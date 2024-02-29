import React, { useEffect }               from "react";
import sfondohome           from "../images/challenging.png";
import Sidebar              from "../components/Sidebar";

import "../styles/Homepage.css";
import Sidebar2 from "../components/componentiBackup/Sidebar2";
import SidebarTorchy from "../components/SidebarTorchy";
import Sfondo from '../images/loginTorchy.svg';



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
            alt="Login background"
            src={Sfondo}
            style={{
            width: '100vw',
            height: '100vh',
            objectFit: 'cover',
            position: 'absolute', 
            top: 0,
            left: 0,
            zIndex: -1, 
            }}
        />
        <div className="sidebar-container">
          <SidebarTorchy />
        </div>

    </div>
    </div>
);
};

export default Homepage;
