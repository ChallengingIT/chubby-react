import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import CircularProgress from '@mui/material/CircularProgress';



const MyDataGrid = ({ data, columns, title, searchBoxComponent: SearchBox }) => {

  const [ rowsPerPage,                setRowsPerPage        ] = React.useState(25);
  const [ page,                       setPage               ] = React.useState(0);
  const [ loading,                    setLoading            ] = React.useState(false);
  const [ showNoDataMessage,          setShowNoDataMessage  ] = React.useState(false); 



  React.useEffect(() => {
    if (data.length === 0) {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
        setShowNoDataMessage(true);
      }, 4000);
      return () => clearTimeout(timer);
    } else {
      setLoading(false);
      setShowNoDataMessage(false);
    }
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
        width: "94vw",
        height: "80vh",
        backgroundColor: "white",
        borderRadius: "40px",
        display: "flex",
        flexDirection: "column",
        marginLeft: '20px',
        marginRight: '20px',
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
     {SearchBox && <SearchBox />}

      <DataGrid
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
          showNoDataMessage ? ( 
            <div>Nessun dato</div>
          ) : (
            <CircularProgress style={{ color: '#14D928' }} />
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
              <CircularProgress style={{ color: '#14D928' }} />
            </div>
          ),
        }}
        
        sx={{
          height: `${5 * 52}px`,
          borderStyle: "none",

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
          "& .MuiDataGrid-cell": {
            fontSize: "16.5px",
            fontFamily: "Roboto",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            color: '#808080',
            fontWeight: "bolder",
            fontSize: "18px", 
          },
          
        }}
      />
    </Box>
  );
};

export default MyDataGrid;