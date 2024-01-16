import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import CircularProgress from '@mui/material/CircularProgress';



const MyDataGrid = ({ data, columns, title }) => {

  const [ rowsPerPage,                setRowsPerPage ] = React.useState(25);
  const [ page,                       setPage        ] = React.useState(0);
  const [ loading,                    setLoading     ] = React.useState(false);


  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (data.length === 0) {
        setLoading(true);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [data]);


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };


  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
        // rows={data}
        // columns={columns}
        // pageSize={5}
        // rowsPerPage={rowsPerPage}
        // pagination={{ pageSize: 25 }} 
        // pstatoSizeOptions={[5, 10, 20]}
        // checkboxSelection={false}
        // disableRowSelectionOnClick
        // disableColumnMenu={true}
        rows={data}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 25 },
          },
        }}
        rowsPerPageOptions={[5, 10, 25]}
        rowsPerPage={rowsPerPage}
        pageSize={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        loading={data.length === 0 && loading}
        noRowsOverlay={
          loading ? (
            <div>Caricamento dei dati in corso...</div>
          ) : (
            <div>No rows</div>
          )
        }
        components={{
          LoadingOverlay: () => (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}>
              <CircularProgress style={{ color: '#fbb800' }} />
            </div>
          ),
        }}
        
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
