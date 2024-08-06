import { ICountry } from "../interfaces/ICountry";


export default class MapperService {
    private static getCurrencies(currencyObjects) {
        if (!currencyObjects) return [];

        const currencyCodes = Object.keys(currencyObjects);
        const currencies = currencyCodes.map((code) => {
            return {
                code,
                symbol: currencyObjects[code].symbol,
                name: currencyObjects[code].name,
            }
        });

        return currencies;
    }

    private static getLanguages(languageObjects): string[] {
        if (!languageObjects) return [];

        const languageCodes = Object.keys(languageObjects);
        const languages = languageCodes.map((code) => {
            return languageObjects[code];
        })

        return languages;
    }

    public static mapCountryResponseToObject(data: any): ICountry {
        const country: ICountry = {};

        country.name = data.name.common;
        country.currencies = MapperService.getCurrencies(data.currencies);
        country.capital = data.capital;
        country.region = data.region;
        country.continents = data.continents;
        country.languages = MapperService.getLanguages(data.languages);
        country.location = data.latlng;
        country.flag = data.flag;
        country.flags = data.flags;
        country.maps = data.maps;
        country.population = data.population;
        country.area = data.area;
        country.timezones = data.timezones;

        return country;
    }

    public static mapCountryArrayResponseToArray(data: any[]): ICountry[] {
        if (data.length === 0) return [];

        const countries = data.map((dataObject) => {
            return MapperService.mapCountryResponseToObject(dataObject);
        });

        return countries;
    }
}