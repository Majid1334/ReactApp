import { Modal, Button } from "react-bootstrap";
interface ConfirmationModel {
  show: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}
const ConfirmationModel = (props: ConfirmationModel) => {
  return (
    <Modal
      show={props.show}
      id="PromoteSubProcessModal"
      backdrop="static"
      keyboard={false}
      centered
      animation={false}
      onHide={props.onCancel}
      onSubmit={props.onConfirm}
    >
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onCancel}>
          No
        </Button>
        <Button variant="primary" onClick={props.onConfirm}>
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default ConfirmationModel;
