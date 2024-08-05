import { Request, Response, NextFunction } from "express";
import CountryService from "../services/CountryService";


const getAllCountriesFromService = async (req: Request, res: Response, next: NextFunction): Promise<Response> => CountryService.getCountriesFromService(req, res);


export default {
    getAllCountriesFromService
}