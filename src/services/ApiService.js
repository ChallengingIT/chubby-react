import axios from 'axios';
import config from '../api/config.json';
import BASE_URL from '../api/apiConfig';

class ApiService {
    constructor() {
        this.baseUrl = BASE_URL || config.basePath;
        this.preFix = config.preFix;
        this.paths = config.paths;
    }

    request(apiName, params = {}, body = {}, headers = {}, queryParams = {}) {
        const api = this.paths[apiName];
        if (!api) {
            throw new Error(`API name "${apiName}" not found in config.`);
        }

        let url = this.baseUrl + api.path;
        if (params) {
            Object.keys(params).forEach((key) => {
                url = url.replace(`{${key}}`, params[key]);
            });
        }


        const queryString = Object.entries(queryParams)
        .map(([key, value]) => {
            if (Array.isArray(value)) {
                return `${key}=${value.join(',')}`;  
            }
            return `${key}=${value}`;
        })
        .join('&');
    
    if (queryString) {
        url += `?${queryString}`;
    }
    


        const user = JSON.parse(sessionStorage.getItem("user"));
        const token = user?.token;

        const options = {
            method: api.method,
            url,
            data: body,
            headers: {
                Authorization: `Bearer ${token}`,
                ...headers, 
            },
        };

        return axios(options)
            .then((response) => response)
            .catch((error) => {
                console.error(`Error in API request: ${apiName}`, error);
                throw error;
            });
    }
}

export default new ApiService();
