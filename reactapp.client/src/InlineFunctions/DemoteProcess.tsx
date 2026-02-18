import { useCallback, useEffect, useState } from "react";
import { callAPI } from "../ApiCall";
import Modal from "react-bootstrap/Modal";
import type { ProcessWithExclusionModel } from "../OutgoingModels/ProcessWithExclusionModel";

interface ModalpropsType {
  PersonId: number;
  show: boolean;
  PathDesc: string;
  title: string;
  message: string;
  modalStatusHandler: (value: boolean) => void;
  onSubmit: (value: string) => void;
  onClose: () => void;
}

const DemoteProcess = (props: ModalpropsType) => {
  if (props.show) {
    const [Modalshow, ModalsetShow] = useState<boolean>(props.show);
    const setShowModal = (value: boolean) => {
      ModalsetShow(value);
      props.modalStatusHandler(value);
    };
    const [ModalProcessID, ModalsetProcessId] = useState<string>("");
    const GetProcessDropDown = useCallback(
      (PersonID: number) => {
        //clear list of Processes
        const ModallistOfProcesses = document.getElementById(
          "ModalProcessid",
        ) as HTMLSelectElement;
        if (
          typeof ModallistOfProcesses !== "undefined" &&
          ModallistOfProcesses !== null
        ) {
          ModallistOfProcesses.innerHTML = "";
        }
        //to make it possible " if (processId !== processIdRef.current){}" works correctly
        const ProcessApi = "Diagram/GetMyProcesses";
        const stopString = "-gtgt";
        const stopIndex = props.PathDesc
          ? props.PathDesc.indexOf(stopString)
          : -1;
        let pathDesc: string;
        if (stopIndex > -1) {
          pathDesc = props.PathDesc.substring(0, stopIndex);
        } else {
          pathDesc = props.PathDesc;
        }
        const params: ProcessWithExclusionModel = {
          PersonID: props.PersonId,
          ExcludedProcessID: 0,
          ExcludeSubProcessName: pathDesc,
          OnlyThisProcessID: 0,
        };
        const param: { PersonID: number } = { PersonID: PersonID };
        const paramsInString = JSON.stringify(params);
        const paramsInJSON = JSON.parse(paramsInString);
        callAPI(ProcessApi, paramsInJSON)
          .then((response: any) => {
            let selectOption = "";
            if (response !== null && response.length > 0) {
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
                document.getElementById("ModalProcessid") as HTMLSelectElement;
              if (
                typeof ModallistOfProcesses !== "undefined" &&
                ModallistOfProcesses !== null
              ) {
                ModallistOfProcesses.innerHTML = selectOption;
                ModallistOfProcesses.value = String(response[0].ProcessID);
              }
              //set the selected workspace record to find related processes automatically
              if (ModalProcessID !== null && ModalProcessID !== "") {
                ModalsetProcessId(ModalProcessID);
              } else {
                ModalsetProcessId(String(response[0].processID));
              }
            }
          })
          .catch(() => {
            //we need to raise a proper message
          });
      },
      [ModalProcessID],
    );

    function returnValue() {
      const Process = document.getElementById(
        "ModalProcessid",
      ) as HTMLSelectElement;
      setShowModal(false);
      return ModalProcessID + "~ " + Process[Process.selectedIndex].textContent;
    }

    useEffect(() => {
      //finding Processes based on the received userID
      GetProcessDropDown(props.PersonId);
    }, [props.PersonId]);

    return (
      <>
        <div></div>
        <Modal
          show={Modalshow}
          size="lg"
          centered
          onHide={() => setShowModal(false)}
          animation={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Please select a process</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb3">
              <label htmlFor="ModalProcessid" className="form-label">
                Process
              </label>
              <select
                className="form-select"
                aria-label="Select Process"
                id="ModalProcessid"
                title="Select Process"
                value={ModalProcessID}
                onChange={(e) => {
                  ModalsetProcessId(e.target.value);
                }}
              ></select>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => props.onSubmit(returnValue())}
            >
              Demote selected process
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
export default DemoteProcess;
