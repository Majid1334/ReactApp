import { useCallback, useEffect, useRef, useState } from "react";
import { callAPI } from "../ApiCall";
import Modal from "react-bootstrap/Modal";
import { AxiosError } from "axios";
import {
  TreeViewComponent,
  type NodeSelectEventArgs,
  TreeView,
} from "@syncfusion/ej2-react-navigations";
import { FaFolder, FaRegFileAlt } from "react-icons/fa";
import type { ProcessWithExclusionModel } from "../OutgoingModels/ProcessWithExclusionModel";

interface ModalpropsType {
  PersonId: number;
  ExcludingProcessId: number;
  ExcludeProcessName: string;
  OnlyThisProcessId: number;
  show: boolean;
  title: string;
  message: string;
  modalStatusHandler: (value: boolean) => void;
  onSubmit: (value: string) => void;
  onClose: () => void;
}

const RefSubProcess = (props: ModalpropsType) => {
  if (props.show) {
    const [Modalshow, ModalsetShow] = useState<boolean>(props.show);
    const RefProcTreeviewRef: any = useRef<TreeView>(null);
    const [Procdata, setProcdata] = useState<any[]>([]);
    const [ProcessID, setProcessID] = useState<number>(
      props.ExcludingProcessId,
    );
    const onlyProcessID = useRef<number>(0);
    const selectedSubprocessName = useRef<string>("");
    const [PathDesc, setPathDesc] = useState<string>("");
    const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
    const [refTreeViewVersion, setTreeViewVersion] = useState<number>(0);
    const setShowModal = (value: boolean) => {
      ModalsetShow(value);
      props.modalStatusHandler(value);
    };
    const [ProcessesList, setProcessesList] = useState<string>("");
    const fieldSettings: object = {
      dataSource: Procdata,
      id: "ID",
      parentID: "ParentID",
      text: "ProcessName",
      hasChildren: "hasChild",
      iconCss: "iconCss",
    };

    useEffect(() => {
      const params: ProcessWithExclusionModel = {
        PersonID: props.PersonId,
        ExcludedProcessID: ProcessID,
        ExcludeSubProcessName: "",
        OnlyThisProcessID: onlyProcessID.current,
      };
      GetProcessDropDown(params);
      GetProcessTree(params);
    }, [onlyProcessID.current, refTreeViewVersion]);

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

    const GetProcessDropDown = useCallback(
      (params: ProcessWithExclusionModel) => {
        //clear list of Processes
        const ModallistOfProcesses = document.getElementById(
          "SelectProcessesID",
        ) as HTMLSelectElement;
        if (
          typeof ModallistOfProcesses !== "undefined" &&
          ModallistOfProcesses !== null
        ) {
          ModallistOfProcesses.innerHTML = "";
        }
        params.ExcludeSubProcessName = props.ExcludeProcessName;
        const ProcessApi = "Diagram/GetMyProcesses";
        const paramsInString = JSON.stringify(params);
        const paramsInJSON = JSON.parse(paramsInString);
        callAPI(ProcessApi, paramsInJSON)
          .then((response: any) => {
            let selectOption = "";
            if (response !== null && response.length > 0) {
              selectOption = '<option value="0"></option>';
              for (const i in response) {
                selectOption =
                  selectOption +
                  '<option value="' +
                  response[i].processID +
                  '">' +
                  response[i].processName +
                  "</option>";
              }
              const ModallistOfProcesses: HTMLSelectElement | null =
                document.getElementById(
                  "SelectProcessesID",
                ) as HTMLSelectElement;
              if (
                typeof ModallistOfProcesses !== "undefined" &&
                ModallistOfProcesses !== null
              ) {
                ModallistOfProcesses.innerHTML = selectOption;
                ModallistOfProcesses.value = String(response[0].ProcessID);
              }
              //set the selected workspace record to find related processes automatically
              if (ProcessesList !== null && ProcessesList !== "") {
                setProcessesList(ProcessesList);
              } else {
                setProcessesList("0");
              }
            }
          })
          .catch(() => {
            //we need to raise a proper message
          });
      },
      [ProcessesList],
    );
    const handleRefTreeNodeClick = (args: NodeSelectEventArgs) => {
      const evt = (args as any).event;
      const clickedTarget = evt?.target as HTMLElement | undefined;
      if (
        args.node.textContent &&
        clickedTarget &&
        !clickedTarget.className?.includes("e-icons ")
      ) {
        selectedSubprocessName.current = args.node.textContent;
        onlyProcessID.current = Number(
          RefProcTreeviewRef.current.selectedNodes[0],
        );
        console.log("Selected Node IDs:", onlyProcessID.current);
      }
    };
    const onClick = (_event: React.MouseEvent, processID: number) => {
      const allLinks = document.querySelectorAll(".nav-link");

      allLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
          // 1. Find the currently selected link and remove the 'selected' class
          const previouslySelected =
            document.querySelector(".nav-link.selected");
          if (previouslySelected) {
            previouslySelected.classList.remove("selected");
          }

          // 2. Add the 'selected' class to the clicked link
          (event.target as HTMLElement).classList.add("selected");

          // 3. Remove focus after the click
          (event.target as HTMLElement).blur();
        });
      });
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
            onClick={(e) => onClick(e, Number(props.processID))}
            style={
              props.refrenced ? { color: "#e74d1fff" } : { color: "black" }
            }
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
            <FaRegFileAlt
              className="node-icon"
              style={{ color: "#2c64a3ff" }}
            />
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
    const loadPage = (args: NodeSelectEventArgs) => {
      var data = RefProcTreeviewRef.current?.getTreeData(args.node);
      //let routerLink = data[0].url;
      //history.pushState(null, "", "/" + routerLink);
    };
    const setScrolls = () => {
      const MyProcessesPnl = document.getElementById("RefSubProcessModal");
      const treeviewEl = document.getElementById("treeview");
      if (MyProcessesPnl && treeviewEl) {
        treeviewEl.style.width = MyProcessesPnl.clientWidth - 30 + "px";
        treeviewEl.style.height = MyProcessesPnl.clientHeight - 100 + "px";
        treeviewEl.style.overflowY = "auto";
        treeviewEl.style.overflowX = "hidden";
      }
    };
    function returnValue() {
      const Process = document.getElementById(
        "SelectProcessesID",
      ) as HTMLSelectElement;
      setShowModal(false);
      return onlyProcessID.current + "~ " + selectedSubprocessName.current;
    }

    return (
      <>
        <div></div>
        <Modal
          show={Modalshow}
          size="lg"
          centered
          onHide={() => setShowModal(false)}
          animation={false}
          id="RefSubProcessModal"
        >
          <Modal.Header closeButton>
            <Modal.Title>{props.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb3">
              <label htmlFor="SelectProcessesID" className="form-label">
                Please select a process
              </label>
              <div className="row">
                <div className="col-6">
                  {" "}
                  Process Name
                  <div className="p-3"></div>
                  <select
                    className="form-select"
                    aria-label="Select Process"
                    id="SelectProcessesID"
                    title="Select Process"
                    value={ProcessesList}
                    onChange={(e) => {
                      setProcessesList(e.target.value);
                      onlyProcessID.current = Number(e.target.value);
                    }}
                  ></select>
                </div>

                <div className="col-6">
                  {" "}
                  Process Tree
                  <div className="p-3 border bg-light">
                    <TreeViewComponent
                      ref={RefProcTreeviewRef}
                      id="RefProcessTreeView"
                      fields={fieldSettings}
                      nodeClicked={handleRefTreeNodeClick}
                      nodeTemplate={nodeTemplate}
                      nodeSelected={loadPage}
                      selectedNodes={selectedNodes}
                      created={setScrolls}
                    ></TreeViewComponent>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => props.onSubmit(returnValue())}
            >
              Reference selected process
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </Modal.Footer>
        </Modal>
      </>
    );
  } else return <></>;
};
export default RefSubProcess;
