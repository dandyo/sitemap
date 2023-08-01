
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
// import { collection, query, orderBy, onSnapshot } from "firebase/firestore"
// import { db } from './firebase'
import Url from './Url';
import { UserAuth } from './AuthContext';
import UrlForm from './UrlForm';
import { Modal, ProgressBar, Spinner, Button } from 'react-bootstrap';
import Checkbox from './Checkbox';
// import { doc, updateDoc } from "firebase/firestore";
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';

function Home() {
    const { logout } = UserAuth();
    const navigate = useNavigate();
    let [checkTotal, setCheckTotal] = useState(0)

    let [isCheckAll, setIsCheckAll] = useState(false);
    const [isCheck, setIsCheck] = useState([]);
    const [loading, setLoading] = useState(true);
    let [errors, setErrors] = useState([]);

    const [saveUrls, setSaveUrls] = useState(true);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
            console.log('You are logged out')
        } catch (e) {
            console.log(e.message);
        }
    };

    const [urls, setUrls] = useState([])
    let baseURL = process.env.REACT_APP_API_URL + "api/index.php/url/list";
    // console.log(baseURL)

    useEffect(() => {
        fetchUrls()

        // return
    }, [])

    const fetchUrls = () => {
        console.log('fetching urls...')
        axios.get(baseURL).then((response) => {
            setUrls(response.data);
            setLoading(false)
        }).catch((error) => {
            if (error.response) {
                console.log(error.response.data); // => the response payload 
            }
        });
    }

    // useEffect(() => {
    //     console.log('errors=' + errors.length)
    // }, [errors])

    useEffect(() => {
        var x = 0;
        for (var i = 0; i < urls.length; i++) {
            if (urls[i].checked === 1) {
                x++
            }
        }
        settingCheckTotal(x)
    }, [urls])

    useEffect(() => {
        if (checkTotal >= urls.length) {
            setIsCheckAll(true);
        } else {
            setIsCheckAll(false);
        }
    }, [checkTotal, urls.length])

    const settingCheckTotal = (n) => {
        setCheckTotal(n)
    }

    const [addModal, setAddModal] = useState(false);

    const addModalHandle = () => {
        setAddModal(false);
        fetchUrls()
    }

    // const [post, setPost] = React.useState(null);

    let [currentUrl, setCurrentUrl] = useState(0);
    let [progress, setProgress] = useState(0);
    let [status, setStatus] = useState('');
    let [progressStyle, setProgressStyle] = useState('animated');

    useEffect(() => {
        if (progress >= 100) {
            setProgressStyle('')
            setStatus('Done generating sitemaps. ' + errors.length + ' ' + ((errors.length === 1) ? ' error' : 'errors'))
            setCurrentUrl(0)
        } else {
            setProgressStyle('animated')
        }

        console.log('progress=' + progress)
    }, [progress, errors])

    const reset = () => {
        setProgress(0)
        setProgressStyle('animated')
        setCurrentUrl(0)
        setErrors([])
        setStatus('')
    }

    const generate = async () => {

        // console.log(urls[currentUrl].checked);

        console.log('currentUrl=' + currentUrl + ', urls.length=' + urls.length);
        if (currentUrl < urls.length) {
            // console.log(urls[currentUrl].data.checked);
            // console.log('progress=' + p + ', currentUrl + 1=' + parseInt(currentUrl + 1));
            // console.log('url=' + urls[currentUrl].data.url);

            // let p = (100 / urls.length) * (currentUrl + 1)
            let p = ((currentUrl + 1) / urls.length) * 100

            setProgress(p);

            if (urls[currentUrl].checked === 1) {
                console.log('url=' + urls[currentUrl].url);
                setStatus('Scanning ' + urls[currentUrl].url);

                // const urlDocRef = doc(db, 'details', urls[currentUrl].data.id)
                try {
                    let baseURL = process.env.REACT_APP_API_URL + "api/details.php/delete";

                    axios
                        .post(baseURL, {
                            id: urls[currentUrl].id,
                        })
                        .then((response) => {
                            // console.log(response)
                        }).catch(error => {
                            console.log(error);
                        });
                    // await deleteDoc(urlDocRef)
                    // var urldelete_query = db.collection('details')
                    //     .where('urlid', '==', urls[currentUrl].id);

                    // urldelete_query.get().then(function (querySnapshot) {
                    //     querySnapshot.forEach(function (doc) {
                    //         doc.ref.delete();
                    //     });
                    // });
                } catch (err) {
                    console.log(err)
                }

                let url = urls[currentUrl].url;
                url = encodeURIComponent(url);

                if (urls[currentUrl].folder !== "") {
                    url = url + '&folder=' + encodeURIComponent(urls[currentUrl].folder);
                }

                let baseURL = process.env.REACT_APP_API_URL + "generator.php?url=" + url;

                var es = new EventSource(baseURL);
                console.log(baseURL);

                es.addEventListener('message', async function (e) {
                    var result = JSON.parse(e.data);

                    // console.log(result.message);

                    if (result.message === 'CLOSE') {
                        console.log('Received CLOSE closing');
                        es.close();

                        setCurrentUrl(currentUrl++);
                        generate();
                    } else if (result.progress === 'url') {
                        console.log('url: ' + result.message);
                        if (saveUrls === true) {
                            let baseURL = process.env.REACT_APP_API_URL + "api/details.php/add";

                            axios
                                .post(baseURL, {
                                    url: result.message,
                                    urlid: urls[currentUrl].id
                                })
                                .then((response) => {
                                }).catch(error => {
                                    console.log(error);
                                });
                        }
                    } else if (result.progress === 'error') {
                        setStatus(result.message);
                        let newError = result.message;
                        setErrors(errors => [...errors, newError]);

                        if (saveUrls === true) {
                            let baseURL = process.env.REACT_APP_API_URL + "api/details.php/add";

                            axios
                                .post(baseURL, {
                                    url: result.message,
                                    urlid: urls[currentUrl].id
                                })
                                .then((response) => {
                                }).catch(error => {
                                    console.log(error);
                                });

                            // let newurl = db.collection("details").doc();
                            // await newurl.set({
                            //     id: newurl.id,
                            //     url: result.message,
                            //     urlid: urls[currentUrl].id
                            // })
                        }
                    } else {
                        // console.log(result.progress);
                        console.log(result.message);
                        setStatus(result.message);

                        if (result.message === 'url') {

                        }
                    }
                });

                es.addEventListener('error', function (e) {
                    setStatus('Cannot generate sitemap of ' + decodeURIComponent(url));
                    console.log('Cannot generate sitemap of ' + decodeURIComponent(url));
                    console.log(e);

                    let newError = 'Cannot generate sitemap of ' + decodeURIComponent(url)
                    setErrors(errors => [...errors, newError]);

                    es.close();
                    setCurrentUrl(currentUrl++);
                    generate();
                });
            } else {
                // setCurrentUrl(0);
                setCurrentUrl(currentUrl++);

                generate();
            }
        }
        // else {
        //     setCurrentUrl(currentUrl++);
        // }
    }

    const handleClick = async (e) => {
        const { id, checked } = e.target;
        console.log('check id=' + id)
        setIsCheck([...isCheck, id]);
        if (!checked) {
            setIsCheck(isCheck.filter(item => item !== id));
        }

        let baseURL = process.env.REACT_APP_API_URL + "api/index.php/url/check";

        axios
            .post(baseURL, {
                id: id,
                checked: (checked === true) ? 1 : 0
            })
            .then((response) => {
                fetchUrls()
            }).catch(error => {
                console.log(error);
            });

        // const urlDocRef = doc(db, 'urls', id)
        // try {
        //     await updateDoc(urlDocRef, {
        //         checked: checked
        //     })
        // } catch (err) {
        //     alert(err)
        // }
    };

    const handleSelectAll = async (e) => {
        setIsCheckAll(!isCheckAll);
        console.log('isCheckAll=' + isCheckAll)
        // setIsCheck(urls.map(li => li.id));
        // setIsCheck(urls.map(async (li) => {
        const baseURL = process.env.REACT_APP_API_URL + "api/index.php/url/checkall"

        axios
            .post(baseURL, {
                checked: (isCheckAll) ? 0 : 1
            })
            .then((response) => {
                // setPost(response.data);
                // modalCloseHandle()
                fetchUrls()

            }).catch(error => {
                console.log(error);
            });


        if (isCheckAll) {
            setIsCheck([]);
        }
    };

    const handleSaveUrls = () => {
        if (saveUrls === true) {
            setSaveUrls(false)
        } else {
            setSaveUrls(true)
        }
    }

    const [showErrorsModal, setShowErrorsModal] = useState(false)
    const closeErrorsModal = () => {
        setShowErrorsModal(false);
    }

    return (
        <>
            <div className="container">
                <div className="wrap">
                    <div className='d-flex justify-content-center title'>
                        <h1 className='mx-auto'>Sitemap</h1>
                        <div className="dropdown">
                            <button className='btn dropdown-toggle' type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <i className='bi bi-gear-fill'></i>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li><span className="dropdown-item" onClick={handleSaveUrls}>
                                    {(saveUrls === true) ?
                                        <i className='bi bi-toggle-on'></i> :
                                        <i className='bi bi-toggle-off'></i>
                                    }
                                    &nbsp;Save Scanned Urls</span></li>
                                <li><span className="dropdown-item" onClick={handleLogout}><i className='bi bi-box-arrow-right'></i> Logout</span></li>
                            </ul>
                        </div>
                    </div>

                    <p>{urls.length} websites to generate</p>
                    <div className="url-list-wrap">
                        <div>
                            <div className="d-flex align-items-center">
                                {/* <div className="form-check">
                                    <input className="form-check-input" type="checkbox" value="" id="selectall" />
                                    <label className="form-check-label" htmlFor="selectall">
                                        Select All
                                    </label>
                                </div> */}
                                <Checkbox
                                    url="Select All"
                                    id="selectAll"
                                    handleClick={handleSelectAll}
                                    folder={''}
                                    isChecked={isCheckAll}
                                    checked={isCheckAll} />

                                <div className="ms-auto">
                                    <button className="btn py-0 px-1 fw-bold" onClick={() => setAddModal(true)}><i className="bi bi-plus-lg"></i></button>
                                </div>
                            </div>
                            <hr />
                            {loading ?
                                <div className='text-center mb-4'><Spinner animation="border" /></div> :

                                <div>{
                                    urls.map((_url, index) => (
                                        <Url key={_url.id} id={_url.id} url={_url.url} isChecked={isCheck.includes(_url.id)} checked={_url.checked} folder={_url.folder} handleClick={handleClick} doneDelete={fetchUrls} />
                                    ))
                                }
                                </div>
                            }
                        </div>
                    </div>

                    {progressStyle === 'animated' ? <ProgressBar now={progress} animated className='mb-2' /> : <ProgressBar now={progress} className='mb-2' />}
                    {/* <button onClick={test}>click</button> */}

                    <div className='mb-4'>{status}</div>

                    <button className='btn btn-primary mb-4' onClick={() => { reset(); generate(); }}>Generate</button>
                    {/* <p><button className='btn btn-link' onClick={handleLogout}>Logout</button></p> */}

                    {addModal && <UrlForm showModal={addModal} modalCloseHandle={addModalHandle} />}

                    <div className='error-wrap'>
                        <button className='btn' type="button" onClick={() => setShowErrorsModal(true)}><i className='bi bi-exclamation-diamond-fill'></i></button>
                    </div>

                    {showErrorsModal > 0 &&
                        <Modal className='errors-modal modal-lg' show={showErrorsModal} onHide={closeErrorsModal} aria-labelledby="contained-modal-title-vcenter" centered>
                            <Modal.Header closeButton>
                                <Modal.Title>Errors</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {errors.map((error, index) => {
                                    return <p key={index}>{error}</p>
                                })}
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="primary" onClick={closeErrorsModal}>
                                    OK
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    }
                </div>
            </div>
        </>
    );
}

export default Home;