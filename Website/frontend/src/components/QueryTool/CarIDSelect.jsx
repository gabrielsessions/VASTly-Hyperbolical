import { TextInput, Label } from "flowbite-react";
import { useState } from "react";


export default function CarIDSelect(props) {
  const [id, setID] = useState('');

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
          value={id}
          onChange={(e) => setID(e.target.value)}
        />
      </div>
    </>
  )
}