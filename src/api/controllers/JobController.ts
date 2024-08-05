import { Request, Response, NextFunction } from "express";
import CountryService from "../services/CountryService";
import ResponseHandler from "../handlers/ResponseHandler";


const getAllCountriesFromService = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    const response = await CountryService.getCountriesFromService(req, res)
    return ResponseHandler.HandleResponse(res, response);
};


export default {
    getAllCountriesFromService
}