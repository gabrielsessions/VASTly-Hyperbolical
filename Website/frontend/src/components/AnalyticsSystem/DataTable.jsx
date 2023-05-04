
import SimpleTable from "../SimpleTable.jsx";

/** dummy data - field constant has strings */
const fields = [ 
  'column1', 'column2', 'column3', 'column4'
 ];

/** dummy data - key matches field, values are json objects */
 const data = [  
  {'column1': 21, 'column2':22, 'column3': 23, 'column4': 24},
  {'column1':25, 'column2': 26, 'column3': 27, 'column4': 28},  
 ]

export default function DataTable() {
  return (
    <div>

      <SimpleTable data = {data} fields = {fields} ></SimpleTable>

    </div>
  )
}