//Initialize bpmn shapes for symbol palette.
import { type PaletteModel } from "@syncfusion/ej2-react-diagrams";

export const BPMNsymbols: PaletteModel[] = [
  {
    id: "flow",
    expanded: true,
    title: "Flow Shapes",
    symbols: [
      {
        id: "Terminator",
        addInfo: { tooltip: "Terminator" },
        width: 30,
        height: 40,
        shape: { type: "Flow", shape: "Terminator" },
      },
      {
        id: "Process",
        addInfo: { tooltip: "Process" },
        width: 30,
        height: 40,
        shape: { type: "Flow", shape: "Process" },
      },
      {
        id: "Document",
        addInfo: { tooltip: "Document" },
        width: 30,
        height: 30,
        shape: { type: "Flow", shape: "Document" },
      },
      {
        id: "PreDefinedProcess",
        addInfo: { tooltip: "Predefined process" },
        width: 30,
        height: 30,
        shape: { type: "Flow", shape: "PreDefinedProcess" },
      },
      {
        id: "data",
        width: 30,
        height: 30,
        addInfo: { tooltip: "Data" },
        shape: { type: "Flow", shape: "Data" },
      },
      {
        id: "Decision",
        addInfo: { tooltip: "Decision" },
        width: 35,
        height: 35,
        shape: { type: "Flow", shape: "Decision" },
      },
    ],
  },
  {
    id: "swimlaneShapes",
    expanded: true,
    title: "Swimlane Shapes",
    symbols: [
      {
        id: "Horizontalswimlane",
        addInfo: { tooltip: "Horizontal swimlane" },
        shape: {
          type: "SwimLane",
          lanes: [
            {
              id: "lane1",
              height: 40,
              width: 100,
              header: { width: 50, height: 50, style: { fontSize: 11 } },
            },
          ],
          orientation: "Horizontal",
          isLane: true,
        },
        height: 30,
        width: 90,
        offsetX: 35,
        offsetY: 15,
      },
      {
        id: "Verticalswimlane",
        addInfo: { tooltip: "Vertical swimlane" },
        shape: {
          type: "SwimLane",
          lanes: [
            {
              id: "lane1",
              height: 100,
              width: 40,
              header: { width: 50, height: 50, style: { fontSize: 11 } },
            },
          ],
          orientation: "Vertical",
          isLane: true,
        },
        height: 90,
        width: 30,
        offsetX: 35,
        offsetY: 10,
      },
      {
        id: "verticalPhase",
        addInfo: { tooltip: "Vertical phase" },
        shape: {
          type: "SwimLane",
          phases: [{ style: { strokeWidth: 1, strokeDashArray: "3,3" } }],
          annotations: [{ text: "" }],
          orientation: "Vertical",
          isPhase: true,
        },
        height: 30,
        width: 60,
      },
      {
        id: "horizontalPhase",
        addInfo: { tooltip: "Horizontal phase" },
        shape: {
          type: "SwimLane",
          phases: [{ style: { strokeWidth: 1, strokeDashArray: "3,3" } }],
          annotations: [{ text: "" }],
          orientation: "Horizontal",
          isPhase: true,
        },
        height: 30,
        width: 60,
      },
    ],
  },
  {
    id: "bpmnshapes",
    expanded: true,
    title: "BPMN Shapes",
    symbols: [
      {
        id: "Task",
        width: 35,
        height: 30,
        shape: {
          type: "Bpmn",
          shape: "Activity",
          activity: {
            activity: "Task",
          },
        },
      },
      {
        id: "Start",
        width: 35,
        height: 35,
        shape: {
          type: "Bpmn",
          shape: "Event",
          event: { event: "Start" },
        },
      },
      {
        id: "NonInterruptingIntermediate",
        width: 35,
        height: 35,
        shape: {
          type: "Bpmn",
          shape: "Event",
          event: { event: "NonInterruptingIntermediate" },
        },
      },
      {
        id: "End",
        width: 35,
        height: 35,
        shape: {
          type: "Bpmn",
          shape: "Event",
          event: { event: "End" },
        },
      },
      {
        id: "Transaction",
        width: 35,
        height: 35,
        shape: {
          type: "Bpmn",
          shape: "Activity",
          activity: {
            activity: "SubProcess",
            subProcess: {
              type: "Transaction",
              transaction: {
                cancel: { visible: false },
                failure: { visible: false },
                success: { visible: false },
              },
            },
          },
        },
      },
      {
        id: "Task_Service",
        width: 35,
        height: 35,
        shape: {
          type: "Bpmn",
          shape: "Activity",
          activity: {
            activity: "Task",
            task: { type: "Service" },
          },
        },
      },
      {
        id: "Gateway",
        width: 35,
        height: 35,
        shape: {
          type: "Bpmn",
          shape: "Gateway",
          gateway: { type: "Exclusive" },
        },
      },
      {
        id: "DataObject",
        width: 35,
        height: 35,
        shape: {
          type: "Bpmn",
          shape: "DataObject",
          dataObject: { collection: false, type: "None" },
        },
      },
    ],
  },
  {
    id: "connectors",
    expanded: true,
    symbols: [
      {
        id: "orthogonal",
        type: "Orthogonal",
        sourcePoint: { x: 0, y: 0 },
        targetPoint: { x: 40, y: 40 },
      },
      {
        id: "Orthogonaldashed",
        type: "Orthogonal",
        sourcePoint: { x: 0, y: 0 },
        targetPoint: { x: 40, y: 40 },
        style: { strokeDashArray: "4 4" },
      },
      {
        id: "straight",
        type: "Straight",
        sourcePoint: { x: 0, y: 0 },
        targetPoint: { x: 40, y: 40 },
      },
      {
        id: "straightdashed",
        type: "Straight",
        sourcePoint: { x: 0, y: 0 },
        targetPoint: { x: 40, y: 40 },
        style: { strokeDashArray: "4 4" },
      },
    ],
    title: "Connectors",
  },
];
