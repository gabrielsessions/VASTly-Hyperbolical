import { useState, useEffect } from "react";
import SimpleTable from "./SimpleTable";
import VehicleMap from "./AnalyticsSystem/VehicleMap";
import ClassificationPlot from "./AnalyticsSystem/ClassificationPlot";
import Timeline from "./AnalyticsSystem/Timeline";
import DataTable from "./AnalyticsSystem/DataTable";

export default function AnalyticsSystem() {

  const analyticsComponentClass = "border";

  // global data variable:
  // 2 Queries one for graph/table, one for tsne


  const [TSNEQuery, setTSNEQuery] = useState({
    sqlQuery: "",
    data: [],
    fields: []
  });

  const [graphQuery, setGraphQuery] = useState({
    sqlQuery: "",
    data: [],
    fields: []
  });
  
  function executeQuery(query, callback) {
    fetch('http://localhost:3001/dbtest/query?' + new URLSearchParams({
      sqlQuery: query
    }))
      .then((res) => res.json())
      .then((res) => {
        callback(res);
      })
  }


  useEffect(() => {
    const initGraphQuery = "SELECT * FROM sensor_data LIMIT 20;";
    executeQuery(initGraphQuery, (res) => {
      setGraphQuery({
        sqlQuery: initGraphQuery,
        data: res.rows,
        fields: res.fields
      });
    });

    const initTSNEQuery = "SELECT car.carid, car.cartype, car.cluster, TO_CHAR(MIN(sensor.timestamp), 'MM/DD/YY HH:MI:SS AM') AS first_entry, TO_CHAR(MAX(sensor.timestamp), 'MM/DD/YY HH:MI:SS AM') AS last_entry, car.xcoord, car.ycoord FROM car_data as car JOIN sensor_data as sensor ON car.carid = sensor.carid GROUP BY car.carid, car.cartype, car.cluster ORDER BY car.carid LIMIT 50;"
    // "SELECT car.carid, car.cartype, car.cluster, MIN(sensor.timestamp) AS first_entry FROM car_data AS car NATURAL JOIN sensor_data AS sensor LIMIT 100;";
    // "SELECT car.carid, car.cartype, car.cluster, MIN(sensor.timestamp) AS first_entry, MAX(sensor.timestamp) AS last_entry FROM car_data AS car NATURAL JOIN sensor_data AS sensor ON car.carid = sensor.carid GROUP BY car.carid, car.cartype, car.cluster LIMIT 10;"
    // "SELECT car.carid, car.cartype, car.cluster, MIN(sensor.timestamp) AS first_entry, MAX(sensor.timestamp) AS last_entry FROM car_data as car JOIN sensor_data as sensor ON car.carid = sensor.carid GROUP BY car.carid, car.cartype, car.cluster LIMIT 50"

    //const initTSNEQuery = "SELECT * FROM car_data;";
    executeQuery(initTSNEQuery, (res) => {
      setTSNEQuery({
        sqlQuery: initTSNEQuery,
        data: res.rows,
        fields: res.fields
      });
    });

}, [])

  // Fetch default data from server (first 10 entries)

  return (
    <div className="min-h-screen max-h-screen">
      <div className="md:grid md:grid-cols-2">
        <div>
          <div className={analyticsComponentClass}>
            <VehicleMap graphQuery={graphQuery} />
          </div>
        </div>
        <div>
          <div className={analyticsComponentClass}>

            <ClassificationPlot TSNEQuery={TSNEQuery} />
          </div>
        </div>
        <div>
          <div className={analyticsComponentClass}>
            <DataTable setTSNEQuery={setTSNEQuery} tsneQuery={tsneQuery} executeQuery={executeQuery}/>
          </div>
        </div>
        <div>
          <div className={analyticsComponentClass}>
            <Timeline />
          </div>
        </div>
      </div>

    </div>
  )
}