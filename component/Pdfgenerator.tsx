import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function GeneratePDF(data:any) {
  const dataPrescription = JSON.parse(data.data.dataPrescriptions);

  function generate() {
    const doc = new jsPDF()
    doc.text('Your Prescription', 50, 20);
    doc.text(' ', 20, 30);
    doc.text(' ', 20, 40);
    doc.text('Object : Prescription ', 20, 50);
    doc.text(' ', 20, 60);
    doc.text(`Date : ${dataPrescription[0].date}`, 20, 70);
    doc.text(`- ${dataPrescription[0].contenu}`, 20, 90);
    doc.addPage();
    doc.save('table.pdf')
  }

  return (
    <div>
      <button onClick={generate} >Download PDF</button>
    </div>
  )
}
