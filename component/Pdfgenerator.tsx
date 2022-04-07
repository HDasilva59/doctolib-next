import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function GeneratePDF(data:any) {
console.log(data)
  function generate() {
    const doc = new jsPDF()
const personne = ["maxime", "23","defefefe"]
    autoTable(doc, {
      head: [['Name', 'Age', 'Address']],
      body: personne.map((element)=>{return ["toto"]})

    })
    doc.save('table.pdf')
  }

  return (
    <div>
      <button onClick={generate} >Download PDF</button>
    </div>
  )
}
