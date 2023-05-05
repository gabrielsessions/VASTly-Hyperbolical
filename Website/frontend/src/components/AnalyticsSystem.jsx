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

  const [timelineQuery, setTimelineQuery] = useState({
    sqlQuery: "",
    data: [],
    fields: []
  });

  const [tableQuery, setTableQuery] = useState({
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

  function initialTimelineQuery() {

  }

  function initialTableQuery() {

  }

  function initialGraphQuery() {

  }


  useEffect(() => {
    initialTSNEQuery();
    initialTableQuery();
    initialTimelineQuery();
    initialGraphQuery();

  }, [])

  // Fetch default data from server (first 10 entries)

  return (
    <div className="min-h-screen max-h-screen">
      <div className="md:grid md:grid-cols-2">
        <div>
          <div className={analyticsComponentClass}>
            <VehicleMap graphQuery={graphQuery} executeQuery={executeQuery} />
          </div>
        </div>
        <div>
          <div className={analyticsComponentClass} style={{height: '70vh'}}>

            <ClassificationPlot TSNEQuery={TSNEQuery} />
          </div>
        </div>
        <div>
          <div className={analyticsComponentClass}>
            <DataTable tableQuery={tableQuery} setTSNEQuery={setTSNEQuery} TSNEQuery={TSNEQuery} executeQuery={executeQuery} />
          </div>
        </div>
        <div>
          <div className={analyticsComponentClass}>
            <Timeline timelineQuery={timelineQuery} />
          </div>
        </div>
      </div>

    </div>
  )
}