
import { Link, Navigate } from 'react-router-dom';
import React, { useState, useEffect, useContext, useRef } from 'react';
import Url from './Url';

import { UserContext } from './AuthContext'
import UrlForm from './UrlForm';
import { Modal, ProgressBar, Spinner, Button } from 'react-bootstrap';
import Checkbox from './Checkbox';
import ListSettingsModal from './ListSettings';
import axios from 'axios';
import { useUrlsContext } from './hooks/useUrlsContext';

function Home() {
    // const { logout } = UserAuth();
    const { user, logout } = useContext(UserContext);

    // const navigate = useNavigate();
    let [checkTotal, setCheckTotal] = useState(0)
    let [currentCheck, setCurrentCheck] = useState(1)

    let [isCheckAll, setIsCheckAll] = useState(false);
    // const [isCheck, setIsCheck] = useState([]);
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

    const { urls, test, dispatch } = useUrlsContext()
    let baseURL = process.env.REACT_APP_API_URL;
    let baseGENERATOR_URL = process.env.REACT_APP_GENERATOR_URL;

    const fetchSettings = async () => {
        await axios.get(baseURL + "settings").then((response) => {
            if (response.data) {
                // setTypes(response.data)
                // console.log(response.data)
            }
        }).catch((error) => {
            if (error.response) {
                console.log(error.response.data); // => the response payload 
            }
        })
    }

    const fetchTypes = async () => {
        console.log('fetching types..., current type = ' + type)
        await axios.get(baseURL + "types").then((response) => {
            if (response.data) {
                setTypes(response.data)
            }
            setLoading(false)
        }).catch((error) => {
            if (error.response) {
                console.log(error.response.data); // => the response payload 
            }
            setLoading(false)
        })
    }

    useEffect(() => {
        const fetchUrls = async () => {
            console.log('fetching urls...')
            await axios.get(baseURL + "urls").then((response) => {
                dispatch({ type: 'SET_URLS', payload: response.data })
                // setLoading(false)
            }).catch((error) => {
                if (error.response) {
                    console.log(error.response.data); // => the response payload 
                }
                // setLoading(false)
            })
        }

        setLoading(false)

        fetchUrls()
        // fetchSettings()
        fetchTypes()
        checkChecktotal()
    }, [])

    // useEffect(() => {
    //     console.log('type=' + type)
    // }, [type])

    const checkChecktotal = () => {
        // let chk = 0
        // if (urls && urls.length > 0) {
        //     urls.forEach(url => {
        //         if (url.checked) {
        //             chk++
        //         }
        //     })

        //     if (chk >= urls.length) {
        //         setIsCheckAll(true)
        //         setType('')
        //     }
        // }
        // setCheckTotal(chk)
    }

    useEffect(() => {
        // checkChecktotal()
        setCheckTotal(checkTotal)

        if (urls && checkTotal >= urls.length) {
            setIsCheckAll(true)
            setType('')
        }
    }, [urls, type])

    useEffect(() => {
    }, [checkTotal])

    const updateCheckTotal = (check) => {
        if (check == 1) {
            checkTotal--
        } else {
            checkTotal++
        }

        setCheckTotal(checkTotal)
    }

    const [addModal, setAddModal] = useState(false);

    const addModalHandle = () => {
        setAddModal(false);
    }

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
        setCurrentCheck(1)
    }

    const generate = async () => {
        setGenerating(true)
        let p = (currentUrl / urls.length) * 100
        setProgress(p);

        console.log('currentUrl=' + currentUrl + ', urls.length=' + urls.length);
        if (currentUrl < urls.length) {
            if (urls[currentUrl].checked === 1) {
                // console.log('includes = ' + urls[currentUrl].id)
                setActiveUrl(urls[currentUrl].url)
                setCurrentCheck(currentCheck++)
                try {
                    // let baseURL = process.env.REACT_APP_API_URL + "details/delete/" + urls[currentUrl].id;

                    axios
                        .delete(baseURL + 'details/delete/' + urls[currentUrl].id)
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

                // let baseURL = process.env.REACT_APP_GENERATOR_URL + "generator.php?url=" + url;

                var es = new EventSource(baseGENERATOR_URL + 'generator.php?url=' + url);

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
                            axios
                                .post(baseURL + "details/add", {
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
                            axios
                                .post(baseURL + "details/add", {
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
                //console.log('not included');
                setCurrentUrl(currentUrl++);
                generate();
            }
        } else {
            // setCurrentUrl(currentUrl++);
            //console.log('else')
        }
    }

    const handleClick = async (e) => {
        // e.preventDefault()
        // console.log('click')

        const { id } = e.target;
        let check = e.target.getAttribute('data-checked')
        const index = e.target.getAttribute('data-index')

        const inputdata = {
            'index': index,
            'id': id,
            'checked': check
        }
        // console.log(check)

        dispatch({ type: 'CHECK_URL', payload: inputdata })

        // let baseURL = process.env.REACT_APP_API_URL + "urls/check";
        updateCheckTotal(check)

        axios
            .post(baseURL + "urls/check", {
                id: parseInt(id),
                checked: (check == 1) ? 0 : 1
            })
            .then((response) => {
                // setCheckTotal(checkTotal)
                // fetchUrls()
                // dispatch({ type: 'CHECK_URL', payload: response })
            }).catch(error => {
                console.log(error);
            });
    };

    const handleSelectAll = async (e) => {

        setIsCheckAll(!isCheckAll);
        setType('selectall')
        let isCheckAllNum = (isCheckAll) ? 0 : 1

        dispatch({ type: 'CHECK_ALL_URL', payload: { 'checkall': isCheckAllNum } })
        console.log('isCheckAll=' + isCheckAllNum)

        // const baseURL = process.env.REACT_APP_API_URL + "urls/checkall"

        axios
            .post(baseURL + "urls/checkall", {
                checked: (isCheckAll) ? 0 : 1
            })
            .then((response) => {
                checkChecktotal()
            }).catch(error => {
                console.log(error);
            });
    };

    const handleSelectType = async (e) => {
        const { id } = e.target;
        setIsCheckAll(false);
        setType(id)
        var currentTypeIds

        setCurrentCheck(1)

        //console.log('type=' + id)

        if (id === 'daily') {
            dispatch({ type: 'CHECK_TYPE', payload: { 'ids': dailyUrls } })
            currentTypeIds = dailyUrls
        }
        if (id === 'monthly') {
            dispatch({ type: 'CHECK_TYPE', payload: { 'ids': monthlyUrls } })
            currentTypeIds = monthlyUrls
        }
        if (id === 'asneeded') {
            dispatch({ type: 'CHECK_TYPE', payload: { 'ids': asNeededUrls } })
            currentTypeIds = asNeededUrls
        }

        checkChecktotal()

        if (currentTypeIds) {
            let baseTypesApi = process.env.REACT_APP_API_URL + "urls/checksome";

            axios.post(baseTypesApi, {
                ids: currentTypeIds
            }).then((response) => {
                if (response.data) {
                    // console.log(response.data)
                }
            }).catch((error) => {
                if (error.response) {
                    console.log('error=' + error.response.data);
                }
            });
        }
    }

    useEffect(() => {
        separateTypes()
    }, [types])

    const separateTypes = () => {
        types.map((_type) => {
            // console.log(_type)

            if (_type.type === 'daily') {
                setDailyUrls(_type.sitemap_id)
            }
            if (_type.type === 'monthly') {
                setMonthlyUrls(_type.sitemap_id)
            }
            if (_type.type === 'asneeded') {
                setAsNeededUrls(_type.sitemap_id)
            }

            return null
        })
    }

    const handleSaveUrls = () => {
        if (saveUrls === true) {
            setSaveUrls(false)
        } else {
            setSaveUrls(true)
        }
    }

    const [showListSettings, setShowListSettings] = useState(false)
    const handleShowListSettings = () => {
        setShowListSettings(false)
        fetchTypes()
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
                                <li><span className="dropdown-item" onClick={() => setShowListSettings(true)}><i className='bi bi-check2-square'></i> List Settings</span></li>
                                {/* <li><span className="dropdown-item" onClick={() => setShowManageUsers(true)}><i className='bi bi-person'></i> Manage Users</span></li> */}
                                <li><Link to="/users" className='dropdown-item'><i className='bi bi-person'></i> Mange Users</Link></li>
                                <li><span className="dropdown-item" onClick={logout}><i className='bi bi-box-arrow-right'></i> Logout</span></li>
                            </ul>
                        </div>
                    </div>

                    <p>Checked {checkTotal} out of {urls && urls.length} urls</p>
                    <div className={"url-list-wrap " + ((generating === true) ? "generating" : "")}>
                        <div>
                            <div className="d-flex align-items-center">
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

                                <div>
                                    {
                                        urls && urls.map((_url, index) => {
                                            if (index == 0) {
                                                checkTotal = 0
                                            }
                                            if (_url.checked === 1) {
                                                checkTotal++
                                            }
                                            // let checked = isCheck.includes('' + _url.id + '')
                                            return <Url key={index} index={index} id={_url.id} url={_url.url} checked={_url.checked} folder={_url.folder} handleClick={handleClick} current={currentUrl} />

                                        })
                                    }
                                </div>
                            }
                        </div>
                    </div>

                    <hr />

                    {(progressStyle === 'animated' && generating === true) && <ProgressBar now={progress} animated className='mb-2' />}

                    {generating && <div className='mb-2'>{'Scanning ' + activeUrl}</div>}

                    <div className='mb-2'>{status}</div>

                    {generating && <div className='mb-4'>Generating site {currentCheck} of {checkTotal}</div>}

                    <button className='btn btn-primary mb-4' onClick={() => { reset(); generate(); }} disabled={generating}>Generate</button>

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

            <div id='bottom'></div>

            <div className='scroll-btns'>
                <a href='#root'><span className='bi bi-chevron-up'></span></a>
                <a href='#bottom'><span className='bi bi-chevron-down'></span></a>
            </div>

        </>
    );
}

export default Home;