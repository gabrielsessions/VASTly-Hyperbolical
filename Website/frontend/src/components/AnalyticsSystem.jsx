import { useState, useEffect } from "react";
import SimpleTable from "./SimpleTable";
import VehicleMap from "./AnalyticsSystem/VehicleMap";
import ClassificationPlot from "./AnalyticsSystem/ClassificationPlot";
import Timeline from "./AnalyticsSystem/Timeline";
import DataTable from "./AnalyticsSystem/DataTable";

export default function AnalyticsSystem() {

  const analyticsComponentClass = "border";
  const [data, setData] = useState({})

  // Fetch default data from server (first 10 entries)

  return (
    <div className="min-h-screen max-h-screen">
      <div className="md:grid md:grid-cols-2">
        <div>
          <div className={analyticsComponentClass}>
            <VehicleMap />
          </div>
        </div>
        <div>
          <div className={analyticsComponentClass}>
            <ClassificationPlot />
          </div>
        </div>

      </div>
      
    <div className="md:grid md:grid-cols-2">
      <div>
        <div className={analyticsComponentClass}>
          <DataTable />
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