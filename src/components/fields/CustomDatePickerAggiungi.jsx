import React, { useState } from "react";
import { DatePicker, ConfigProvider } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/it";

dayjs.locale("it");

function CustomDatePickerAggiungi({ name, label, type, onChange, values }) {
  const hasValue = Boolean(values?.[name]);
  const [focused, setFocused] = useState(false);

  const shrink = focused || hasValue;

  const pickerValue = hasValue ? dayjs(values[name], "YYYY-MM-DD") : null;

  const handleChange = (dateObj) => {
    const formatted = dateObj ? dateObj.format("YYYY-MM-DD") : "";
    onChange({ [name]: formatted });
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#00B400",
          colorLink: "#00B400",
          colorLinkHover: "#00B400",
          colorTextBase: "rgba(0,0,0,0.88)",
        },
      }}
    >
      <div
        className={`torchy-date ${shrink ? "torchy-date--shrink" : ""}`}
        style={{
          position: "relative",
          width: "100%",
          height: "4em",
        }}
      >
        {label && (
          <span
            style={{
              position: "absolute",
              left: 18,
              top: shrink ? 8 : "50%",
              transform: shrink ? "translateY(0)" : "translateY(-50%)",
              fontSize: shrink ? 11 : 14,
              fontFamily: "Roboto, sans-serif",
              fontWeight: 500,
              color: "rgba(0,0,0,0.75)",
              transition: "all 180ms ease",
              pointerEvents: "none",
              zIndex: 3,
            }}
          >
            {label}
          </span>
        )}

        <DatePicker
          value={pickerValue}
          onChange={handleChange}
          format="YYYY-MM-DD"
          placeholder=""
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 20,
            background: "#EDEDED",
            border: "1px solid transparent",
            paddingLeft: 12,
            position: "relative",
            zIndex: 1,
          }}
        />

        <style>{`
          /* Input trasparente per far vedere la label */
          .torchy-date .ant-picker-input > input {
            background: transparent !important;
            height: 4em;
            padding-left: 6px;
            padding-right: 10px;
            font-family: Roboto, sans-serif;
          }

          /* Quando la label si “shrink”, spostiamo il testo un po’ più in basso */
          .torchy-date--shrink .ant-picker-input > input {
            padding-top: 16px !important;
          }

          /* Icona calendario un filo più soft */
          .torchy-date .ant-picker-suffix {
            opacity: 0.65;
          }
        `}</style>
      </div>
    </ConfigProvider>
  );
}

export default CustomDatePickerAggiungi;
