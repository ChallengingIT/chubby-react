import React from "react";

const SimpleTable = ({ columns, initialValues, tableTitle }) => (
  <div>
    <h1 style={{ color: "#808080", margin: '20px', fontSize: 'bold' }}>{tableTitle}</h1>
    <table style={{ width: "100%" }}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.name}>{column.label}</th>
          ))}
        </tr>
      </thead>
      <tbody style={{ textAlign: "center"}}>
        {initialValues.map((rowData, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((column) => (
              <td key={column.name}>{rowData[column.name]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default SimpleTable;
