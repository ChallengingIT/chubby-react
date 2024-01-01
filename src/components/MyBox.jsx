import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import CustomCalendar from "./CustomCalendar";
import "../styles/MyBox.css";

export default function MyBox({ title, fields, dropdownOptions, onSave, onCancel }) {

  const defaultFormData = fields.reduce((acc, field) => {
    acc[field.name] = field.defaultValue || "";
    return acc;
  }, {});
  const [formData, setFormData] = useState(defaultFormData);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="container-box-father">
      <div className="container-box">
        <Box
          sx={{
            gridColumn: "1 / -1",
            gridRow: "1",
            width: "100%",
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          {title && <h3>{title}</h3>}
        </Box>
        {fields.map((field, index) => (
          <div key={index}>
            {field.dividerTitle && (
              <div>
                <hr
                  style={{
                    width: "100%",
                    margin: "8px 0",
                    textAlign: "center",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                />
                <h3>{field.dividerTitle}</h3>
              </div>
            )}
            <Box
              sx={{
                width: "100%",
                maxWidth: "220px",
                height: 70,
                backgroundColor: "white",
                textAlign: "left",
              }}
            >
              <label className="col-form-label" htmlFor={field.name}>{field.label}</label>
              {field.type === "date" ? (
                <CustomCalendar
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                />
              ) : field.type === "dropdown" ? (
                <Select
                  className="dropdown-menu"
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  sx={{
                    backgroundColor: "#E8E8E8",
                    fontSize: "0.8rem",
                    textAlign: "start",
                    color: "#757575",
                    width: "100%",
                    maxWidth: "220px",
                    display: "flex",
                    height: "100%",
                    maxHeight: "56px",
                  }}
                  native
                >
                  <option value="seleziona" disabled>---</option>
                  {dropdownOptions.map((option, index) => (
                    <option key={index} value={option.name}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              ) : (
                <TextField
                  name={field.name}
                  id={field.name}
                  variant="filled"
                  sx={{
                    width: "100%",
                    maxWidth: "220px",
                    display: "flex",
                    border: 'none',
                  }}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                />
              )}
            </Box>
          </div>
        ))}

        {dropdownOptions.map((option, index) => (
          <Box
            key={index}
            sx={{
              width: "100%",
              maxWidth: "220px",
              height: 70,
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
                maxWidth: "220px",
                display: "flex",
                height: "100%",
                maxHeight: "56px",
              }}
              native
            >
              <option value="seleziona" disabled>---</option>
              {option.values.map((value, index) => (
                <option key={index} value={value}>
                  {value}
                </option>
              ))}
            </Select>
          </Box>
        ))}
        <Box
          sx={{
            gridRow: "span 2",
            gridColumn: "1 / 4",
            height: '120px',
            textAlign: "left",
          }}
        >
          <label className="col-form-label" htmlFor={fields.name}>Note </label>
          <TextField
            name={fields.name}
            id={fields.name}
            variant="filled"
            multiline
            sx={{
              width: "100%",
              height: "120px",
              overflowY: "auto",
              border: 'none',
            }}
            value={formData.note || ""}
            onChange={handleChange}
          />
        </Box>
      </div>

      <div className="row-container-button">
        <Button
          color="primary"
          onClick={handleGoBack}
          sx={{
            backgroundColor: "#6C757D",
            color: "white",
            "&:hover": {
              backgroundColor: "#6C757D",
              transform: "scale(1.05)",
            },
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
            "&:hover": {
              backgroundColor: "black",
              transform: "scale(1.05)",
            },
          }}
        >
          Salva
        </Button>
      </div>
    </div>
  );
}
