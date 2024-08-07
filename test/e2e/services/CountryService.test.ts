import CountryService from "../../../src/api/services/CountryService";
import CacheService from "../../../src/api/services/CacheService";
import Country from "../../../src/api/models/mongo/Country";
import HttpService from "../../../src/api/services/HttpService";
import MapperService from "../../../src/api/services/MapperService";
import { env } from "../../../src/env";
import { Request, Response } from "express";
import { ResponseStatus } from "../../../src/api/enums";


describe("CountryService", () => {
    let jsonGetMock: jest.SpyInstance;
    let jsonSetMock: jest.SpyInstance;
    let cacheDeleteAllMock: jest.SpyInstance;
    let findCountryMock: jest.SpyInstance;
    let createCountryMock: jest.SpyInstance;
    let deleteManyCountriesMock: jest.SpyInstance;
    let mapperServiceMock: jest.SpyInstance;
    let getHttpResourceMock: jest.SpyInstance;
    let getAllCountriesFromServiceMock: jest.SpyInstance;

    const redisKeyForAllCountries = "countries:all";
    const httpBaseUrl = env.services.restCountries.baseUrl;
    const privateCountryService = CountryService as any;



    describe("retrieveRegions", () => {
        beforeAll(() => {
            jsonGetMock = jest.spyOn(CacheService, "jsonGet");
            findCountryMock = jest.spyOn(Country, "find");
        });

        afterEach(() => {
            jest.clearAllMocks();
        });



        it('should retrieve regions from cache', async () => {
            const cachedCountries = [[{ name: 'Country1', region: 'Region1', population: 100, area: 1000 }]];

            jsonGetMock.mockResolvedValue(cachedCountries);

            const expectedRegions = {
                Region1: {
                    countries: ['Country1'],
                    totalPopulation: 100,
                    totalArea: 1000,
                },
            };

            const regions = await privateCountryService.retrieveRegions();

            expect(regions).toEqual(expectedRegions);
            expect(jsonGetMock).toHaveBeenCalledWith(redisKeyForAllCountries);
            expect(findCountryMock).not.toHaveBeenCalled();
        });

        it('should retrieve regions from database when cache is empty', async () => {
            jsonGetMock.mockResolvedValue(null);
            const dbCountries = [{ name: 'Country2', region: 'Region2', population: 200, area: 2000 }];
            findCountryMock.mockResolvedValue(dbCountries);

            const expectedRegions = {
                Region2: {
                    countries: ['Country2'],
                    totalPopulation: 200,
                    totalArea: 2000,
                },
            };

            const regions = await privateCountryService.retrieveRegions();

            expect(regions).toEqual(expectedRegions);
            expect(jsonGetMock).toHaveBeenCalledWith(redisKeyForAllCountries);
            expect(findCountryMock).toHaveBeenCalled();
        });

        it('should handle multiple countries and regions', async () => {
            const cachedCountries = [
                [
                    { name: 'Country1', region: 'Region1', population: 100, area: 1000 },
                    { name: 'Country2', region: 'Region1', population: 200, area: 2000 },
                    { name: 'Country3', region: 'Region2', population: 300, area: 3000 },
                ]
            ];
            jsonGetMock.mockResolvedValue(cachedCountries);

            const expectedRegions = {
                Region1: {
                    countries: ['Country1', 'Country2'],
                    totalPopulation: 300,
                    totalArea: 3000,
                },
                Region2: {
                    countries: ['Country3'],
                    totalPopulation: 300,
                    totalArea: 3000,
                },
            };

            const regions = await privateCountryService.retrieveRegions();

            expect(regions).toEqual(expectedRegions);
            expect(jsonGetMock).toHaveBeenCalledWith(redisKeyForAllCountries);
            expect(findCountryMock).not.toHaveBeenCalled();
        });

        it('should handle no countries', async () => {
            jsonGetMock.mockResolvedValue(null);
            findCountryMock.mockResolvedValue([]);

            const expectedRegions = {};

            const regions = await privateCountryService.retrieveRegions();

            expect(regions).toEqual(expectedRegions);
            expect(jsonGetMock).toHaveBeenCalledWith(redisKeyForAllCountries);
            expect(findCountryMock).toHaveBeenCalled();
        });

        it('should handle countries with missing data gracefully', async () => {
            const cachedCountries = [
                [
                    { name: 'Country1', region: 'Region1', population: 100, area: 1000 },
                    { name: 'Country2', region: 'Region1', population: null, area: null },
                    { name: 'Country3', region: 'Region2', population: 300, area: 3000 },
                ]
            ];
            jsonGetMock.mockResolvedValue(cachedCountries);

            const expectedRegions = {
                Region1: {
                    countries: ['Country1', 'Country2'],
                    totalPopulation: 100, // null values should be treated as 0
                    totalArea: 1000, // null values should be treated as 0
                },
                Region2: {
                    countries: ['Country3'],
                    totalPopulation: 300,
                    totalArea: 3000,
                },
            };

            const regions = await privateCountryService.retrieveRegions();

            expect(regions).toEqual(expectedRegions);
            expect(jsonGetMock).toHaveBeenCalledWith(redisKeyForAllCountries);
            expect(findCountryMock).not.toHaveBeenCalled();
        });
    });

    describe("retrieveLanguages", () => {
        beforeAll(() => {
            jsonGetMock = jest.spyOn(CacheService, "jsonGet");
            findCountryMock = jest.spyOn(Country, "find");
        });

        afterEach(() => {
            jest.clearAllMocks();
        });


        it('should retrieve languages from cache', async () => {
            const cachedCountries = [[{
                name: 'Country1',
                population: 100,
                region: 'Region1',
                languages: ['Language1', 'Language2']
            }]];
            jsonGetMock.mockResolvedValue(cachedCountries);

            const expectedLanguages = {
                Language1: {
                    countries: [{ name: 'Country1', region: 'Region1' }],
                    totalPopulation: 100,
                },
                Language2: {
                    countries: [{ name: 'Country1', region: 'Region1' }],
                    totalPopulation: 100,
                },
            };

            const languages = await privateCountryService.retrieveLanguages();

            expect(languages).toEqual(expectedLanguages);
            expect(jsonGetMock).toHaveBeenCalledWith(redisKeyForAllCountries);
            expect(findCountryMock).not.toHaveBeenCalled();
        });

        it('should retrieve languages from database when cache is empty', async () => {
            jsonGetMock.mockResolvedValue(null);
            const dbCountries = [{
                name: 'Country2',
                population: 200,
                region: 'Region2',
                languages: ['Language3']
            }];
            findCountryMock.mockResolvedValue(dbCountries);

            const expectedLanguages = {
                Language3: {
                    countries: [{ name: 'Country2', region: 'Region2' }],
                    totalPopulation: 200,
                },
            };

            const languages = await privateCountryService.retrieveLanguages();

            expect(languages).toEqual(expectedLanguages);
            expect(jsonGetMock).toHaveBeenCalledWith(redisKeyForAllCountries);
            expect(findCountryMock).toHaveBeenCalled();
        });

        it('should handle multiple countries and languages', async () => {
            const cachedCountries = [[
                {
                    name: 'Country1',
                    population: 100,
                    region: 'Region1',
                    languages: ['Language1', 'Language2']
                },
                {
                    name: 'Country2',
                    population: 200,
                    region: 'Region1',
                    languages: ['Language1', 'Language3']
                },
                {
                    name: 'Country3',
                    population: 300,
                    region: 'Region2',
                    languages: ['Language3']
                }
            ]];
            jsonGetMock.mockResolvedValue(cachedCountries);

            const expectedLanguages = {
                Language1: {
                    countries: [
                        { name: 'Country1', region: 'Region1' },
                        { name: 'Country2', region: 'Region1' }
                    ],
                    totalPopulation: 300,
                },
                Language2: {
                    countries: [{ name: 'Country1', region: 'Region1' }],
                    totalPopulation: 100,
                },
                Language3: {
                    countries: [
                        { name: 'Country2', region: 'Region1' },
                        { name: 'Country3', region: 'Region2' }
                    ],
                    totalPopulation: 500,
                },
            };

            const languages = await privateCountryService.retrieveLanguages();

            expect(languages).toEqual(expectedLanguages);
            expect(jsonGetMock).toHaveBeenCalledWith(redisKeyForAllCountries);
            expect(findCountryMock).not.toHaveBeenCalled();
        });

        it('should handle no countries', async () => {
            jsonGetMock.mockResolvedValue(null);
            findCountryMock.mockResolvedValue([]);

            const expectedLanguages = {};

            const languages = await privateCountryService.retrieveLanguages();

            expect(languages).toEqual(expectedLanguages);
            expect(jsonGetMock).toHaveBeenCalledWith(redisKeyForAllCountries);
            expect(findCountryMock).toHaveBeenCalled();
        });

        it('should handle countries with no languages gracefully', async () => {
            const cachedCountries = [[
                {
                    name: 'Country1',
                    population: 100,
                    region: 'Region1',
                    languages: []
                },
                {
                    name: 'Country2',
                    population: 200,
                    region: 'Region2',
                    languages: ['Language1']
                }
            ]];
            jsonGetMock.mockResolvedValue(cachedCountries);

            const expectedLanguages = {
                Language1: {
                    countries: [{ name: 'Country2', region: 'Region2' }],
                    totalPopulation: 200,
                },
            };

            const languages = await privateCountryService.retrieveLanguages();

            expect(languages).toEqual(expectedLanguages);
            expect(jsonGetMock).toHaveBeenCalledWith(redisKeyForAllCountries);
            expect(findCountryMock).not.toHaveBeenCalled();
        });

        it('should handle countries with missing data gracefully', async () => {
            const cachedCountries = [[
                {
                    name: 'Country1',
                    population: 100,
                    region: 'Region1',
                    languages: ['Language1']
                },
                {
                    name: 'Country2',
                    population: null,
                    region: 'Region2',
                    languages: ['Language1', 'Language2']
                },
                {
                    name: 'Country3',
                    population: 300,
                    region: null,
                    languages: ['Language2']
                }
            ]];
            jsonGetMock.mockResolvedValue(cachedCountries);

            const expectedLanguages = {
                Language1: {
                    countries: [
                        { name: 'Country1', region: 'Region1' },
                        { name: 'Country2', region: 'Region2' }
                    ],
                    totalPopulation: 100, // null population should be treated as 0
                },
                Language2: {
                    countries: [
                        { name: 'Country2', region: 'Region2' },
                        { name: 'Country3', region: null }
                    ],
                    totalPopulation: 300, // null population should be treated as 0
                },
            };

            const languages = await privateCountryService.retrieveLanguages();

            expect(languages).toEqual(expectedLanguages);
            expect(jsonGetMock).toHaveBeenCalledWith(redisKeyForAllCountries);
            expect(findCountryMock).not.toHaveBeenCalled();
        });
    });

    describe("getAllCountriesFromService", () => {
        beforeAll(() => {
            jsonGetMock = jest.spyOn(CacheService, "jsonGet");
            jsonSetMock = jest.spyOn(CacheService, "jsonSet");
            cacheDeleteAllMock = jest.spyOn(CacheService, "deleteAll");
            createCountryMock = jest.spyOn(Country, "create");
            mapperServiceMock = jest.spyOn(MapperService, "mapCountryArrayResponseToArray");
            deleteManyCountriesMock = jest.spyOn(Country, "deleteMany");
            getHttpResourceMock = jest.spyOn(HttpService, "getResource");
        });

        afterEach(() => {
            jest.clearAllMocks();
        });



        it('should retrieve and process countries correctly', async () => {
            const apiResponse = [{ name: 'CountryB' }, { name: 'CountryA' }];
            const mappedCountries = [
                { name: 'CountryB' },
                { name: 'CountryA' }
            ];
            const sortedCountries = [
                { name: 'CountryA' },
                { name: 'CountryB' }
            ];

            getHttpResourceMock.mockResolvedValue(apiResponse);
            mapperServiceMock.mockReturnValue(mappedCountries);
            createCountryMock.mockResolvedValue(sortedCountries);
            deleteManyCountriesMock.mockResolvedValue(null);
            cacheDeleteAllMock.mockResolvedValue(null);
            jsonSetMock.mockResolvedValue(null);

            const result = await CountryService.getAllCountriesFromService();

            expect(getHttpResourceMock).toHaveBeenCalledWith(httpBaseUrl, 'all');
            expect(mapperServiceMock).toHaveBeenCalledWith(apiResponse);
            expect(deleteManyCountriesMock).toHaveBeenCalled();
            expect(createCountryMock).toHaveBeenCalledWith(sortedCountries);
            expect(cacheDeleteAllMock).toHaveBeenCalled();
            expect(jsonSetMock).toHaveBeenCalledWith(redisKeyForAllCountries, sortedCountries);
            expect(result).toEqual(sortedCountries);
        });

        it('should handle errors gracefully', async () => {
            getHttpResourceMock.mockRejectedValue(new Error('API Error'));

            await expect(CountryService.getAllCountriesFromService()).rejects.toThrow('API Error');

            expect(getHttpResourceMock).toHaveBeenCalledWith(httpBaseUrl, 'all');
            expect(mapperServiceMock).not.toHaveBeenCalled();
            expect(deleteManyCountriesMock).not.toHaveBeenCalled();
            expect(createCountryMock).not.toHaveBeenCalled();
            expect(cacheDeleteAllMock).not.toHaveBeenCalled();
            expect(jsonSetMock).not.toHaveBeenCalled();
        });

        it('should call Country.deleteMany and CacheService.deleteAll even if Country.create fails', async () => {
            const apiResponse = [{ name: 'CountryB' }, { name: 'CountryA' }];
            const mappedCountries = [
                { name: 'CountryB' },
                { name: 'CountryA' }
            ];
            const sortedCountries = [
                { name: 'CountryA' },
                { name: 'CountryB' }
            ];

            getHttpResourceMock.mockResolvedValue(apiResponse);
            mapperServiceMock.mockReturnValue(mappedCountries);
            createCountryMock.mockRejectedValue(new Error('Database Error'));

            await expect(CountryService.getAllCountriesFromService()).rejects.toThrow('Database Error');

            expect(getHttpResourceMock).toHaveBeenCalledWith(httpBaseUrl, 'all');
            expect(mapperServiceMock).toHaveBeenCalledWith(apiResponse);
            expect(deleteManyCountriesMock).toHaveBeenCalled();
            expect(createCountryMock).toHaveBeenCalledWith(sortedCountries);
            expect(cacheDeleteAllMock).not.toHaveBeenCalled();
            expect(jsonSetMock).not.toHaveBeenCalled();
        });

        it('should call CacheService.deleteAll and CacheService.jsonSet even if CacheService.deleteAll fails', async () => {
            const apiResponse = [{ name: 'CountryB' }, { name: 'CountryA' }];
            const mappedCountries = [
                { name: 'CountryB' },
                { name: 'CountryA' }
            ];
            const sortedCountries = [
                { name: 'CountryA' },
                { name: 'CountryB' }
            ];

            getHttpResourceMock.mockResolvedValue(apiResponse);
            mapperServiceMock.mockReturnValue(mappedCountries);
            createCountryMock.mockResolvedValue(sortedCountries);
            cacheDeleteAllMock.mockRejectedValue(new Error('Cache Error'));

            await expect(CountryService.getAllCountriesFromService()).rejects.toThrow('Cache Error');

            expect(getHttpResourceMock).toHaveBeenCalledWith(httpBaseUrl, 'all');
            expect(mapperServiceMock).toHaveBeenCalledWith(apiResponse);
            expect(deleteManyCountriesMock).toHaveBeenCalled();
            expect(createCountryMock).toHaveBeenCalledWith(sortedCountries);
            expect(cacheDeleteAllMock).toHaveBeenCalled();
            expect(jsonSetMock).not.toHaveBeenCalled();
        });

        it('should handle partially populated responses correctly', async () => {
            const apiResponse = [{ name: 'CountryA' }, null, { name: 'CountryB' }];
            const mappedCountries = [
                { name: 'CountryA' },
                { name: 'CountryB' }
            ];
            const sortedCountries = [
                { name: 'CountryA' },
                { name: 'CountryB' }
            ];

            getHttpResourceMock.mockResolvedValue(apiResponse);
            mapperServiceMock.mockReturnValue(mappedCountries);
            createCountryMock.mockResolvedValue(sortedCountries);
            cacheDeleteAllMock.mockResolvedValue(null);

            const result = await CountryService.getAllCountriesFromService();

            expect(getHttpResourceMock).toHaveBeenCalledWith(httpBaseUrl, 'all');
            expect(mapperServiceMock).toHaveBeenCalledWith(apiResponse);
            expect(deleteManyCountriesMock).toHaveBeenCalled();
            expect(createCountryMock).toHaveBeenCalledWith(sortedCountries);
            expect(cacheDeleteAllMock).toHaveBeenCalled();
            expect(jsonSetMock).toHaveBeenCalledWith(redisKeyForAllCountries, sortedCountries);
            expect(result).toEqual(sortedCountries);
        });
    });

    describe("getCountriesFromService", () => {
        let req: Partial<Request>, res: Partial<Response>;

        beforeAll(() => {
            req = {}; // Mock request object
            res = { // Mock response object
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            };

            getAllCountriesFromServiceMock = jest.spyOn(CountryService as any, "getAllCountriesFromService");
        });

        afterEach(() => {
            jest.clearAllMocks();
        });



        it('should return success response with country count', async () => {
            const countries = [{ name: 'CountryA' }, { name: 'CountryB' }];
            getAllCountriesFromServiceMock.mockResolvedValue(countries);

            const result = await CountryService.getCountriesFromService(req as Request, res as Response);

            expect(result.code).toEqual(ResponseStatus.OK);
            expect(result.data).toEqual({ count: countries.length })
        });

        it('should handle empty countries array correctly', async () => {
            const countries = [];
            getAllCountriesFromServiceMock.mockResolvedValue(countries);

            const result = await CountryService.getCountriesFromService(req as Request, res as Response);

            expect(result.code).toEqual(ResponseStatus.OK);
            expect(result.data).toEqual({ count: 0 })
        });

        it('should handle unexpected errors gracefully', async () => {
            const error = { message: 'Unexpected Error' };
            getAllCountriesFromServiceMock.mockImplementation(() => {
                throw error;
            });

            const result = await CountryService.getCountriesFromService(req as Request, res as Response);

            expect(result.code).toEqual(ResponseStatus.INTERNAL_SERVER_ERROR);
        });
    });

    // describe("getCountries", () => {
    //     let req: Partial<Request>;
    //     let res: Partial<Response>;

    //     beforeAll(() => {
    //         req = {
    //             query: {}
    //         };
    //         res = {
    //             status: jest.fn().mockReturnThis(),
    //             json: jest.fn().mockReturnThis()
    //         };

    //         jsonGetMock = jest.spyOn(CacheService, "jsonGet");
    //         jsonSetMock = jest.spyOn(CacheService, "jsonSet");
    //         findCountryMock = jest.spyOn(Country, "find");
    //         countryDbCountMock = jest.spyOn(Country, "countDocuments");
    //     });

    //     afterEach(() => {
    //         jest.clearAllMocks();
    //     });



    //     it('should return countries from cache', async () => {
    //         const cachedData = [{ data: [{ name: 'CountryA' }], meta: { page: 1, pageSize: 10, total: 1, pageCount: 1 } }];
    //         jsonGetMock.mockResolvedValue(cachedData);

    //         const result = await CountryService.getCountries(req as Request, res as Response);

    //         expect(jsonGetMock).toHaveBeenCalled();
    //         expect(findCountryMock).not.toHaveBeenCalled();
    //         expect(result.code).toEqual(ResponseStatus.OK)
    //         expect(result.data).toEqual(cachedData[0].data);
    //         expect(result.meta).toEqual(cachedData[0].meta);
    //     });

    //     it('should return countries from database and set cache', async () => {
    //         const countries = [{ name: 'CountryA' }, { name: 'CountryB' }];
    //         const filters = {};
    //         const pageSize = Pagination.DEFAULT_PAGE_NUMBER;
    //         const page = Pagination.DEFAULT_PAGE_NUMBER;
    //         const countriesCount = countries.length;
    //         const totalPages = 1;

    //         type MockedModel<T extends Document> = {
    //             [K in keyof Model<T>]: jest.Mock<any, any>;
    //         }

    //         const countryModelMock = <T extends Document>(): Partial<MockedModel<T>> => ({
    //             find: jest.fn().mockImplementation(() => ({
    //                 skip: jest.fn().mockReturnThis(),
    //                 limit: jest.fn().mockReturnThis(),
    //                 sort: jest.fn().mockReturnThis(),
    //             })),
    //         });

    //         const countryMock = countryModelMock<Country>();

    //         findCountryMock.mockResolvedValue(countries);
    //         countryDbCountMock.mockResolvedValue(countries.length);

    //         jsonGetMock.mockResolvedValue(null);
    //         jsonSetMock.mockResolvedValue(null);

    //         const result = await CountryService.getCountries(req as Request, res as Response);
    //         console.log(result);

    //         expect(jsonGetMock).toHaveBeenCalled();
    //         expect(jsonSetMock).toHaveBeenCalled();
    //         expect(findCountryMock).toHaveBeenCalledWith(filters);
    //         // expect(Country.find().skip).toHaveBeenCalledWith(0);
    //         // expect(Country.find().limit).toHaveBeenCalledWith(pageSize);
    //         // expect(Country.find().sort).toHaveBeenCalledWith({ name: "asc" });
    //         expect(countryDbCountMock).toHaveBeenCalledWith(filters);

    //         expect(result.code).toEqual(ResponseStatus.OK)
    //         expect(result.data).toEqual(countries);
    //         expect(result.meta).toEqual({ page, pageSize, total: countriesCount, pageCount: totalPages });
    //     });

    //     it('should handle query parameters correctly', async () => {
    //         req.query = {
    //             region: 'Europe',
    //             minPopulation: '1000000',
    //             maxPopulation: '50000000',
    //             page: '2',
    //             pageSize: '20'
    //         };
    //         const filters = {
    //             region: 'Europe',
    //             population: { $gte: '1000000', $lte: '50000000' }
    //         };
    //         const countries = [{ name: 'CountryA' }, { name: 'CountryB' }];
    //         const pageSize = 20;
    //         const page = 2;
    //         const countriesCount = countries.length;
    //         const totalPages = 1;

    //         jsonGetMock.mockResolvedValue(null);
    //         findCountryMock.mockResolvedValue(countries);
    //         countryDbCountMock.mockResolvedValue(countriesCount);
    //         jsonSetMock.mockResolvedValue(null);

    //         const result = await CountryService.getCountries(req as Request, res as Response);

    //         expect(jsonGetMock).toHaveBeenCalled();
    //         expect(jsonSetMock).toHaveBeenCalled();
    //         expect(findCountryMock).toHaveBeenCalledWith(filters);
    //         expect(countryDbCountMock).toHaveBeenCalledWith(filters);

    //         expect(result.code).toEqual(ResponseStatus.OK)
    //         expect(result.data).toEqual(countries);
    //         expect(result.meta).toEqual({ page, pageSize, total: countriesCount, pageCount: totalPages });
    //     });

    //     it('should handle errors correctly', async () => {
    //         const error = new Error('Database error');
    //         jsonGetMock.mockRejectedValue(error);

    //         const result = await CountryService.getCountries(req as Request, res as Response);

    //         expect(result.code).toEqual(ResponseStatus.INTERNAL_SERVER_ERROR);
    //     });
    // });

    describe("getCountry", () => {
        let req: Partial<Request>, res: Partial<Response>;

        beforeAll(() => {
            req = {
                params: {}
            };
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            };

            jsonGetMock = jest.spyOn(CacheService, "jsonGet");
            jsonSetMock = jest.spyOn(CacheService, "jsonSet");
            findCountryMock = jest.spyOn(Country, "findOne");
        });

        afterEach(() => {
            jest.clearAllMocks();
        });



        it('should return country from cache', async () => {
            const countryName = 'CountryA';
            const cachedData = [{ data: { name: countryName } }];
            jsonGetMock.mockResolvedValue(cachedData);
            (req.params as object)["name"] = countryName;

            const result = await CountryService.getCountry(req as Request, res as Response);

            expect(jsonGetMock).toHaveBeenCalledWith(`countries:${countryName.toLowerCase()}`);
            expect(findCountryMock).not.toHaveBeenCalled();
            expect(result.code).toEqual(ResponseStatus.OK)
            expect(result.data).toEqual(cachedData[0].data)
        });

        it('should return country from database and set cache', async () => {
            const countryName = 'CountryB';
            const countryData = { name: countryName };
            jsonGetMock.mockResolvedValue(null);
            jsonSetMock.mockResolvedValue(null);
            findCountryMock.mockResolvedValue(countryData);
            (req.params as object)["name"] = countryName;

            const result = await CountryService.getCountry(req as Request, res as Response);

            expect(jsonGetMock).toHaveBeenCalledWith(`countries:${countryName.toLowerCase()}`);
            expect(findCountryMock).toHaveBeenCalledWith({ name: countryName });
            expect(jsonSetMock).toHaveBeenCalledWith(`countries:${countryName.toLowerCase()}`, { data: countryData });
            expect(result.code).toEqual(ResponseStatus.OK)
            expect(result.data).toEqual(countryData)
        });

        it('should return error if country not found in database', async () => {
            const countryName = 'CountryC';
            jsonGetMock.mockResolvedValue(null);
            findCountryMock.mockResolvedValue(null);
            (req.params as object)["name"] = countryName;

            const result = await CountryService.getCountry(req as Request, res as Response);

            expect(jsonGetMock).toHaveBeenCalledWith(`countries:${countryName.toLowerCase()}`);
            expect(findCountryMock).toHaveBeenCalledWith({ name: countryName });
            expect(result.code).toEqual(ResponseStatus.NOT_FOUND)
        });

        it('should handle errors correctly', async () => {
            const countryName = 'CountryD';
            const error = new Error('Database error');
            jsonGetMock.mockRejectedValue(error);
            (req.params as object)["name"] = countryName;

            const result = await CountryService.getCountry(req as Request, res as Response);

            expect(jsonGetMock).toHaveBeenCalledWith(`countries:${countryName.toLowerCase()}`);
            expect(result.code).toEqual(ResponseStatus.INTERNAL_SERVER_ERROR)
        });
    });

    describe("getRegions", () => {
        let req: Partial<Request>;
        let res: Partial<Response>;
        let retrieveRegionsMock: jest.SpyInstance;

        beforeAll(() => {
            req = {};
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            };

            jsonGetMock = jest.spyOn(CacheService, "jsonGet");
            jsonSetMock = jest.spyOn(CacheService, "jsonSet");
            retrieveRegionsMock = jest.spyOn(CountryService as any, "retrieveRegions");
        });

        afterEach(() => {
            jest.clearAllMocks();
        });


        it('should return regions from cache', async () => {
            const cachedData = [{ data: { region1: {}, region2: {} }, meta: { total: 2 } }];
            jsonGetMock.mockResolvedValue(cachedData);


            const result = await CountryService.getRegions(req as Request, res as Response);

            expect(jsonGetMock).toHaveBeenCalledWith('regions:all');
            expect(retrieveRegionsMock).not.toHaveBeenCalled();
            expect(result.code).toEqual(ResponseStatus.OK);
            expect(result.data).toEqual(cachedData[0].data);
            expect(result.meta).toEqual(cachedData[0].meta);
        });

        it('should return regions from CountryService and set cache', async () => {
            const regions = { regionB: {}, regionA: {} };
            const sortedRegions = { regionA: {}, regionB: {} };
            const totalRegions = 2;

            jsonGetMock.mockResolvedValue(null);
            retrieveRegionsMock.mockResolvedValue(regions);
            jsonSetMock.mockResolvedValue(null);

            const result = await CountryService.getRegions(req as Request, res as Response);

            expect(jsonGetMock).toHaveBeenCalledWith('regions:all');
            expect(retrieveRegionsMock).toHaveBeenCalled();
            expect(jsonSetMock).toHaveBeenCalledWith('regions:all', { data: sortedRegions, meta: { total: totalRegions } });
            expect(result.code).toEqual(ResponseStatus.OK);
            expect(result.data).toEqual(sortedRegions);
            expect(result.meta).toEqual({ total: totalRegions });
        });

        it('should handle errors correctly', async () => {
            const error = new Error('Database error');
            jsonGetMock.mockRejectedValue(error);

            const result = await CountryService.getRegions(req as Request, res as Response);

            expect(jsonGetMock).toHaveBeenCalled();
            expect(result.code).toEqual(ResponseStatus.INTERNAL_SERVER_ERROR);
        });

        it('should handle empty regions correctly', async () => {
            const regions = {};
            const sortedRegions = {};
            const totalRegions = 0;

            jsonGetMock.mockResolvedValue(null);
            jsonSetMock.mockResolvedValue(null);
            retrieveRegionsMock.mockResolvedValue(regions);

            const result = await CountryService.getRegions(req as Request, res as Response);

            expect(jsonGetMock).toHaveBeenCalledWith('regions:all');
            expect(retrieveRegionsMock).toHaveBeenCalled();
            expect(jsonSetMock).toHaveBeenCalledWith('regions:all', { data: sortedRegions, meta: { total: totalRegions } });
            expect(result.code).toEqual(ResponseStatus.OK);
            expect(result.data).toEqual(sortedRegions);
            expect(result.meta).toEqual({ total: totalRegions });
        });

        it('should handle unsorted regions correctly', async () => {
            const regions = { regionC: {}, regionB: {}, regionA: {} };
            const sortedRegions = { regionA: {}, regionB: {}, regionC: {} };
            const totalRegions = 3;

            jsonGetMock.mockResolvedValue(null);
            jsonSetMock.mockResolvedValue(null);
            retrieveRegionsMock.mockResolvedValue(regions);

            const result = await CountryService.getRegions(req as Request, res as Response);

            expect(jsonGetMock).toHaveBeenCalledWith('regions:all');
            expect(retrieveRegionsMock).toHaveBeenCalled();
            expect(jsonSetMock).toHaveBeenCalledWith('regions:all', { data: sortedRegions, meta: { total: totalRegions } });
            expect(result.code).toEqual(ResponseStatus.OK);
            expect(result.data).toEqual(sortedRegions);
            expect(result.meta).toEqual({ total: totalRegions });
        });
    });

    describe("getLanguages", () => {
        let req: Partial<Request>;
        let res: Partial<Response>;
        let retrieveLanguagesMock: jest.SpyInstance;

        beforeAll(() => {
            req = {};
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            };

            jsonGetMock = jest.spyOn(CacheService, "jsonGet");
            jsonSetMock = jest.spyOn(CacheService, "jsonSet");
            retrieveLanguagesMock = jest.spyOn(CountryService as any, "retrieveLanguages");
        });

        afterEach(() => {
            jest.clearAllMocks();
        });



        it('should return languages from cache', async () => {
            const cachedData = [{ data: { language1: {}, language2: {} }, meta: { total: 2 } }];
            jsonGetMock.mockResolvedValue(cachedData);

            const result = await CountryService.getLanguages(req as Request, res as Response);

            expect(jsonGetMock).toHaveBeenCalledWith('languages:all');
            expect(retrieveLanguagesMock).not.toHaveBeenCalled();
            expect(result.code).toEqual(ResponseStatus.OK);
            expect(result.data).toEqual(cachedData[0].data);
            expect(result.meta).toEqual(cachedData[0].meta);
        });

        it('should return languages from CountryService and set cache', async () => {
            const languages = { languageB: {}, languageA: {} };
            const sortedLanguages = { languageA: {}, languageB: {} };
            const totalLanguages = 2;

            jsonGetMock.mockResolvedValue(null);
            jsonSetMock.mockResolvedValue(null);
            retrieveLanguagesMock.mockResolvedValue(languages);

            const result = await CountryService.getLanguages(req as Request, res as Response);

            expect(jsonGetMock).toHaveBeenCalledWith('languages:all');
            expect(retrieveLanguagesMock).toHaveBeenCalled();
            expect(jsonSetMock).toHaveBeenCalledWith('languages:all', { data: sortedLanguages, meta: { total: totalLanguages } });
            expect(result.code).toEqual(ResponseStatus.OK);
            expect(result.data).toEqual(sortedLanguages);
            expect(result.meta).toEqual({ total: totalLanguages });
        });

        it('should handle errors correctly', async () => {
            const error = new Error('Database error');
            jsonGetMock.mockRejectedValue(error);

            const result = await CountryService.getLanguages(req as Request, res as Response);

            expect(jsonGetMock).toHaveBeenCalled();
            expect(result.code).toEqual(ResponseStatus.INTERNAL_SERVER_ERROR);
        });

        it('should handle empty languages correctly', async () => {
            const languages = {};
            const sortedLanguages = {};
            const totalLanguages = 0;

            jsonGetMock.mockResolvedValue(null);
            jsonSetMock.mockResolvedValue(null);
            retrieveLanguagesMock.mockResolvedValue(languages);

            const result = await CountryService.getLanguages(req as Request, res as Response);

            expect(jsonGetMock).toHaveBeenCalledWith('languages:all');
            expect(retrieveLanguagesMock).toHaveBeenCalled();
            expect(jsonSetMock).toHaveBeenCalledWith('languages:all', { data: sortedLanguages, meta: { total: totalLanguages } });
            expect(result.code).toEqual(ResponseStatus.OK);
            expect(result.data).toEqual(sortedLanguages);
            expect(result.meta).toEqual({ total: totalLanguages });
        });

        it('should handle unsorted languages correctly', async () => {
            const languages = { languageC: {}, languageB: {}, languageA: {} };
            const sortedLanguages = { languageA: {}, languageB: {}, languageC: {} };
            const totalLanguages = 3;

            jsonGetMock.mockResolvedValue(null);
            jsonSetMock.mockResolvedValue(null);
            retrieveLanguagesMock.mockResolvedValue(languages);

            const result = await CountryService.getLanguages(req as Request, res as Response);

            expect(jsonGetMock).toHaveBeenCalledWith('languages:all');
            expect(retrieveLanguagesMock).toHaveBeenCalled();
            expect(jsonSetMock).toHaveBeenCalledWith('languages:all', { data: sortedLanguages, meta: { total: totalLanguages } });
            expect(result.code).toEqual(ResponseStatus.OK);
            expect(result.data).toEqual(sortedLanguages);
            expect(result.meta).toEqual({ total: totalLanguages });
        });
    });

    describe("getStatistics", () => {
        let req: Partial<Request>;
        let res: Partial<Response>;
        let retrieveLanguagesMock: jest.SpyInstance;
        let findCountryMock: jest.SpyInstance;

        beforeAll(() => {
            req = {};
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            };

            jsonGetMock = jest.spyOn(CacheService, "jsonGet");
            jsonSetMock = jest.spyOn(CacheService, "jsonSet");
            retrieveLanguagesMock = jest.spyOn(CountryService as any, "retrieveLanguages");
            findCountryMock = jest.spyOn(Country, "find");
        });

        afterEach(() => {
            jest.clearAllMocks();
        });



        it('should return statistics from cache', async () => {
            const cachedData = [{ countries: 3 }];
            jsonGetMock.mockResolvedValue(cachedData);

            const result = await CountryService.getStatistics(req as Request, res as Response);

            expect(jsonGetMock).toHaveBeenCalledWith('statistics:all');
            expect(result.code).toEqual(ResponseStatus.OK);
            expect(result.data).toEqual(cachedData[0]);
        });

        it('should return statistics after computing from data', async () => {
            const countries = [
                [
                    { name: 'CountryA', area: 100, population: 1000 },
                    { name: 'CountryB', area: 200, population: 2000 },
                    { name: 'CountryC', area: 50, population: 500 }
                ]
            ];
            const languages = {
                languageA: { totalPopulation: 2000, countries: ['CountryA', 'CountryB'] },
                languageB: { totalPopulation: 1500, countries: ['CountryC'] }
            };
            const expectedStatistics = {
                countries: 3,
                largestCountryByArea: { country: 'CountryB', area: 200 },
                smallestCountryByArea: { country: 'CountryC', area: 50 },
                largestCountryByPopulation: { country: 'CountryB', population: 2000 },
                smallestCountryByPopulation: { country: 'CountryC', population: 500 },
                mostSpokenLanguage: { language: 'languageA', totalSpeakers: 2000, totalCountries: 2 },
                leastSpokenLanguage: { language: 'languageB', totalSpeakers: 1500, totalCountries: 1 }
            };

            jsonGetMock
                .mockResolvedValueOnce(null)
                .mockResolvedValueOnce(countries)
                .mockResolvedValueOnce(null);
            findCountryMock.mockResolvedValue(countries);
            retrieveLanguagesMock.mockResolvedValue(languages);
            jsonSetMock.mockResolvedValue(null);

            const result = await CountryService.getStatistics(req as Request, res as Response);

            expect(jsonGetMock).toHaveBeenCalledWith('statistics:all');
            expect(jsonGetMock).toHaveBeenCalledWith(redisKeyForAllCountries);
            expect(jsonGetMock).toHaveBeenCalledWith('languages:all');
            expect(findCountryMock).not.toHaveBeenCalled();
            expect(retrieveLanguagesMock).toHaveBeenCalled();
            expect(jsonSetMock).toHaveBeenCalledWith('statistics:all', expectedStatistics);
            expect(result.code).toEqual(ResponseStatus.OK);
            expect(result.data).toEqual(expectedStatistics);
        });

        it('should handle errors correctly', async () => {
            const error = new Error('Database error');
            jsonGetMock.mockRejectedValue(error);

            const result = await CountryService.getStatistics(req as Request, res as Response);

            expect(jsonGetMock).toHaveBeenCalled();
            expect(result.code).toEqual(ResponseStatus.INTERNAL_SERVER_ERROR);
        });

        it('should handle missing countries in the database', async () => {
            const languages = {
                languageA: { totalPopulation: 2000, countries: ['CountryA', 'CountryB'] },
                languageB: { totalPopulation: 1500, countries: ['CountryC'] }
            };
            const expectedStatistics = {
                countries: 0,
                largestCountryByArea: null,
                smallestCountryByArea: null,
                largestCountryByPopulation: null,
                smallestCountryByPopulation: null,
                mostSpokenLanguage: { language: 'languageA', totalSpeakers: 2000, totalCountries: 2 },
                leastSpokenLanguage: { language: 'languageB', totalSpeakers: 1500, totalCountries: 1 }
            };

            jsonGetMock
                .mockResolvedValueOnce(null)
                .mockResolvedValueOnce(null)
                .mockResolvedValueOnce(null);
            findCountryMock.mockResolvedValue([]);
            retrieveLanguagesMock.mockResolvedValue(languages);
            jsonSetMock.mockResolvedValue(null);

            const result = await CountryService.getStatistics(req as Request, res as Response);

            expect(jsonGetMock).toHaveBeenCalledWith('statistics:all');
            expect(jsonGetMock).toHaveBeenCalledWith(redisKeyForAllCountries);
            expect(jsonGetMock).toHaveBeenCalledWith('languages:all');
            expect(findCountryMock).toHaveBeenCalled();
            expect(retrieveLanguagesMock).toHaveBeenCalled();
            expect(jsonSetMock).toHaveBeenCalledWith('statistics:all', expectedStatistics);
            expect(result.code).toEqual(ResponseStatus.OK);
            expect(result.data).toEqual(expectedStatistics);
        });

        it('should handle missing languages in the database', async () => {
            const countries = [
                [
                    { name: 'CountryA', area: 100, population: 1000 },
                    { name: 'CountryB', area: 200, population: 2000 },
                    { name: 'CountryC', area: 50, population: 500 }
                ]
            ];
            const expectedStatistics = {
                countries: 3,
                largestCountryByArea: { country: 'CountryB', area: 200 },
                smallestCountryByArea: { country: 'CountryC', area: 50 },
                largestCountryByPopulation: { country: 'CountryB', population: 2000 },
                smallestCountryByPopulation: { country: 'CountryC', population: 500 },
                mostSpokenLanguage: null,
                leastSpokenLanguage: null
            };

            jsonGetMock
                .mockResolvedValueOnce(null)
                .mockResolvedValueOnce(countries)
                .mockResolvedValueOnce(null);
            findCountryMock.mockResolvedValue(countries);
            retrieveLanguagesMock.mockResolvedValue({});

            const result = await CountryService.getStatistics(req as Request, res as Response);

            expect(jsonGetMock).toHaveBeenCalledWith('statistics:all');
            expect(jsonGetMock).toHaveBeenCalledWith(redisKeyForAllCountries);
            expect(jsonGetMock).toHaveBeenCalledWith('languages:all');
            expect(findCountryMock).not.toHaveBeenCalled();
            expect(retrieveLanguagesMock).toHaveBeenCalled();
            expect(jsonSetMock).toHaveBeenCalledWith('statistics:all', expectedStatistics);
            expect(result.code).toEqual(ResponseStatus.OK);
            expect(result.data).toEqual(expectedStatistics);
        });
    });
});