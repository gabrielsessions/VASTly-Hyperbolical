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

    TSNE: [],
    timeline: ["", "", ""],
    table: [],
    graph: []
  })

  function executeQuery(query, callback) {
    console.log("QUERY: ", query)
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
    const initTableQuery = "SELECT car.carid, car.cartype, car.cluster, TO_CHAR(MIN(sensor.timestamp), 'MM/DD/YY HH:MI:SS AM') AS first_entry, TO_CHAR(MAX(sensor.timestamp), 'MM/DD/YY HH:MI:SS AM') AS last_exit FROM car_data as car JOIN sensor_data as sensor ON car.carid = sensor.carid GROUP BY car.carid, car.cartype, car.cluster ORDER BY car.carid  LIMIT 100;"
    executeQuery(initTableQuery, (res) => {
      setTableQuery({
        sqlQuery: initTableQuery,
        data: res.rows,
        fields: res.fields
      });
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


    const newTSNEQuery = `SELECT * FROM car_data as car ${whereClause};`;

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
    AS last_exit
    FROM car_data as car 
    JOIN sensor_data as sensor ON car.carid = sensor.carid  ${whereClause} 
    GROUP BY car.carid, car.cartype, car.cluster 
    ORDER BY car.carid  
    LIMIT 100;`;
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
    //initialTSNEQuery();
    //initialTableQuery();
    //initialTimelineQuery();
    initialGraphQuery();

  }, [])


  const [loaded, setLoaded] = useState(0);

  useEffect(() => {

    console.log("FILTER: ");
    console.log(filters);
    runTSNEQuery(generateWhereClause(filters, ["TSNE", "timeline"]));
    runTableQuery(generateWhereClause(filters, ["TSNE", "timeline"]));
    runTimelineQuery(generateWhereClause(filters, ["TSNE", "timeline"]));
    runGraphQuery(generateWhereClause(filters, ["table"]),loaded);
    setLoaded(1);


  }, [filters])

  function generateWhereClause(filters, allowedWheres) {
    const initWhere = " WHERE ";
    let where = initWhere;
    //const whereArrs = Object.values(filters);
    for (let i = 0; i < allowedWheres.length; i++) {
      console.log(filters[allowedWheres[i]])
      for (let j = 0; j < filters[allowedWheres[i]].length; j++) {
        if (where === initWhere && filters[allowedWheres[i]][j] !== "") {
          where += " " + filters[allowedWheres[i]][j];
        }
        else if (filters[allowedWheres[i]][j] !== ""){
          where += " AND " + filters[allowedWheres[i]][j];
        }
      }
    }
    if (where === initWhere)
      return " ";
    return where + " ";
  }

  function runGraphQuery(where, loaded) {
    if (loaded != 0) {

      const base = "SELECT * from sensor_data as sensor";
      const query = base + where
      console.log("Graph Query");
      console.log(query);
      executeQuery(query, (res) => {
        setGraphQuery({
          sqlQuery: query,
          data: res.rows,
          fields: res.fields
        })
      })
    }
  }

  function runTSNEQuery(where) {
    const base = "SELECT DISTINCT car.carid, car.cluster, car.cartype, car.xcoord, car.ycoord FROM car_data as car NATURAL JOIN sensor_data AS sensor";
    const query = base + where
    console.log(query);
    executeQuery(query, (res) => {
      setTSNEQuery({
        sqlQuery: query,
        data: res.rows,
        fields: res.fields
      })
    })

  }

  function runTableQuery(where) {
    const base = `SELECT car.carid, car.cartype, car.cluster, 
    TO_CHAR(MIN(sensor.timestamp), 'MM/DD/YY HH:MI:SS AM') 
    AS first_entry, TO_CHAR(MAX(sensor.timestamp), 'MM/DD/YY HH:MI:SS AM') 
    AS last_exit
    FROM car_data as car 
    JOIN sensor_data as sensor ON car.carid = sensor.carid`;
    const groupOrderLimit = `GROUP BY car.carid, car.cartype, car.cluster 
    ORDER BY car.carid  
    LIMIT 100;`

    const query = base + where + groupOrderLimit;
    console.log(query);
    executeQuery(query, (res) => {
      setTableQuery({
        sqlQuery: query,
        data: res.rows,
        fields: res.fields
      })
    })
  }

  function runTimelineQuery(where) {
    const base = "SELECT car.cartype, DATE(timestamp) AS date, COUNT(*) FROM car_data AS car, sensor_data AS sensor";
    const extraWhereClause = "car.carid = sensor.carid";
    const groupOrderBy = "GROUP BY car.cartype, date ORDER BY date;";

    const query = where === " " ? base + where + " WHERE " + extraWhereClause + " " + groupOrderBy: base + where + " AND " + extraWhereClause + " " + groupOrderBy;
    
    executeQuery(query, (res) => {
      setTimelineQuery({
        sqlQuery: query,
        data: res.rows,
        fields: res.fields
      })
    })
  }



  // Fetch default data from server (first 10 entries)

  return (
    <div className="min-h-screen max-h-screen">
      <div className="md:grid md:grid-cols-2">
        <div>
          <div style={{height: '70vh'}}>
            <VehicleMap graphQuery={graphQuery} executeQuery={executeQuery} setFilters={setFilters} />
          </div>
        </div>
        <div>
          
          <div  style={{height: '70vh'}}>
            <ClassificationPlot TSNEQuery={TSNEQuery} interTSNE={interTSNE} setFilters={setFilters} />
          </div>
        </div>
        <div>
          <div style={{height: '60vh'}}>
            <DataTable tableQuery={tableQuery} setTableQuery={setTableQuery} executeQuery={executeQuery} setFilters={setFilters} />
          </div>
        </div>
        <div>
          <div style={{height: '60vh'}}>
            <Timeline timelineQuery={timelineQuery} setFilters={setFilters} />
          </div>
        </div>
      </div>
    </div>
  )
}
//new thing