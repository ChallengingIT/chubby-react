import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://89.46.67.198:8443/';

class UserService {
  getPublicContent() {
    return axios.get(API_URL + 'all');
  }

  getUserBoard() {
    return axios.get(API_URL + 'user', { headers: authHeader() });
  }

  getModeratorBoard() {
    return axios.get(API_URL + 'mod', { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + 'admin', { headers: authHeader() });
  }

  getAziende() {
    return axios.get(API_URL + 'aziende/react', { headers: authHeader() });


  }
}

export default new UserService();