import React from "react";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";

const SearchComponent2 = ({ rows, columns, componentType, handleChange }) => {
const getComponent = (type) => {
    switch (type) {
    case "input":
        return (
        <Select
            className="dropdown-menu"
            value="seleziona"
            onChange={handleChange}
        >
            <option value="seleziona" disabled>
    Seleziona un'opzione
            </option>
        </Select>
        );
    default:
        return null;
    }
};
return (
    <div className={`row${rows}-col${columns}-container`}>
    {Array.from({ length: columns }, (_, colIndex) => (
        <div key={colIndex} className="col">
        {Array.from({ length: rows }, (_, rowIndex) => (
            <div key={rowIndex} className="row">
            {getComponent(componentType)}
            </div>
        ))}
        </div>
    ))}
        <div className="col">
        <div className="row">
        <Button
            className="button-search"
            variant="contained"
            sx={{
            width: "100%",
            maxWidth: "90px",
            height: "50px",
            backgroundColor: "#ffb800",
            color: "black",
            borderRadius: "10px",
            fontSize: "0.8rem",
            fontWeight: "bolder",
            marginLeft: "20px",
            marginTop: "5px",
            padding: "0.5rem 1rem",
            "&:hover": {
                // backgroundColor: "black",
                // color: "white",
                transform: "scale(1.05)",
            },
            }}
        >
            Cerca
        </Button>
        </div>
        <div className="row">
        <a className="ripristina-link" href="/aziende">
            Ripristina
        </a>
        </div>
    </div>

    </div>
);
};

export default SearchComponent2;
