import Attributes from "./QueryTool/Attributes";
import DateSelect from "./QueryTool/DateSelect";
import CarIDSelect from "./QueryTool/CarIDSelect";
import GateSelect from "./QueryTool/GateSelect";
import { Button } from "flowbite-react";

export default function QueryTool(props) {

  //const attributes = props.query.attributes;

  return (
    <div>
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
      <div className="flex justify-center">
        <CarIDSelect />
      </div>
      <div className="flex justify-center">
        <GateSelect />
      </div>
      <div className="my-4 text-center">
        <Button className="mx-auto">
          Query Database
        </Button>
      </div>
      
    </div>
  )
}