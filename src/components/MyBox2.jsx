// import React, { useState } from "react";
// import Box from "@mui/material/Box";
// import TextField from "@mui/material/TextField";
// import Select from "@mui/material/Select";
// import CustomCalendar from "./CustomCalendar";
// import "../styles/MyBox.css";

// export default function MyBox2({ title, fields, dropdownOptions }) {
//   const [formData, setFormData] = useState({});

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   return (
//     <div className="container-box-father">
//       <div className="container-box">
//         <Box
//           sx={{
//             gridColumn: "1 / -1", 
//             gridRow: "1",
//             width: "100%",
//             textAlign: "center",
//             marginBottom: "10px",
//           }}
//         >
//           {title && <h3>{title}</h3>}
//         </Box>

//         {fields.map((field, index) => (
//           <div key={index}>
//             {field.dividerTitle && (
//               <div>
//                 <hr
//                   style={{
//                     width: "100%",
//                     margin: "8px 0",
//                     textAlign: "center",
//                     justifyContent: "center",
//                     alignItems: "center",
//                   }}
//                 />
//                 <h3>{field.dividerTitle}</h3>
//               </div>
//             )}
//             <Box
//               sx={{
//                 width: "100%",
//                 maxWidth: "220px",
//                 height: 70,
//                 backgroundColor: "white",
//                 textAlign: "left",
//                 marginTop: "8px", 
//               }}
//             >
//               <label className="col-form-label">{field.label}</label>
//               {field.type === "date" ? (
//                 <CustomCalendar
//                   name={field.name}
//                   value={formData[field.name] || ""}
//                   onChange={handleChange}
//                 />
//               ) : field.type === "dropdown" ? (
//                 <Select
//                   className="dropdown-menu"
//                   value={formData[field.name] || "seleziona"}
//                   onChange={handleChange}
//                   sx={{
//                     backgroundColor: "#E8E8E8",
//                     fontSize: "0.8rem",
//                     textAlign: "start",
//                     color: "#757575",
//                     width: "100%",
//                     maxWidth: "220px",
//                     display: "flex",
//                     height: "100%",
//                     maxHeight: "56px",
//                   }}
//                   native
//                 >
//                   <option value="seleziona" disabled>
//                     ---
//                   </option>
//                   {dropdownOptions.map((option, index) => (
//                     <option key={index} value={option.name}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </Select>
//               ) : (
//                 <TextField
//                   name={field.name}
//                   id="filled-basic"
//                   variant="filled"
//                   sx={{
//                     width: "100%",
//                     maxWidth: "220px",
//                     display: "flex",
//                   }}
//                   value={formData[field.name] || ""}
//                   onChange={handleChange}
//                 />
//               )}
//             </Box>
//           </div>
//         ))}

//         {dropdownOptions.map((option, index) => (
//           <Box
//             key={index}
//             sx={{
//               width: "100%",
//               maxWidth: "220px",
//               height: 70,
//               textAlign: "left",
//               marginTop: "8px", 
//             }}
//           >
//             <label className="col-form-label">{option.label}</label>
//             <Select
//               className="dropdown-menu"
//               value={formData[option.name] || "seleziona"}
//               onChange={handleChange}
//               sx={{
//                 backgroundColor: "#F0F0F0",
//                 fontSize: "0.8rem",
//                 textAlign: "start",
//                 color: "#757575",
//                 width: "100%",
//                 maxWidth: "220px",
//                 display: "flex",
//                 height: "100%",
//                 maxHeight: "56px",
//               }}
//               native
//             >
//               <option value="seleziona" disabled>
//                 ---
//               </option>
//               {option.values.map((value, index) => (
//                 <option key={index} value={value}>
//                   {value}
//                 </option>
//               ))}
//             </Select>
//           </Box>
//         ))}
//       </div>
//     </div>
//   );
// }
