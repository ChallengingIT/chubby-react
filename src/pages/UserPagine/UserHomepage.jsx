import React, { useEffect }               from "react";
import sfondohome           from "../../images/sfondohome.png";


import "../../styles/Homepage.css";
import UserSidebar from "./UserSidebar";

const UserHomepage = () => {

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
        <UserSidebar />
    </div>
    </div>
);
};

export default UserHomepage;
