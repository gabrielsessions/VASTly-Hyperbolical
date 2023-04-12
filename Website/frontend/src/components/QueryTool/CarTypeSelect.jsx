import { TextInput, Label } from "flowbite-react";

/**
 * CarTypeSelect Component
 * Text input to filter by a car type
 * TODO: Be able to filter by multiple Car types
 * @param {*} props 
 */
export default function CarTypeSelect(props) {
  return (
    <>
      <div className="flex flex-col  text-center my-2 mt-4">
        <div className="mb-2">
          <Label
            htmlFor="carType"
            value="Car Type"
            className=""
          />
        </div>
        <TextInput
          id="carType"
          type="text"
          sizing="md"
          value={props.query.cartypeSelect}
          // Limit number of characters to 2
          onChange={(e) => {
            if (e.target.value.length > 2) {
              return;
            }
            props.setQuery((prev) => {
              const copy = { ...prev }
              copy.cartypeSelect = e.target.value;
              return copy;
            
          })}}
        />
      </div>
    </>
  )
}