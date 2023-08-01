import React, { useState, useEffect } from 'react';
import { Modal, Button, Spinner } from "react-bootstrap";
import { collection, query, orderBy, onSnapshot, where } from "firebase/firestore"
import { db } from './firebase'
import axios from 'axios';

const DetailsModal = ({ showModal, hideModal, confirmModal, id }) => {
    const [urls, setUrls] = useState([])
    const [loading, setLoading] = useState(true);

    let baseURL = process.env.REACT_APP_API_URL + "api/details.php/list?id=" + id;

    useEffect(() => {
        fetchUrls()
    }, [])

    const fetchUrls = () => {
        axios.get(baseURL).then((response) => {
            setUrls(response.data);
            setLoading(false)
        }).catch((error) => {
            if (error.response) {
                console.log(error.response.data);
            }
        });
    }

    // useEffect(() => {
    //     // setLoading(true);
    //     const urlsRef = query(collection(db, 'details'), where('urlid', '==', id), orderBy('url', 'asc'))
    //     const detailsSnapshot = onSnapshot(urlsRef, (snapshot) => {
    //         setUrls(snapshot.docs.map(doc => ({
    //             id: doc.id,
    //             data: doc.data()
    //         })))
    //         setLoading(false)
    //     })

    //     return detailsSnapshot

    // }, [urls, id, loading])

    return (
        <Modal className='details-modal modal-lg' show={showModal} onHide={hideModal} aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title>Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ?
                    <div className='text-center'><Spinner animation="border" /></div> :
                    <>
                        <p>{urls.length} links</p>
                        <table className='table'>
                            <tbody>
                                {urls.map((_url, index) => {
                                    return <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{_url.url}</td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                    </>
                }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={hideModal}>
                    OK
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default DetailsModal;