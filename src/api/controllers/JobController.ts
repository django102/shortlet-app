/* istanbul ignore file */

import { Request, Response, NextFunction } from "express";
import CountryService from "../services/CountryService";
import ResponseHandler from "../handlers/ResponseHandler";


export default class JobController {
    public static async getAllCountriesFromService (req: Request, res: Response, next: NextFunction): Promise<Response> {
        const response = await CountryService.getCountriesFromService(req, res)
        return ResponseHandler.handleResponse(res, response);
    }
}