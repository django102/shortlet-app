import { ResponseStatus } from "../enums";
import { Response } from "express";
import ApiResponse from "../response";
import { ServiceResponse } from "../models/ServiceResponse";



const HandleResponse = (res: Response, response: ServiceResponse) => {
    return response.status ? SuccessResponse(res, response) : ErrorResponse(res, response.err)
}


const SuccessResponse = (res: Response, response: ServiceResponse) => {
    return ApiResponse.success(res, response.code, response.message, response.data, response.meta)
}

const ErrorResponse = (res: Response, err: any) => {
    console.error(err);
    return ApiResponse.error(res, ResponseStatus.INTERNAL_SERVER_ERROR, err.message)
}


export default {
    HandleResponse,
    ErrorResponse
}