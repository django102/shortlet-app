import { Request, Response, NextFunction } from "express";
import CountryService from "../services/CountryService";
import ResponseHandler from "../handlers/ResponseHandler";


const getCountries = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    const response = await CountryService.getCountries(req, res);
    return ResponseHandler.HandleResponse(res, response);
};

const getCountry = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    const response = await CountryService.getCountry(req, res);
    return ResponseHandler.HandleResponse(res, response);
}

const getRegions = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    const response = await CountryService.getRegions(req, res);
    return ResponseHandler.HandleResponse(res, response);
}

const getLanguages = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    const response = await CountryService.getLanguages(req, res);
    return ResponseHandler.HandleResponse(res, response);
}

const getStatistics = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    const response = await CountryService.getStatistics(req, res);
    return ResponseHandler.HandleResponse(res, response);
}


export default {
    getCountries,
    getCountry,
    getRegions,
    getLanguages,
    getStatistics
}
