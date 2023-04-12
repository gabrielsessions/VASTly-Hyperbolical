import QueryTool from "./QueryTool";
import SimpleTable from "./SimpleTable";
import { useEffect, useState } from "react";

export default function QueryCarID() {
  const [data, setData] = useState([]);
  const [fields, setFields] = useState([]);

  const [query, setQuery] = useState({
    attributes: [
        {
          "sqlName": "timestamp",
          "displayName": "Timestamp",
          "selected": false
        },
        {
          "sqlName": "carid",
          "displayName": "Car ID",
          "selected": false
        },
        {
          "sqlName": "cartype",
          "displayName": "Car Type",
          "selected": false
        },
        {
          "sqlName": "gatename",
          "displayName": "Gate Name",
          "selected": false
        }
    ],
    caridSelect: "",
    daySelect: "",
    gatenameSelect: "",
    cartypeSelect: ""
  });

  function queryDB() {
    fetch('http://localhost:3001/dbtest?' + new URLSearchParams({
      carid: 'value',
      gatename: 'stuff',
    }))
      .then((res) => res.text())
      .then((res) => console.log(res))
  }

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
    <div className="lg:grid lg:grid-cols-2 my-8">
      <div>
        <SimpleTable data={data} fields={fields} />
      </div>
      <div>
        <QueryTool query={query} setQuery={setQuery} />
      </div>
      
    </div>

  )
}