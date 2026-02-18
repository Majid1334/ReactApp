import React, { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import callAPI from "../ApiCall";
import { type UpdProcessDetailModel } from "../OutgoingModels/UpdProcessDetailModel";
import Dexie from "dexie";
Dexie.debug = false;
import ProcessDiagram from "../Diagram/ProcessDiagram";
import { createPortal } from "react-dom";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap/dist/js/bootstrap.min.js";
import type { ProcessIDModel } from "../OutgoingModels/ProcessIDModel";

// Define types for form data
interface FormData {
  ID: number;
  ParentID: number;
  ProcessName: string;
  Status: string;
  LastModifiedDate: Date;
  Description: string;
  ParentName: string;
}
interface ModalpropsType {
  ProcessID: number;
  showModal: boolean;
  PathDesc: string;
  keyForDiagram: number;
  modalStatusHandler: (value: boolean) => void;
  onSubmit: (value: string) => void;
}

const ProcessDetailForm = (props: ModalpropsType) => {
  const [showDiagram, setShowDiagram] = useState(false);
  const [keyForModal, setKeyForModal] = useState(0);
  const [KeyForDiagram, setKeyForDiagram] = useState(props.keyForDiagram);
  const [showModal, setShowModal] = useState(props.showModal);
  const [formData, setFormData] = useState<FormData>({
    ID: 0,
    ParentID: 0,
    ProcessName: "",
    LastModifiedDate: new Date(),
    Status: "",
    Description: "",
    ParentName: "",
  });
  interface SelectOption {
    value: string;
    label: string;
  }
  const options: SelectOption[] = [
    { value: "", label: "Select an option" },
    { value: "Preliminary", label: "Preliminary Stage" },
    { value: "Planning", label: "Planning Stage" },
    { value: "Developing", label: "Developing Stage" },
    { value: "Testing", label: "Testing Stage" },
    { value: "Deployment", label: "Deployment Stage" },
    { value: "Operation", label: "Operational" },
    { value: "Closed", label: "Closed / not Active" },
  ];
  const [processID, setProcessID] = useState<number>(0);
  const handleClose = () => {
    setKeyForDiagram((prevKey) => prevKey + 1);
    props.modalStatusHandler(false);
    setShowModal(false);
  };
  const handleCloseDiagram = () => {
    props.modalStatusHandler(false);
    setShowDiagram(false);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement;
    setFormData((prevData) => {
      if (name === "LastModifiedDate") {
        return {
          ...prevData,
          LastModifiedDate: value ? new Date(value) : prevData.LastModifiedDate,
        };
      }
      if (name === "ID" || name === "ParentID") {
        return {
          ...prevData,
          [name]: Number(value),
        } as FormData;
      }
      return {
        ...prevData,
        [name]: value,
      } as FormData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const Params: UpdProcessDetailModel = {
      ProcessID: formData.ID,
      Status: formData.Status,
      ProcessName: formData.ProcessName,
      LastModifiedDate: formData.LastModifiedDate,
      Description: formData.Description,
    };
    const TargetAPI = "Diagram/UpdateProcessesDetails";
    const paramsInString = JSON.stringify(Params);
    const paramsInJSON = JSON.parse(paramsInString);

    callAPI(TargetAPI, paramsInJSON)
      .then((response) => {
        if (response > 0) {
          setProcessID(response);
          props.modalStatusHandler(true);
          props.onSubmit(response.toString());
          setShowModal(false);
        } else {
          alert("Error in updating process details");
          props.modalStatusHandler(false);
        }
      })
      .catch(() => {
        //we need to raise a proper message
      });

    console.log("Form submitted:", paramsInJSON);
  };

  useEffect(() => {
    if (props.ProcessID !== processID) {
      const Params: ProcessIDModel = { ProcessID: props.ProcessID };
      const TargetAPI = "Diagram/GetProcessesDetails";
      const paramsInString = JSON.stringify(Params);
      const paramsInJSON = JSON.parse(paramsInString);
      setProcessID(props.ProcessID);
      callAPI(TargetAPI, paramsInJSON)
        .then((response) => {
          if (response !== null && response.length > 0) {
            setFormData((prev) => ({
              ...prev,
              ID: response[0].id,
              ParentID: response[0].ParentID,
              ProcessName: response[0].processName,
              LastModifiedDate: new Date(response[0].lastModifiedDate),
              Status: response[0].status,
              Description: response[0].description,
              ParentName: response[0].parentName,
            }));
          }
        })
        .catch(() => {
          //we need to raise a proper message
        });
    }
  }, [processID, props.ProcessID, props.PathDesc, keyForModal]);

  const showDiagramPage = () => {
    setKeyForDiagram((prevKey) => prevKey + 1);
    setKeyForModal((prevKey) => prevKey + 1);
    setShowModal(false);
    setShowDiagram(true);
  };
  return (
    <>
      {showModal &&
        createPortal(
          <Modal
            show={showModal}
            id="processDetailModal"
            size="lg"
            centered
            animation={false}
            onHide={handleClose}
            onSubmit={handleSubmit}
            backdrop="static"
            keyboard={false}
            key={keyForModal}
          >
            <Modal.Header closeButton>
              <Modal.Title style={{ color: "white", fontSize: "20px" }}>
                Process:&nbsp;
                {props.PathDesc.replaceAll("gtgt", ">")}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit}>
                <div className="container-fluid">
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <Form.Group className="mb-3" controlId="formID">
                        <Form.Label>ID</Form.Label>
                        <Form.Control
                          className="form-control fw-normal"
                          type="Number"
                          placeholder="ID"
                          name="ID"
                          value={formData.ID}
                          readOnly
                        />
                      </Form.Group>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <Form.Group className="mb-3" controlId="formProcessName">
                        <Form.Label>Process Name</Form.Label>
                        <Form.Control
                          className="form-control fw-normal"
                          type="text"
                          placeholder=" Process Name"
                          name="ProcessName"
                          value={formData.ProcessName}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group className="mb-3" controlId="formParentName">
                        <Form.Label>Parent Name</Form.Label>
                        <Form.Control
                          className="form-control fw-normal"
                          type="text"
                          placeholder="Parent Name"
                          name="ParentName"
                          value={
                            formData.ParentName === ""
                              ? "Root Level Process"
                              : formData.ParentName
                          }
                          onChange={handleChange}
                          required
                          readOnly
                        />
                      </Form.Group>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <Form.Group
                        className="mb-3"
                        controlId="formLastModifiedDate"
                      >
                        <Form.Label>Last Modified Date</Form.Label>
                        <Form.Control
                          className="form-control fw-normal"
                          type="date"
                          placeholder="Last Modified Date"
                          name="LastModifiedDate"
                          value={
                            formData.LastModifiedDate.toISOString().split(
                              "T",
                            )[0]
                          }
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group className="mb-3" controlId="formStatus">
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                          className="form-control fw-normal"
                          aria-label="Select Status"
                          name="Status"
                          value={formData.Status}
                          onChange={handleChange}
                          required
                        >
                          {options.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <Form.Group className="mb-3" controlId="formShowDiagram">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={showDiagramPage}
                        hidden={formData.ID === 0}
                      >
                        Show Diagram
                      </button>
                    </Form.Group>
                  </div>
                  <div className="row mb-3">
                    <Form.Group className="mb-3" controlId="formDescription">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        className="form-control fw-normal"
                        as="textarea"
                        rows={5}
                        placeholder="Enter Description"
                        name="Description"
                        value={formData.Description}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </div>

                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      Close
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      onClick={handleSubmit}
                    >
                      Submit
                    </Button>
                  </Modal.Footer>
                </div>
              </Form>
            </Modal.Body>
          </Modal>,
          document.body,
        )}
      {showDiagram && (
        <Modal
          id="processDiagramModal"
          size="lg"
          centered
          animation={false}
          show={showDiagram}
          onHide={handleCloseDiagram}
          fullscreen={true}
          key={KeyForDiagram}
        >
          <Modal.Header closeButton>
            <Modal.Title style={{ color: "white", fontSize: "20px" }}>
              Process:&nbsp;
              {props.PathDesc.replaceAll("gtgt", ">")}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ minHeight: "500px", overflow: "auto" }}>
            <ProcessDiagram
              ProcessID={props.ProcessID}
              PathDesc={props.PathDesc}
              key={props.keyForDiagram}
              showModal={showDiagram}
            />
          </Modal.Body>
          <Modal.Footer />
        </Modal>
      )}
    </>
  );
};

export default ProcessDetailForm;
