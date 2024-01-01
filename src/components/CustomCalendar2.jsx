import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";

export default function CustomCalendar2() {
  return (
    <div className='calendarBoxContainer' style={{display: 'grid'}}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          renderInput={(params) => (
            <TextField 
              {...params} 
              InputProps={{...params.InputProps, disableUnderline: true}}
              sx={{ 
                svg: { color: "#000000" }, // icon color
                input: { 
                  borderRadius: '40px', // borderRadius for the text field
                  backgroundColor: 'white', // background color for the text field
                  padding: '10px', // padding inside the text field
                  "&::placeholder": { // styles the placeholder
                    fontSize: '1rem',
                  },
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: '40px', // borderRadius for the outline
                }
              }}
            />
          )}
          inputFormat="MM/DD/YYYY"
        />
      </LocalizationProvider>
    </div>
  );
}
