import { ICurrency } from "../interfaces/ICurrency";

export default class Currency implements ICurrency {
    code: string;
    name: string;
    symbol: string;
}