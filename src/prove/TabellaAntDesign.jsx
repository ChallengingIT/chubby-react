    // import React, { useState, useContext, useMemo, useEffect } from "react";
    // import { HolderOutlined } from "@ant-design/icons";
    // import { DndContext } from "@dnd-kit/core";
    // import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
    // import {
    // arrayMove,
    // SortableContext,
    // useSortable,
    // verticalListSortingStrategy,
    // } from "@dnd-kit/sortable";
    // import { CSS } from "@dnd-kit/utilities";
    // import { Button, Table } from "antd";
    // import MoreVertIcon from "@mui/icons-material/MoreVert";
    // import {
    // Dialog,
    // DialogContent,
    // DialogTitle,
    // IconButton,
    // TableBody,
    // TableCell,
    // TableHead,
    // TableRow,
    // } from "@mui/material";
    // import CloseIconButton from "../components/button/CloseIconButton";

    // const RowContext = React.createContext({});

    // const DragHandle = () => {
    // const { setActivatorNodeRef, listeners } = useContext(RowContext);
    // return (
    //     <Button
    //     type="text"
    //     size="small"
    //     icon={<HolderOutlined />}
    //     style={{ cursor: "move" }}
    //     ref={setActivatorNodeRef}
    //     {...listeners}
    //     />
    // );
    // };

    // const Row = (props) => {
    // const {
    //     attributes,
    //     listeners,
    //     setNodeRef,
    //     setActivatorNodeRef,
    //     transform,
    //     transition,
    //     isDragging,
    // } = useSortable({
    //     id: props["data-row-key"],
    // });

    // const style = {
    //     ...props.style,
    //     transform: CSS.Translate.toString(transform),
    //     transition,
    //     ...(isDragging ? { position: "relative", zIndex: 9999 } : {}),
    // };
    // const contextValue = useMemo(
    //     () => ({
    //     setActivatorNodeRef,
    //     listeners,
    //     }),
    //     [setActivatorNodeRef, listeners]
    // );

    // return (
    //     <RowContext.Provider value={contextValue}>
    //     <tr {...props} ref={setNodeRef} style={style} {...attributes} />
    //     </RowContext.Provider>
    // );
    // };

    // const TabellaAntDesign = ({ data, columns, getRowId }) => {
    // const [dataSource, setDataSource] = useState([]);


    // const [dialogOpen, setDialogOpen] = useState(false);
    // const [currentPipelineData, setCurrentPipelineData] = useState({});


    // const dialogData = [
    //     {
    //     header: "ITW",
    //     data: [
    //         { title: "Pianificata", value: currentPipelineData.itwPianificate },
    //         { title: "Fatte", value: currentPipelineData.itwFatte },
    //     ],
    //     },
    //     {
    //     header: "CF",
    //     data: [
    //         { title: "Disponibili", value: currentPipelineData.cfDisponibili },
    //         { title: "Inviati", value: currentPipelineData.cfInviati },
    //     ],
    //     },
    //     {
    //     header: "QM",
    //     data: [
    //         { title: "Pianif.", value: currentPipelineData.qmPianificate },
    //         { title: "Fatte", value: currentPipelineData.qmFatte },
    //     ],
    //     },
    //     {
    //     header: "F/U",
    //     data: [
    //         { title: "OK", value: currentPipelineData.followUpPositivi },
    //         { title: "Pool", value: currentPipelineData.followUpPool },
    //     ],
    //     },
    // ];

    // const handleOpenDialog = (pipelineData) => {
    //     setDialogOpen(true);
    //     setCurrentPipelineData(pipelineData);
    // };

    // const handleCloseDialog = () => {
    //     setDialogOpen(false);
    // };

    // const renderActionCell = (record, index) => {
    //     console.log("Params received in renderActionCell:", record, index); // Aggiungi questo per controllare cosa contiene params

    //     return (
    //     <IconButton onClick={() => handleOpenDialog(record.pipeline)}>
    //         <MoreVertIcon />
    //     </IconButton>
    //     );
    // };

    // const colonne = [
    //     {
    //     title: "",
    //     dataIndex: "sort",
    //     key: "sort",
    //     render: () => <DragHandle />,
    //     width: 40,
    //     },
    //     ...columns,
    //     {
    //     title: "Azione",
    //     dataIndex: "azioni",
    //     key: "azioni",
    //     render: (text, record, index) => renderActionCell(record, index),
    //     width: 100,
    //     },
    // ];

    // useEffect(() => {
    //     setDataSource(
    //     data.map((item, index) => ({ ...item, id: item.id || index }))
    //     );
    // }, [data]);


    // const onDragEnd = ({ active, over }) => {
    //     if (active.id !== over?.id) {
    //     setDataSource((prevState) => {
    //         const activeIndex = prevState.findIndex(
    //         (item) => getRowId(item) === active.id
    //         );
    //         const overIndex = prevState.findIndex(
    //         (item) => getRowId(item) === over.id
    //         );
    //         return arrayMove(prevState, activeIndex, overIndex);
    //     });
    //     }
    // };

    // return (
    //     <>
    //     <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
    //         <SortableContext
    //         items={dataSource.map((item) => getRowId(item))}
    //         strategy={verticalListSortingStrategy}
    //         >
    //         <Table
    //             rowKey={getRowId}
    //             components={{ body: { row: Row } }}
    //             columns={colonne}
    //             dataSource={dataSource}
    //             pagination={false}
    //             scroll={{ y: 240 }}
    //             style={{ maxHeight: "50em", overflowY: "auto" }}
    //         />
    //         </SortableContext>
    //     </DndContext>
    //     <Dialog
    //         open={dialogOpen}
    //         onClose={handleCloseDialog}
    //         sx={{
    //         "& .MuiDialog-paper": {
    //             width: "50%",
    //             maxWidth: "none",
    //             height: "auto",
    //             borderRadius: "20px",
    //             border: "2.5px solid #00B400",
    //         },
    //         }}
    //     >
    //         <DialogTitle sx={{ fontWeight: 600, fontSize: "1.2em" }}>
    //         Dettagli Azioni
    //         <IconButton
    //             aria-label="close"
    //             onClick={handleCloseDialog}
    //             sx={{
    //             position: "absolute",
    //             right: 8,
    //             top: 8,
    //             color: (theme) => theme.palette.grey[500],
    //             }}
    //         >
    //             <CloseIconButton />
    //         </IconButton>
    //         </DialogTitle>
    //         <DialogContent>
    //         <Table size="small" aria-label="simple table">
    //             <TableHead>
    //             <TableRow>
    //                 {dialogData.map((column) => (
    //                 <TableCell
    //                     key={column.header}
    //                     align="center"
    //                     style={{
    //                     fontWeight: "bold",
    //                     borderBottom: "2px solid #ccc7c7",
    //                     }}
    //                 >
    //                     {column.header}
    //                 </TableCell>
    //                 ))}
    //             </TableRow>
    //             </TableHead>
    //             <TableBody>
    //             {dialogData[0].data.map((_, index) => (
    //                 <TableRow
    //                 key={index}
    //                 sx={{ borderBottom: "2px solid #ccc7c7" }}
    //                 >
    //                 {dialogData.map((column) => (
    //                     <TableCell key={column.header} align="center">
    //                     <div style={{ fontWeight: 500 }}>
    //                         {column.data[index].title}
    //                     </div>
    //                     <div>{column.data[index].value}</div>
    //                     </TableCell>
    //                 ))}
    //                 </TableRow>
    //             ))}
    //             </TableBody>
    //         </Table>
    //         </DialogContent>
    //     </Dialog>
    //     </>
    // );
    // };

    // export default TabellaAntDesign;
