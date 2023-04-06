import { useState } from "react"
import Barchart from "./components/Barchart"
import data from "./components/data"

function App() {

  const [dataState, changeData] = useState(data);

  const [yearVal, changeYear] = useState(1980);
  const [value, changeValue] = useState(0);
  const [addedText, setAddedText] = useState("Submit");

  function yearInput(event) {
    changeYear(event.target.value);
    return;
  }

  function valueInput(event) {
    changeValue(event.target.value);
    return;
  }

  function submit(event) {
    event.preventDefault();
    changeData((prev) => {
      const newElem = 
      {year: yearVal, efficiency: 0, sales: value};
      const newArr = [...prev, newElem];
      return newArr;

    });
    changeYear(1980);
    changeValue(0);
    setAddedText("Added!");
    setTimeout(() => {
      setAddedText("Submit")
    }, 1000);
  }

  return (
    <>
      <h1 className='text-center text-4xl my-4'>VASTly Hyperbolical</h1>
      <div className="lg:grid lg:grid-cols-2">
        <div className="flex justify-center">
          <Barchart data={dataState} />
        </div>
        <div className="flex justify-center">
          <div className="block">
            <h2 className="text-center text-xl block mb-8 my-4">Add More Data:</h2>
            <form onSubmit={(e) => submit(e)}>
              <label className="mx-1 my-2 block">
                Year: 
                <input className="mx-1 p-2 border-2 rounded" type="number" name="year" value={yearVal} onChange={(e) => yearInput(e)} />
              </label>
              <label className="mx-1 my-2 block">
                Value: 
                <input className="mx-1 p-2 border-2 rounded" type="number" name="value" value={value} onChange={(e) => valueInput(e)} />
              </label>
              <div className="flex justify-center">
              <input className="mx-1 border rounded p-2 my-4 bg-blue-500 hover:bg-blue-600 hover:border-2 hover:shadow-xl active:bg-blue-700 text-white text-center"  type="submit" value={addedText} />
              </div>
              
            </form>
          </div>

        </div>

      </div>

    </>

  )
}

export default App
