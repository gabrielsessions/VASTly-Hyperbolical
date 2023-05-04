import React, { useEffect, useState } from 'react';
import ReactFlow, {Controls} from 'reactflow';

import 'reactflow/dist/style.css';
import gate_info from './gate_info';
import default_paths from './default_paths';
import edge_calculation from './edge_calculation';

import TooltipNode from './TooltipNode';

const initialNodes = gate_info;
const initialEdges = default_paths;
const nodeTypes = {
  tooltip: TooltipNode,
};

export default function Canvas(props) {
  const [nodes, setNodes] = useState(initialNodes);
  const [defaultEdges, setDefaultEdges] = useState(initialEdges);
  const [edges, setEdges] = useState(initialEdges);

  useEffect(() => {
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

  return (
    <div style={{ width: '100vh', height: '65vh' }}>
      <ReactFlow fitView={true} nodes={nodes} edges={edges} proOptions={{ hideAttribution: true }} nodeTypes={nodeTypes} onNodeClick={(e, node) => {
        setEdges((prev) => {
          return prev.filter((elem) => {
            return elem.source === node.id || elem.target === node.id
          })
        })
      }}
      onNodeDoubleClick={() => setEdges(defaultEdges)}>
        <Controls />
        <div className='p-1'>
          <p className='text-pink-500'>Entrance</p>
          <p className='text-green-500'>Gate</p>
          <p className='text-red-500'>General Gate</p>
          <p className='text-blue-500'>Camping</p>
          <p className='text-purple-500'>Ranger Stop</p>
          <p className='text-yellow-300'>Ranger Base</p>
        </div>
      </ReactFlow>
    </div>
  );
}