import React from 'react';
import ReactFlow from 'reactflow';

import 'reactflow/dist/style.css';
import gate_info from './gate_info';
import default_paths from './default_paths';

/*
let initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
  { id: '3', position: { x: 0, y: 150 }, data: { label: 'Stuff' } },
];
*/

const initialNodes = gate_info;
const initialEdges = default_paths;
//const initialEdges = [{ id: 'e1-2', source: 'gate1', target: 'gate2', animated: true, style:{strokeWidth:3}}];

export default function DemoFlow() {
  const defaultViewport = { x: 200, y: 80, zoom: 0.5 };
  return (
    <div style={{ width: '100vh', height: '65vh' }}>
      <ReactFlow defaultViewport={defaultViewport} nodes={initialNodes} edges={initialEdges} proOptions={{ hideAttribution: true }} />
    </div>
  );
}