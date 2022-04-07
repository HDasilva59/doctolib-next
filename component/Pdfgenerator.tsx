import jsPDF from 'jspdf'
import moment from 'moment';
import { Button } from 'react-bootstrap';

export default function GeneratePDF(props:any) {
  const dataPrescription = JSON.parse(props.data);
  function generate() {
    const doc = new jsPDF()
    doc.text(`Dr ${dataPrescription.lastNameDoctor} ${dataPrescription.firstNameDoctor}`, 20, 20);
    doc.text('Médecine Générale', 20, 30);
    doc.text(' ', 20, 40);
    doc.text(`Diplomé de la faculté de ${dataPrescription.city}`, 20, 50);
    doc.text(' ', 20, 60);
    doc.text(' ', 20, 70);
    doc.text(' ', 20, 90);
    doc.text(`${dataPrescription.cityDoctor} le ${dataPrescription.date}`, 140, 100);
    doc.text(``, 20, 110);
    doc.text(`${dataPrescription.contenu}`, 20, 120);
    doc.addPage();
    doc.save(`Prescription_${dataPrescription.date}.pdf`)
  }

  return (
    <div>
      <Button variant="success" onClick={generate} >Download The Prescription To Reservation : {dataPrescription.date}</Button>
    </div>
  )
}
