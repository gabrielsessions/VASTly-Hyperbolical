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
      setDefaultEdges(initialEdges);
      setEdges(initialEdges);
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
            const newEdges = defaultEdges.filter((elem) => {
              return elem.source === node.id || elem.target === node.id
            })

            let sumOfCounts = 0;
            newEdges.forEach(elem => {
              sumOfCounts += elem.count;
            });

            setDisplayText(
              <div>
                <p>{node.id}</p>
                <p># of Vehicles: {sumOfCounts}</p>
              </div>
            );

            return newEdges;
          })
        }}
        onNodeDoubleClick={() => setEdges(defaultEdges)}
        onEdgeClick={(e, edge) => {
          setDisplayText(
            <div>
              <p>{edge.source} to</p>
              <p className='mb-2'>{edge.target}</p>
              <p># of Vehicles: {edge.count}</p>
            </div>
          );
        }}
      >


        <div className='p-2 mt-4'>
          {<Legend data={legendTypes} colors={(i) => legendColors[i]} />}
          {
            displayText !== "" ?
              <div className='absolute top-2 right-0 xl:right-6 p-1 border-2 border-gray-500 max-w-fit rounded'>
                <div className='2xl:hidden flex justify-center'>
                  {displayText}
                </div>
                
              </div>
            :
              <div />
          }



        </div>
        {/*
        <ControlButtons
          reset={() => {
            setEdges(defaultEdges);
            setDisplayText("");
          }}
        />
        */}
      </ReactFlow>
    </div>
  );
}