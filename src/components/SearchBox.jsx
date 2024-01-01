import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import CustomCalendar2 from './CustomCalendar2';
import '../styles/SearchBox.css';

function SearchBox({ fields, dropdownOptions, onSearch, onReset, numRows, numCols, showResetButton, showSearchButton }) {
  const [formData, setFormData] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div
      className="container-search-box"
      // style={{
      //   backgroundColor: "#ffe393",
      //   borderRadius: "40px",
      //   width: "100%",
      //   display: "grid",
      //   gridTemplateColumns: `repeat(${numCols}, 0.3fr)`,
      //   gridTemplateRows: `repeat(${numRows}, auto)`,
      //   maxWidth: "1000px",
      //   minWidth: "430px",
      //   maxHeight: '300px',
      //   margin: '20px',
      //   boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.5)",
      // }}
    >
{fields.map((field, index) => (
  <Box
    key={index}
    sx={{
      borderRadius: '40px',
      maxWidth: '250px',
      height: '40px',
      paddingLeft: '10px',
      textAlign: 'start',
      margin: '15px',
      marginRight: '10px',
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      gridColumn: field.position ? field.position.col : 'auto',
      gridRow: field.position ? field.position.row : 'auto',
    }}
  >
    {field.type === "date" ? (
      <CustomCalendar2
      sx={{backgroundColor: 'white',}}
        name={field.name}
        value={formData[field.name] || ""}
        onChange={handleChange}
      />
    ) : field.type === "dropdown" ? (
      <Select
      sx={{
        borderRadius: '40px',
        border: 'none',
        width: 'calc(100% - 10px)',
        height: '40px',
        paddingLeft: '10px',
        textAlign: 'start',
        marginBottom: '10px',
        backgroundColor: 'white',

      }}
      native
      value={formData[field.name] || "" } style={{ color: 'gray', fontSize: '0.8rem' }}
      onChange={handleChange}
    >
      <option value="" disabled hidden >
        {field.label}
      </option>
      {dropdownOptions.map((option, index) => (
        <option key={index} value={option.name}>
          {option.label}
        </option>
      ))}
    </Select>
      ) : field.type === "searchButton" ? (
        <Button
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
              backgroundColor: "black",
              color: "white",
              transform: "scale(1.05)",
            },
          }}
          onClick={() => onSearch(formData)}
          className="button-search"
        >
          {field.label}
        </Button>
        ) : field.type === "resetButton" ? (
          <Button
          variant="contained"
          sx={{
            color: "white",
            backgroundColor: "black",
            width: "100%",
            maxWidth: "90px",
            height: "50px",
            borderRadius: "10px",
            fontSize: "0.8rem",
            fontWeight: "bolder",
            marginLeft: "20px",
            marginTop: "5px",
            padding: "0.5rem 1rem",
            "&:hover": {
              backgroundColor: "black",
              color: "white",
              transform: "scale(1.05)",
            },
          }}
            onClick={() => onReset(formData)}
            className="button-reset"
          >
            {field.label}
          </Button>
    ) : (
      <input
      type="text"
      style={{borderRadius: '40px',
        border: 'none',
        width: '100%',
        height: '40px',
        paddingLeft: '10px',
        textAlign: 'start',
        marginBottom: '10px',
        marginLeft: 'auto',
        backgroundColor: 'white'}}
        className="input" 
        
        placeholder={field.label}
        id="filled-basic"
        variant="filled"
        // value={formData[field.name] || ""}
        onChange={handleChange}
      />
    )}
  </Box>
))}
      {showSearchButton && (
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
          onClick={() => onSearch(formData)}
        >
          Cerca
        </Button>
          )}
          {showResetButton && (
        <Button
          sx={{
            color: "white",
            backgroundColor: "black",
            width: "100%",
            maxWidth: "90px",
            height: "50px",
            borderRadius: "10px",
            fontSize: "0.8rem",
            fontWeight: "bolder",
            marginLeft: "20px",
            marginTop: "5px",
            padding: "0.5rem 1rem",
            "&:hover": {
              backgroundColor: "black",
              color: "white",
              transform: "scale(1.05)",
            },
          }}
          onClick={() => {
            setFormData({});
            onReset();
          }}
        >
          Reset
        </Button>
        
          )}
    </div>
  );
}

export default SearchBox;
