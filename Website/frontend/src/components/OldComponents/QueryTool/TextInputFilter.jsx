import { TextInput, Label } from "flowbite-react";

/**
 * A general text input component with a label
 * @param {*} props 
 *  - label
 *  - value
 *  - onChange
 * 
 */
export default function TextInputFilter(props) {
  return (
    <>
      <div className="flex flex-col text-center my-2 mt-4">
        <div className="mb-2">
          <Label
            htmlFor={props.label}
            value={props.label}
            className=""
          />
        </div>
        <TextInput
          id={props.label}
          type="text"
          sizing="md"
          value={props.value}
          // Limit number of characters to 2
          onChange={props.onChange}
        />
      </div>
    </>
  )
}