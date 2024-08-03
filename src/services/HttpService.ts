import axios from "axios";
import querystring from "querystring";


const getResource = async (baseUrl: string, path: string, query: any) => {
    try {
        const filters = querystring.stringify(query);
        const url = `${path}${filters && `?${filters}`}`;

        const result: any = await axios({
            baseURL: baseUrl,
            method: "GET",
            url
        });

        return result.data
    } catch (err: any) {
        console.log("Axios Error: ", err);
        return { status: false, message: err.message }
    }
}


export default {
    getResource
}