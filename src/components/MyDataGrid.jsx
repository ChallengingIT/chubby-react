import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import CircularProgress from '@mui/material/CircularProgress';
import { DataGrid } from '@mui/x-data-grid/DataGrid';


const MyDataGrid = ({ data, columns, title, searchBoxComponent: SearchBox, storageID }) => {

    // const [ rowPerPage, setRowsPerPage ] = useState( parseInt(localStorage.getItem("rowsPerPage") || "25", 10));
    // const [ page, setPage ] = useState( parseInt(localStorage.getItem("currentPage" || "0", 10)));
    const [ loading, setLoading] = useState(false);
    const [ showNoDataMessage, setShowNoDataMessage ] = useState(false);
    const [ paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 9,
      });

    useEffect(() => {
        const paginationInfo = localStorage.getItem(storageID)
        if(paginationInfo) {
            setPaginationModel(JSON.parse(paginationInfo))
        }
    }, [])

    useEffect(() => {
        if(data.length === 0) {
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

    const onPaginationChange = (pageModel) => {
        localStorage.setItem(storageID, JSON.stringify(pageModel));
        setPaginationModel(pageModel);
    };


    return (
        <Box
        sx={{
            width: '94vw',
            height: 'auto',
            minHeight: '40vh',
            backgroundColor: 'white',
            borderRadius: '40px',
            display: 'flex',
            flexDirection: 'column',
            ml: 4,
            mr: 1,
            borderWidth: '0',
            boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.6)",
            fontSize: '1.4rem',
            fontWeight: 'bolder'
        }}
        >
            <Box
            sx={{
                minHeight: '1vh',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                paddingLeft: '1.6%',
                paddingTop: '1%',
                backgroundColor: 'white',
                color: 'black',
                borderRadius: '40px 40px 0 0',
                borderBottom: '2px solid #c4c4c4',
            }}
            >
                { title && (
                    <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: 'black',
                        fontSize: '0.8em',
                        mb: 1
                    }}
                    >
                        {title}
                    </Box>
                )}
            </Box>
            {SearchBox && <SearchBox />}

            <DataGrid
            columns={columns}
            rows={data}
            pagination
            paginationModel={paginationModel}
            onPaginationModelChange={onPaginationChange}
            rowHeight={42}

            loading={data.length === 0 && loading}
            noRowsOverlay={
                showNoDataMessage ? ( 
                    <h1>Nessun dato</h1>
                ) : (
                <CircularProgress style={{ color: '#FFB700' }} />
                )
            }  
            getRowClassName={(params) => 
                params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row'
                            }
            sx={{
                borderStyle: 'none',
                '& .MuiDataGrid-columnHeader': {
                    borderBottom: '2px solid #c4c4c4',
                },
                '& .even-row': {
                    backgroundColor: '#ffffff',
                    },
                '& .odd-row': {
                    backgroundColor: '#ECECEC',
                    },
                '&. MuiDataGrid-row:nth-of-type(even)': {
                    backgroundColor: '#ececec',
                },
                '& .MuiDataGrid-row': {
                    border: 'hidden',
                    width: '100%'
                },
                '& .MuiDataGrid-footerContainer': {
                    borderTop: '2px solid #dbd9d9',
                    width: '100%'
                },
                '& .MuiDataGrid-cell': {
                    fontSize: '1em',
                    fontFamily: 'Roboto'
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                    color: '#808080',
                    fontWeight: 'bolder',
                    fontSize: '1em'
                },
                

            }}          
            
            
            
            
            
            />

        </Box>
    );
};

export default MyDataGrid;