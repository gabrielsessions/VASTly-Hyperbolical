import Attributes from "./QueryTool/Attributes";
import DateSelect from "./QueryTool/DateSelect";
import CarIDSelect from "./QueryTool/CarIDSelect";
import CarTypeSelect from "./QueryTool/CarTypeSelect";
import GateSelect from "./QueryTool/GateSelect";
import { Button } from "flowbite-react";

/**
 * Query Tool
 * Higher level component to structure the query execution form
 * @param props.query - current query parameters
 * @param props.setQuery - a function to change and dynamically update the 
 * query parameters
 */

export default function QueryTool(props) {
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
        <CarIDSelect query={props.query} setQuery={props.setQuery} />
      </div>

      {/* Car ID Filter */}
      <div className="flex justify-center">
        <CarTypeSelect query={props.query} setQuery={props.setQuery} />
      </div>

      {/* Gate Name Filter */}
      <div className="flex justify-center">
        <GateSelect query={props.query} setQuery={props.setQuery} />
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