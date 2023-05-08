// Import Stuff Here!

import { useEffect, useState } from "react";
import TimelineGraph from "./Timeline/TimelineGraph";
import MultipleLineGraph from "./Timeline/MultipleLineGraph";
import { schemeCategory10 } from "d3";

export default function Timeline(props) {
  const [timeRange, setRange] = useState({
    startDate: new Date('2015-05-01'),
    endDate: new Date('2015-05-31')
  })

  function setTimeRange(newObj) {
    setRange(newObj);
    props.setFilters((prev) => {
      const newFilters = {...prev};
      newFilters.timeline[0] = "sensor.timestamp" + ">='" + newObj.startDate + "'";
      newFilters.timeline[1] = "sensor.timestamp" + "<='" + newObj.endDate + "'";

      return newFilters;
    })
  }

  function selectCarType(carType) {
    props.setFilters((prev) => {
      const newFilters = {...prev};
      console.log(prev);
      newFilters.timeline[2] = "car.cartype='"+ carType + "'";
      return newFilters;
    })
  } 

  const typeMap = {
    "1": 0,
    "2": 1,
    "2P": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6
  }
  const types = ["2 Axle Car", "2 Axle Truck", "2 Axle Park Truck", "3 Axle Truck", "4+ Axle Truck", "2 Axle Bus", "3 Axle Bus"];

  const dataInit = [];
  for (let i = 0; i < 7; i++) {
    dataInit.push({
      values: [],
      color: schemeCategory10[i],
      name: types[i]
    })
  }

  const [data, setData] = useState(dataInit);

  
  useEffect(() => {
    //console.log(props.timelineQuery.data);
    const newData = [...dataInit];
    props.timelineQuery.data.forEach(element => {
      const newDate = new Date(element.date)
      newData[typeMap[element["cartype"]]].values.push({
        date: newDate,
        cartype: element.cartype,
        value: parseInt(element.count),
        color: typeMap[element["cartype"]]
      })
    });
    setData(newData);
  }, [props.timelineQuery])
  
  return (

    <div class="liney">
     <MultipleLineGraph data={data} setTimeRange={setTimeRange} selectCarType={selectCarType}/>
    </div>
  )
}