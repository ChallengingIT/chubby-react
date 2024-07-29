import axios from "axios";



const API_LOGIN = "http://localhost:8080/api/auth/";
const API_LOGIN_CANDIDATO = "http://localhost:8080/candidato/auth/";
const API_LOGOUT = "http://localhost:8080/logout";
const API_REGISTER_CANDIDATO = "http://localhost:8080/candidato/auth/signup"



class AuthService {
  // login(username, password) {
  //   return axios
  //     .post(API_URL + "signin", {
  //       username,
  //       password
  //     })
  //     .then(response => {
  //       if (response.data) {
  //         sessionStorage.setItem("user", JSON.stringify(response.data));
  //       } else {
  //         console.log("login fallito!");
  //       }

  //       return response.data;
  //     });
  // }


  login(username, password) {
    return axios
      .post(API_LOGIN + "signin", {
        username,
        password
      })
      .then(response => {
        if (response.data) {
          sessionStorage.setItem("user", JSON.stringify(response.data));
          return response.data;
        } else {
          throw new Error("Login failed"); // Lancia un errore se la login fallisce
        }
      })
      .catch(error => {
        throw error; // Propaga l'errore al chiamante
      });
  }



  loginCandidato(username, password) {
    return axios
      .post(API_LOGIN_CANDIDATO + "signin", {
        username,
        password
      })
      .then(response => {
        if (response.data) {
          sessionStorage.setItem("user", JSON.stringify(response.data));
          return response.data;
        } else {
          throw new Error("Login failed"); // Lancia un errore se la login fallisce
        }
      })
      .catch(error => {
        throw error; // Propaga l'errore al chiamante
      });
  }

  async registerCandidato(username, password, nome, cognome, cellulare, residenza, email, file) {
    try {
  
      // Invia i dati di registrazione come JSON
      const registrationResponse = await axios.post(API_REGISTER_CANDIDATO, {username, password, nome, cognome, cellulare, residenza, email});
  

        const usernameResponse = registrationResponse.data;
        console.log("risposta: ", registrationResponse.data);

        try{
          if(usernameResponse) {
            const formData = new FormData();
            formData.append("cv", file);
            formData.append('username', usernameResponse);

            const cvResponse = await axios.post('http://localhost:8080/candidato/auth/signup/cv', formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
          });
          }
          return registrationResponse;
        } catch (error) {
          if (error.response && error.response.status === 401) {
            console.error("Non autorizzato: verifica i dettagli di autenticazione.");
          } else {
            console.error("Si è verificato un errore:", error.message);
          }
          throw error;
        }
      
      
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Non autorizzato: verifica i dettagli di autenticazione.");
      } else {
        console.error("Si è verificato un errore:", error.message);
      }
      throw error;
    }
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

  // register( nome, cognome, username, password, role) {
  //   return axios
  //   .post(API_URL + "signup", {
  //     nome,
  //     cognome,
  //     username,
  //     password,
  //     role

  //   })
  //   .then(response => {
  //     if (response.data) {
  //     console.log("registrazione effettuata!");
  //     }
  //   });
  // }

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