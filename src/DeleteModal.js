import React from 'react'
import { Modal, Button } from "react-bootstrap";

const DeleteModal = ({ showModal, hideModal, confirmModal, id }) => {
    return (
        <Modal show={showModal} onHide={hideModal} aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title>Delete Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete?</Modal.Body>
            <Modal.Footer>
                <Button variant="default" onClick={hideModal}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={() => confirmModal(id)}>
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default DeleteModal;