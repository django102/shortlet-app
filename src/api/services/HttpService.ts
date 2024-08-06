import axios from "axios";
import querystring from "querystring";


export default class HttpService {
    public static async getResource(baseUrl: string, path?: string, query?: any) {
        try {
            const filters = query ? querystring.stringify(query) : '';
            const url = `${path || ''}${filters ? `?${filters}` : ''}`;
            const fullUrl = `${baseUrl}${url}`;

            const result: any = await axios.get(fullUrl)
           
            return result.data
        } catch (err: any) {
            console.log("Axios Error: ", err);
            return { status: false, message: err.message }
        }
    }
}