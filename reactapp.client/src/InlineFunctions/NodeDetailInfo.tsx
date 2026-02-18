import { useEffect, useRef, useState } from "react";

import Modal from "react-bootstrap/Modal";

interface ModalpropsType {
  NodeName: string;
  NodeDescription: string;
  show: boolean;
  title: string;
  message: string;
  modalStatusHandler: (value: boolean) => void;
  onSubmit: (value: string) => void;
  onClose: () => void;
}

const NodeDetailInfo = (props: ModalpropsType) => {
  if (props.show) {
    const [Modalshow, ModalsetShow] = useState<boolean>(props.show);
    const [nodeName, setNodeName] = useState<string>(props.NodeName);
    const [nodeDescription, setNodeDescription] = useState<string>(
      props.NodeDescription,
    );
    const setShowModal = (value: boolean) => {
      ModalsetShow(value);
      props.modalStatusHandler(value);
    };

    useEffect(() => {
      ModalsetShow(props.show);
    }, [props.show]);

    function returnValue() {
      const NodeName = document.getElementById("NodeName") as HTMLInputElement;
      const NodeDescription = document.getElementById(
        "NodeDescription",
      ) as HTMLTextAreaElement;
      setShowModal(false);
      return NodeName.value + "~ " + NodeDescription.value;
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
              <div className="row"></div>
              <div className="row">
                <label htmlFor="NodeName" className="form-label">
                  Node Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="NodeName"
                  value={nodeName}
                  onChange={(e) => setNodeName(e.target.value)}
                />
              </div>
              <div className="row">
                <label htmlFor="NodeDescription" className="form-label">
                  Node Description
                </label>
                <textarea
                  rows={4}
                  cols={50}
                  className="form-control"
                  id="NodeDescription"
                  value={nodeDescription}
                  onChange={(e) => setNodeDescription(e.target.value)}
                />
              </div>
              <div className="row">
                <div className="col-6">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => props.onSubmit(returnValue())}
                  >
                    Save Name / Description
                  </button>
                </div>
                <div className="col-6 text-end">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
              <div
                className="row"
                style={{ marginTop: "1rem", fontWeight: "bold" }}
              >
                Detail information for Selected Node
              </div>
              <div className="row">
                <div className="left-aligned-text">
                  <a
                    href="#"
                    className="btn btn-link"
                    onClick={() => alert("This module is not implemented")}
                  >
                    Inputs
                  </a>
                </div>
              </div>
              <div className="row">
                <div className="left-aligned-text">
                  <a
                    href="#"
                    className="btn btn-link"
                    onClick={() => alert("This module is not implemented")}
                  >
                    Outputs
                  </a>
                </div>
              </div>
              <div className="row">
                <div className="left-aligned-text">
                  <a
                    href="#"
                    className="btn btn-link"
                    onClick={() => alert("This module is not implemented")}
                  >
                    Responsibilities
                  </a>
                </div>
              </div>
              <div className="row">
                <div className="left-aligned-text">
                  <a
                    href="#"
                    className="btn btn-link"
                    onClick={() => alert("This module is not implemented")}
                  >
                    Attachments
                  </a>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>
      </>
    );
  } else return <></>;
};
export default NodeDetailInfo;
