import { useState, useEffect } from "react";
import SimpleTable from "./SimpleTable";
import VehicleMap from "./AnalyticsSystem/VehicleMap";
import ClassificationPlot from "./AnalyticsSystem/ClassificationPlot";
import Timeline from "./AnalyticsSystem/Timeline";
import DataTable from "./AnalyticsSystem/DataTable";

export default function AnalyticsSystem() {

  const analyticsComponentClass = "analytics-system-box border";
  const [data, setData] = useState({})

  // Fetch default data from server (first 10 entries)
  useEffect(() => {
    fetch("http://localhost:3001/dbtest")
      .then((res) => res.json())
      .then((res) => {
        setData(res);
      });
  }, [])


  return (
    <div className="flex flex-wrap">
      <div className={analyticsComponentClass}>
        <VehicleMap />
      </div>
      <div className={analyticsComponentClass}>
        <ClassificationPlot />
      </div>
      <div className={analyticsComponentClass}>
        <DataTable data={data} />
      </div>
      <div className={analyticsComponentClass}>
        <Timeline />
      </div>

    </div>
  )
}