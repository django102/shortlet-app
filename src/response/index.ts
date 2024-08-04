import { Response } from "express";
import { ResponseStatus } from "../enums";


export default {
    success: (res: Response, code: ResponseStatus, message: string, data?: any, meta?: any) => {
        const response = {
            status: 'success',
            message,
            data,
            meta
        };

        // logResponse(res, response, code, "response");
        return res.status(code).json(response);
    },

    error: (res: Response, code: ResponseStatus, message: string) => {
        const response = {
            status: 'error',
            message,
        };

        // logResponse(res, response, code, "error");
        return res.status(code).json(response);
    }
}