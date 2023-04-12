import { TextInput, Label } from "flowbite-react";
import { useState } from "react";


export default function CarIDSelect(props) {
  return (
    <>
      <div className="flex flex-col  text-center my-2 mt-4">
        <div className="mb-2">
          <Label
            htmlFor="carID"
            value="Car ID"
            className=""
          />
        </div>
        <TextInput
          id="carID"
          type="text"
          sizing="md"
          value={props.query.caridSelect}
          onChange={(e) => props.setQuery((prev) => {
            const copy = {...prev}
            copy.caridSelect = e.target.value;
            return copy;
          })}
        />
      </div>
    </>
  )
}