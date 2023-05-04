// Import Stuff Here!
import { useState } from "react"
import Canvas from "./VehicleGraph/Canvas"


// Use THIS! 
//https://codesandbox.io/s/react-d3-graph-demo-e8d2pp?file=/src/data.js


export default function VehicleMap(props) {

  const [testData, setTestData] = useState({
    sqlQuery: "",
    data: [],
    fields: []
  });

  function testing() {
    props.executeQuery("SELECT * FROM sensor_data WHERE carid='20154112014114-381' ORDER BY timestamp;", (res) => {
      //console.log(res.rows);
      setTestData({
        sqlQuery: "STUFF!",
        data: res.rows,
        fields: res.fields
      });
    })
  }


  return (
    <div onClick={() => testing()}>
      <Canvas graphQuery={testData} executeQuery={props.executeQuery} />
    </div>
  )

}