import Canvas from "./VehicleGraph/Canvas"

export default function VehicleMap(props) {
  return (
    <div>
      <Canvas graphQuery={props.graphQuery} executeQuery={props.executeQuery} />
    </div>
  )

}