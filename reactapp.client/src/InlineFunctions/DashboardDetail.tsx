import { useEffect, useState } from "react";

import Modal from "react-bootstrap/Modal";

interface ModalpropsType {
  UserPanels: string[];
  showModal: boolean;
  modalStatusHandler: (value: boolean) => void;
}

const DashboardModal = (props: ModalpropsType) => {
  const [ModalPanelId, ModalsetPanelId] = useState<string>("");
  const [ModalshowModal, ModalsetShowModal] = useState<boolean>(
    props.showModal,
  );

  const setShowModal = (value: boolean) => {
    ModalsetShowModal(value);
    props.modalStatusHandler(value);
  };

  const setPanelOptions = (userPanels: string[]) => {
    const ListOfPanels = [
      { ID: "MyProcessesPnl", Name: "My Processes" },
      { ID: "ProcessNavigationPnl", Name: "Process Navigation" },
      { ID: "OrganizationPnl", Name: "Organization Chart" },
    ];
    let selectOption = "<option value=''></option>";
    let flag: boolean = false;
    if (userPanels.length > 0) {
      for (let i = 0; i < ListOfPanels.length; i++) {
        flag = false;
        for (let j = 0; j < userPanels.length; j++) {
          if (ListOfPanels[i].ID === userPanels[j]) {
            flag = true;
            break;
          }
        }
        if (!flag) {
          selectOption =
            selectOption +
            '<option value="' +
            ListOfPanels[i].ID +
            '">' +
            ListOfPanels[i].Name +
            "</option>";
        }
      }
      const ModallistOfActivities = document.getElementById(
        "PanelsListID",
      ) as HTMLSelectElement;
      if (
        typeof ModallistOfActivities !== "undefined" &&
        ModallistOfActivities !== null
      ) {
        ModallistOfActivities.innerHTML = selectOption;
      }
    }
  };

  useEffect(() => {
    setPanelOptions(props.UserPanels);
  }, [props.UserPanels]);

  function returnValue() {
    return ModalPanelId;
  }

  return (
    <>
      <div></div>
      <Modal
        show={ModalshowModal}
        size="lg"
        centered
        onHide={() => setShowModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Please select a panel</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <label htmlFor="PanelsList" className="form-label">
              Panels
            </label>
            <select
              className="form-select"
              aria-label="Select workspace"
              id="PanelsListID"
              title="Select Panel"
              onChange={(e) => {
                ModalsetPanelId(e.target.value);
              }}
            ></select>
          </div>
        </Modal.Body>
        <Modal.Footer>
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
};
export default DashboardModal;
