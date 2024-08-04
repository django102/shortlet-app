import { Schema, model } from 'mongoose';
import { ICountry } from '../../interfaces/ICountry';
// import Flag from '../Flag';
// import Map from '../Map';
import { Currency, Flag, Map } from '../mongoose/CustomTypes';
// import Flag from '../mongoose/CustomTypes';
// import Currency from '../Currency';


const countrySchema = new Schema<ICountry>(
    {
        name: {
            type: String,
            required: true
        },
        currencies: {
            type: [Currency]
        },
        capital: {
            type: [String],
        },
        region: {
            type: String,
            required: true
        },
        continents: {
            type: [String],
        },
        languages: {
            type: [String],
        },
        location: {
            type: [Number],
        },
        flag: {
            type: String,
        },
        flags: {
            type: [Flag],
        },
        maps: {
            type: [Map]
        },
        population: {
            type: Number,
            required: true
        },
        timezones: {
            type: [String],
        },
    },
    { timestamps: true },
);

const Country = model<ICountry>('country', countrySchema);
export default Country;