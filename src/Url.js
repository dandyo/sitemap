import React, { useState } from 'react'
import DeleteModal from './DeleteModal';
import EditModal from './EditModal';
import { db } from './firebase'
import { doc, deleteDoc, updateDoc } from "firebase/firestore";

function Url({ id, url, checked, folder }) {
    const [open, setOpen] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false);

    const handleClose = () => {
        setOpen(false)
    }

    const handleCloseDelete = () => {
        setDeleteModal(false);
    }

    const submitDelete = async (id) => {
        const urlDocRef = doc(db, 'urls', id)
        try {
            await deleteDoc(urlDocRef)
        } catch (err) {
            alert(err)
        }
        setDeleteModal(false);
    };

    const handleCheck = async () => {
        const urlDocRef = doc(db, 'urls', id)
        const check = (checked === true) ? false : true;
        try {
            await updateDoc(urlDocRef, {
                checked: check
            })
        } catch (err) {
            alert(err)
        }
    }

    return (
        <>
            <li className="url-list-item" key={id}>
                <span className="drag-handle"><i className="bi bi-grip-vertical"></i></span>
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" value={id} id={'url-' + id} checked={checked} onChange={handleCheck} />
                    <label className="form-check-label" htmlFor={'url-' + id}>
                        {url}
                    </label>
                    <span className="folder">{folder}</span>
                </div>

                <div className="btn-wrap">
                    <button className="btn btn-edit" onClick={() => setOpen(true)}><i className="bi bi-pencil-square"></i></button>
                    <button className="btn btn-delete" onClick={() => setDeleteModal(true)}><i className="bi bi-trash3-fill"></i></button>
                </div>

                {open &&
                    <EditModal
                        showModal={open}
                        hideModal={handleClose}
                        data={{ url: url, folder: folder }}
                        id={id} />
                }

                {deleteModal && <DeleteModal showModal={deleteModal} hideModal={handleCloseDelete} confirmModal={submitDelete} id={id} />}
            </li >
        </>
    )
}

export default Url;