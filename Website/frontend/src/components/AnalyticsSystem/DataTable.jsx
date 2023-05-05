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
  'carid', 'cartype', 'cluster', 'first_entry', 'last_entry'
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
 * SELECT car.carid, car.cartype, car.cluster, sensor.first AS MIN(sensor.Tiems), sensor.last
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

  const [selectedRowData, setSelectedRowData] = useState();

  const getChosenRowData = selectedRow => {
    setSelectedRowData(selectedRow);
  };
      
  var queryTemplate = "SELECT sensor.gatename, sensor.Timestamp, sensor.carid FROM sensor_data AS sensor WHERE sensor.carid = setSelectedRowData ORDER BY sensor.carid, sensor.TimeStamp ASC"

  var queryOne = "SELECT car.carid, car.cartype, car.cluster, MIN(sensor.timestamp) AS first_entry, MAX(sensor.timestamp) AS last_entry FROM car_data as car JOIN sensor_data as sensor ON car.carid = sensor.carid GROUP BY car.carid, car.cartype, car.cluster LIMIT 50"

  var dummyData = "SELECT * FROM sensor_data AS sensor LIMIT 50"

  var queryTwo = `SELECT * FROM sensor_data AS sensor WHERE sensor.carid = '${getChosenRowData}'`

  function getResult(res) {
    props.setTSNEQuery({
      sqlQuery: queryOne,
      data: res.rows,
      fields: res.fields
      
    });
  }

  function getGraphResult(res) {
    props.setGraphQuery({
      sqlQuery: queryTwo,
      data: res.rows,
      fields: res.fields
      
    });
    console.log(res)
  }

  /** define new function, use it as callback to execute query */
  useEffect(() => {
    props.executeQuery(queryOne, getResult);
  }, [])

    /** update function to state of graphQuery function */


  /** send selected data from selected car id to graph query */



  return (
    <div  >

        <p className="text-center text-1xl my-2"> {selectedRowData}</p>
    
        <div class = "h-96 overflow-y-auto" > 
        
        <SimpleTable data = {props.TSNEQuery.data} fields = {['carid', 'cartype', 'cluster', 'first_entry', 'last_entry']} getChosenRowData = {getChosenRowData} getGraphResult = {getGraphResult}/>
        
        </div> 
        
    </div>
  )
}

