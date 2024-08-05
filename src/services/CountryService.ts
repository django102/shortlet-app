import ApiResponse from "../response";
import { Response, Request } from "express";

import { env } from "../env";
import HttpService from "./HttpService";
import { Pagination, ResponseStatus } from "../enums";
import MapperService from "./MapperService";
import Country from "../models/mongo/Country";
import CacheService from "./CacheService";
import ResponseHandler from "../handlers/ResponseHandler";
import { ICountry } from "src/interfaces/ICountry";


type RegionData = {
    countries: string[];
    totalPopulation: number;
    totalArea: number;
};

type LanguageData = {
    countries: { name: string, region: string }[];
    totalPopulation: number;
};

const redisKeyForAllCountries = "countries:all";






const retrieveRegions = async () => {
    const cachedCountries = await CacheService.jsonGet(redisKeyForAllCountries);
    const countries = cachedCountries ? cachedCountries[0] : await Country.find();

    const regions = countries.reduce((acc, country) => {
        const { name, region, population, area } = country;
        if (!acc[region]) {
            acc[region] = { countries: [], totalPopulation: 0, totalArea: 0 }
        }
        acc[region].countries.push(name);
        acc[region].totalPopulation += population;
        acc[region].totalArea += area;
        return acc;
    }, {} as Record<string, RegionData>);

    return regions;
};

const retrieveLanguages = async () => {
    const cachedCountries = await CacheService.jsonGet(redisKeyForAllCountries);
    const countries = cachedCountries ? cachedCountries[0] : await Country.find();

    const languages = countries.reduce((acc, country) => {
        const { name, population, region, languages: countryLanguages } = country;
        countryLanguages.forEach(language => {
            if (!acc[language]) {
                acc[language] = { countries: [], totalPopulation: 0 };
            }
            acc[language].countries.push({ name, region });
            acc[language].totalPopulation += population;
        });
        return acc;
    }, {} as Record<string, LanguageData>);

    return languages;
};

const getAllCountriesFromService = async () => {
    const path = "all";
    const baseUrl = env.services.restCountries.baseUrl;

    const result = await HttpService.getResource(baseUrl, path)
    const parsedResult = MapperService.mapCountryArrayResponseToArray(result);
    const sortedArray = parsedResult.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

    await Country.deleteMany();
    const countries = await Country.create(sortedArray);

    await CacheService.deleteAll();

    await CacheService.jsonSet(redisKeyForAllCountries, countries);

    return countries;
};



const getCountriesFromService = async (req: Request, res: Response): Promise<Response> => {
    try {
        const countries = await getAllCountriesFromService();
        return ApiResponse.success(res, ResponseStatus.OK, "Data pull successful", { count: countries.length });
    } catch (err: any) {
        return ResponseHandler.ErrorResponse(res, err);
    }
};

const getCountries = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { query } = req;
        const { region, minPopulation, maxPopulation } = query;
        const page = Number(query.page) || Pagination.DEFAULT_PAGE_NUMBER;
        const pageSize = Number(query.pageSize) || Pagination.DEFAULT_PAGE_NUMBER;
        const skipRecords = (page - 1) * pageSize
        const filters = {
            ...(region && { region }),
            ...(minPopulation && { population: { $gte: minPopulation } }),
            ...(maxPopulation && { population: { $lte: maxPopulation } })
        }

        const redisKey = `countries:${[region, minPopulation, maxPopulation, page, pageSize].filter(Boolean).join(':')}`;

        const cachedResult = await CacheService.jsonGet(redisKey);
        if (cachedResult) {
            return ApiResponse.success(res, ResponseStatus.OK, "Countries successfully retrieved", cachedResult[0].data, cachedResult[0].meta);
        }

        const countries = await Country.find(filters).skip(skipRecords).limit(pageSize).sort({ name: "asc" });
        const countriesCount = await Country.countDocuments(filters);
        const totalPages = Math.ceil(countriesCount / pageSize);

        await CacheService.jsonSet(redisKey, { data: countries, meta: { page, pageSize, total: countriesCount, pageCount: totalPages } })

        return ApiResponse.success(res, ResponseStatus.OK, "Countries successfully retrieved", countries, { page, pageSize, total: countriesCount, pageCount: totalPages });
    } catch (err: any) {
        return ResponseHandler.ErrorResponse(res, err);
    }
};

const getCountry = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { params } = req;
        const { name } = params;

        const redisKey = `countries:${name.toLowerCase()}`;
        const cachedResult = await CacheService.jsonGet(redisKey);
        if (cachedResult) {
            return ApiResponse.success(res, ResponseStatus.OK, "Country successfully retrieved", cachedResult[0].data);
        }

        const country = await Country.findOne({ name });
        if (!country) {
            return ApiResponse.error(res, ResponseStatus.NOT_FOUND, `No country information was found for ${name}`);
        }

        await CacheService.jsonSet(redisKey, { data: country })
        return ApiResponse.success(res, ResponseStatus.OK, "Country successfully retrieved", country);
    } catch (err: any) {
        return ResponseHandler.ErrorResponse(res, err);
    }
};

const getRegions = async (req: Request, res: Response): Promise<Response> => {
    try {
        const redisKey = `regions:all`;
        const cachedResult = await CacheService.jsonGet(redisKey);
        if (cachedResult) {
            return ApiResponse.success(res, ResponseStatus.OK, "Regions successfully retrieved", cachedResult[0].data, cachedResult[0].meta);
        }

        const regions = await retrieveRegions();
        const totalRegions = Object.keys(regions).length;
        const sortedRegions = Object.keys(regions).sort().reduce((acc, key) => {
            acc[key] = regions[key];
            return acc;
        }, {} as Record<string, RegionData>)

        await CacheService.jsonSet(redisKey, { data: sortedRegions, meta: { total: totalRegions } })

        return ApiResponse.success(res, ResponseStatus.OK, "Regions successfully retrieved", sortedRegions, { total: totalRegions });
    } catch (err: any) {
        return ResponseHandler.ErrorResponse(res, err);
    }
};

const getLanguages = async (req: Request, res: Response): Promise<Response> => {
    try {
        const redisKey = "languages:all";
        const cachedResult = await CacheService.jsonGet(redisKey);
        if (cachedResult) {
            return ApiResponse.success(res, ResponseStatus.OK, "Languages successfully retrieved", cachedResult[0].data, cachedResult[0].meta);
        }

        const languages = await retrieveLanguages();
        const totalLanguages = Object.keys(languages).length;
        const sortedLanguages = Object.keys(languages).sort().reduce((acc, key) => {
            acc[key] = languages[key];
            return acc;
        }, {} as Record<string, LanguageData>)

        await CacheService.jsonSet(redisKey, { data: sortedLanguages, meta: { total: totalLanguages } });
        return ApiResponse.success(res, ResponseStatus.OK, "Languages successfully retrieved", sortedLanguages, { total: totalLanguages });
    } catch (err: any) {
        return ResponseHandler.ErrorResponse(res, err);
    }
};

const getStatistics = async (req: Request, res: Response): Promise<Response> => {
    try {
        const redisKey = "statistics:all";
        const cachedResult = await CacheService.jsonGet(redisKey);
        if (cachedResult) {
            return ApiResponse.success(res, ResponseStatus.OK, "Statistics computed successfully", cachedResult[0]);
        }

        const cachedCountries = await CacheService.jsonGet(redisKeyForAllCountries);
        const countries: ICountry[] = cachedCountries ? cachedCountries[0] : await Country.find();

        const languagesRedisKey = "languages:all";
        const cachedLanguages = await CacheService.jsonGet(languagesRedisKey);
        const languages: Record<string, LanguageData> = cachedLanguages ? cachedLanguages[0].data : await retrieveLanguages();

        const statistics = countries.reduce((acc, country) => {
            if (!acc.largestCountryByArea || country.area > acc.largestCountryByArea.area) {
                acc.largestCountryByArea = { country: country.name, area: country.area };
            }
            if (!acc.smallestCountryByArea || country.area < acc.smallestCountryByArea.area) {
                acc.smallestCountryByArea = { country: country.name, area: country.area };
            }
            if (!acc.largestCountryByPopulation || country.population > acc.largestCountryByPopulation.population) {
                acc.largestCountryByPopulation = { country: country.name, population: country.population };
            }
            if (!acc.smallestCountryByPopulation || country.population < acc.smallestCountryByPopulation.population) {
                acc.smallestCountryByPopulation = { country: country.name, population: country.population };
            }
            return acc;
        }, {
            largestCountryByArea: null,
            smallestCountryByArea: null,
            largestCountryByPopulation: null,
            smallestCountryByPopulation: null
        });

        const languageStats = Object.entries(languages).reduce((acc, [language, data]) => {
            if (!acc.mostSpokenLanguage || data.totalPopulation > acc.mostSpokenLanguage.totalSpeakers) {
                acc.mostSpokenLanguage = { language, totalSpeakers: data.totalPopulation, totalCountries: data.countries.length };
            }
            if (!acc.leastSpokenLanguage || data.totalPopulation < acc.leastSpokenLanguage.totalSpeakers) {
                acc.leastSpokenLanguage = { language, totalSpeakers: data.totalPopulation, totalCountries: data.countries.length };
            }
            return acc;
        }, {
            mostSpokenLanguage: null,
            leastSpokenLanguage: null
        });

        const finalStatistics = {
            countries: countries.length,
            ...statistics,
            mostSpokenLanguage: languageStats.mostSpokenLanguage,
            leastSpokenLanguage: languageStats.leastSpokenLanguage
        };

        await CacheService.jsonSet(redisKey, finalStatistics);
        return ApiResponse.success(res, ResponseStatus.OK, "Statistics computed successfully", finalStatistics);
    } catch (err: any) {
        return ResponseHandler.ErrorResponse(res, err);
    }
}



export default {
    getCountriesFromService,
    getAllCountriesFromService,
    getCountries,
    getCountry,
    getRegions,
    getLanguages,
    getStatistics
}