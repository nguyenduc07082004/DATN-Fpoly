import React from "react";
import { Modal, Button } from "react-bootstrap";

interface DescriptionModalProps {
  show: boolean;
  handleClose: () => void;
  description: string;
}

const DescriptionModal: React.FC<DescriptionModalProps> = ({
  show,
  handleClose,
  description,
}) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Mô tả</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ whiteSpace: "pre-wrap" }}>
        <div>{description}</div>{" "}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DescriptionModal;
