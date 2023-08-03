import React, { useState } from 'react'
import DeleteModal from './DeleteModal';
import EditModal from './EditModal';
import Checkbox from './Checkbox';
import DetailsModal from './DetailsModal';
import axios from 'axios';

function Url({ id, url, isChecked, checked, folder, handleClick, doneDelete }) {
    const [open, setOpen] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false);
    const [detailsModal, setDetailsModal] = useState(false);

    const handleClose = () => {
        setOpen(false)
        doneDelete()
    }

    const handleCloseDelete = () => {
        setDeleteModal(false);
    }

    const handleCloseDetails = () => {
        setDetailsModal(false);
    }

    const submitDelete = async (id) => {
        // const urlDocRef = doc(db, 'urls', id)

        try {
            let baseURL = process.env.REACT_APP_API_URL + "api/index.php/url/delete";

            axios
                .post(baseURL, {
                    id: id,
                })
                .then((response) => {
                    console.log(response);
                    doneDelete()
                }).catch(error => {
                    console.log(error);
                });
        } catch (err) {
            alert(err)
        }
        setDeleteModal(false);
    };

    return (
        <>
            <div className="url-list-item" key={id}>
                <span className="drag-handle"><i className="bi bi-grip-vertical"></i></span>

                <Checkbox
                    url={url}
                    id={id}
                    handleClick={handleClick}
                    folder={folder}
                    isChecked={isChecked}
                    checked={checked} />

                <div className="btn-wrap">
                    <button className="btn btn-edit" onClick={() => setOpen(true)}><i className="bi bi-pencil-square"></i></button>
                    <button className="btn btn-delete" onClick={() => setDeleteModal(true)}><i className="bi bi-trash3-fill"></i></button>
                    <button className="btn btn-link btn-details" onClick={() => setDetailsModal(true)}><i className="bi bi-info-circle-fill"></i></button>
                </div>

                {open &&
                    <EditModal
                        showModal={open}
                        hideModal={handleClose}
                        data={{ url: url, folder: folder }}
                        id={id} />
                }

                {deleteModal && <DeleteModal showModal={deleteModal} hideModal={handleCloseDelete} confirmModal={submitDelete} id={id} />}

                {detailsModal && <DetailsModal showModal={detailsModal} hideModal={handleCloseDetails} id={id} />}
            </div >
        </>
    )
}

export default Url;