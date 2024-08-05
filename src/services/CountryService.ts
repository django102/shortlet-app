import ApiResponse from "../response";
import { Response, Request } from "express";

import { env } from "../env";
import HttpService from "./HttpService";
import { Pagination, ResponseStatus } from "../enums";
import MapperService from "./MapperService";
import Country from "../models/mongo/Country";
import CacheService from "./CacheService";
import ResponseHandler from "../handlers/ResponseHandler";


const redisKeyForAllCountries = "countries:all";

export const CountryService = {
    getAllCountriesFromService: async (req: Request, res: Response): Promise<Response> => {
        try {
            const path = "all";
            const baseUrl = env.services.restCountries.baseUrl;

            const result = await HttpService.getResource(baseUrl, path)
            const parsedResult = MapperService.mapCountryArrayResponseToArray(result);
            const sortedArray = parsedResult.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

            await Country.deleteMany();
            const countries = await Country.create(sortedArray);

            await CacheService.deleteAll();

            await CacheService.jsonSet(redisKeyForAllCountries, countries);

            return ApiResponse.success(res, ResponseStatus.OK, "Data pull successful", { count: countries.length });
        } catch (err: any) {
            return ResponseHandler.ErrorResponse(res, err);
        }
    },

    getAllCountries: async (req: Request, res: Response): Promise<Response> => {
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
    },

    getCountry: async (req: Request, res: Response): Promise<Response> => {
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
    },

    getRegions: async (req: Request, res: Response): Promise<Response> => {
        type RegionData = {
            countries: string[];
            totalPopulation: number;
            totalArea: number;
        };

        try {
            const redisKey = `regions:all`;
            const cachedResult = await CacheService.jsonGet(redisKey);
            if (cachedResult) {
                return ApiResponse.success(res, ResponseStatus.OK, "Regions successfully retrieved", cachedResult[0].data, cachedResult[0].meta);
            }

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

            const totalRegions = Object.keys(regions).length;

            await CacheService.jsonSet(redisKey, { data: regions, meta: { total: totalRegions } })

            return ApiResponse.success(res, ResponseStatus.OK, "Regions successfully retrieved", regions, { total: totalRegions });
        } catch (err: any) {
            return ResponseHandler.ErrorResponse(res, err);
        }
    },

    getLanguages: async (req: Request, res: Response): Promise<Response> => {
        type LanguageData = {
            countries: { name: string, region: string }[];
            totalPopulation: number;
        };

        try {
            const redisKey = "languages:all";
            const cachedResult = await CacheService.jsonGet(redisKey);
            if (cachedResult) {
                return ApiResponse.success(res, ResponseStatus.OK, "Languages successfully retrieved", cachedResult[0].data, cachedResult[0].meta);
            }

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

            const totalLanguages = Object.keys(languages).length;

            await CacheService.jsonSet(redisKey, { data: languages, meta: { total: totalLanguages } });
            return ApiResponse.success(res, ResponseStatus.OK, "Languages successfully retrieved", languages, { total: totalLanguages });
        } catch (err: any) {
            return ResponseHandler.ErrorResponse(res, err);
        }
    }
}