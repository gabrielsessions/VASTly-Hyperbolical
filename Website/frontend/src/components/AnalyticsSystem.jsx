import { useState, useEffect } from "react";
import SimpleTable from "./SimpleTable";
import VehicleMap from "./AnalyticsSystem/VehicleMap";
import ClassificationPlot from "./AnalyticsSystem/ClassificationPlot";
import Timeline from "./AnalyticsSystem/Timeline";
import DataTable from "./AnalyticsSystem/DataTable";

export default function AnalyticsSystem() {

  const analyticsComponentClass = "analytics-system-box border";

  return (
    <div className="flex flex-wrap">
      <div className={analyticsComponentClass}>
        <VehicleMap />
      </div>
      <div className={analyticsComponentClass}>
        <ClassificationPlot />
      </div>
      <div className={analyticsComponentClass}>
        <DataTable />
      </div>
      <div className={analyticsComponentClass}>
        <Timeline />
      </div>

    </div>
  )
}