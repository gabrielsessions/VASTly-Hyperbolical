import { TextInput, Label } from "flowbite-react";
import { useState } from "react";


export default function GateSelect(props) {
  const [gate, setGate] = useState('');

  return (
    <>
      <div className="flex flex-col  text-center my-2">
        <div className="mb-2">
          <Label
            htmlFor="gateName"
            value="Gate Name"
            className=""
          />
        </div>
        <TextInput
          id="gateName"
          type="text"
          sizing="md"
          value={gate}
          onChange={(e) => setGate(e.target.value)}
        />
      </div>
    </>
  )
}