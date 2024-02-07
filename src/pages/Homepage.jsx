import React, { useEffect }               from "react";
import sfondohome           from "../images/sfondohome.png";
import Sidebar              from "../components/Sidebar";

import "../styles/Homepage.css";



const Homepage = () => {

    useEffect(() => {
        // Recupera i dati dell'utente dal localStorage
        const userData = localStorage.getItem('user');
        const user = userData ? JSON.parse(userData) : null;
    
 

      }, []);


return (
    <div className="homepage-container">
    <div className="img-container-homepage">
        <img
        src={sfondohome}
        alt="Immagine di sfondo"
        className="background-image"
        />
        <div className="sidebar-container">
          <Sidebar />
        </div>

    </div>
    </div>
);
};

export default Homepage;
