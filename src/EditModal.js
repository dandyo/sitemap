import React, { useState } from 'react'
import { Modal, Button } from "react-bootstrap";
import axios from 'axios';

const EditModal = ({ showModal, hideModal, id, data }) => {
    const [url, setUrl] = useState(data.url);
    const [folder, setFolder] = useState(data.folder);

    const handleSubmit = async (e) => {
        e.preventDefault()

        let baseURL = process.env.REACT_APP_API_URL + "api/index.php/url/update";

        axios
            .post(baseURL, {
                id: id,
                url: url,
                folder: folder
            })
            .then((response) => {
                hideModal()
                console.log(response);
            }).catch(error => {
                console.log(error);
            });
        // const urlDocRef = doc(db, 'urls', id)
        // try {
        //     await updateDoc(urlDocRef, {
        //         url: url,
        //         folder: folder
        //     })
        //     hideModal()
        // } catch (err) {
        //     alert(err)
        // }

    }


    return (
        <Modal show={showModal} onHide={hideModal} aria-labelledby="contained-modal-title-vcenter" centered>
            <form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit URL</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='form-group mb-3'>
                        <input type="text" className='form-control' placeholder='URL' value={url} onChange={(e) => { setUrl(e.target.value) }} />
                    </div>
                    <div className='form-group mb-3'>
                        <input type="text" className='form-control' placeholder='Custom folder' value={folder} onChange={(e) => { setFolder(e.target.value) }} />
                    </div>
                    {/* <input type="submit" className='btn btn-primary' value="Submit" /> */}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="default" onClick={hideModal}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" onClick={() => handleSubmit}>
                        Submit
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}

export default EditModal;