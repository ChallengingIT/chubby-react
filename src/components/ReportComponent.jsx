import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';


function ReportComponent() {

    const [ dipendenti, setDipendenti ] = useState([]);

    const fetchData = async () => {
        try {
            const responseDipendenti = await axios.get("http://localhost:8080/hr/react");






  return (
    <div>ReportComponent</div>
  )
}

export default ReportComponent