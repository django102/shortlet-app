import { Request, Response, NextFunction } from "express";
import { CountryService } from "../services/CountryService";


export const getAllCountriesFromService = async (req: Request, res: Response, next: NextFunction): Promise<Response> => CountryService.getAllCountriesFromService(req, res);


/*
import { Request, Response, NextFunction } from "express";
import { MerchantService } from "../services/MerchantService";


export const registerMerchant = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => MerchantService.registerMerchant(req.body, res);
export const authenticateMerchant = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => MerchantService.authenticateMerchant(req.body, res);
export const approveMerchant = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => MerchantService.approveMerchant(req, res);
export const verifyMerchant = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => MerchantService.verifyMerchant(req, res);
export const requestPayment = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => MerchantService.requestPayment(req, res);
*/