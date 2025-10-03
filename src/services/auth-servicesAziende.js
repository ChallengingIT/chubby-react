import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://89.46.196.60:8443/";

class AUthServiceAziende {
    aziende() {
        return axios
        .get(API_URL + "aziende/react", { headers: authHeader() } )

    }
}

export default new AUthServiceAziende();