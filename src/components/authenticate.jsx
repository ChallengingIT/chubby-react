import axios from 'axios';

const authenticate = async (username, password) => {

  try {
    const response = await axios.post('http://89.46.196.60:8443/login', {
      username,
      password,
    });

    const csrfToken = response.headers['XSRF-TOKEN'];

    if (!csrfToken) {
      console.error('Errore nel recupero del token CSRF.');
      return;
    }

  } catch (error) {
    throw error;
  }
};

export { authenticate };
