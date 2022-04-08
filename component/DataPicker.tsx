import React, { useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import fr from 'date-fns/locale/fr';
registerLocale('fr', fr);
import "react-datepicker/dist/react-datepicker.css";

export default function GfgDatePicker() {
  const [startDate, setStartDate] = useState(new Date());

  return (
    <div>
      <DatePicker name="date"  locale="fr" id="date" selected={startDate} onChange=
              {(date:any) => setStartDate(date)} />
    </div>
  );
}
