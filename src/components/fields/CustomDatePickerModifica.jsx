import React, { useState } from "react";
import { DatePicker, ConfigProvider } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/it";

dayjs.locale("it");

function CustomDatePickerModifica({
  name,
  label,
  type,
  onChange,
  values,
  initialValues,
  disabled,
}) {
  const rawValue = values?.[name] || initialValues?.[name] || "";
  const hasValue = Boolean(rawValue);

  const [focused, setFocused] = useState(false);
  const shrink = focused || hasValue;

  const pickerValue = hasValue ? dayjs(rawValue, "YYYY-MM-DD") : null;

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
        className={`torchy-date ${shrink ? "torchy-date--shrink" : ""} ${
          disabled ? "torchy-date--disabled" : ""
        }`}
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
              color: disabled ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0.75)",
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
          disabled={disabled}
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
            cursor: disabled ? "not-allowed" : "text",
            opacity: disabled ? 0.85 : 1,
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
            color: rgba(0,0,0,0.88);
          }

          /* Spazio sotto la label quando shrink */
          .torchy-date--shrink .ant-picker-input > input {
            padding-top: 16px !important;
          }

          /* Icona calendario un filo più soft */
          .torchy-date .ant-picker-suffix {
            opacity: 0.65;
          }

          /* Disabled: simile al tuo MUI (testo leggibile, cursor not-allowed) */
          .torchy-date--disabled .ant-picker-input > input {
            -webkit-text-fill-color: rgba(0,0,0,0.88) !important;
            color: rgba(0,0,0,0.88) !important;
            cursor: not-allowed !important;
          }

          .torchy-date--disabled .ant-picker {
            cursor: not-allowed !important;
          }
        `}</style>
      </div>
    </ConfigProvider>
  );
}

export default CustomDatePickerModifica;
