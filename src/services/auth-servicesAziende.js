import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://89.46.67.198/";

class AUthServiceAziende {
    aziende() {
        return axios
        .get(API_URL + "aziende/react", { headers: authHeader() } )

    }
}

export default new AUthServiceAziende();