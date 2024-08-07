import { Request, Response, NextFunction } from "express";
import CountryService from "../services/CountryService";
import ResponseHandler from "../handlers/ResponseHandler";


export default class CountryController {
    public static async getCountries (req: Request, res: Response, next: NextFunction): Promise<Response> {
        const response = await CountryService.getCountries(req, res);
        return ResponseHandler.handleResponse(res, response);
    }

    public static async getCountry (req: Request, res: Response, next: NextFunction): Promise<Response> {
        const response = await CountryService.getCountry(req, res);
        return ResponseHandler.handleResponse(res, response);
    }

    public static async getRegions (req: Request, res: Response, next: NextFunction): Promise<Response> {
        const response = await CountryService.getRegions(req, res);
        return ResponseHandler.handleResponse(res, response);
    }

    public static async getLanguages (req: Request, res: Response, next: NextFunction): Promise<Response> {
        const response = await CountryService.getLanguages(req, res);
        return ResponseHandler.handleResponse(res, response);
    }

    public static async getStatistics (req: Request, res: Response, next: NextFunction): Promise<Response> {
        const response = await CountryService.getStatistics(req, res);
        return ResponseHandler.handleResponse(res, response);
    }
}