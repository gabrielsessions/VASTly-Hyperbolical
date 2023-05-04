import { memo, useState } from 'react';
import { Handle, Position, NodeToolbar } from 'reactflow';

const TooltipNode = ({ data }) => {
  const [isVisible, setVisible] = useState(false);

  return (
    <div onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
      <NodeToolbar isVisible={isVisible} position={data.toolbarPosition}>
        <div>{data.tooltip}</div>
      </NodeToolbar>
      <div style={{ padding: 20 }}>{data.label}</div>
    </div>
  );
};

export default memo(TooltipNode);
