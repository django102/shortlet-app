import { Request, Response, NextFunction } from "express";
import { CountryService } from "../services/CountryService";


const getAllCountries = async (req: Request, res: Response, next: NextFunction): Promise<Response> => CountryService.getAllCountries(req, res);
const getCountry = async (req: Request, res: Response, next: NextFunction): Promise<Response> => CountryService.getCountry(req, res);

const getRegions = async (req: Request, res: Response, next: NextFunction): Promise<Response> => CountryService.getRegions(req, res);

const getLanguages = async (req: Request, res: Response, next: NextFunction): Promise<Response> => CountryService.getLanguages(req, res);


export default {
    getAllCountries,
    getCountry,
    getRegions,
    getLanguages
}
