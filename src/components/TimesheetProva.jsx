import React, { useState } from 'react';
import '../styles/Timesheet.css'; // Assicurati di creare un file CSS con il nome Timesheet.css

function TimesheetProva({ year, month }) {
  // Ipotizziamo che tu possa ottenere i giorni festivi da un API o un database.
  const holidays = [/* array di oggetti date che sono giorni festivi */];
  const [days, setDays] = useState([]);

  // Utilizza l'effetto per generare l'array dei giorni una volta che il componente viene montato o quando cambiano year e month
  React.useEffect(() => {
    const date = new Date(year, month - 1, 1);
    const daysInMonth = new Date(year, month, 0).getDate();
    const daysArray = [];
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push(new Date(year, month - 1, i));
    }
    setDays(daysArray);
  }, [year, month]);

  const isWeekend = (date) => date.getDay() === 0 || date.getDay() === 6;
  const isHoliday = (date) => holidays.some(holiday => holiday.getTime() === date.getTime());

  return (
    <div className='containerBox'>
    <div className="timesheet">
      <div className="timesheet-header">
        {/* Header with controls to navigate months */}
      </div>
      <div className="timesheet-body">
        {days.map((day, index) => (
          <div
            key={index}
            className={`day ${isWeekend(day) ? 'weekend' : ''} ${isHoliday(day) ? 'holiday' : ''}`}
            onClick={() => handleDayClick(day)}
          >
            {day.getDate()}
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}

function handleDayClick(day) {
  // Gestisci il clic su un giorno qui, ad esempio impostando lo stato per un modal
  console.log(day); // Logga o fai qualcosa con il giorno cliccato
}

export default TimesheetProva;
