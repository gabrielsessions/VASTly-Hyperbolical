import { useState, useEffect } from "react"


/*
  Props:
  - data: an array of rows to be rendered in the table
  - fields: the names of the columns
*/

export default function SimpleTable(props) {
  return (
    <div className="mb-24">
      <h1 className="text-center text-2xl block">Database Query Results</h1>
      <h3 className="text-center my-4">Query: SELECT * FROM sensor_data LIMIT 10;</h3>
      <br />
      <table className={props.data.length === 0 ? "hidden" : "ml-auto mr-auto border-black border text-center"}>
        <tr className="border border-black">
          {
            props.fields.map((elem, index) => {
              return (
                <td key={index} className="p-2 border border-black font-semibold">{elem}</td>
              )
            })
          }
        </tr>
        {
          props.data.map((elem, index) => {
            return (
              <tr key={index}>
                {
                  props.fields.map((rowElem, colIndex) => {
                    // Make timestamps readable
                    if (rowElem === "timestamp") {
                      elem[rowElem] = new Date(elem[rowElem]).toLocaleString('en-US');
                    }
                    return (
                      <td key={colIndex} className="p-2 border border-black">{elem[rowElem]}</td>
                    )
                  })
                }
              </tr>
            )
          })
        }
      </table>
      <h3 className={props.data.length === 0 ? "text-center text-xl" : "hidden"}>No Results</h3>
    </div>
  )
}