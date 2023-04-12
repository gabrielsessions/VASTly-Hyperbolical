import { TextInput, Label } from "flowbite-react";

/**
 * DateSelect Component
 * Two text inputs where users can enter start and end dates for their query
 * @param props
 */
export default function DateSelect(props) {

  return (
    <>
      <div className="flex flex-col lg:ml-12">
        <div className="text-center">
          <div className="my-4">
            <div className="mb-2">
              <Label
                htmlFor="startDate"
                value="Start Date"
                className=""
              />
            </div>
            <TextInput
              id="startDate"
              type="text"
              sizing="md"
              value={props.query.daySelect[0]}
              onChange={(e) => props.setQuery((prev) => {
                const copy = {...prev}
                copy.daySelect[0] = e.target.value;
                return copy;
              })}
            />
          </div>
          <div className="my-4">
            <div className="mb-2 block">
              <Label
                htmlFor="endDate"
                value="End Date"
              />
            </div>
            <TextInput
              id="endDate"
              type="text"
              sizing="md"
              value={props.query.daySelect[1]}
              onChange={(e) => props.setQuery((prev) => {
                const copy = {...prev}
                copy.daySelect[1] = e.target.value;
                return copy;
              })}
            />
          </div>
        </div>
      </div>
    </>

  );
}