import Attributes from "./QueryTool/Attributes";
import DateSelect from "./QueryTool/DateSelect";
import { Button } from "flowbite-react";
import TextInputFilter from "./QueryTool/TextInputFilter";

/**
 * Query Tool
 * Higher level component to structure the query execution form
 * @param props.query - current query parameters
 * @param props.setQuery - a function to change and dynamically update the 
 * query parameters
 */

export default function QueryTool(props) {
  const modifyQuery = (parameter, event) => {
    props.setQuery((prev) => {
      const copy = { ...prev }
      copy[parameter] = event.target.value;
      return copy;
    })
  }

  return (
    <div>
      {/* Two columns: attribute selection on the left, data range on the right*/}
      <div className="flex justify-center">
        <div className="lg:grid lg:grid-cols-2">
          <div className="flex justify-center">
            <Attributes query={props.query} setQuery={props.setQuery} />
          </div>
          <div className="flex justify-center">
            <DateSelect query={props.query} setQuery={props.setQuery} />
          </div>
        </div>
      </div>

      {/* Car ID Filter */}
      <div className="flex justify-center">
        {/*<CarIDSelect query={props.query} setQuery={props.setQuery} />*/}
        <TextInputFilter
          label={"Car ID"}
          value={props.query.caridSelect}
          onChange={(e) => modifyQuery("caridSelect", e)}
        />
      </div>

      {/* Car Type Filter */}
      <div className="flex justify-center">
        <TextInputFilter
          label={"Car Type"}
          value={props.query.cartypeSelect}
          onChange={(e) => modifyQuery("cartypeSelect", e)}
        />
      </div>

      {/* Gate Name Filter */}
      <div className="flex justify-center">
        <TextInputFilter
          label={"Gate Name"}
          value={props.query.gatenameSelect}
          onChange={(e) => modifyQuery("gatenameSelect", e)}
        />
      </div>

      {/* Button to submit query to the backend */}
      <div className="my-4 text-center">
        <Button onClick={props.executeQuery} className="mx-auto">
          Query Database
        </Button>
      </div>

    </div>
  )
}