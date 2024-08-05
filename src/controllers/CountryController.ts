import { Request, Response, NextFunction } from "express";
import { CountryService } from "../services/CountryService";


const getAllCountries = async (req: Request, res: Response, next: NextFunction): Promise<Response> => CountryService.getAllCountries(req, res);


export default {
    getAllCountries
}
