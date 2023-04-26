import TextInputFilter from "./TextInputFilter";

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
            <TextInputFilter
              label={"Start Date"}
              value={props.query.daySelect[0]}
              onChange={(e) => props.setQuery((prev) => {
                const copy = { ...prev }
                copy.daySelect[0] = e.target.value;
                return copy;
              })}
            />
          </div>
          <div className="my-4">
            <TextInputFilter
              label={"End Date"}
              value={props.query.daySelect[1]}
              onChange={(e) => props.setQuery((prev) => {
                const copy = { ...prev }
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