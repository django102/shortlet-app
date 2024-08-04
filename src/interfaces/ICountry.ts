import {Flag, Map} from "../models/mongoose/CustomTypes";

export interface ICountry {
    name?: string;
    currencies?: object[];
    capital?: string[];
    region?: string;
    continents?: string[];
    languages?: string[];
    location?: number[];
    flag?: string;
    flags?: Flag[];
    maps?: Map[];
    population?: number;
    timezones?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}