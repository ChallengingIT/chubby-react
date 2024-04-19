import axios from "axios";



const API_URL = "http://localhost:8080/api/auth/";
const API_LOGOUT = "http://localhost:8080/logout";



class AuthService {
  login(username, password) {
    return axios
      .post(API_URL + "signin", {
        username,
        password
      })
      .then(response => {
        if (response.data) {
          sessionStorage.setItem("user", JSON.stringify(response.data));
        } else {
          console.log("login fallito!");
        }

        return response.data;
      });
  }

  logout() {
    
    const user = JSON.parse(sessionStorage.getItem("user"));
    const token = user?.token;

    const config = {
      headers: {
          Authorization: `Bearer ${token}`
      }
  };
    
    return axios
    .post(API_LOGOUT, {}, config)
    .then(response => {
      if (response.data) {
        sessionStorage.removeItem("user");
        
        
      }
      return response.data;
    })
    

  }

  register( nome, cognome, username, password, role) {
    return axios
    .post(API_URL + "signup", {
      nome,
      cognome,
      username,
      password,
      role

    })
    .then(response => {
      if (response.data) {
      console.log("registrazione effettuata!");
      }
    });
  }

  getCurrentUser() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    return user;
  }
  

  isAuthenticated() {
    const user = this.getCurrentUser();
    return user && user.token ? true : false;

  }
}

export default new AuthService();