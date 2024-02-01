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
                svg: { color: "#000000" },
                input: { 
                  borderRadius: '40px', 
                  backgroundColor: 'white', 
                  padding: '10px', 
                  "&::placeholder": { 
                    fontSize: '1rem',
                  },
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: '40px', 
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
