import MapperService from "../../../src/api/services/MapperService";


describe("MapperService", () => {
    describe('getCurrencies', () => {
        it('should return an empty array if no currencies provided', () => {
            const result = (MapperService as any).getCurrencies(null);
            expect(result).toEqual([]);
        });

        it('should map currency objects to array of currencies', () => {
            const currencyObjects = {
                USD: { symbol: '$', name: 'United States dollar' },
                EUR: { symbol: '€', name: 'Euro' }
            };
            const expectedCurrencies = [
                { code: 'USD', symbol: '$', name: 'United States dollar' },
                { code: 'EUR', symbol: '€', name: 'Euro' }
            ];

            const result = (MapperService as any).getCurrencies(currencyObjects);
            expect(result).toEqual(expectedCurrencies);
        });
    });

    describe('getLanguages', () => {
        it('should return an empty array if no languages provided', () => {
            const result = (MapperService as any).getLanguages(null);
            expect(result).toEqual([]);
        });

        it('should map language objects to array of languages', () => {
            const languageObjects = {
                en: 'English',
                es: 'Spanish'
            };
            const expectedLanguages = ['English', 'Spanish'];

            const result = (MapperService as any).getLanguages(languageObjects);
            expect(result).toEqual(expectedLanguages);
        });
    });

    describe('mapCountryResponseToObject', () => {
        it('should map country response to country object', () => {
            const data = {
                name: { common: 'CountryName' },
                currencies: {
                    USD: { symbol: '$', name: 'United States dollar' }
                },
                capital: ['CapitalCity'],
                region: 'RegionName',
                continents: ['ContinentName'],
                languages: {
                    en: 'English'
                },
                latlng: [10, 20],
                flag: '🏳️',
                flags: {
                    png: 'http://example.com/flag.png',
                    svg: 'http://example.com/flag.svg'
                },
                maps: {
                    googleMaps: 'http://example.com/maps',
                    openStreetMaps: 'http://example.com/osm'
                },
                population: 1000000,
                area: 50000,
                timezones: ['UTC+0']
            };
            const expectedCountry = {
                name: 'CountryName',
                currencies: [
                    { code: 'USD', symbol: '$', name: 'United States dollar' }
                ],
                capital: ['CapitalCity'],
                region: 'RegionName',
                continents: ['ContinentName'],
                languages: ['English'],
                location: [10, 20],
                flag: '🏳️',
                flags: {
                    png: 'http://example.com/flag.png',
                    svg: 'http://example.com/flag.svg'
                },
                maps: {
                    googleMaps: 'http://example.com/maps',
                    openStreetMaps: 'http://example.com/osm'
                },
                population: 1000000,
                area: 50000,
                timezones: ['UTC+0']
            };

            const result = MapperService.mapCountryResponseToObject(data);
            expect(result).toEqual(expectedCountry);
        });
    });

    describe('mapCountryArrayResponseToArray', () => {
        it('should return an empty array if no data provided', () => {
            const result = MapperService.mapCountryArrayResponseToArray([]);
            expect(result).toEqual([]);
        });

        it('should map array of country responses to array of country objects', () => {
            const data = [
                {
                    name: { common: 'CountryName1' },
                    currencies: {
                        USD: { symbol: '$', name: 'United States dollar' }
                    },
                    capital: ['CapitalCity1'],
                    region: 'RegionName1',
                    continents: ['ContinentName1'],
                    languages: {
                        en: 'English'
                    },
                    latlng: [10, 20],
                    flag: '🏳️',
                    flags: {
                        png: 'http://example.com/flag1.png',
                        svg: 'http://example.com/flag1.svg'
                    },
                    maps: {
                        googleMaps: 'http://example.com/maps1',
                        openStreetMaps: 'http://example.com/osm1'
                    },
                    population: 1000000,
                    area: 50000,
                    timezones: ['UTC+0']
                },
                {
                    name: { common: 'CountryName2' },
                    currencies: {
                        EUR: { symbol: '€', name: 'Euro' }
                    },
                    capital: ['CapitalCity2'],
                    region: 'RegionName2',
                    continents: ['ContinentName2'],
                    languages: {
                        es: 'Spanish'
                    },
                    latlng: [30, 40],
                    flag: '🏴',
                    flags: {
                        png: 'http://example.com/flag2.png',
                        svg: 'http://example.com/flag2.svg'
                    },
                    maps: {
                        googleMaps: 'http://example.com/maps2',
                        openStreetMaps: 'http://example.com/osm2'
                    },
                    population: 2000000,
                    area: 100000,
                    timezones: ['UTC+1']
                }
            ];
            const expectedCountries = [
                {
                    name: 'CountryName1',
                    currencies: [
                        { code: 'USD', symbol: '$', name: 'United States dollar' }
                    ],
                    capital: ['CapitalCity1'],
                    region: 'RegionName1',
                    continents: ['ContinentName1'],
                    languages: ['English'],
                    location: [10, 20],
                    flag: '🏳️',
                    flags: {
                        png: 'http://example.com/flag1.png',
                        svg: 'http://example.com/flag1.svg'
                    },
                    maps: {
                        googleMaps: 'http://example.com/maps1',
                        openStreetMaps: 'http://example.com/osm1'
                    },
                    population: 1000000,
                    area: 50000,
                    timezones: ['UTC+0']
                },
                {
                    name: 'CountryName2',
                    currencies: [
                        { code: 'EUR', symbol: '€', name: 'Euro' }
                    ],
                    capital: ['CapitalCity2'],
                    region: 'RegionName2',
                    continents: ['ContinentName2'],
                    languages: ['Spanish'],
                    location: [30, 40],
                    flag: '🏴',
                    flags: {
                        png: 'http://example.com/flag2.png',
                        svg: 'http://example.com/flag2.svg'
                    },
                    maps: {
                        googleMaps: 'http://example.com/maps2',
                        openStreetMaps: 'http://example.com/osm2'
                    },
                    population: 2000000,
                    area: 100000,
                    timezones: ['UTC+1']
                }
            ];

            const result = MapperService.mapCountryArrayResponseToArray(data);
            expect(result).toEqual(expectedCountries);
        });
    });
});