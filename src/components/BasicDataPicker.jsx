import * as React                 from "react";
import { DemoContainer }          from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs }           from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider }   from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker }             from "@mui/x-date-pickers/DatePicker";

import "../styles/BasicDatePicker.css";

export default function BasicDatePicker() {
  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      sx={{
        width: "100%",
        height: "auto",
        display: "flex",
        maxWidth: "300px",
      }}
    >
      <DemoContainer
        components={["DatePicker"]}
        sx={{
          width: "100%",
          height: "auto",
          display: "flex",
          maxWidth: "300px",
        }}
      >
        <DatePicker
          inputFormat="DD/MM/YYYY"
          className="calendar"
          label="Date"
          sx={{
            border: "none", 
            backgroundColor: "#E8E8E8",
            borderRadius: "0px",
            outlineStyle: "none",
            width: "100%",
            height: "100%",
            maxHeight: "55px",
            justifyItems: "center",
            alignItems: "center",
            fontSize: "20px",
            maxWidth: "280px",
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
