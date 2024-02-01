// import React, { useState } from 'react';
// import {
//   Grid,
//   Button,
//   TextField,
//   Select,
//   MenuItem,
//   FormControl,
//   Typography,
//   Box,
// } from '@mui/material';

// const SearchFieldsBox = ({ searchFields, onSearch, onReset }) => {
//   const [formValues, setFormValues] = useState({});

//   const handleChange = (fieldName) => (event) => {
//     const value = event.target.value;
//     setFormValues({ ...formValues, [fieldName]: value });
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     onSearch(formValues);
//   };

//   const handleReset = () => {
//     setFormValues({});
//     onReset();
//   };

//   const renderField = (field) => {
//     switch (field.type) {
//       case 'text':
//         return (
//           <TextField
//             label={field.label}
//             name={field.name}
//             onChange={handleChange(field.name)}
//             value={formValues[field.name] || ''}
//             fullWidth
//             variant="outlined"
//             size="small"
//           />
//         );

//       case 'select':
//         return (
//           <FormControl fullWidth>
//             <Select
//               label={field.label}
//               name={field.name}
//               value={formValues[field.name] || ''}
//               onChange={handleChange(field.name)}
//               displayEmpty
//               inputProps={{ 'aria-label': 'Without label' }}
//               size="small"
//             >
//               <MenuItem disabled value="">
//                 <em>{field.label}</em>
//               </MenuItem>
//               {field.options?.map((option) => (
//                 <MenuItem key={option.value} value={option.value}>
//                   {option.label}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         );

//         case 'cerca':
//         return (
//             <FormControl fullWidth>
//                 <Button
//               type="submit"
//               variant="contained"
//               sx={{
//                 bgcolor: '#fbb800',
//                 color: 'black',
//                 maxWidth: "100px",
//                 marginLeft: "20px",
//                 '&:hover': {
//                   bgcolor: '#fbb800',
//                 },
//                 marginBottom: '16px', // to give space between the two buttons
//               }}
//             >
//               Cerca
//             </Button>
//             </FormControl>
//         );

//         case 'reset': 
//         return (
//             <FormControl fullWidth>
//                 <Button
//               variant="contained"
//               onClick={handleReset}
//               sx={{
//                 marginLeft: "20px",
//                 bgcolor: 'black',
//                 color: 'white',
//                 maxWidth: "100px",
//                 '&:hover': {
//                   bgcolor: 'black',
//                 },
//               }}
//             >
//               Reset
//             </Button>
//             </FormControl>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <Box
//       sx={{
//         display: 'flex',
//         flexDirection: 'column',
//         maxWidth: "1000px",
//         margin: '20px auto',
//         borderRadius: "40px",
//         padding: '20px',
//         backgroundColor: 'white',
//         boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
//         '& .MuiTextField-root, .MuiFormControl-root': {
//           margin: '8px',
//           borderRadius: '40px',
//         },
//         '& .MuiButton-root': {
//           borderRadius: '20px',
//           padding: '10px 30px',
//         },
//       }}
//     >
      
//       <form onSubmit={handleSubmit}>
//         <Grid container spacing={2}>
//           {searchFields.map((field, index) => (
//             index < 6 ? (
//               <Grid item xs={12} sm={4} key={index}>
//                 {renderField(field)}
//               </Grid>
//             ) : null
//           ))}
         
//         </Grid>
//       </form>
//     </Box>
//   );
// };

// export default SearchFieldsBox;
