
/**
 * Simple Table Component
 * Renders an array of objects in a table
 * @param props.data - an array of rows to be rendered in the table
 * @param props.fields - names of the columns in the table
 */
export default function SimpleTable(props) {
  return (
    <div className="lg:mb-24 mb-8">
      {/* Title and query that was last run */}
      <h1 className="text-center text-2xl block">Database Query Results</h1>
      <h3 className="text-center my-4">{props.displayedQuery}</h3>

      {/* Only display table when there's results to display */}
      <table className={props.data.length === 0 ? "hidden" : "ml-auto mr-auto border-black border text-center"}>

        {/* Table Header, displays column names */}
        <thead className="border border-black">
          <tr>
            {
              props.fields.map((elem, index) => {
                return (
                  <td key={index} className="p-2 border border-black font-semibold">{elem}</td>
                )
              })
            }
          </tr>

        </thead>

        {/* Table Body, displays props.data by dynamically generating rows */}
        <tbody>
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
        </tbody>
      </table>

      {/* Display "No Results" if the data array is empty */}
      <h3 className={props.data.length === 0 ? "text-center text-xl" : "hidden"}>No Results</h3>
    </div>
  )
}