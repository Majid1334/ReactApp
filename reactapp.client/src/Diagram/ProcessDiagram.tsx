import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { createPortal } from "react-dom";
import {
  type AnnotationModel,
  DiagramComponent,
  Inject,
  HierarchicalTree,
  MindMap,
  RadialTree,
  ComplexHierarchicalTree,
  DataBinding,
  Snapping,
  PrintAndExport,
  BpmnDiagrams,
  SymmetricLayout,
  ConnectorBridging,
  UndoRedo,
  LayoutAnimation,
  DiagramContextMenu,
  ConnectorEditing,
  Ej1Serialization,
  DiagramTools,
  SelectorConstraints,
  SymbolPalette,
  NodeConstraints,
  type UserHandleEventsArgs,
  type ICollectionChangeEventArgs,
  type FileFormats,
  type IExportOptions,
  type NodeModel,
  type DiagramEventDropObject,
} from "@syncfusion/ej2-react-diagrams";

import { UserHandles } from "./UserHandles";
import { HandelsOnlyDetailInfo } from "./HandelsOnlyDetailInfo";
import {
  ToolbarComponent,
  ItemsDirective,
  ItemDirective,
  type ClickEventArgs,
} from "@syncfusion/ej2-react-navigations";
import {
  DropDownButtonComponent,
  type ItemModel,
  type MenuEventArgs,
} from "@syncfusion/ej2-react-splitbuttons";
import { CheckBoxComponent } from "@syncfusion/ej2-react-buttons";
import MoveableSymbolPalette from "./MoveableSymbolPalette";
import { type CreateSubProcessModel } from "../OutgoingModels/CreateSubProcessModel";
import "@syncfusion/ej2-icons/styles/material.css";
import "@syncfusion/ej2-icons/styles/bootstrap5.css";
import { type UpdDiagramModel } from "../OutgoingModels/UpdDiagramModel";
import "../App.css";
import callAPI from "../ApiCall";
import Dexie from "dexie";
import ConfirmationModal from "../IncomingModels/ConfirmationModel";
import DemoteProcess from "../InlineFunctions/DemoteProcess";
import RefSubProcesses from "../InlineFunctions/RefSubProcess";
import NodeDetailInfo from "../InlineFunctions/NodeDetailInfo";
Dexie.debug = false;

interface deleteAndPromoteSubProcess {
  Promote: number;
  ProcessID: number;
  SubProcessName: string;
  DiagramContent: string;
  DiagramImage: string;
}

interface DemotingProcess {
  ProcessID: number;
  DemotingProcessID: number;
  OldName: string;
  DemotingName: string;
  DiagramContent: string;
  DiagramImage: string;
}
interface ReferencedSubProcess {
  ProcessID: number;
  ReferencedProcessID: number;
  ReferencedName: string;
  SelectedSubProcessName: string;
  DiagramContent: string;
  DiagramImage: string;
}
interface ProcessDiagramProps {
  ProcessID: number;
  PathDesc: string;
  showModal: boolean;
}
export function ProcessDiagram(props: ProcessDiagramProps) {
  const [ProcessID, setProcessID] = useState<number>(props.ProcessID);
  const diagramRef = useRef<DiagramComponent>(null);
  const [KeyForDiagram, setKeyForDiagram] = useState<number>(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [selectedNodeName, setSelectedNodeName] = useState<string>("");
  const [selectedNodeDesc, setSelectedNodeDesc] = useState<string>("");
  const newSubProcessRef = useRef<boolean>(false);
  const subNameChangedRef = useRef<boolean>(false);
  const newSubProcNameRef = useRef<string>("");
  const oldSubProcNameRef = useRef<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [DiagramInMemory, setDiagramInMemory] = useState<string | null>(null);
  const checkBoxRef = useRef<CheckBoxComponent>(null);
  const [promoteSubProcess, setPromoteSubProcess] = useState<boolean>(false);
  const [demoteSubProcess, setDemoteSubProcess] = useState<boolean>(false);
  const [showReferenceToSubProcess, setShowReferenceToSubProcess] =
    useState<boolean>(false);

  const [showDetailInfoModal, setShowDetailInfoModal] = useState(false);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [showDemotionModal, setShowDemotionModal] = useState(false);
  const [showReferenceModal, setShowReferenceModal] = useState(false);

  const deleteAndPromoteSubProcess = useRef<deleteAndPromoteSubProcess>({
    Promote: 0,
    ProcessID: 0,
    SubProcessName: "",
    DiagramContent: "",
    DiagramImage: "",
  });
  const ReferencedSubProcess = useRef<ReferencedSubProcess>({
    ProcessID: ProcessID,
    ReferencedProcessID: 0,
    ReferencedName: "",
    SelectedSubProcessName: "",
    DiagramContent: "",
    DiagramImage: "",
  });
  const demoteAndRenameSubProcess = useRef<DemotingProcess>({
    ProcessID: 0,
    DemotingProcessID: 0,
    OldName: "",
    DemotingName: "",
    DiagramContent: "",
    DiagramImage: "",
  });
  const renderComplete = () => {
    diagramRef.current?.fitToPage();
  };
  const rulerSettings = {};
  const pageSettings = {};
  const exportItems: ItemModel[] = [
    { text: "JPG" },
    { text: "PNG" },
    { text: "SVG" },
  ];

  const loadItems: ItemModel[] = [
    { text: "Memory" },
    { text: "Local" },
    { text: "Database" },
  ];

  const SaveDiagramInMemory = () => {
    setDiagramInMemory(diagramRef.current?.saveDiagram() ?? null);
  };

  const renderExportDropdown = () => (
    <DropDownButtonComponent
      id="exportDropdownbtn_diagram"
      items={exportItems}
      iconCss="e-icons e-medium e-export"
      content="Export&nbsp;"
      select={handlePrintOption}
    />
  );
  const handleLoadSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = event.target.value;
    setSelectedOption(value);
    if (fileInputRef.current) {
      fileInputRef.current?.click();
    }
  };
  const handleSaveSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = event.target.value;
    setSelectedOption(value);
    if (fileInputRef.current) {
      fileInputRef.current?.click();
    }
  };
  const renderSaveDropdown = () => (
    <DropDownButtonComponent
      id="loadDropdownbtn_diagram"
      items={loadItems}
      iconCss="e-icons e-medium e-save"
      content="Save&nbsp;"
      select={handleSaveOption}
      onChange={handleSaveSelectChange}
    />
  );

  const renderLoadDropdown = () => (
    <DropDownButtonComponent
      id="loadDropdownbtn_diagram"
      items={loadItems}
      iconCss="e-icons e-medium e-import"
      content="Load&nbsp;"
      select={handleLoadOption}
      onChange={handleLoadSelectChange}
    />
  );
  const saveDiagramLocally = () => {
    const diagramData = diagramRef.current?.saveDiagram();
    if (diagramData) {
      const blob = new Blob([diagramData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "diagram.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };
  const renderMultiPageCheckbox = () => (
    <CheckBoxComponent
      id="checkBox1"
      checked={false}
      ref={checkBoxRef}
      label="Multiplepage print"
    />
  );
  const handlePrintOption = (args: MenuEventArgs) => {
    const options: IExportOptions = {
      format: args.item.text as FileFormats,
      mode: "Download",
      region: "PageSettings",
      multiplePage: checkBoxRef.current?.checked ?? false,
      fileName: "Export",
      margin: { left: 0, top: 0, bottom: 0, right: 0 },
    };
    diagramRef.current?.exportDiagram(options);
  };
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      file
        .text()
        .then((text) => {
          diagramRef.current?.loadDiagram(text);
        })
        .catch((err) => {
          console.error("Failed to read diagram file:", err);
        });
    }
  };
  const handleToolbarClick = (args: ClickEventArgs) => {
    if (args.item.text === "Print") {
      const options: IExportOptions = {
        mode: "Data",
        region: "PageSettings",
        multiplePage: checkBoxRef.current?.checked ?? false,
        margin: { left: 0, top: 0, bottom: 0, right: 0 },
      };
      diagramRef.current?.print(options);
    }
  };
  const handleSaveOption = (args: MenuEventArgs) => {
    switch (args.item.text) {
      case "Memory":
        SaveDiagramInMemory();
        break;
      case "Local":
        saveDiagramLocally();
        break;
      case "Database":
        const Params: UpdDiagramModel = {
          ProcessID: ProcessID,
          DiagramContent: diagramRef.current?.saveDiagram() ?? "",
          DiagramImage:
            diagramRef.current
              ?.exportDiagram({ format: "SVG", mode: "Data" })
              .toString() ?? "",
        };
        UpdateDiagram(Params);
        break;
    }
  };
  const handleLoadOption = (args: MenuEventArgs) => {
    switch (args.item.text) {
      case "Memory":
        diagramRef.current?.loadDiagram(DiagramInMemory ?? "");
        break;
      case "Local":
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
          fileInputRef.current.click();
        }
        break;
      case "Database":
        GetDiagram(ProcessID);
        break;
    }
  };
  const onMouseClick = (event: MouseEvent) => {
    const diagramCanvas = document.getElementById(
      diagramRef.current?.element?.id + "content",
    );
    if (
      diagramRef.current &&
      diagramCanvas &&
      diagramRef.current.tool === DiagramTools.ZoomPan &&
      (event.target as HTMLElement).id !== "diagram_diagramLayer_svg" &&
      (diagramRef.current.selectedItems?.nodes?.length ?? 0) > 0
    ) {
      diagramRef.current.clearSelection();
    }
  };
  const onLoad = (args: any) => {
    const ProcessDiagramPnl = document.getElementById("ProcessDiagramPnl");
    const diagramEl = document.getElementById("ProcessDiagram");
    const symbolpaletteEl = document.getElementById("symbolpalette");
    if (ProcessDiagramPnl && diagramEl) {
      diagramEl.style.cursor = "default";
      diagramEl.style.width = ProcessDiagramPnl.clientWidth + "px";
      diagramEl.style.height = ProcessDiagramPnl.clientHeight - 30 + "px";
      symbolpaletteEl!.style.height =
        ProcessDiagramPnl.clientHeight - 30 + "px";
    }
    renderComplete();
  };
  const handleDoubleClick = (args: any) => {
    const actual = args?.actualObject as NodeModel | undefined;
    if (
      actual &&
      Array.isArray(actual.annotations) &&
      actual.annotations.length > 0
    ) {
      if (diagramRef.current) {
        (diagramRef.current as any).startLabelEdit(actual);
      }
    }
  };

  function isSubProcessShape(shape: any): boolean {
    if (
      shape &&
      shape.type === "Bpmn" &&
      shape.shape === "Activity" &&
      shape.activity.activity === "SubProcess"
    ) {
      return true;
    }
    return false;
  }

  const UpdateDiagram = useCallback((Params: UpdDiagramModel) => {
    const ApiPath = "/Diagram/UpdtDiagram";
    const paramsInString = JSON.stringify(Params);
    const paramsInJSON = JSON.parse(paramsInString);
    callAPI(ApiPath, paramsInJSON)
      .then((response) => {
        if (response === true && response.length > 0) {
          alert("Diagram updated successfully");
        }
        if (response === false || response === null || response.length === 0) {
          alert(
            "SubProcess could not be updated. It may be referenced by other processes." +
              Params.ProcessID,
          );
        }
      })
      .catch(() => {
        console.error("Error updating diagram ProcessID = " + Params.ProcessID);
      });
  }, []);

  const GetDiagram = useCallback((ProcessID: number) => {
    const ApiPath = "/Diagram/GetDiagramContent";
    const param: any = { ProcessID: ProcessID };
    callAPI(ApiPath, param)
      .then((response) => {
        if (response !== null && response.length > 0) {
          diagramRef.current?.loadDiagram(response[0].diagramContent);
          setProcessID(response[0].actualProcessID);
        }
        if (response === false || response === null || response.length === 0) {
          alert("No diagram content found for ProcessID = " + ProcessID);
        }
      })
      .catch(() => {
        console.error(
          "Error fetching diagram content ProcessID = " + ProcessID,
        );
      });
  }, []);
  const CreateSubprocess = useCallback((Params: CreateSubProcessModel) => {
    const ApiPath = "/Diagram/CreateSubProcess";
    const paramsInString = JSON.stringify(Params);
    const paramsInJSON = JSON.parse(paramsInString);
    callAPI(ApiPath, paramsInJSON)
      .then((response) => {
        if (response === true) {
          alert("SubProcess created successfully");
        } else {
          alert(
            "SubProcess could not be created. It may be referenced by other processes." +
              Params.ProcessName,
          );
        }
      })
      .catch(() => {
        console.error("Error creating SubProcess " + Params.ProcessName);
        //we need to raise a proper message
      });
  }, []);
  const DeleteSubprocess = useCallback(() => {
    const ApiPath = "/Diagram/DeleteSubProcess";
    const paramsInString = JSON.stringify(deleteAndPromoteSubProcess.current);
    const paramsInJSON = JSON.parse(paramsInString);
    callAPI(ApiPath, paramsInJSON)
      .then((response) => {
        if (response === true) {
          alert(
            "SubProcess is " +
              (deleteAndPromoteSubProcess.current.Promote === 0
                ? "deleted successfully"
                : "promoted successfully"),
          );
          //GetDiagram(ProcessID);
        } else {
          alert(
            "SubProcess could not be " +
              (deleteAndPromoteSubProcess.current.Promote === 0
                ? "deleted"
                : "promoted" + ". It may be referenced by other processes.") +
              deleteAndPromoteSubProcess.current.SubProcessName,
          );
        }
      })
      .catch(() => {
        console.error(
          "Error " +
            (deleteAndPromoteSubProcess.current.Promote === 0
              ? "deleting"
              : "promoting") +
            " SubProcess " +
            deleteAndPromoteSubProcess.current.SubProcessName,
        );
      })
      .finally(() => {
        setPromoteSubProcess(false);
        deleteAndPromoteSubProcess.current = {
          Promote: 0,
          ProcessID: 0,
          SubProcessName: "",
          DiagramContent: "",
          DiagramImage: "",
        };
      });
  }, []);

  const handleDrop = (args: DiagramEventDropObject) => {
    const droppedNode = (args as any).element as NodeModel;
    const targetNode = (args as any).target as NodeModel;
    if (droppedNode && droppedNode.shape) {
      droppedNode.height = 50;
      droppedNode.width = 100;
      const shape = droppedNode.shape as any;
      (droppedNode as any).userHandles = [];
      if (isSubProcessShape(shape)) {
        console.log("Subprocess shape dropped:", droppedNode);
        const label = "Sub" + Math.floor(Math.random() * 1000);
        if (!droppedNode.annotations || droppedNode.annotations.length === 0) {
          droppedNode.annotations = [{ content: label } as any];
        }
        droppedNode.annotations[0].content = label;
        diagramRef.current?.dataBind();
        newSubProcessRef.current = true;
      }
    }
  };
  const RefProcess = useCallback(() => {
    const ApiPath = "/Diagram/ReferencedSubProcesses";
    if (diagramRef.current) {
      diagramRef.current?.dataBind();
      const dr = diagramRef.current;
      ReferencedSubProcess.current.SelectedSubProcessName =
        dr.selectedItems.nodes?.[0].annotations?.[0].content ?? "";
      ReferencedSubProcess.current.DiagramContent = dr.saveDiagram() ?? "";
    }
    const paramsInString = JSON.stringify(ReferencedSubProcess.current);
    const paramsInJSON = JSON.parse(paramsInString);
    callAPI(ApiPath, paramsInJSON)
      .then((response) => {
        if (response === true) {
          alert(
            "Process '" +
              ReferencedSubProcess.current.ReferencedName +
              "' Referenced successfully",
          );
          if (diagramRef.current) {
            diagramRef.current.clearSelection();
          }
        }
        if (response === false) {
          alert(
            "Process '" +
              ReferencedSubProcess.current.ReferencedName +
              "' could not be referenced",
          );
        }
      })
      .catch(() => {
        diagramRef.current?.loadDiagram(DiagramInMemory ?? "");
        console.error(
          "Error: in '" +
            ReferencedSubProcess.current.ReferencedName +
            "' referencing ",
        );
      })
      .finally(() => {
        ReferencedSubProcess.current = {
          ProcessID: 0,
          ReferencedProcessID: 0,
          ReferencedName: "",
          SelectedSubProcessName: "",
          DiagramContent: "",
          DiagramImage: "",
        };
      });
  }, []);
  const demoteProcess = useCallback(() => {
    const ApiPath = "/Diagram/DemoteProcesses";
    if (diagramRef.current) {
      diagramRef.current?.dataBind();
      const dr = diagramRef.current;
      demoteAndRenameSubProcess.current.DiagramContent = dr.saveDiagram() ?? "";
      demoteAndRenameSubProcess.current.DiagramImage =
        dr?.exportDiagram({ format: "SVG", mode: "Data" }).toString() ?? "";
    }
    const paramsInString = JSON.stringify(demoteAndRenameSubProcess.current);
    const paramsInJSON = JSON.parse(paramsInString);
    callAPI(ApiPath, paramsInJSON)
      .then((response) => {
        if (response === true) {
          if (diagramRef.current) {
            diagramRef.current.clearSelection();
          }
          alert(
            "Process " +
              demoteAndRenameSubProcess.current.DemotingName +
              (demoteAndRenameSubProcess.current.DemotingProcessID === 0
                ? " renamed "
                : "demoted ") +
              "successfully",
          );
        }
        if (response === false) {
          alert(
            "Process could not be " +
              (demoteAndRenameSubProcess.current.DemotingProcessID === 0
                ? " renamed "
                : " demoted ") +
              demoteAndRenameSubProcess.current.DemotingName,
          );
        }
      })
      .catch(() => {
        diagramRef.current?.loadDiagram(DiagramInMemory ?? "");
        console.error(
          "Error: in " +
            (demoteAndRenameSubProcess.current.DemotingProcessID === 0
              ? "renaming "
              : "demoting ") +
            "Process " +
            demoteAndRenameSubProcess.current.DemotingName,
        );
        //we need to raise a proper message
      })
      .finally(() => {
        demoteAndRenameSubProcess.current = {
          ProcessID: 0,
          DemotingProcessID: 0,
          OldName: "",
          DemotingName: "",
          DiagramContent: "",
          DiagramImage: "",
        };
        // setKeyForDiagram((prevKey) => prevKey + 1);
        // GetDiagram(ProcessID);
      });
  }, []);
  const selectionChange = (args: any) => {
    const dr = diagramRef.current;
    if (!dr) return;
    setPromoteSubProcess(false);
    setDemoteSubProcess(false);
    setShowReferenceToSubProcess(false);
    if (args.state === "Changed") {
      const isNodeSelected = (dr.selectedItems?.nodes?.length ?? 0) > 0;
      if (dr.selectedItems?.nodes) {
        const selectedNode = dr.selectedItems.nodes[0] as NodeModel | undefined;
        if (selectedNode) {
          if (isSubProcessShape(selectedNode.shape)) {
            if (isNodeSelected) {
              dr.selectedItems.constraints =
                SelectorConstraints.All | SelectorConstraints.UserHandle;
              dr.selectedItems.userHandles = UserHandles;
            } else {
              dr.selectedItems.constraints =
                SelectorConstraints.All & ~SelectorConstraints.UserHandle;
              dr.selectedItems.userHandles = [];
            }
          } else if (
            selectedNode.shape &&
            ((selectedNode.shape as any).type === "SwimLane" ||
              (selectedNode.shape as any).type === "Basic")
          ) {
            dr.selectedItems.userHandles = [];
          } else {
            args.newValue.forEach((obj: any) => {
              if (obj && ("sourceID" in obj || "targetID" in obj)) {
                dr.selectedItems.constraints =
                  SelectorConstraints.All & SelectorConstraints.UserHandle;
                dr.selectedItems.userHandles = [];
              } else if (
                selectedNode.shape &&
                ((selectedNode.shape as any).type === "SwimLane" ||
                  (selectedNode.shape as any).type === "Basic")
              ) {
                dr.selectedItems.userHandles = [];
              } else {
                dr.selectedItems.constraints =
                  SelectorConstraints.All & SelectorConstraints.UserHandle;
                dr.selectedItems.userHandles = HandelsOnlyDetailInfo;
              }
            });
          }
        } else {
          dr.selectedItems.constraints =
            SelectorConstraints.All & ~SelectorConstraints.UserHandle;
          dr.selectedItems.userHandles = [];
        }
      }
      dr.dataBind();
    }
    if (args.state === "Changed" && args.type === "Addition") {
      const actualNode = args.newValue[0] as NodeModel | undefined;
      if (
        actualNode &&
        Array.isArray(actualNode.annotations) &&
        actualNode.annotations.length > 0 &&
        newSubProcessRef.current
      ) {
        if (
          actualNode.shape &&
          ((actualNode.shape as any).type === "SwimLane" ||
            (actualNode.shape as any).type === "Basic")
        ) {
          dr.selectedItems.userHandles = [];
        } else if (isSubProcessShape(actualNode.shape)) {
          const label = String(actualNode.annotations[0].content ?? "");
          const diagramContent = dr.saveDiagram() ?? "";
          const diagramImage =
            dr?.exportDiagram({ format: "SVG", mode: "Data" }).toString() ?? "";
          const Params: CreateSubProcessModel = {
            ParentID: ProcessID,
            ReferencedTo: 0,
            ProcessName: label,
            DiagramContent: diagramContent,
            DiagramImage: diagramImage,
          };
          CreateSubprocess(Params);
          newSubProcessRef.current = false;
        }
      }
    }
    if (args.state === "Changed" && args.type === "Removal") {
      const actualNode = args.oldValue[0] as NodeModel | undefined;
      if (
        actualNode &&
        isSubProcessShape(actualNode.shape) &&
        Array.isArray(actualNode.annotations) &&
        actualNode.annotations.length > 0 &&
        subNameChangedRef.current
      ) {
        console.log(
          `Node name changed! Old name: "${oldSubProcNameRef.current}", New name: "${newSubProcNameRef.current}"`,
        );
        //changing the name of SubProcess is also happening in Demote process,
        // so if we have one transaction block for changing Subprocess name,
        // then first changing the name is firering and then it will be demoting the process
        // this will broke the atomicity of the transaction in demoting.
        // in API backend we need to handle this as a single transaction,
        // it means we to continue demoting process if the DemotingProcessID is not 0,
        // this way we can handle Name change and demoting in one transaction
        demoteAndRenameSubProcess.current = {
          ProcessID: ProcessID,
          DemotingProcessID:
            demoteAndRenameSubProcess.current.DemotingProcessID,
          OldName: oldSubProcNameRef.current,
          DemotingName: newSubProcNameRef.current,
          DiagramContent: dr.saveDiagram() ?? "",
          DiagramImage:
            dr?.exportDiagram({ format: "SVG", mode: "Data" }).toString() ?? "",
        };
        demoteProcess();
        subNameChangedRef.current = false;
      }
    }
  };
  const collectionChange = (args: ICollectionChangeEventArgs) => {
    if (args.state === "Changed" && args.type === "Removal") {
      const element = args.element as any;
      if (
        element &&
        (element.id !== undefined ||
          element.shape !== undefined ||
          element.offsetX !== undefined)
      ) {
        const deletedNode = args.element as NodeModel;
        if (
          deletedNode &&
          deletedNode.shape &&
          isSubProcessShape(deletedNode.shape)
        ) {
          diagramRef.current?.dataBind();
          deleteAndPromoteSubProcess.current = {
            Promote: deleteAndPromoteSubProcess.current.Promote,
            ProcessID: ProcessID,
            SubProcessName: String(deletedNode.annotations?.[0]?.content ?? ""),
            DiagramContent: diagramRef.current?.saveDiagram() ?? "",
            DiagramImage:
              diagramRef.current
                ?.exportDiagram({ format: "SVG", mode: "Data" })
                .toString() ?? "",
          };
          DeleteSubprocess();
          console.log(
            "Node " +
              (deleteAndPromoteSubProcess.current.Promote === 0
                ? "  renamed "
                : " promoted ") +
              "to " +
              String(deletedNode.annotations?.[0]?.content ?? ""),
          );
        }
      }
    }
    if (args.state === "Changed" && args.type === "Addition") {
      const element = args.element as any;
      if (
        element &&
        (element.id !== undefined || element.shape !== undefined)
      ) {
        const DroppedNode = args.element as NodeModel;
        if (
          DroppedNode &&
          DroppedNode.shape &&
          ((DroppedNode.shape as any).type === "SwimLane" ||
            (DroppedNode.shape as any).type === "Basic") &&
          diagramRef.current
        ) {
          diagramRef.current.selectedItems.userHandles = [];
        }
      }
    }
    if (args.state === "Changed" && args.type === "Removal") {
      const element = args.element as any;
      if (
        element &&
        (element.id !== undefined ||
          element.shape !== undefined ||
          element.offsetX !== undefined)
      ) {
        const deletedNode = args.element as NodeModel;
        if (
          deletedNode &&
          deletedNode.shape &&
          isSubProcessShape(deletedNode.shape)
        ) {
        }
      }
    }
  };
  const PropertyChange = (args: any) => {
    if (
      args.element &&
      args.element.shape &&
      args.element.propName === "nodes" &&
      isSubProcessShape(args.element.shape) &&
      args.element.properties.annotations.length > 0
    ) {
      if (
        args.oldValue &&
        args.newValue &&
        args.oldValue.annotations &&
        args.newValue.annotations
      ) {
        let oldName = args.oldValue.annotations[0]?.content.toString();
        let newName = args.newValue.annotations[0]?.content.toString();
        if (oldName !== newName) {
          subNameChangedRef.current = true;
          newSubProcNameRef.current = newName ?? "";
          oldSubProcNameRef.current = oldName ?? "";
        }
      }
    }
  };
  useEffect(() => {
    GetDiagram(ProcessID);
    if (diagramRef.current) {
      diagramRef.current.selectedItems = {
        nodes: [],
        connectors: [],
        userHandles: UserHandles,
        constraints: SelectorConstraints.UserHandle,
      };
    }
  }, [ProcessID, ReferencedSubProcess]);

  const handleUserHandleMouseDown = (args: UserHandleEventsArgs) => {
    if (
      args.element &&
      (args.element.name === "PromoteProcess" ||
        args.element.name === "DemoteProcess" ||
        args.element.name === "ReferenceTo" ||
        args.element.name === "DetailInfo") &&
      diagramRef.current?.selectedItems.nodes
    ) {
      const selectedElement = diagramRef.current?.selectedItems.nodes[0] as
        | NodeModel
        | undefined;
      if (selectedElement) {
        if (args.element.name === "DetailInfo") {
          setShowDetailInfoModal(true);
          setSelectedNodeName(
            String(selectedElement.annotations?.[0]?.content ?? ""),
          );
          setSelectedNodeDesc(
            ((selectedElement.addInfo as any)?.description ?? "") as string,
          );

          console.log(
            "Detail Information: " + args.element.name,
            selectedElement,
          );
        } else if (args.element.name === "ReferenceTo") {
          setShowReferenceToSubProcess(true);
          setShowReferenceModal(true);
          setSelectedNodeName(
            String(selectedElement.annotations?.[0]?.content ?? ""),
          );
          setSelectedNodeDesc(
            ((selectedElement.addInfo as any)?.description ?? "") as string,
          );
          console.log(
            "Subprocess referenced: " + args.element.name,
            selectedElement,
          );
        } else if (args.element.name === "PromoteProcess") {
          setPromoteSubProcess(true);
          setShowPromotionModal(true);
          setSelectedNodeName(
            String(selectedElement.annotations?.[0]?.content ?? ""),
          );
          setSelectedNodeDesc(
            ((selectedElement.addInfo as any)?.description ?? "") as string,
          );
          console.log(
            "Subprocess shape cloned: " + args.element.name,
            selectedElement,
          );
        } else if (args.element.name === "DemoteProcess") {
          setDemoteSubProcess(true);
          setShowDemotionModal(true);
          setSelectedNodeName(
            String(selectedElement.annotations?.[0]?.content ?? ""),
          );
          setSelectedNodeDesc(
            ((selectedElement.addInfo as any)?.description ?? "") as string,
          );
          console.log(
            "Subprocess shape cloned: " + args.element.name,
            selectedElement,
          );
        }
        //        }
      } else {
        setShowDetailInfoModal(false);
        setPromoteSubProcess(false);
        setDemoteSubProcess(false);
        setShowReferenceToSubProcess(false);
        setShowPromotionModal(false);
        setShowDemotionModal(false);
        setShowReferenceModal(false);
      }
    }
  };
  const onUserHandleMouseEnter = (args: UserHandleEventsArgs) => {
    if (args.element) {
      args.element.pathColor = "red";
      args.element.backgroundColor = "pink";
    }
  };
  const removeSelectedNode = () => {
    const selectedNode = diagramRef.current?.selectedItems?.nodes?.[0] as
      | NodeModel
      | undefined;
    if (selectedNode) {
      diagramRef.current?.remove(selectedNode);
      diagramRef.current?.dataBind();
    }
  };
  const handlePromoteSubProcess = () => {
    SaveDiagramInMemory();
    deleteAndPromoteSubProcess.current.Promote = 1;
    removeSelectedNode();
    setPromoteSubProcess(false);
  };
  const handleDetailInfo = (detailInfoResponse: string) => {
    const splitArray = detailInfoResponse.split("~").map((s) => s.trim());
    const selectedNode = diagramRef.current?.selectedItems
      ?.nodes?.[0] as NodeModel;

    if (selectedNode) {
      if (!selectedNode.annotations || selectedNode.annotations.length === 0) {
        const newNodeAnnotation: AnnotationModel = {
          id: splitArray[0],
          content: splitArray[0],
        };
        selectedNode.annotations = [newNodeAnnotation];
        diagramRef.current?.addLabels(selectedNode, [newNodeAnnotation]);
      } else {
        selectedNode.annotations[0].content = splitArray[0];
      }
      selectedNode.addInfo = {
        description: splitArray[1].toString(),
      };
      diagramRef.current?.dataBind();
    }
    SaveDiagramInMemory();
  };
  const handleDemoteSubProcess = (demoteprocess: string) => {
    SaveDiagramInMemory();
    const splitArray = demoteprocess.split("~").map((s) => s.trim());
    demoteAndRenameSubProcess.current.DemotingName = splitArray[1];
    const selectedNode = diagramRef.current?.selectedItems?.nodes?.[0] as
      | NodeModel
      | undefined;
    if (selectedNode && isSubProcessShape(selectedNode.shape)) {
      demoteAndRenameSubProcess.current.ProcessID = ProcessID;
      demoteAndRenameSubProcess.current.OldName = String(
        selectedNode.annotations?.[0]?.content ?? "",
      );
      demoteAndRenameSubProcess.current.DemotingProcessID =
        splitArray[0] as unknown as number;
      if (!selectedNode.annotations) {
        selectedNode.annotations = [
          { content: demoteAndRenameSubProcess.current.DemotingName } as any,
        ];
      } else if (selectedNode.annotations.length === 0) {
        selectedNode.annotations.push({
          content: demoteAndRenameSubProcess.current.DemotingName,
        } as any);
      } else {
        selectedNode.annotations[0].content =
          demoteAndRenameSubProcess.current.DemotingName;
      }
      diagramRef.current?.dataBind();
    }
    setDemoteSubProcess(false);
  };
  const handleReferenceSubProcess = (ReferenceProcess: string) => {
    SaveDiagramInMemory();
    const splitArray = ReferenceProcess.split("~").map((s) => s.trim());
    ReferencedSubProcess.current.ProcessID = ProcessID;
    ReferencedSubProcess.current.ReferencedName = splitArray[1];
    ReferencedSubProcess.current.ReferencedProcessID =
      splitArray[0] as unknown as number;
    RefProcess();
    setShowReferenceToSubProcess(false);
  };
  const handleExcludeProcess = (): string => {
    const excludeProcess = props.PathDesc.split("-gtgt").map((s) => s.trim());
    return excludeProcess.length > 0 ? excludeProcess[0] : "";
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
  return (
    <>
      {showPromotionModal &&
        createPortal(
          <ConfirmationModal
            show={promoteSubProcess}
            title="Promote Subprocess"
            message="Are you sure you want to promote this subprocess?"
            onConfirm={handlePromoteSubProcess}
            onCancel={() => setPromoteSubProcess(false)}
          />,
          document.body,
        )}
      {showDemotionModal &&
        createPortal(
          <DemoteProcess
            PersonId={1}
            show={demoteSubProcess}
            PathDesc={props.PathDesc}
            title="Demote Subprocess"
            message="Are you sure you want to demote this subprocess?"
            modalStatusHandler={setDemoteSubProcess}
            onSubmit={handleDemoteSubProcess}
            onClose={() => setDemoteSubProcess(false)}
          />,
          document.body,
        )}
      {showReferenceModal &&
        createPortal(
          <RefSubProcesses
            PersonId={1}
            ExcludingProcessId={ProcessID}
            ExcludeProcessName={handleExcludeProcess()}
            OnlyThisProcessId={0}
            show={showReferenceToSubProcess}
            title="Reference Subprocess to a Subprocess in other Processes"
            message="Are you sure you want to reference this subprocess?"
            modalStatusHandler={setShowReferenceToSubProcess}
            onSubmit={handleReferenceSubProcess}
            onClose={() => setShowReferenceToSubProcess(false)}
          />,
          document.body,
        )}
      {showDetailInfoModal &&
        createPortal(
          <NodeDetailInfo
            NodeName={selectedNodeName}
            NodeDescription={selectedNodeDesc}
            show={showDetailInfoModal}
            title="Detail Information"
            message="This module is not yet implemented"
            modalStatusHandler={setShowDetailInfoModal}
            onSubmit={handleDetailInfo}
            onClose={() => setShowDetailInfoModal(false)}
          />,
          document.body,
        )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept=".json"
      />
      <div id="ProcessDiagramPnl" style={{ display: "flex", height: "500px" }}>
        <div id="diagramContainerDiv" style={{ flex: 1 }}>
          <ToolbarComponent id="toolbar_diagram" clicked={handleToolbarClick}>
            <ItemsDirective>
              <ItemDirective
                type="Input"
                text="Load"
                template={renderLoadDropdown}
              />
              <ItemDirective
                type="Input"
                text="Export"
                template={renderExportDropdown}
              />
              <ItemDirective
                type="Input"
                text="Save"
                template={renderSaveDropdown}
              />
              <ItemDirective
                type="Button"
                text="Print"
                prefixIcon="e-diagram-icons e-diagram-print e-icons e-medium e-print"
              />
              <ItemDirective type="Input" template={renderMultiPageCheckbox} />
            </ItemsDirective>
          </ToolbarComponent>
          <DiagramComponent
            id="ProcessDiagram"
            width={"100%"}
            height={"100%"}
            ref={diagramRef}
            rulerSettings={rulerSettings}
            pageSettings={pageSettings}
            tool={DiagramTools.Default}
            created={onLoad}
            drop={handleDrop}
            doubleClick={handleDoubleClick}
            selectionChange={selectionChange}
            propertyChange={PropertyChange}
            collectionChange={collectionChange}
            click={onMouseClick}
            selectedItems={{
              userHandles: UserHandles,
              constraints: SelectorConstraints.UserHandle,
            }}
            key={KeyForDiagram}
            onUserHandleMouseDown={handleUserHandleMouseDown}
            onUserHandleMouseEnter={onUserHandleMouseEnter}
            getNodeDefaults={getNodeDefaults}
            getConnectorDefaults={getConnectorDefaults}
          >
            <Inject
              services={[
                BpmnDiagrams,
                HierarchicalTree,
                MindMap,
                RadialTree,
                ComplexHierarchicalTree,
                DataBinding,
                Snapping,
                PrintAndExport,
                SymmetricLayout,
                ConnectorBridging,
                UndoRedo,
                LayoutAnimation,
                DiagramContextMenu,
                ConnectorEditing,
                Ej1Serialization,
                SymbolPalette,
                BpmnDiagrams,
              ]}
            />
          </DiagramComponent>
          <MoveableSymbolPalette />
        </div>
      </div>
    </>
  );
}

export default ProcessDiagram;
