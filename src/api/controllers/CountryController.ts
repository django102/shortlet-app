import { Request, Response, NextFunction } from "express";
import CountryService from "../services/CountryService";
import ResponseHandler from "../handlers/ResponseHandler";


const getCountries = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    const response = await CountryService.getCountries(req, res);
    return ResponseHandler.HandleResponse(res, response);
};

const getCountry = async (req: Request, res: Response, next: NextFunction): Promise<Response> => CountryService.getCountry(req, res);

const getRegions = async (req: Request, res: Response, next: NextFunction): Promise<Response> => CountryService.getRegions(req, res);

const getLanguages = async (req: Request, res: Response, next: NextFunction): Promise<Response> => CountryService.getLanguages(req, res);

const getStatistics = async (req: Request, res: Response, next: NextFunction): Promise<Response> => CountryService.getStatistics(req, res);


export default {
    getCountries,
    getCountry,
    getRegions,
    getLanguages,
    getStatistics
}
