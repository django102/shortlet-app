import ApiResponse from "../response";
import { Response, Request } from "express";

import { env } from "../env";
import HttpService from "./HttpService";
import { ResponseStatus } from "../enums";
import MapperService from "./MapperService";
import Country from "../models/mongo/Country";


export const CountryService = {
    getAllCountriesFromService: async (req: Request, res: Response): Promise<Response> => {
        try {
            const path = "all";
            const baseUrl = env.services.restCountries.baseUrl;

            const result = await HttpService.getResource(baseUrl, path)
            const parsedResult = MapperService.mapCountryArrayResponseToArray(result);
            const sortedArray = parsedResult.sort((a, b) => a.name.localeCompare(b.name));
           
            const countries = await Country.create(sortedArray);
            console.log(countries.length)

            return ApiResponse.success(res, ResponseStatus.OK, "OK");
        } catch (err: any) {
            console.error(err);
            return ApiResponse.error(res, ResponseStatus.INTERNAL_SERVER_ERROR, err.message)
        }
    }
}