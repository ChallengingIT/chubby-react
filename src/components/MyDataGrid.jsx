import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";



const MyDataGrid = ({ data, columns, title }) => {


  return (
    <Box
      sx={{
        width: "95%",
        height: "430px",
        backgroundColor: "white",
        borderRadius: "40px",
        display: "flex",
        flexDirection: "column",
        margin: '20px',
        marginRight: '20px',
        // marginTop: "20px",
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
          borderBottom: '2px solid #dbd9d9',
          padding: '20px',
        }}
      >
        
        {title && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: 'black', 
            }}
          >
            {title}
          </div>
        )}
      </div>

      <DataGrid
        rows={data}
        columns={columns}
        pageSize={5}
        pagination={{ pageSize: 25 }} 
        pstatoSizeOptions={[5, 10, 20]}
        checkboxSelection={false}
        disableRowSelectionOnClick
        disableColumnMenu={true}
        sx={{
          height: `${5 * 52}px`,
          borderStyle: "none",
          // marginLeft: "5px",
          // "& .MuiDataGrid-columnHeader": {
          //   borderBottom: "2px solid #ffb800 !important",
          //   width: "100%",
          //   border: 'hidden'
          // },

          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bolder",
            color: '#808080',
          },

          "& .MuiDataGrid-columnHeader": {
            borderBottom: '2px solid #c4c4c4',
          },

          "& .MuiDataGrid-row:nth-of-type(even)": {
            backgroundColor: "#ececec",
            border: 'hidden',
          },

          "& .MuiDataGrid-row": {
            border: 'hidden',
            width: "100%",

          },

          "&. .MuiDataGrid-withBorderColor": {
            border: "hidden",
          },

          "& .MuiDataGrid-footerContainer": {
            borderTop: "2px solid #dbd9d9",
            width: "100%",
          },
        }}
      />
    </Box>
  );
};

export default MyDataGrid;
