import axios from "axios";
import querystring from "querystring";
import HttpService from "../../../src/api/services/HttpService";

jest.mock("axios");

describe("HttpService", () => {
    const baseUrl = 'https://example.com/';
    const path = 'resource';
    const query = { param1: 'value1', param2: 'value2' };

    afterEach(() => {
        jest.clearAllMocks();
    });


    describe("getResource", () => {
        it('should make a GET request to the given URL without query parameters', async () => {
            const responseData = { data: 'test data' };
            (axios.get as jest.Mock).mockImplementationOnce(() => Promise.resolve({ data: responseData }));

            const result = await HttpService.getResource(baseUrl, path);

            expect(axios.get).toHaveBeenCalledWith(`${baseUrl}${path}`);
            expect(result).toEqual(responseData);
        });

        it('should make a GET request to the given URL with query parameters', async () => {
            const responseData = { data: 'test data' };
            const qString = querystring.stringify(query);
            (axios.get as jest.Mock).mockImplementationOnce(() => Promise.resolve({ data: responseData }));

            const result = await HttpService.getResource(baseUrl, path, query);

            expect(axios.get).toHaveBeenCalledWith(`${baseUrl}${path}?${qString}`);
            expect(result).toEqual(responseData);
        });

        it('should handle errors and return error message', async () => {
            const errorMessage = 'Network Error';
            (axios.get as jest.Mock).mockImplementationOnce(() => Promise.reject(new Error(errorMessage)));

            const result = await HttpService.getResource(baseUrl, path);

            expect(axios.get).toHaveBeenCalledWith(`${baseUrl}${path}`);
            expect(result).toEqual({ status: false, message: errorMessage });
        });

        it('should handle errors with query parameters and return error message', async () => {
            const errorMessage = 'Network Error';
            const qString = querystring.stringify(query);
            (axios.get as jest.Mock).mockImplementationOnce(() => Promise.reject(new Error(errorMessage)));

            const result = await HttpService.getResource(baseUrl, path, query);

            expect(axios.get).toHaveBeenCalledWith(`${baseUrl}${path}?${qString}`);
            expect(result).toEqual({ status: false, message: errorMessage });
        });

        it('should return data with a complex query object', async () => {
            const complexQuery = { array: [1, 2, 3] };
            const responseData = { data: 'test data' };
            const qString = querystring.stringify(complexQuery);

            (axios.get as jest.Mock).mockImplementationOnce(() => Promise.resolve({ data: responseData }));

            const result = await HttpService.getResource(baseUrl, path, complexQuery);

            expect(axios.get).toHaveBeenCalledWith(`${baseUrl}${path}?${qString}`);
            expect(result).toEqual(responseData);
        });

        it('should handle empty path and query parameters', async () => {
            const responseData = { data: 'test data' };
            (axios.get as jest.Mock).mockImplementationOnce(() => Promise.resolve({ data: responseData }));

            const result = await HttpService.getResource(baseUrl);

            expect(axios.get).toHaveBeenCalledWith(`${baseUrl}`);
            expect(result).toEqual(responseData);
        });
    });
});