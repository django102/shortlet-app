import { Schema, model } from 'mongoose';
import { ICountry } from '../../interfaces/ICountry';
import { Currency, Flag, Map } from '../mongoose/CustomTypes';


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
            type: [Schema.Types.Number],
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
        area: {
            type: Schema.Types.Number,
            required: true
        },
        timezones: {
            type: [String],
        },
    },
    { timestamps: true, collation: { locale: 'en_US', strength: 2 } },
);

countrySchema.index({ name: 1 });
countrySchema.index({ region: 1 });


const Country = model<ICountry>('country', countrySchema);
export default Country;