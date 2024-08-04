// mongoose.d.ts
import 'mongoose';

declare module 'mongoose' {
    interface SchemaTypes {
        Flag: typeof import("./CustomTypes").Flag;
        Map: typeof import("./CustomTypes").Map;
        Currency: typeof import("./CustomTypes").Currency;
    }
}
