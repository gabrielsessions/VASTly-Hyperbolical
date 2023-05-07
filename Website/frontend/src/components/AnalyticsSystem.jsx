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

  const initialQuery = {
    sqlQuery: "",
    data: [],
    fields: []
  }

  const [TSNEQuery, setTSNEQuery] = useState(initialQuery);
  const [timelineQuery, setTimelineQuery] = useState(initialQuery);
  const [tableQuery, setTableQuery] = useState(initialQuery);
  const [graphQuery, setGraphQuery] = useState(initialQuery);
  const [filters, setFilters] = useState({

    tsne: [-1,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18],
    timeline: ["", "", ""],
    table: [],
    graph: []
  })

  function executeQuery(query, callback) {
    fetch('http://localhost:3001/dbtest/query?' + new URLSearchParams({
      sqlQuery: query
    }))
      .then((res) => res.json())
      .then((res) => {
        callback(res);
      })
  }


  // Note: The returned data is unsorted
  function initialTimelineQuery() {
    const initTimelineQuery = "SELECT cd.cartype, DATE(timestamp) AS date, COUNT(*) FROM car_data AS cd, sensor_data AS sd WHERE cd.carid = sd.carid GROUP BY cd.cartype, date ORDER BY date;";
    executeQuery(initTimelineQuery, (res) => {
      setTimelineQuery({
        sqlQuery: initTimelineQuery,
        data: res.rows,
        fields: res.fields
      })
    })

  }

  // to update initialTableQuery:
  // a where statement will be updated with a global variable with selected options
  // WHERE car.cluster = selectedCheckBoxes
  // WHERE car.cartype = selectedLine
   
  function initialTableQuery() {

    const initTableQuery = "SELECT car.carid, car.cartype, car.cluster, TO_CHAR(MIN(sensor.timestamp), 'MM/DD/YY HH:MI:SS AM') AS first_entry, TO_CHAR(MAX(sensor.timestamp), 'MM/DD/YY HH:MI:SS AM') AS last_entry FROM car_data as car JOIN sensor_data as sensor ON car.carid = sensor.carid GROUP BY car.carid, car.cartype, car.cluster ORDER BY car.carid  LIMIT 12;"
    executeQuery(initTableQuery, (res) => {
      setTableQuery({
        sqlQuery: initTableQuery,
        data: res.rows,
        fields: res.fields
      });
      console.log(res.fields)
      console.log(res.rows)
    });
  }


  function initialTSNEQuery() {
    const initTSNEQuery = "SELECT * FROM car_data;";
    executeQuery(initTSNEQuery, (res) => {
      const newFields = res.fields.map((e) => e.name);
      setTSNEQuery({
        sqlQuery: initTSNEQuery,
        data: res.rows,
        fields: newFields
      });
    });
  }

   function interTSNE(array){
    let whereClause = "";

    if (Array.isArray(array) && array.length > 0) {
      whereClause = `WHERE cluster IN (${array.map((item) => `${item}`).join(", ")})`;
    }

    const newTSNEQuery = `SELECT * FROM car_data ${whereClause};`;
    console.log(newTSNEQuery)
    executeQuery(newTSNEQuery, (res) => {
      const newFields = res.fields.map((e) => e.name);
      setTSNEQuery({
        sqlQuery: newTSNEQuery,
        data: res.rows,
        fields: newFields
      });
    });

    const newTableQuery = `SELECT car.carid, car.cartype, car.cluster, 
    TO_CHAR(MIN(sensor.timestamp), 'MM/DD/YY HH:MI:SS AM') 
    AS first_entry, TO_CHAR(MAX(sensor.timestamp), 'MM/DD/YY HH:MI:SS AM') 
    AS last_entry
    FROM car_data as car 
    JOIN sensor_data as sensor ON car.carid = sensor.carid  ${whereClause} 
    GROUP BY car.carid, car.cartype, car.cluster 
    ORDER BY car.carid  
    LIMIT 100;`;
    console.log(newTableQuery)
    executeQuery(newTableQuery, (res) => {
      const newFields = res.fields.map((e) => e.name);
      setTableQuery({
        sqlQuery: newTableQuery,
        data: res.rows,
        fields: newFields
      });
    });


  } 

  function initialGraphQuery() {

  }

  useEffect(() => {
    initialTSNEQuery();
    initialTableQuery();
    initialTimelineQuery();
    initialGraphQuery();

  }, [])


  useEffect(() => {
    console.log("FILTER: ");
    console.log(filters);

  }, [filters])


  function generateTSNEQuery() {
    const base = "SELECT * FROM car_data";

  }

  function generateTimelineQuery() {
    const base = "SELECT car.cartype, DATE(timestamp) AS date, COUNT(*) FROM car_data AS car, sensor_data AS sensor";
    const whereClause = ["car.carid = sensor.carid"];

    const groupOrderBy = "GROUP BY car.cartype, date ORDER BY date;";
  }



  // Fetch default data from server (first 10 entries)

  return (
    <div className="min-h-screen max-h-screen">
      <div className="md:grid md:grid-cols-2">
        <div>
          <div className={analyticsComponentClass}>
            <VehicleMap graphQuery={graphQuery} executeQuery={executeQuery} setFilters={setFilters} />
          </div>
        </div>
        <div>
          
          <div className={analyticsComponentClass} style={{height: '70vh'}}>
            <ClassificationPlot TSNEQuery={TSNEQuery} interTSNE={interTSNE} setFilters={setFilters} />
          </div>
        </div>
        <div>
          <div className={analyticsComponentClass}>
            <DataTable tableQuery={tableQuery} setTableQuery={setTableQuery} executeQuery={executeQuery} setFilters={setFilters} />
          </div>
        </div>
        <div>
          <div className={analyticsComponentClass}>
            <Timeline timelineQuery={timelineQuery} setFilters={setFilters} />
          </div>
        </div>
      </div>
    </div>
  )
}
//new thing