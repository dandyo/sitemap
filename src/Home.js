
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from "firebase/firestore"
import { db } from './firebase'
import Url from './Url';
// import { Fancybox } from "@fancyapps/ui";
import { UserAuth } from './AuthContext';
import UrlForm from './UrlForm';

// Fancybox.bind('[data-fancybox]', { dragToClose: false, contentClick: false });

function Home() {
    const { logout } = UserAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
            console.log('You are logged out')
        } catch (e) {
            console.log(e.message);
        }
    };

    const generate = async () => {
        console.log('generate');
        for (var i = 0; i < urls.length; i++) {
            console.log(urls[i].data.url);
        }
    }

    const [urls, setUrls] = useState([])

    useEffect(() => {
        const taskColRef = query(collection(db, 'urls'), orderBy('order', 'asc'), orderBy('datecreated', 'asc'))
        onSnapshot(taskColRef, (snapshot) => {
            setUrls(snapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            })))
        })
    }, [])

    const [addModal, setAddModal] = useState(false);

    const addModalHandle = () => {
        setAddModal(false);
    }

    return (
        <>
            <div className="container">
                <div className="wrap">
                    <h1>Sitemap</h1>
                    <p>{urls.length} websites to generate</p>
                    <div className="url-list-wrap">
                        <div>
                            <div className="d-flex align-items-center">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" value="" id="selectall" />
                                    <label className="form-check-label" htmlFor="selectall">
                                        Select All
                                    </label>
                                </div>
                                <div className="ms-auto">
                                    <button className="btn py-0 px-1 fw-bold" onClick={() => setAddModal(true)}><i className="bi bi-plus-lg"></i></button>
                                </div>
                            </div>
                            <hr />
                            <ul className="mb-3">
                                {urls.map((_url) => (
                                    <Url key={_url.id} id={_url.id} url={_url.data.url} checked={_url.data.checked} folder={_url.data.folder} />
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="progress mb-2" role="progressbar" aria-label="Basic example" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                        <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: '25%' }}></div>
                    </div>

                    <div className='mb-4'>Status</div>

                    <button className='btn btn-primary' onClick={generate}>Generate</button>
                    <p><button className='btn btn-link' onClick={handleLogout}>Logout</button></p>

                    {addModal && <UrlForm showModal={addModal} modalCloseHandle={addModalHandle} />}
                </div>
            </div>
        </>
    );
}

export default Home;