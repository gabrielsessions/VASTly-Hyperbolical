/**
 * Attributes component
 * A vertical set of checkboxes to select which columns to display
 * @param {*} props  
 */
export default function Attributes(props) {

  // Flips the selection boolean of an attribute when it's clicked
  const checkboxClick = (sqlName, newState) => {
    props.setQuery((prev) => {
      // Make a copy of the previous query object
      const queryCopy = {...prev};
      
      // Find position of the clicked attribute in the attribute array
      const selectAttributeIndex = queryCopy.attributes.findIndex((elem) => {
        return elem.sqlName === sqlName;
      });

      // Flip the state (can't flip previous value because of weird React behavior)
      queryCopy.attributes[selectAttributeIndex].selected = 
      newState;

      // Return the result
      return queryCopy
    });
  }
  

  return (
    <div className="block lg:mr-12 -mb-2">
      <h3 className="mb-4 font-semibold text-gray-900 dark:text-white block text-center">Attributes</h3>
      <ul className="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
        {/* Display attributes present in the attributes array as checkboxes */}
        {
          props.query.attributes.map((elem, index) => {
            return (
              <li key={index} class="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600" >
                <div class="flex items-center pl-3">
                  <input id={elem.sqlName + " checkbox"} type="checkbox"
                    checked={elem.checked} value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" onChange={() => checkboxClick(elem.sqlName, !elem.selected)} />
                  <label htmlFor={elem.sqlName + " checkbox"} className="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{elem.displayName}</label>
                </div>
              </li>
            )
          })
        }
      </ul>
    </div>
  )

}