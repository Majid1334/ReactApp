import React, { useRef, useState } from "react";
import {
  Inject,
  SymbolPaletteComponent,
  DataBinding,
  BpmnDiagrams,
  UndoRedo,
  DiagramContextMenu,
  NodeConstraints,
  type PointPortModel,
  PortVisibility,
} from "@syncfusion/ej2-react-diagrams";
import Draggable from "react-draggable";
import { BPMNsymbols } from "./bpmnShapes";

const MoveableSymbolPalette: React.FC = React.memo(() => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [divPosition, setDivPosition] = useState({ top: 50, left: 10 });
  const symbolPaletteRef = React.useRef<any>(null);
  const MAX_HEIGHT = 500;
  const ports: PointPortModel[] = [
    // Top and Bottom
    {
      id: "topPort",
      offset: { x: 0.5, y: 0 },
      visibility: PortVisibility.Connect,
    },
    {
      id: "bottomPort",
      offset: { x: 0.5, y: 1 },
      visibility: PortVisibility.Connect,
    },

    // Left (Top and Bottom)
    {
      id: "leftTopPort",
      offset: { x: 0, y: 0.3 },
      visibility: PortVisibility.Connect,
    },
    {
      id: "leftBottomPort",
      offset: { x: 0, y: 0.7 },
      visibility: PortVisibility.Connect,
    },

    // Right (Top and Bottom)
    {
      id: "rightTopPort",
      offset: { x: 1, y: 0.3 },
      visibility: PortVisibility.Connect,
    },
    {
      id: "rightBottomPort",
      offset: { x: 1, y: 0.7 },
      visibility: PortVisibility.Connect,
    },
  ];
  const adjustPaletteHeight = () => {
    const comp = symbolPaletteRef.current;
    if (!comp || !comp.element) return;
    const el = comp.element;
    el.style.height = "auto";
    const natural = el.scrollHeight || el.getBoundingClientRect().height || 0;
    const clamped = Math.min(MAX_HEIGHT, Math.round(natural));
    comp.height = clamped;
  };
  const onPaletteExpanding = () => {
    requestAnimationFrame(() =>
      requestAnimationFrame(() => adjustPaletteHeight()),
    );
  };
  function setConnectorStyles(connector: any, color: string) {
    connector.style.strokeWidth = 1;
    connector.style.strokeColor = color;
    connector.targetDecorator.style.fill = color;
    connector.targetDecorator.style.strokeColor = color;
  }
  function getNodeDefaults(node: any) {
    //ignore remove inconnect and outconnect for Lane node
    if (node && node.shape && !node.isLane) {
      node.constraints =
        node.constraints &
        ~(NodeConstraints.InConnect | NodeConstraints.OutConnect);
      node.ports = ports;
    }

    return node;
  }
  function getConnectorDefaults(connector: any) {
    if (
      connector.id.indexOf("straight") !== -1 ||
      connector.id.indexOf("straightdashed") !== -1
    ) {
      connector.type = "Straight";
    } else {
      connector.type = "Orthogonal";
    }
    setConnectorStyles(connector, "#717171");
    return connector;
  }
  const symbolMargin = { left: 5, right: 5, top: 5, bottom: 5 };
  return (
    <Draggable nodeRef={nodeRef} handle=".palette-header">
      <div
        ref={nodeRef}
        className="draggable-container"
        style={{
          position: "absolute", // Or 'relative', 'fixed', 'sticky' as needed
          top: `${divPosition.top}px`,
          left: `${divPosition.left}px`,
        }}
      >
        <div
          id="palette-headerDiv"
          className="palette-header vertical-text"
          role="button"
          aria-label="Drag symbol palette"
          style={{ cursor: "move", fontSize: "12px" }}
        >
          Drag Me
        </div>
        <div className="palette-content">
          <SymbolPaletteComponent
            ref={symbolPaletteRef}
            id="symbolpalette"
            width="190px"
            height="500px"
            expandMode="Multiple"
            allowDrag
            enableSearch={true}
            paletteExpanding={onPaletteExpanding}
            palettes={BPMNsymbols}
            symbolMargin={symbolMargin}
            getConnectorDefaults={getConnectorDefaults}
            getNodeDefaults={getNodeDefaults}
          >
            <Inject
              services={[
                BpmnDiagrams,
                UndoRedo,
                DiagramContextMenu,
                DataBinding,
              ]}
            />
          </SymbolPaletteComponent>
        </div>
      </div>
    </Draggable>
  );
});

export default MoveableSymbolPalette;
