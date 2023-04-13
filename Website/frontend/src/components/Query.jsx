import QueryTool from "./QueryTool";
import SimpleTable from "./SimpleTable";
import { useEffect, useState } from "react";

export default function Query() {
  // States for the data in the display table
  const [data, setData] = useState([]);
  const [fields, setFields] = useState([]);
  const [displayedQuery, setDisplayedQuery] = useState("Query: SELECT * FROM sensor_data LIMIT 10;")

  // Data from controlled components in the Query Tool
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
    daySelect: ["05/01/2015", "05/31/2016"],
    gatenameSelect: "",
    cartypeSelect: ""
  });

  // Selects appropriate columns based on checked off inputs
  function selectCols(attributes) {
    let selectStatement = "SELECT ";
    const selectedAttributes = attributes.filter((elem) => {
      return elem.selected;
    });

    if (selectedAttributes.length === 0) {
      return (selectStatement + "NULL ");
    }

    // Select all case
    if (selectedAttributes.length === attributes.length) {
      return (selectStatement + "* ");
    }

    // Select none case
    selectedAttributes.forEach(element => {
      selectStatement += element.sqlName + ", ";
    });
    return (selectStatement.substring(0, selectStatement.length - 2) + " ");

  }

  // Geneates FROM clause based on which attributes were selected
  function fromClause(attributes) {
    //const table1 = ["cartype"];
    const table2 = ["timestamp", "gatename"];

    // TODO: carid only special case

    if (attributes.length === 1 && attributes[0].sqlName === "carid") {
      return "FROM sensor_data NATURAL JOIN car_data ";
    }

    for (let i = 0; i < attributes.length; i++) {
      if (table2.includes(attributes[i].sqlName) && attributes[i].selected) {
        return "FROM sensor_data ";
      }
    }

    return "FROM car_data ";
  }

  // Joins tables if attributes across 2 tables
  function joinTables(attributes) {
    // Note: carid is in both tables, no relevant for joins
    const table1 = ["cartype"];
    const table2 = ["timestamp", "gatename"];
    let inTable1 = false;
    let inTable2 = false;
    attributes.forEach(element => {
      if (element.selected) {
        if (table1.includes(element.sqlName)) {
          inTable1 = true;
        }
        else if (table2.includes(element.sqlName)) {
          inTable2 = true;
        }
      }
    });
    // FROM will be from sensor_data in cases where we need to join
    if (inTable1 && inTable2) {
      return "NATURAL JOIN car_data ";
    }
    return "";
  }

  // WHERE clauses are generated based on which options were selected in the form
  function filterCols(query, curQuery) {
    const carIncluded = curQuery.includes("car_data");
    const sensorIncluded = curQuery.includes("sensor_data");

    let whereStatement = "WHERE ";

    // Car ID
    if (query.caridSelect !== "") {
      whereStatement += `carid='${query.caridSelect}' AND `;
    }

    // Gate Name
    if (query.gatenameSelect !== "" && sensorIncluded) {
      whereStatement += `gatename='${query.gatenameSelect}' AND `;
    }

    // Car Type
    if (query.cartypeSelect !== "" && carIncluded) {
      whereStatement += `cartype='${query.cartypeSelect}' AND `;
    }

    // Start Date
    if (query.daySelect[0] !== "" && sensorIncluded) {
      whereStatement += `timestamp>='${query.daySelect[0]}' AND `;
    }

    // End Date
    if (query.daySelect[1] !== "" && sensorIncluded) {
      whereStatement += `timestamp<='${query.daySelect[1]}' AND `;
    }

    // If no filters, don't include WHERE in the query
    if (whereStatement === "WHERE ") {
      return "";
    }

    // Remove the "AND " from the end of the string
    return (whereStatement.substring(0, whereStatement.length - 4));
  }

  // Generates a SQL statement based on the query selections
  // then sends it to the backend. Renders response in a table.
  function executeQuery() {
    let sqlQuery = selectCols(query.attributes);
    sqlQuery += fromClause(query.attributes);
    sqlQuery += joinTables(query.attributes);
    sqlQuery += filterCols(query, sqlQuery);
    sqlQuery += "LIMIT 20;"

    setDisplayedQuery(sqlQuery);

    fetch('http://localhost:3001/dbtest/query?' + new URLSearchParams({
      sqlQuery: sqlQuery
    }))
      .then((res) => res.json())
      .then((res) => renderTable(res));
  }

  function renderTable(res) {
    console.log(res);
    // Get fields of result
    const newFields = res.fields.map((elem) => {
      return elem.name;
    })
    setFields(newFields);

    // Get Data
    setData(res.rows);
  }

  // Fetch default data from server (first 10 entries)
  useEffect(() => {
    fetch("http://localhost:3001/dbtest")
      .then((res) => res.json())
      .then((res) => {
        renderTable(res);
      });
  }, [])

  return (
    <div className="lg:grid lg:grid-cols-2 my-8">
      <div>
        <SimpleTable data={data} fields={fields} displayedQuery={displayedQuery} />
      </div>
      <div>
        <QueryTool query={query} setQuery={setQuery} executeQuery={executeQuery} />
      </div>

    </div>

  )
}