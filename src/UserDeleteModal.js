import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from 'axios';

const UserDeleteModal = ({ showModal, hideModal, doneDelete, id }) => {

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(id)

        let baseURL = process.env.REACT_APP_API_URL + "users/delete/" + id;
        await axios
            .delete(baseURL)
            .then((response) => {
                // console.log(response)
                hideModal()
                doneDelete()
            }).catch(error => {
                console.log(error);
            });
    }

    return (
        <Modal className='modal-md' show={showModal} onHide={hideModal} aria-labelledby="contained-modal-title-vcenter" centered>
            <form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm delete</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>Are you sure you want to delete this user?</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="default" onClick={hideModal}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="danger" onClick={() => handleSubmit}>
                        Yes
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    )
}
export default UserDeleteModal;