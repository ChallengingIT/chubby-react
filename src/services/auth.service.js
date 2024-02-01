import axios from "axios";



const API_URL = "http://localhost:8080/api/auth/";
const API_LOGOUT = "http://localhost:8080/logout";



// Recupera l'accessToken da localStorage
const user = JSON.parse(localStorage.getItem("user"));
const accessToken = user?.accessToken;

// Configura gli headers della richiesta con l'Authorization token
const headers = {
  Authorization: `Bearer ${accessToken}`
};

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