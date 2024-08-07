import { Request, Response, NextFunction } from 'express';
import CountryController from '../../../src/api/controllers/CountryController';
import CountryService from '../../../src/api/services/CountryService';
import ResponseHandler from '../../../src/api/handlers/ResponseHandler';


jest.mock('../../../src/api/services/CountryService');
jest.mock('../../../src/api/handlers/ResponseHandler');


describe('CountryController', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: Partial<NextFunction>;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        next = jest.fn();

        jest.clearAllMocks();
    });

    describe('getCountries', () => {
        test('should handle getCountries and return response', async () => {
            const mockResponse = { status: true, data: [] };
            (CountryService.getCountries as jest.Mock).mockResolvedValue(mockResponse);
            (ResponseHandler.handleResponse as jest.Mock).mockReturnValue(res);

            const result = await CountryController.getCountries(req as Request, res as Response, next as NextFunction);

            expect(CountryService.getCountries).toHaveBeenCalledWith(req, res);
            expect(ResponseHandler.handleResponse).toHaveBeenCalledWith(res, mockResponse);
            expect(result).toBe(res);
        });
    });

    describe('getCountry', () => {
        test('should handle getCountry and return response', async () => {
            const mockResponse = { status: true, data: {} };
            (CountryService.getCountry as jest.Mock).mockResolvedValue(mockResponse);
            (ResponseHandler.handleResponse as jest.Mock).mockReturnValue(res);

            const result = await CountryController.getCountry(req as Request, res as Response, next as NextFunction);

            expect(CountryService.getCountry).toHaveBeenCalledWith(req, res);
            expect(ResponseHandler.handleResponse).toHaveBeenCalledWith(res, mockResponse);
            expect(result).toBe(res);
        });
    });

    describe('getRegions', () => {
        test('should handle getRegions and return response', async () => {
            const mockResponse = { status: true, data: [] };
            (CountryService.getRegions as jest.Mock).mockResolvedValue(mockResponse);
            (ResponseHandler.handleResponse as jest.Mock).mockReturnValue(res);

            const result = await CountryController.getRegions(req as Request, res as Response, next as NextFunction);

            expect(CountryService.getRegions).toHaveBeenCalledWith(req, res);
            expect(ResponseHandler.handleResponse).toHaveBeenCalledWith(res, mockResponse);
            expect(result).toBe(res);
        });
    });

    describe('getLanguages', () => {
        test('should handle getLanguages and return response', async () => {
            const mockResponse = { status: true, data: [] };
            (CountryService.getLanguages as jest.Mock).mockResolvedValue(mockResponse);
            (ResponseHandler.handleResponse as jest.Mock).mockReturnValue(res);

            const result = await CountryController.getLanguages(req as Request, res as Response, next as NextFunction);

            expect(CountryService.getLanguages).toHaveBeenCalledWith(req, res);
            expect(ResponseHandler.handleResponse).toHaveBeenCalledWith(res, mockResponse);
            expect(result).toBe(res);
        });
    });

    describe('getStatistics', () => {
        test('should handle getStatistics and return response', async () => {
            const mockResponse = { status: true, data: {} };
            (CountryService.getStatistics as jest.Mock).mockResolvedValue(mockResponse);
            (ResponseHandler.handleResponse as jest.Mock).mockReturnValue(res);

            const result = await CountryController.getStatistics(req as Request, res as Response, next as NextFunction);

            expect(CountryService.getStatistics).toHaveBeenCalledWith(req, res);
            expect(ResponseHandler.handleResponse).toHaveBeenCalledWith(res, mockResponse);
            expect(result).toBe(res);
        });
    });
});
