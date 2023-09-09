
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
// import { collection, query, orderBy, onSnapshot } from "firebase/firestore"
// import { db } from './firebase'
import Url from './Url';
import { UserAuth } from './AuthContext';
import UrlForm from './UrlForm';
import { Modal, ProgressBar, Spinner, Button } from 'react-bootstrap';
import Checkbox from './Checkbox';
import ListSettingsModal from './ListSettings';
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
    const [generating, setGenerating] = useState(false)
    let [errors, setErrors] = useState([]);
    let [activeUrl, setActiveUrl] = useState('');

    const [saveUrls, setSaveUrls] = useState(true);
    const [types, setTypes] = useState([])
    const [type, setType] = useState('')

    const [dailyUrls, setDailyUrls] = useState('')
    const [monthlyUrls, setMonthlyUrls] = useState('')
    const [asNeededUrls, setAsNeededUrls] = useState('')

    const [dailyCheckedUrls, setDailyCheckedUrls] = useState([])
    const [monthlyCheckedUrls, setMonthlyCheckedUrls] = useState([])
    const [asNeededCheckedUrls, setAsNeededCheckedUrls] = useState([])

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
        if (loading === false) {
            var x = 0;
            var _isCheck = []
            for (var i = 0; i < urls.length; i++) {
                if (urls[i].checked === 1) {
                    x++
                    // _isCheck.push('' + urls[i].id + '')
                    _isCheck = [..._isCheck, '' + urls[i].id + '']
                    console.log('urls[i].checked === 1')
                }
            }
            setIsCheck(_isCheck)
            settingCheckTotal(x)
            // console.log(_isCheck)
        }
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
            setGenerating(false)
        } else {
            setProgressStyle('animated')
        }

        // console.log('progress=' + progress)
    }, [progress, errors])

    const reset = () => {
        setProgress(0)
        setProgressStyle('animated')
        setCurrentUrl(0)
        setErrors([])
        setStatus('')
        setGenerating(false)
    }

    // const delay = ms => new Promise(res => setTimeout(res, ms));

    const generate = async () => {
        setGenerating(true)
        // console.log(urls[currentUrl].checked);
        // currentUrl++
        // setCurrentUrl(currentUrl)
        let p = (currentUrl / urls.length) * 100
        setProgress(p);

        // console.log('currentUrl=' + currentUrl + ', urls.length=' + urls.length);
        if (currentUrl < urls.length) {

            // if (urls[currentUrl].checked === 1) {
            if (isCheck.includes('' + urls[currentUrl].id + '')) {
                console.log('url=' + urls[currentUrl].url);
                setActiveUrl(urls[currentUrl].url)
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
                        }
                    } else {
                        // console.log(result.progress);
                        // console.log(result.message);
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
        e.preventDefault()
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
    };

    const handleSelectAll = async (e) => {
        setIsCheckAll(!isCheckAll);
        setType('')
        // console.log('isCheckAll=' + isCheckAll)
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
    }

    const handleSelectType = async (e) => {
        const { id } = e.target;
        // console.log('type=' + id)
        setIsCheckAll(false);
        setType(id)

        let baseTypesApi = process.env.REACT_APP_API_URL + "api/types.php/list";
        axios.get(baseTypesApi).then((response) => {
            if (response.data) {
                setTypes(response.data)
            }
        }).catch((error) => {
            if (error.response) {
                console.log(error.response.data);
            }
        });
    }

    useEffect(() => {
        separateTypes()
    }, [types])

    const separateTypes = () => {
        types.map((_type, index) => {
            if (_type.type === 'daily') {
                setDailyUrls(_type.sitemap_id)
            }
            if (_type.type === 'monthly') {
                setMonthlyUrls(_type.sitemap_id)
            }
            if (_type.type === 'asneeded') {
                setAsNeededUrls(_type.sitemap_id)
            }
        })
    }

    useEffect(() => {
        let _checkedUrls = []
        if (dailyUrls !== '' && type === 'daily') {
            console.log('daily')
            if (dailyUrls.indexOf(',') != -1) {
                _checkedUrls = dailyUrls.split(',')
            } else {
                _checkedUrls = [dailyUrls]
            }
            setIsCheck(_checkedUrls)
        }
        if (monthlyUrls !== '' && type === 'monthly') {
            console.log('monthly')
            if (monthlyUrls.indexOf(',') != -1) {
                _checkedUrls = monthlyUrls.split(',')
            } else {
                _checkedUrls = [monthlyUrls]
            }
            setIsCheck(_checkedUrls)
        }
        if (asNeededUrls !== '' && type === 'asneeded') {
            console.log('as needed')
            if (asNeededUrls.indexOf(',') != -1) {
                _checkedUrls = asNeededUrls.split(',')
            } else {
                _checkedUrls = [asNeededUrls]
            }
            setIsCheck(_checkedUrls)
        }
    }, [dailyUrls, monthlyUrls, asNeededUrls, type])

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

    const [showListSettings, setShowListSettings] = useState(false)
    const handleShowListSettings = () => {
        setShowListSettings(false)
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
                                <li><span className="dropdown-item" onClick={() => setShowListSettings(true)}><i className='bi bi-check2-square'></i> List Settings</span></li>
                                <li><span className="dropdown-item" onClick={handleLogout}><i className='bi bi-box-arrow-right'></i> Logout</span></li>
                            </ul>
                        </div>
                    </div>

                    <p>{urls.length} websites to generate</p>
                    <div className={"url-list-wrap " + ((generating === true) ? "generating" : "")}>
                        <div>
                            <div className="d-flex align-items-center">
                                {/* <div className="form-check">
                                    <input className="form-check-input" type="checkbox" value="" id="selectall" />
                                    <label className="form-check-label" htmlFor="selectall">
                                        Select All
                                    </label>
                                </div> */}
                                <div className='d-flex'>
                                    <Checkbox
                                        url="Select All"
                                        id="selectAll"
                                        handleClick={handleSelectAll}
                                        folder={''}
                                        isChecked={isCheckAll}
                                        checked={isCheckAll}
                                        moreClass={'me-3'} />
                                    <Checkbox
                                        url="Daily"
                                        id="daily"
                                        handleClick={handleSelectType}
                                        folder={''}
                                        checked={(type === 'daily') ? true : false}
                                        moreClass={'me-3'} />
                                    <Checkbox
                                        url="Monthly"
                                        id="monthly"
                                        handleClick={handleSelectType}
                                        checked={(type === 'monthly') ? true : false}
                                        folder={''}
                                        moreClass={'me-3'} />
                                    <Checkbox
                                        url="As Needed"
                                        id="asneeded"
                                        handleClick={handleSelectType}
                                        checked={(type === 'asneeded') ? true : false}
                                        folder={''}
                                        moreClass={'me-3'} />
                                </div>

                                <div className="ms-auto">
                                    <button className="btn py-0 px-1 fw-bold" onClick={() => setAddModal(true)}><i className="bi bi-plus-lg"></i></button>
                                </div>
                            </div>
                            <hr />
                            {loading ?
                                <div className='text-center mb-4'><Spinner animation="border" /></div> :

                                <div>{
                                    urls.map((_url, index) => {
                                        let checked = isCheck.includes('' + _url.id + '')
                                        return <Url key={index} index={index} id={_url.id} url={_url.url} checked={checked} folder={_url.folder} handleClick={handleClick} doneDelete={fetchUrls} current={currentUrl} />

                                    })
                                }
                                </div>
                            }
                        </div>
                    </div>

                    <hr />

                    {(progressStyle === 'animated' && generating === true) && <ProgressBar now={progress} animated className='mb-2' />}

                    {generating && <div className='mb-2'>{'Scanning ' + activeUrl}</div>}
                    <div className='mb-4'>{status}</div>

                    <button className='btn btn-primary mb-4' onClick={() => { reset(); generate(); }} disabled={generating}>Generate</button>
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

                    {showListSettings && <ListSettingsModal showModal={showListSettings} hideModal={handleShowListSettings} />}
                </div>
            </div>
        </>
    );
}

export default Home;