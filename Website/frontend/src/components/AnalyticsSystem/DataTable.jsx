import SimpleTable from "../SimpleTable.jsx";
import { useState, useEffect } from "react";
/**
 * general plan:
 * input is from query #1: timeline + tsne interact to give specific cluster, vehicle type, time
 * limit to 10 for initial display, have a scrolling feature 
 * output is query #2: for selected row give gates and timestamps <- goes to graph
 */

/** dummy data - field constant has strings 
 * 
*/

const fields = [ 
  'timestamp', 'carid', 'gatename' 
 ];

/** dummy data - key matches field, values are json objects 

*/

const data = [  
  {'column1': 21, 'column2':22, 'column3': 23, 'column4': 24},
  {'column1':25, 'column2': 26, 'column3': 27, 'column4': 28},  
 ]

/** New dummy data - subset of sensor data
*/

 /** real input data - from query 1 which is in SimpleTable
 * contents of data table: carid, cartype, cluster, firstentry, lastexit
 * carid, cartype, cluster <- car_data <- t-sne data
 * firstentry, lastext <- min/max queries of sensor data table 
 * 
 * SELECT car.carid, car.cartype, car.cluster, sensor.first, sensor.last
 * FROM cardata as car, sensor_data as sensor
 * WHERE car.cluster = ___ <- from selection of boxes
 * WHERE car.cartype = ___ <- from selection of line 
 * HAS timestamp in range(from brush)
 */

 /**
 * real output data - query 2 
 * SELECT gatename, timestamp, carid
 * FROM  sensordata as sensor
 * WHERe carid = setSelectedRowData
 */

 /**
 * Define constants here since DataTable is parent
 * SimpleTable (child) uses the onclick function to choose data from selected row
 */

export default function DataTable(props) {

  const [selectedRowData, setSelectedRowData] = useState("hi");

  const getChosenRowData = selectedRow => {
    setSelectedRowData({selectedRow });
  };
      
  var queryTemplate = "SELECT sensor.gatename, sensor.Timestamp, sensor.carid " + 
    "FROM sensor_data AS sensor" + 
    "WHERE sensor.carid = setSelectedRowData" + 
    "ORDER BY sensor.carid, sensor.TimeStamp DESC"

  var dummyData = "SELECT * FROM sensor_data AS sensor LIMIT 10"

  function getResult(res) {
    props.setTSNEQuery({
      sqlQuery: dummyData,
      data: res.rows,
      fields: res.fields
      
    });
  }

  /** define new function, use it as callback to execute theory */
  useEffect(() => {
    props.executeQuery(dummyData, getResult);
  }, [])

  return (
    <div>
        <h1 className="text-center text-2xl my-6">Data Table Goes Here!</h1> 

        <p className="text-center text-1xl my-2"> {selectedRowData}</p>

         <SimpleTable data = {props.tsneQuery.data} fields = {fields} getChosenRowData = {getChosenRowData}></SimpleTable>
            
    </div>
  )
}

