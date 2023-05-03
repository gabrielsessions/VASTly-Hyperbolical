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
  'column1', 'column2', 'column3', 'column4'
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

  const [selectedRowData, setSelectedRowData] = useState([]);

  const getSelectedRowwValues = selectedRow => {
    setSelectedRowData({ ...selectedRow.values });
  };
      
  var queryTemplate = "SELECT sensor.gate-name, sensor.Timestamp, sensor.car-id " + 
    "FROM Lekagul_Sensor_Data AS sensor" + 
    "WHERE sensor.car-id = setSelectedRowData" + 
    "ORDER BY sensor.car-id, sensor.TimeStamp DESC"

  var dummyData = "SELECT * " + 
  "FROM Lekagul_Sensor_Data AS sensor" + 
  "LIMIT 10"

  function getResult(res) {
    props.setTSNEQuery({
      sqlQuery: query,
      data: res.rows,
      fields: res.fields
    });
  }

  /** define new function, use it as callback to execute theory */
  props.executeQuery(dummyData, getResult)

  return (
    <div>
        <h1 className="text-center text-2xl my-6">Data Table Goes Here!</h1> 

         <SimpleTable data = {data} fields = {fields} ></SimpleTable>
            
    </div>
  )
}

