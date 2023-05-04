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

    const initTSNEQuery = "SELECT * FROM sensor_data LIMIT 50;";
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
            <DataTable setTSNEQuery={setTSNEQuery} tsneQuery={TSNEQuery} executeQuery={executeQuery}/>
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