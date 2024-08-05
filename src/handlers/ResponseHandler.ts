import { ResponseStatus } from "../enums";
import { Response } from "express";
import ApiResponse from "../response";


const ErrorResponse = (res: Response, err: any) => {
    console.error(err);
    return ApiResponse.error(res, ResponseStatus.INTERNAL_SERVER_ERROR, err.message)
}


export default {
    ErrorResponse
}