import {
  type NodeModel,
  type ConnectorModel,
  PortVisibility,
  type PointPortModel,
} from "@syncfusion/ej2-react-diagrams";

export function mapBpmnToSyncfusion(json: any) {
  const process = json.process;
  const pool = process.pool;

  // Layout configuration
  const laneHeight = 100;
  const nodeWidth = 100;
  const nodeHeight = 50;
  const horizontalSpacing = 120;
  const headerHeight = 50;

  // Calculate swimlane size
  const maxElementsInLane = Math.max(
    ...pool.lanes.map((lane: any) => lane.elements.length),
    1,
  );

  const swimlaneWidth = maxElementsInLane * horizontalSpacing + 100;
  const swimlaneHeight = pool.lanes.length * laneHeight + headerHeight;

  const swimlaneStartX = swimlaneWidth / 2;
  const swimlaneStartY = swimlaneHeight / 2;

  // Swimlane root node
  const swimlaneNode: NodeModel = {
    id: pool.id,
    width: swimlaneWidth,
    height: swimlaneHeight,
    offsetX: swimlaneStartX,
    offsetY: swimlaneStartY,
    shape: {
      type: "SwimLane",
      header: {
        annotation: { content: pool.name },
        height: headerHeight,
      },
      lanes: [],
    },
  };

  const nodes: NodeModel[] = [];
  const connectors: ConnectorModel[] = [];
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
  // Build lanes + child nodes properly
  for (let laneIndex = 0; laneIndex < pool.lanes.length; laneIndex++) {
    const lane = pool.lanes[laneIndex];

    const laneChildren: NodeModel[] = [];

    for (
      let elementIndex = 0;
      elementIndex < lane.elements.length;
      elementIndex++
    ) {
      const el = lane.elements[elementIndex];

      const childNode: NodeModel = {
        id: el.id,

        annotations: [{ content: el.name }],
        width: nodeWidth,
        height: nodeHeight,
        // use margin instead of offset
        margin: {
          left: 80 + elementIndex * horizontalSpacing,
          top: (laneHeight - nodeHeight) / 2,
        },
        shape: mapBpmnShape(el.type) as any,
        ports: ports, // Add ports to each child node
      };

      laneChildren.push(childNode);
      nodes.push(swimlaneNode);
    }

    const laneObj: any = {
      id: lane.id,
      header: { annotation: { content: lane.name } },
      height: laneHeight,
      children: laneChildren, //  correct placement
    };

    (swimlaneNode.shape as any).lanes.push(laneObj);
  }

  //  Connectors (works with lane children)
  for (const flow of process.sequenceFlows) {
    connectors.push({
      id: `conn_${flow.from}_${flow.to}`,
      sourceID: flow.from,
      targetID: flow.to,
      type: "Orthogonal",
      shape: {
        type: "Bpmn",
        flow: "Sequence", // Sets the type of BPMN flow
      },
      annotations: flow.condition ? [{ content: flow.condition }] : [],
    });
  }

  return {
    nodes, // only swimlane node
    connectors,
  };
}

function mapBpmnShape(type: string) {
  if (type === "bpmn:StartEvent") {
    return { type: "Bpmn", shape: "Event", event: { event: "Start" } };
  } else if (type === "bpmn:EndEvent") {
    return { type: "Bpmn", shape: "Event", event: { event: "End" } };
  } else if (type === "bpmn:ExclusiveGateway") {
    return {
      type: "Bpmn",
      shape: "Gateway",
      gateway: { gateway: "Exclusive" },
    };
  }
  return { type: "Bpmn", shape: "Activity" };
}
