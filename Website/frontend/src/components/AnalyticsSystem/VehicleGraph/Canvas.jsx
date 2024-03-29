import React, { useEffect, useState } from 'react';
import ReactFlow, { Controls } from 'reactflow';

import 'reactflow/dist/style.css';
import gate_info from './gate_info';
import default_paths from './default_paths';
import edge_calculation from './edge_calculation';
import ControlButtons from './ControlButtons';
import Legend from './Legend';

const initialNodes = gate_info;
const initialEdges = default_paths;

export default function Canvas(props) {
  const [nodes, setNodes] = useState(initialNodes);
  const [defaultEdges, setDefaultEdges] = useState(initialEdges);
  const [edges, setEdges] = useState(initialEdges);

  //const [selectedEdge, setSelectedEdge] = useState("");
  const [displayText, setDisplayText] = useState(<div></div>);

  function clearDisplayText() {
    setDisplayText("");
  }

  useEffect(() => {
    clearDisplayText();
    if (props.graphQuery.sqlQuery !== "") {
      const newEdges = edge_calculation(props.graphQuery.data);
      setDefaultEdges(newEdges);
      setEdges(newEdges);
    }
    else {
      console.log("Initial!");
      setDefaultEdges(default_paths);
      setEdges(default_paths);
    }
  }, [props.graphQuery])

  const legendTypes = ["Entrance", "Gate", "General Gate", "Camping", "Ranger Stop", "Ranger Base"];
  const legendColors = ["#F8B4D9", "#84E1BC", "#F8B4B4", "#A4CAFE", "#CABFFD", "#FACA15"]

  return (
    <div style={{ width: '100vh', height: '65vh' }} >
      <ReactFlow
        fitView={true}
        nodes={nodes}
        edges={edges}
        draggable={true}
        nodesConnectable={false}
        proOptions={{ hideAttribution: true }}
        onNodeClick={(e, node) => {
          setEdges((prev) => {
            setDisplayText("")
            const newEdges = defaultEdges.filter((elem) => {
              return elem.source === node.id || elem.target === node.id
            })

            let sumOfCounts = 0;
            if (props.graphQuery.sqlQuery === "") {
              newEdges.forEach(elem => {
                sumOfCounts += elem.count;
              });
            }
            else {
              sumOfCounts = [];
              newEdges.forEach(elem => {
                sumOfCounts.push(elem.count);
              })
            }

            console.log(sumOfCounts);


            setDisplayText(
              <div>
                <p>{node.id}</p>
                {
                  props.graphQuery.sqlQuery === "" || props.graphQuery.sqlQuery === " " ?
                    <p># of Vehicles: {sumOfCounts}</p> :
                    sumOfCounts.map((elem, i) => {
                      const timestamp = new Date(elem);
                      return (<p key={i}>{timestamp.toLocaleTimeString()}</p>)
                    })
                }

              </div>
            );

            return newEdges;
          })
        }}
        onNodeDoubleClick={() => {
          setDisplayText("")
          setEdges(defaultEdges)
        }}
        onEdgeClick={(e, edge) => {
          setDisplayText(
            <div>
              <p>{edge.source} to</p>
              <p>{edge.target}</p>

              {
                defaultEdges == initialEdges ?
                  <div>
                    <p># of Vehicles: {edge.count}</p>
                  </div>
                  :
                <div />
                  

                  

              }

            </div>
          );
        }}
      >


        <div className='p-2 mt-4'>
          {<Legend data={legendTypes} colors={(i) => legendColors[i]} />}
          {
            displayText !== "" ?
              <div className='absolute top-2 right-0 xl:right-6 p-1 border-2 border-gray-500 max-w-fit rounded'>
                <div className='flex justify-center'>
                  {displayText}
                </div>

              </div>
              :
              <div />
          }



        </div>
        {
          <ControlButtons
            reset={() => {
              //props.clearGraphQuery();
              setEdges(initialEdges);
              setDefaultEdges(initialEdges)
              setDisplayText("");
            }}
          />
        }
      </ReactFlow>
    </div>
  );
}