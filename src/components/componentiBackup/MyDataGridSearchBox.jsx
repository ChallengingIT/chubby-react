import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import CircularProgress from "@mui/material/CircularProgress";
import { TextField, Button, Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const MyDataGrid = ({ data, columns, title, searchOptions, onSearch, onReset }) => {
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data.length === 0) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [data]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Initialize searchFields based on searchOptions
  const initialSearchFields = Object.keys(searchOptions).reduce((acc, key) => {
    acc[key] = "";
    return acc;
  }, {});

  const [searchFields, setSearchFields] = useState(initialSearchFields);

  const handleSearchFieldChange = (fieldName, value) => {
    setSearchFields({ ...searchFields, [fieldName]: value });
  };

  const renderSearchField = (fieldConfig) => {
    const options = searchOptions[fieldConfig.optionsKey]; // Use optionsKey to get the right options from searchOptions

    switch (fieldConfig.type) {
      case "text":
        return (
          <TextField
            key={fieldConfig.name}
            label={fieldConfig.placeholder}
            value={searchFields[fieldConfig.name]}
            onChange={(e) => handleSearchFieldChange(fieldConfig.name, e.target.value)}
          />
        );
      case "select":
        return (
          <FormControl key={fieldConfig.name}>
            <InputLabel>{fieldConfig.placeholder}</InputLabel>
            <Select
              label={fieldConfig.placeholder}
              value={searchFields[fieldConfig.name]}
              onChange={(e) => handleSearchFieldChange(fieldConfig.name, e.target.value)}
            >
              {options && options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      default:
        return null;
    }
  };

  const handleSearchClick = () => {
    onSearch(searchFields);
  };

  const handleResetClick = () => {
    setSearchFields(initialSearchFields);
    onReset();
  };

  return (
    <Box
      sx={{
        width: "95%",
        height: "57%",
        backgroundColor: "white",
        borderRadius: "40px",
        display: "flex",
        flexDirection: "column",
        margin: "20px",
        marginRight: "20px",
        borderWidth: "0",
        boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.6)",
        fontSize: "25px",
        fontWeight: "bolder",
      }}
    >
      <div
        style={{
          minHeight: "52px",
          boxShadow: "0px 0px 0px rgba(0, 0, 0, 0.6)",
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          paddingLeft: "20px",
          paddingTop: "20px",
          backgroundColor: "white",
          color: "black",
          borderRadius: "40px 40px 0 0",
          borderBottom: "2px solid #dbd9d9",
          padding: "20px",
        }}
      >
        {title && (
          <div style={{ display: "flex", alignItems: "center", color: "black" }}>
            {title}
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", padding: "10px" }}>
        {Object.keys(searchOptions).map((key) =>
          renderSearchField({
            name: key,
            type: "select",
            optionsKey: key,
            placeholder: key.charAt(0).toUpperCase() + key.slice(1) // Capitalize the first letter
          })
        )}
        <Button onClick={handleResetClick} sx={{ ml: 2, bgcolor: "black", color: "white", "&:hover": { bgcolor: "black" } }}>
          Reset
        </Button>
        <Button onClick={handleSearchClick} sx={{ ml: 2, bgcolor: "#ffb800", color: "black", "&:hover": { bgcolor: "#ffb800" } }}>
          Cerca
        </Button>
      </div>

      <DataGrid
        rows={data}
        columns={columns}
        pageSize={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        pagination
        page={page}
        onPageChange={handleChangePage}
        onPageSizeChange={handleChangeRowsPerPage}
        loading={loading}
        autoHeight
        sx={{
          "& .MuiDataGrid-columnHeaderTitle": { fontWeight: "bolder", color: "#808080" },
          "& .MuiDataGrid-columnHeader": { borderBottom: "2px solid #c4c4c4" },
          "& .MuiDataGrid-row:nth-of-type(even)": { backgroundColor: "#ececec" },
          "& .MuiDataGrid-cell": { fontSize: "16.5px", fontFamily: "Roboto" },
          "& .MuiDataGrid-footerContainer": { borderTop: "2px solid #dbd9d9" },
        }}
      />
    </Box>
  );
};

export default MyDataGrid;
