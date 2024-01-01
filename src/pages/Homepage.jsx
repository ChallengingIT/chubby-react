import React                from "react";
import sfondohome           from "../images/sfondohome.png";
import Sidebar              from "../components/Sidebar";

import "../styles/Homepage.css";

const Homepage = () => {
return (
    <div className="homepage-container">
    <div className="img-container-homepage">
        <img
        src={sfondohome}
        alt="Immagine di sfondo"
        className="background-image"
        />
        <Sidebar />
    </div>
    </div>
);
};

export default Homepage;
