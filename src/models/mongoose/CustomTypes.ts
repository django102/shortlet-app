import mongoose from "mongoose";

export class Flag extends mongoose.SchemaType {
    constructor(key, options) {
        super(key, options, 'Flag');
    }

    // Validate and cast the flag value
    cast(val) {
        if (val instanceof Object && typeof val.png === 'string' && typeof val.svg === 'string') {
            return val;
        }
        throw new Error(`Invalid flag value: ${val}. Must be an object with png and svg properties.`);
    }
}

export class Map extends mongoose.SchemaType {
    constructor(key, options) {
        super(key, options, 'Map');
    }

    // Validate and cast the flag value
    cast(val) {
        if (val instanceof Object && typeof val.googleMaps === 'string' && typeof val.openStreetMaps === 'string') {
            return val;
        }
        throw new Error(`Invalid map value: ${val}. Must be an object with googleMaps and openStreetMaps properties.`);
    }
}


export class Currency extends mongoose.SchemaType {
    constructor(key, options) {
        super(key, options, 'Currency');
    }

    // Validate and cast the flag value
    cast(val) {
        if (val instanceof Object && typeof val.code === 'string' && typeof val.name === 'string' && typeof val.symbol === 'string') {
            return val;
        }
        throw new Error(`Invalid currency value: ${val}. Must be an object with code, name and symbol properties.`);
    }
}


(mongoose.Schema.Types as any).Flag = Flag;
(mongoose.Schema.Types as any).Map = Map;
(mongoose.Schema.Types as any).Currency = Currency;