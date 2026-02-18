import { useEffect, useState, useRef, useCallback } from "react";
import { callAPI } from "../ApiCall";
import { AxiosError } from "axios";
import type { ClickEventArgs } from "@syncfusion/ej2-react-navigations";
import type { CustomToolbarItemModel } from "@syncfusion/ej2-react-documenteditor";
import {
  TreeViewComponent,
  type NodeSelectEventArgs,
  TreeView,
  ToolbarComponent,
} from "@syncfusion/ej2-react-navigations";
import { FaFolder, FaRegFileAlt } from "react-icons/fa";
import { createPortal } from "react-dom";
import ProcessDetailForm from "../InlineFunctions/ProcessDetailForm";
import type { ProcessWithExclusionModel } from "../OutgoingModels/ProcessWithExclusionModel.tsx";

export function MyProcesses(PersonId: number) {
  const [keyForDiagram, setKeyForDiagram] = useState(0);

  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [Procdata, setProcdata] = useState<any[]>([]);
  const [ProcessID, setProcessID] = useState<number>(0);
  const [PathDesc, setPathDesc] = useState<string>("");
  const treeviewRef: any = useRef<TreeView>(null);
  const [treeViewVersion, setTreeViewVersion] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState(false);
  const fieldSettings: object = {
    dataSource: Procdata,
    id: "ID",
    parentID: "ParentID",
    text: "ProcessName",
    hasChildren: "hasChild",
    iconCss: "iconCss",
  };
  function handleButtonClick() {
    setModalOpen(false);
    setKeyForDiagram((prevKey) => prevKey + 1);
    setTreeViewVersion((prevKey) => prevKey + 1);
  }
  const handleTreeNodeClick = (args: NodeSelectEventArgs) => {
    const evt = (args as any).event;
    const clickedTarget = evt?.target as HTMLElement | undefined;
    if (
      args.node.textContent &&
      clickedTarget &&
      !clickedTarget.className?.includes("e-icons ")
    ) {
      const selectedIds = treeviewRef.current.selectedNodes;
      setProcessID(selectedIds[0]);
      if (selectedIds && selectedIds.length > 0) {
        for (let i = 0; i < treeviewRef.current.DDTTreeData.length; i++) {
          const node = treeviewRef.current.DDTTreeData[i];
          if (selectedIds == node.ID.toString()) {
            setPathDesc(node.PathDesc);
            if (node.ReferencedTo > 0) {
              setProcessID(node.ReferencedTo);
              setTreeViewVersion(treeViewVersion + 1);
              setKeyForDiagram((prevKey) => prevKey + 1);
            }
          }
        }
        setModalOpen(true);
        console.log("Selected Node IDs:", ProcessID);
      }
      setSelectedNodes([]);
    }
  };

  const GetProcessTree = useCallback((Params: ProcessWithExclusionModel) => {
    const ProcessApi = "Diagram/GetProcessTree/";
    const paramsInString = JSON.stringify(Params);
    const paramsInJSON = JSON.parse(paramsInString);
    callAPI(ProcessApi, paramsInJSON)
      .then((response: any) => {
        if (response != null && response !== undefined) {
          const data = Array.isArray(response) ? response[0] : response;
          const jsonData = JSON.parse(data) as any[];
          setProcdata(jsonData);
        }
      })
      .catch((error: AxiosError) => {
        console.error(`Error: ${error.message}`);
      });
  }, []);

  useEffect(() => {
    const params: ProcessWithExclusionModel = {
      PersonID: PersonId,
      ExcludeSubProcessName: "",
      ExcludedProcessID: 0,
      OnlyThisProcessID: 0,
    };
    GetProcessTree(params);
  }, [treeViewVersion, modalOpen, keyForDiagram]);

  // Define the onClick handler
  const onClick = (_event: React.MouseEvent) => {
    const allLinks = document.querySelectorAll(".nav-link");

    allLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        const previouslySelected = document.querySelector(".nav-link.selected");
        if (previouslySelected) {
          previouslySelected.classList.remove("selected");
        }
        (event.target as HTMLElement).classList.add("selected");
        (event.target as HTMLElement).blur();
      });
    });
    setSelectedNodes([]);
  };

  const ProchyperLinkTemplate = (props: {
    processName: string;
    processID: string;
    refrenced: boolean;
  }) => {
    return (
      <>
        <a
          type="button"
          href="#"
          key={props.processID}
          onClick={(e) => onClick(e)}
          style={props.refrenced ? { color: "#e74d1fff" } : { color: "black" }}
        >
          {props.processName}
        </a>
      </>
    );
  };

  const nodeTemplate = (data: any) => {
    return (
      <div>
        {data.type === "folder" ? (
          <FaFolder className="node-icon" style={{ color: "#e6d46dff" }} />
        ) : (
          <FaRegFileAlt className="node-icon" style={{ color: "#2c64a3ff" }} />
        )}
        &nbsp;
        <span className="node-text">
          <ProchyperLinkTemplate
            processName={data.ProcessName}
            processID={data.ID.toString()}
            refrenced={
              data.ReferencedTo && data.ReferencedTo > 0 ? true : false
            }
          />
        </span>
      </div>
    );
  };
  const onToolbarClick = (args: ClickEventArgs): void => {
    switch (args.item.id) {
      case "AddProcess": {
        setProcessID(0);
        setModalOpen(true);
        setTreeViewVersion((prevKey) => prevKey + 1);
        setKeyForDiagram((prevKey) => prevKey + 1);
        break;
      }
      case "PDF": {
        if (treeviewRef.current) {
          //Implement PDF export functionality
        }
        break;
      }
      case "Word": {
        if (treeviewRef.current) {
          //Implement Word export functionality
        }
        break;
      }
      case "DeletePanel": {
        //Implement Delete Panel functionality
        break;
      }

      default:
        break;
    }
  };

  const toolItemExportToExcel: CustomToolbarItemModel = {
    prefixIcon: "e-save icon",
    tooltipText: "Save",
    text: "Save",
    id: "Word",
    cssClass: "customToolbarbutton",
  };

  const toolItemExportToPDF: CustomToolbarItemModel = {
    prefixIcon: "e-export-pdf icon",
    tooltipText: "PDF Export",
    text: "PDF Export",
    id: "PDF",
    cssClass: "customToolbarbutton",
  };

  const diagramDialog: CustomToolbarItemModel = {
    prefixIcon: "bi bi-diagram-2",
    tooltipText: "click to open dialog",
    text: "Add Process",
    id: "AddProcess",
    cssClass: "customToolbarbutton",
  };
  const deletePanel: CustomToolbarItemModel = {
    prefixIcon: "bi bi-x-square",
    tooltipText: "click to delete panel",
    text: "Delete Panel",
    id: "DeletePanel",
    cssClass: "customToolbarbutton",
  };
  const items = [
    deletePanel,
    toolItemExportToExcel,
    toolItemExportToPDF,
    diagramDialog,
  ];

  const setScrolls = () => {
    const MyProcessesPnl = document.getElementById("MyProcessesPnl");
    const treeviewEl = document.getElementById("treeview");
    if (MyProcessesPnl && treeviewEl) {
      treeviewEl.style.width = MyProcessesPnl.clientWidth - 30 + "px";
      treeviewEl.style.height = MyProcessesPnl.clientHeight - 100 + "px";
      treeviewEl.style.overflowY = "auto";
      treeviewEl.style.overflowX = "hidden";
    }
  };
  const checkDiagramInstance = () => {
    const diagraminstance = document.getElementById("ProcessDiagram");
    if (diagraminstance) {
      diagraminstance.innerHTML = "";
    }
  };
  return (
    <>
      {!modalOpen ? checkDiagramInstance() : null}
      {modalOpen &&
        createPortal(
          <ProcessDetailForm
            ProcessID={ProcessID}
            showModal={modalOpen}
            PathDesc={PathDesc}
            keyForDiagram={keyForDiagram}
            modalStatusHandler={setModalOpen}
            onSubmit={handleButtonClick}
          ></ProcessDetailForm>,
          document.body,
        )}
      <ToolbarComponent
        id="toolbar"
        clicked={onToolbarClick}
        items={items}
      ></ToolbarComponent>
      <TreeViewComponent
        ref={treeviewRef}
        id="treeview"
        fields={fieldSettings}
        nodeClicked={handleTreeNodeClick}
        nodeTemplate={nodeTemplate}
        selectedNodes={selectedNodes}
        created={setScrolls}
        key={keyForDiagram}
      ></TreeViewComponent>
    </>
  );
}

export default MyProcesses;
