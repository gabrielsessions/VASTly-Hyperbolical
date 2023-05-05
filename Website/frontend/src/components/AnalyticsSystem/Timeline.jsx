// Import Stuff Here!

import TimelineGraph from "./Timeline/TimelineGraph";


export default function Timeline() {
  const data = [
    
    { date: new Date('2022-03-01'), value: 15 },
    { date: new Date('2022-04-01'), value: 25 },
    { date: new Date('2022-05-01'), value: 18 },
    { date: new Date('2022-06-01'), value: 22 },
    { date: new Date('2022-07-01'), value: 30 },
    { date: new Date('2022-08-01'), value: 28 },
    { date: new Date('2022-09-01'), value: 35 },
    { date: new Date('2022-10-01'), value: 32 },
    { date: new Date('2022-11-01'), value: 40 },
    { date: new Date('2022-12-01'), value: 45 },
  ];
  
  return (
    <div>
     <TimelineGraph data={data} />
    </div>
  )
}