import React, { useState }      from "react";
import Box                      from "@mui/material/Box";
import TextField                from "@mui/material/TextField";
import Button                   from "@mui/material/Button";
import Select                   from "@mui/material/Select";
import BasicDatePicker          from "./BasicDataPicker";
import { useNavigate }          from "react-router-dom";

import "../styles/BoxUser.css";

export default function BoxUser({ fields, dropdownOptions, onSave }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="container-box-father-user">
      <div className="container-box-user">
        {fields.map((field, index) => (
          <Box
            key={index}
            sx={{
              width: "100%",
              height: 70,
              backgroundColor: "white",
              textAlign: "left",
            }}
          >
            <label className="col-form-label-user">{field.label}</label>
            {field.type === "date" ? ( 
              <BasicDatePicker
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
              />
            ) : field.type === "dropdown" ? (
              <Select
                className="dropdown-menu"
                value={formData[field.name] || "seleziona"}
                onChange={handleChange}
                sx={{
                  backgroundColor: "#F0F0F0",
                  fontSize: "0.8rem",
                  textAlign: "start",
                  color: "#757575",
                  width: "100%",
                  display: "flex",
                  height: "100%",
                  maxHeight: "56px",
                }}
                native
              >
                <option value="seleziona" disabled>
                  ---
                </option>
                {dropdownOptions.map((option, index) => (
                  <option key={index} value={option.name}>
                    {option.label}
                  </option>
                ))}
              </Select>
            ) : (
              <TextField
                name={field.name}
                id="filled-basic"
                variant="filled"
                sx={{
                  width: "100%",
                  display: "flex",
                }}
                value={formData[field.name] || ""}
                onChange={handleChange}
              />
            )}
          </Box>
        ))}
        {dropdownOptions.map((option, index) => (
          <Box
            key={index}
            sx={{
              width: "100%",
              height: 70,
              backgroundColor: "white",
              textAlign: "left",
            }}
          >
            <label className="col-form-label">{option.label}</label>
            <Select
              className="dropdown-menu"
              value={formData[option.name] || "seleziona"}
              onChange={handleChange}
              sx={{
                backgroundColor: "#F0F0F0",
                fontSize: "0.8rem",
                textAlign: "start",
                color: "#757575",
                width: "100%",
                display: "flex",
                height: "100%",
                maxHeight: "56px",
              }}
              native
            >
              <option value="seleziona" disabled>
                ---
              </option>
              {option.values.map((value, index) => (
                <option key={index} value={value}>
                  {value}
                </option>
              ))}
            </Select>
          </Box>
        ))}
      </div>
      <div className="row-container-button">
        <Button
          color="primary"
          onClick={() => {
            navigate(-1); 
          }}
          sx={{
            backgroundColor: "#6C757D",
            color: "white",
            "&:hover": { transform: "scale(1.05)", backgroundColor: "#6C757D" },
          }}
        >
          Indietro
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={() => onSave(formData)}
          sx={{
            backgroundColor: "black",
            "&:hover": { transform: "scale(1.05)", backgroundColor: "black" },
          }}
        >
          Salva
        </Button>
      </div>
    </div>
  );
}
