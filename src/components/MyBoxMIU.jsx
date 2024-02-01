// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Grid,
//   TextField,
//   Button,
//   MenuItem,
//   Select,
//   FormControl,
//   InputLabel,
//   Input,
//   IconButton,
//   InputAdornment,
//   Typography
// } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";

// const MyBoxMIU = ({ fields, initialValues, onSubmit, onSave, showSaveButton = true, showBackButton = true, title = "Form", }) => {
//   const navigate = useNavigate();
//   const [formValues, setFormValues] = useState(initialValues || {});
//   const [validationErrors, setValidationErrors] = useState({});

//   const handleInputChange = (e) => {
//     const { name, value, type, options } = e.target;
//     setValidationErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));


//     if (type === "select-multiple") {
//       const selectedOptions = Array.from(options)
//         .filter((option) => option.selected)
//         .map((option) => option.value);

//       setFormValues((prevValues) => ({
//         ...prevValues,
//         [name]: selectedOptions,
//       }));
//     } else {
//       setFormValues((prevValues) => ({
//         ...prevValues,
//         [name]: value,
//       }));
//     }
//   };

//   const handleDownloadFile = (fileUrl) => {

//     window.open(fileUrl, "_blank");

//   };



//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setFormValues((prevValues) => ({
//       ...prevValues,
//       file,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Effettua la validazione prima di inviare la richiesta al server
//     const errors = validate(formValues);
//     setValidationErrors(errors);

//     if (Object.keys(errors).length === 0 && onSubmit) {
//       onSubmit(formValues);
//     }
//   };
// const validate = (values) => {
//   const errors = {};
//   const campoObbligatorioErrors = {};

//   fields.forEach((field) => {
//     const value = values[field.name];

//     if (field.type === "campoObbligatorio" && !value) {
//       campoObbligatorioErrors[field.name] = "Campo obbligatorio";
//     }
//   });

//   return {
//     errors,
//     campoObbligatorioErrors,
//   };
// };


//   const handleGoBack = () => {
//     window.history.back();
//   };

//   return (
//     <div
//       style={{
//         display: "grid",
//         flexDirection: "column",
//         width: "80%",
//         height: "auto",
//         margin: "auto",
//         padding: "30px",
//         backgroundColor: "white",
//         borderRadius: "20px",
//         justifyItems: "center",
//         boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.5)",
//       }}
//     >
//        <Typography variant="h5" style={{ marginBottom: "20px" }}>
//         {title}
//       </Typography>
//       <form onSubmit={handleSubmit}>
//         <Grid container spacing={3}>
//           {fields.map((field) => (
//             <Grid
//               item
//               xs={field.type === "note" ? 12 : 4}
//               key={field.name}
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//               }}
//             >
               
//               {field.type === "select" && (
//                 <FormControl fullWidth>
//                   <InputLabel>{field.label}</InputLabel>
//                   <Select
//                     name={field.name}
//                     label="Filled"
//                     value={formValues[field.name] || ""}
//                     onChange={handleInputChange}
//                     disabled={field.disabled}
//                     style={{ width: "100%", textAlign: "left" }}
//                   >
//                     {field.options.map((option) => (
//                       <MenuItem key={option} value={option}>
//                         {option}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               )}
//               {field.type === "campoObbligatorio" && validationErrors[field.name] && (
//                 <div style={{ color: "red", marginTop: "4px" }}>{validationErrors[field.name]}</div>
//               )}
                
//                 {field.type === "selectValue" && (
//   <FormControl fullWidth>
//     <InputLabel>{field.label}</InputLabel>
//     <Select
//       name={field.name}
//       value={formValues[field.name] || ""}
//       onChange={handleInputChange}
//       disabled={field.disabled}
//       style={{ width: "100%", textAlign: "left" }}
//     >
//       {field.options.map((option) => (
//         <MenuItem key={option.value} value={option.value}>
//           {option.label}
//         </MenuItem>
//       ))}
//     </Select>
//   </FormControl>
// )}
//                 {field.type === "multipleSelect" && (
//   <FormControl fullWidth>
//     <InputLabel>{field.label}</InputLabel>
//     <Select
//       name={field.name}
//       value={formValues[field.name] || []}
//       onChange={handleInputChange}
//       multiple
//       disabled={field.disabled}
//       style={{ width: "100%", textAlign: "left" }}
//     >
//       {(field.options ?? []).map((option) => (
//         <MenuItem key={option} value={option}>
//           {option}
//         </MenuItem>
//       ))}
//     </Select>
//   </FormControl>
// )}
//  {field.type === "file" && (
//         <div style={{ marginBottom: "16px", textAlign: "left" }}>
//           <div style={{ marginBottom: "4px" }}>{field.label}</div>
//           <FormControl fullWidth>
//             <Input
//               type="file"
//               name={field.name}
//               onChange={handleFileChange}
//               inputProps={{ accept: field.accept || "application/pdf" }}
//               // endAdornment={
//               //   <InputAdornment position="end">
//               //     <Button
//               //       color="primary"
//               //       component="span"
//               //       startIcon={<addIcon />}
//               //     >
//               //       Upload
//               //     </Button>
//               //   </InputAdornment>
//               // }
//             />
//           </FormControl>
//         </div>
//       )}
//       {field.type === "downloadFile" && (
//   <div style={{ marginBottom: "16px", textAlign: "left" }}>
//     <Typography variant="subtitle1">{field.label}</Typography>
//     {formValues[field.name] ? (
//       <Button
//         color="primary"
//         variant="contained"
//         onClick={() => handleDownloadFile(formValues[field.name])}
//         style={{
//           backgroundColor: "white",
//           color: "blue",
//           "&:hover": {
//             backgroundColor: "white",
//             color: "blue",
//             transform: "scale(1.05)",
//           },
//         }}
//       >
//         Download
//       </Button>
//     ) : (
//       <Typography variant="body2" style={{ color: "red" }}>
//         Nessun file presente
//       </Typography>
//     )}
//   </div>
// )}



//               {field.type !== "select" && field.type !== "selectValue" && field.type !== "multipleSelect" && field.type !== "file" && field.type !== "downloadFile" && (
//                 <TextField
//                   {...(field.type === "date" && { type: "date" })}
//                   {...(field.type === "note" && {
//                     multiline: true,
//                     fullWidth: true,
//                   })}
//                   label={field.label}
//                   name={field.name}
//                   value={formValues[field.name] || ""}
//                   onChange={handleInputChange}
//                   disabled={field.disabled}
//                   InputLabelProps={
//                     field.type === "date"
//                       ? {
//                           shrink: true,
//                         }
//                       : undefined
//                   }
//                   InputProps={{
//                     placeholder: field.type === "date" && !formValues[field.name] ? field.label : undefined,
//                   }}
//                   style={{ width: "100%" }}
//                 />
//               )}
//             </Grid>
//           ))}
//         </Grid>
//         <div
//           className="bottoni"
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             marginBottom: "20px",
//             marginTop: "40px",
//             gap: "40px",
//           }}
//         >
//           {showBackButton && (
//           <Button
//             color="primary"
//             onClick={handleGoBack}
//             style={{
//               backgroundColor: "#6C757D",
//               color: "white",
//               "&:hover": {
//                 backgroundColor: "#6C757D",
//                 transform: "scale(1.05)",
//               },
//             }}
//           >
//             Indietro
//           </Button>
//           )}
//           {showSaveButton && (
//             <Button
//               color="primary"
//               variant="contained"
//               onClick={() => onSubmit(formValues)}
//               style={{
//                 backgroundColor: "black",
//                 "&:hover": {
//                   backgroundColor: "black",
//                   transform: "scale(1.05)",
//                 },
//               }}
//             >
//               Salva
//             </Button>
//           )}
//         </div>
//       </form>
//     </div>
//   );
// };

// export default MyBoxMIU;