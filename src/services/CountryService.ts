import ApiResponse from "../response";
import { Response, Request } from "express";

import { env } from "../env";
import HttpService from "./HttpService";
import { ResponseStatus } from "../enums";
import MapperService from "./MapperService";
import Country from "../models/mongo/Country";
import CacheService from "./CacheService";
import ResponseHandler from "../handlers/ResponseHandler";


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

            return ApiResponse.success(res, ResponseStatus.OK, "Data pull successful", { count: countries.length });
        } catch (err: any) {
            return ResponseHandler.ErrorResponse(res, err);
        }
    },

    getAllCountries: async (req: Request, res: Response): Promise<Response> => {
        try {
            const { query } = req;
            const { region, minPopulation, maxPopulation } = query;
            const page = Number(query.page) || 1;
            const pageSize = Number(query.pageSize) || 20;
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
    }
}