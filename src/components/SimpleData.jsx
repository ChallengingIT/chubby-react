import React from 'react';

function SimpleData({ titles, data, tableTitle }) {
  return (
    <div className="SimpleDataContainer" style={{ minWidth: '300px', minHeight: '270px', backgroundColor: 'white', borderRadius: '40px', marginRight: '40px', boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.6)", }}>
      <h2 style={{ color: '#808080', margin: '20px' }}>{tableTitle}</h2>
      {data.length > 0 ? (
        <table style={{ backgroundColor: 'white', borderRadius: '40px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', margin: '20px' }}>
          <tbody>
          {titles.map((title, index) => (
  <tr key={index}>
    <td style={{ color: '#808080', marginRight: '40px' }}>
      {typeof title === 'string' ? title : 'Titolo non valido'}
    </td>
    <td style={{ color: 'black', fontWeight: 'bolder' }}>
      {data[0] && typeof data[0] === 'object' && typeof title === 'string' && title.toLowerCase() in data[0]
        ? data[0][title.toLowerCase()]
        : 'Valore non disponibile'}
    </td>
  </tr>
))}

          </tbody>
        </table>
      ) : (
        <p style={{ color: 'black', margin: '20px' }}>Nessun dato disponibile.</p>
      )}
    </div>
  );
}

export default SimpleData;
