import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function GeneratePDF(data:any) {

  console.log(JSON.parse(data.data.dataPrescriptions))
  function generate() {
    const doc = new jsPDF()
    doc.text('Hello world!',20,20);
    doc.text('This is client-side Javascript, pumping out a PDF.',20, 30);
doc.addPage();
    doc.save('table.pdf')
  }

  return (
    <div>
      <button onClick={generate} >Download PDF</button>
    </div>
  )
}
