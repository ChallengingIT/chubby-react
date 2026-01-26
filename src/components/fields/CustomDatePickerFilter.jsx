import React                                        from "react";
import { LocalizationProvider, DesktopDatePicker }  from "@mui/x-date-pickers";
import { AdapterDayjs }                             from "@mui/x-date-pickers/AdapterDayjs";
import dayjs                                        from "dayjs";
import CalendarTodayIcon                            from "@mui/icons-material/CalendarToday";
import "dayjs/locale/it";

function CustomDatePickerFilter({ onDateChange, values, minDate, disabled }) {
    dayjs.locale("it");

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="it">
            <DesktopDatePicker
                variant="standard"
                label={values ? "" : "Data"}
                value={values ? dayjs(values, "DD/MM/YYYY") : null}
                onChange={onDateChange}
                inputFormat="DD/MM/YYYY"
                minDate={minDate ? dayjs(minDate, "DD/MM/YYYY") : dayjs("2020/01/01")}
                maxDate={dayjs()}
                components={{
                    OpenPickerIcon: CalendarTodayIcon,
                }}

                slotProps={{
                    textField: {
                        InputLabelProps: { shrink: false },
                        sx: {
                            width: "100%",
                            textAlign: "left",
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderWidth: "0px 0px 1px 0px",
                                    borderBottom: "1px solid #fda03d",
                                    borderRadius: 0,
                                },
                                "&:hover fieldset": {
                                    borderWidth: "0px 0px 2px 0px",
                                    borderBottom: "2px solid #fda03d",
                                },
                                "&.Mui-focused fieldset": {
                                    borderWidth: "0px 0px 2px 0px",
                                    borderBottom: "2px solid #fda03d",
                                },
                            },
                            "& .MuiOutlinedInput-root.Mui-disabled": {
                                bgcolor: "transparent",
                                cursor: "not-allowed",
                            },
                            "& .Mui-disabled": {
                                cursor: "not-allowed",
                            },
                            "& .MuiInputLabel-root.Mui-focused": {
                                display: 'none',
                                color: "#fda03d",
                            },
                            "& .MuiInputLabel-root": {
                            color: "#9f9f9f",
                        },
                        },
                    },
                }}
            />
        </LocalizationProvider>
    );
}

export default CustomDatePickerFilter;
