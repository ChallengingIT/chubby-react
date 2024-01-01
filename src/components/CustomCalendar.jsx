import * as React                     from 'react';
import { AdapterDayjs }               from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider }       from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer }              from '@mui/x-date-pickers/internals/demo';
import { DatePicker }                 from '@mui/x-date-pickers/DatePicker';

export default function CustomCalendar() {

  const datePickerStyle = {
    backgroundColor: 'lightblue', 
    borderRadius: '40px',
  };


  const inputStyle = {
    backgroundColor: '#000000', 
  };

  return (
    <div className='calendarBoxContainer' style={{display: 'grid'}}>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']} sx={{ display: 'grid', width: '100%'}}>
        <DatePicker inputFormat="DD/MM/YYYY" sx={{ display: 'grid', backgroundColor: '#ebebeb', bottom: '5px'}} 
          slotProps={{
            openPickerButton: {
              color: '#000000',
            },
            inputAdornment: {
              position: 'start',
            },
          }}
          style={datePickerStyle}
          inputStyle={inputStyle}
        />
      </DemoContainer>
    </LocalizationProvider>
    </div>
  );
}
