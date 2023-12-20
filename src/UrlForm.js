import React, { useState } from 'react';
import { Modal, Button } from "react-bootstrap";
import axios from 'axios';

function UrlForm({ showModal, modalCloseHandle }) {
    const [folder, setFolder] = useState('');
    const [urlString, setUrlString] = useState('');

    const handleSubmit = async (e) => {

        e.preventDefault();

        let baseURL = process.env.REACT_APP_API_URL + "urls";

        axios
            .post(baseURL, {
                url: urlString,
                folder: folder,
            })
            .then((response) => {
                // setPost(response.data);
                modalCloseHandle()
            }).catch(error => {
                console.log(error);
            });
    }

    return (
        <Modal show={showModal} onHide={modalCloseHandle} aria-labelledby="contained-modal-title-vcenter" centered>
            <form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Add new url</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group mb-3">
                        <input type="text" className="form-control" placeholder="URL" value={urlString} required onChange={(e) => { setUrlString(e.target.value) }} />
                    </div>
                    <div className="form-group mb-3">
                        <input type="text" className="form-control" placeholder="Custom folder" value={folder} onChange={(e) => { setFolder(e.target.value) }} />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="default" onClick={modalCloseHandle}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" onClick={() => handleSubmit}>
                        Submit
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>

        // <div className="modal fade" id="urlFormModal" aria-labelledby="urlFormModal" aria-hidden="true">
        //     <div className="modal-dialog modal-dialog-centered">
        //         <div className="modal-content">
        //             <div className="modal-header">
        //                 <h5 className="modal-title">Add New Url</h5>
        //                 <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        //             </div>
        //             <div className="modal-body">
        //                 <form onSubmit={onAddUrl}>
        //                     <div className="form-group mb-3">
        //                         <input type="text" className="form-control" placeholder="URL" value={urlString} required onChange={(e) => { setUrlString(e.target.value) }} />
        //                     </div>
        //                     <div className="form-group mb-3">
        //                         <input type="text" className="form-control" placeholder="Custom folder" value={folder} onChange={(e) => { setFolder(e.target.value) }} />
        //                     </div>
        //                     <div className="text-center">
        //                         <input className="btn btn-primary" type="submit" value="Submit" />
        //                     </div>
        //                 </form>
        //             </div>
        //         </div>
        //     </div>
        // </div>
    );
}
export default UrlForm;