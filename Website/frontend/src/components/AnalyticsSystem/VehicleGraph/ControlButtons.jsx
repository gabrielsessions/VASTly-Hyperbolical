import { Controls, ControlButton } from "reactflow";

export default function ControlButtons(props) {
  return (
    <Controls>
      <ControlButton onClick={() => props.reset()} title="action">
      <span>&#x21bb;</span>
      </ControlButton>
    </Controls>
  );
}

