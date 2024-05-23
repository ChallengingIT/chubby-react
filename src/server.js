// import express from 'express';
// import fs from 'fs';
// import path from 'path';
// import React from 'react';
// import ReactDOMServer from 'react-dom/server';
// import { StaticRouter as Router } from 'react-router-dom/server';
// import App from './App';  

// const PORT = process.env.PORT || 3000;
// const app = express();

// // Servire file statici dalla cartella pubblica
// app.use(express.static('build'));

// app.get('/*', (req, res) => {
//     const context = {};

//     const appRendered = ReactDOMServer.renderToString(
//         <Router location={req.url} context={context}>
//             <App />
//         </Router>
//     );

//     // Leggi il file index.html dal file system
//     const indexFile = path.resolve('./build/index.html');
//     fs.readFile(indexFile, 'utf8', (err, data) => {
//         if (err) {
//             console.error('Something went wrong:', err);
//             return res.status(500).send('Oops, better luck next time!');
//         }

//         // Sostituisci il contenuto del div root con il contenuto renderizzato lato server
//         return res.send(
//             data.replace('<div id="root"></div>', `<div id="root">${appRendered}</div>`)
//         );
//     });
// });

// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });


import React from 'react';
import ReactDOMServer from 'react-dom/server';
import express from 'express';
import fs from 'fs';
import path from 'path';
import App from './App'; // Il percorso potrebbe variare

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('build'));

app.get('/*', (req, res) => {
    const appRendered = ReactDOMServer.renderToString(
        <App server={true} location={req.url} />
    );

    const indexFile = path.resolve('./build/index.html');
    fs.readFile(indexFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Something went wrong:', err);
            return res.status(500).send('Oops, better luck next time!');
        }
        return res.send(data.replace('<div id="root"></div>', `<div id="root">${appRendered}</div>`));
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

