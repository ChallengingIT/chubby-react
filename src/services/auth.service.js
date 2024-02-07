import axios from "axios";



const API_URL = "http://89.46.196.60:8443/api/auth/";
const API_LOGOUT = "http://89.46.196.60:8443/logout";


// Configura gli headers della richiesta con l'Authorization token


class AuthService {
  login(username, password) {
    return axios
      .post(API_URL + "signin", {
        username,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    
    // Recupera l'accessToken da localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    const accessToken = user?.accessToken;

    const headers = {
      Authorization: `Bearer ${accessToken}`
    };
    
    return axios
    .post(API_LOGOUT, { headers: headers })
    .then(response => {
      if (response.data) {
        localStorage.removeItem("user");
        
      }
      return response.data;
    })
    

  }

  register(username, email, password) {
    return axios.post(API_URL + "signup", {
      username,
      email,
      password
    });
  }

  getCurrentUser() {
    const user = JSON.parse(localStorage.getItem('user'));
    // console.log('Caricato utente:', user);
    return user;
  }
  

  isAuthenticated() {
    const user = this.getCurrentUser();
    // console.log("utente autenticato: ", user);
    return user && user.accessToken ? true : false;

  }
}

export default new AuthService();