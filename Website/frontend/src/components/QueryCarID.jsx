import SimpleTable from "./SimpleTable";
import { useEffect, useState } from "react";

export default function QueryCarID() {
  const [data, setData] = useState([]);
  const [fields, setFields] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/dbtest")
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        // Get fields of result
        const newFields = res.fields.map((elem) => {
          return elem.name;
        })
        setFields(newFields);

        // Get Data
        setData(res.rows);
      });
  }, [])
  return (
    <SimpleTable data={data} fields={fields} />
  )
}