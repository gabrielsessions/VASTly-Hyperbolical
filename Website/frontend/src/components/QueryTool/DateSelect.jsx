import { TextInput, Label } from "flowbite-react";
import { useState } from "react";

export default function DateSelect() {

  const [dateRange, setDateRange] = useState(['05/01/2015', '05/31/2016'])

  return (
    <>
      <div className="flex flex-col ml-12">
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
              sizing="sm"
              value={dateRange[0]}
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
              sizing="sm"
              value={dateRange[1]}
            />
          </div>
        </div>
      </div>
    </>

  );
}