// import React, { useState } from "react";
// import { Table, Button, Modal, Spin } from 'antd';
// import { HolderOutlined, MoreOutlined, CloseOutlined } from '@ant-design/icons';
// import { DndContext, restrictToVerticalAxis } from '@dnd-kit/core';
// import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';

// const DragHandle = () => (
//   <HolderOutlined style={{ cursor: 'move' }} />
// );

// const RowContext = React.createContext({});

// const Row = (props) => {
//   const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
//     id: props['data-row-key'],
//   });
//   const style = {
//     ...props.style,
//     transform: CSS.Translate.toString(transform),
//     transition,
//     ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
//   };
//   const contextValue = { setActivatorNodeRef, listeners };
//   return (
//     <RowContext.Provider value={contextValue}>
//       <tr {...props} ref={setNodeRef} style={style} {...attributes} />
//     </RowContext.Provider>
//   );
// };

// const TabellaPipelineNeed = ({ data, columns, getRowId }) => {
//       const [dataSource, setDataSource] = useState(data);

//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [currentPipelineData, setCurrentPipelineData] = useState({});

//   const dialogData = [
//     { header: "ITW", data: [{ title: "Pianificata", value: currentPipelineData.itwPianificate }, { title: "Fatte", value: currentPipelineData.itwFatte }] },
//     { header: "CF", data: [{ title: "Disponibili", value: currentPipelineData.cfDisponibili }, { title: "Inviati", value: currentPipelineData.cfInviati }] },
//     { header: "QM", data: [{ title: "Pianif.", value: currentPipelineData.qmPianificate }, { title: "Fatte", value: currentPipelineData.qmFatte }] },
//     { header: "F/U", data: [{ title: "OK", value: currentPipelineData.followUpPositivi }, { title: "Pool", value: currentPipelineData.followUpPool }] }
//   ];

//   const handleOpenDialog = (pipelineData) => {
//     setDialogOpen(true);
//     setCurrentPipelineData(pipelineData);
//   };

//   const handleCloseDialog = () => {
//     setDialogOpen(false);
//   };

//   const renderActionCell = (text, record) => (
//     <Button icon={<MoreOutlined />} onClick={() => handleOpenDialog(record.pipeline)} />
//   );

//   const modifiedColumns = [
//     {
//       title: '',
//       dataIndex: 'drag',
//       key: 'drag',
//       width: 50,
//       render: () => <DragHandle />,
//     },
//     ...columns,
//     {
//       title: 'Azioni',
//       dataIndex: 'actions',
//       key: 'actions',
//       render: renderActionCell,
//     },
//   ];

//   return (
//     <div style={{ marginLeft: '300px' }}>
//       <DndContext onDragEnd={({ active, over }) => {
//         if (active.id !== over?.id) {
//           setDataSource((prevState) => {
//             const activeIndex = prevState.findIndex((record) => record.key === active?.id);
//             const overIndex = prevState.findIndex((record) => record.key === over?.id);
//             return arrayMove(prevState, activeIndex, overIndex);
//           });
//         }
//       }}>
//         <SortableContext items={data.map((i) => i.key)} strategy={verticalListSortingStrategy}>
//           <Table
//             rowKey={getRowId}
//             components={{
//               body: {
//                 row: Row,
//               },
//             }}
//             columns={modifiedColumns}
//             dataSource={data}
//             pagination={false}
//             locale={{
//               emptyText: <h3 style={{ display: 'flex', justifyContent: 'center', marginTop: '10%', fontWeight: 300 }}>Nessun dato</h3>,
//             }}
//           />
//         </SortableContext>
//       </DndContext>

//       <Modal
//         visible={dialogOpen}
//         title="Dettagli Azioni"
//         onCancel={handleCloseDialog}
//         footer={null}
//         closeIcon={<CloseOutlined />}
//         width="50%"
//         style={{ borderRadius: '20px', border: '2.5px solid #00B400' }}
//       >
//         <Table size="small" pagination={false} bordered>
//           <thead>
//             <tr>
//               {dialogData.map((column) => (
//                 <th key={column.header} style={{ textAlign: 'center', fontWeight: 'bold', borderBottom: '2px solid #ccc7c7' }}>
//                   {column.header}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {dialogData[0].data.map((_, index) => (
//               <tr key={index} style={{ borderBottom: '2px solid #ccc7c7' }}>
//                 {dialogData.map((column) => (
//                   <td key={column.header} style={{ textAlign: 'center' }}>
//                     <div style={{ fontWeight: 500 }}>{column.data[index].title}</div>
//                     <div>{column.data[index].value}</div>
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </Modal>
//     </div>
//   );
// };

// export default TabellaPipelineNeed;
