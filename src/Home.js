
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from "firebase/firestore"
import { db } from './firebase'
import Url from './Url';
import { UserAuth } from './AuthContext';
import UrlForm from './UrlForm';
import { ProgressBar } from 'react-bootstrap';
import Checkbox from './Checkbox';
import { doc, updateDoc } from "firebase/firestore";

function Home() {
    const { logout } = UserAuth();
    const navigate = useNavigate();
    let [checkTotal, setCheckTotal] = useState(0)

    let [isCheckAll, setIsCheckAll] = useState(false);
    const [isCheck, setIsCheck] = useState([]);

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

    useEffect(() => {
        const taskColRef = query(collection(db, 'urls'), orderBy('order', 'asc'), orderBy('datecreated', 'asc'))
        onSnapshot(taskColRef, (snapshot) => {
            setUrls(snapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            })))
        })
    }, [])

    useEffect(() => {
        var x = 0;
        for (var i = 0; i < urls.length; i++) {
            if (urls[i].data.checked === true) {
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
    }

    // const [post, setPost] = React.useState(null);

    let [currentUrl, setCurrentUrl] = useState(0);
    let [progress, setProgress] = useState(0);
    let [status, setStatus] = useState('');
    let [progressStyle, setProgressStyle] = useState('animated');

    // console.log('urls.length=' + urls.length);
    useEffect(() => {
        if (progress === 100) {
            setProgressStyle('')
            setStatus('Done generating sitemaps')
            setCurrentUrl(0)
        } else {
            setProgressStyle('animated')
        }
    }, [progress])

    let hostname = window.location.hostname;

    const generate = async () => {

        console.log('currentUrl=' + currentUrl);
        if (currentUrl < urls.length) {
            // console.log(urls[currentUrl].data.checked);

            let p = (100 / urls.length) * (currentUrl + 1)
            setProgress(p);
            // console.log('progress=' + p + ', currentUrl + 1=' + parseInt(currentUrl + 1));
            // console.log('url=' + urls[currentUrl].data.url);

            if (urls[currentUrl].data.checked === true) {
                console.log('url=' + urls[currentUrl].data.url);
                setStatus('Scanning ' + urls[currentUrl].data.url);

                let url = urls[currentUrl].data.url;
                url = encodeURIComponent(url);

                if (urls[currentUrl].data.folder !== "") {
                    url = url + '&folder=' + encodeURIComponent(urls[currentUrl].data.folder);
                }

                let baseURL = '';

                if (hostname === 'localhost') {
                    baseURL = "http://sitemap.local/generator.php?url=" + url;
                } else {
                    baseURL = "https://rekserver.com/sitemap/generator.php?url=" + url;
                }

                var es = new EventSource(baseURL);
                console.log(baseURL);

                es.addEventListener('message', function (e) {
                    var result = JSON.parse(e.data);

                    // console.log(result.message);

                    if (result.message === 'CLOSE') {
                        console.log('Received CLOSE closing');
                        es.close();

                        setCurrentUrl(currentUrl++);
                        generate();
                    } else {
                        // console.log(result.progress);
                        console.log(result.message);
                        setStatus(result.message);
                    }
                });

                es.addEventListener('error', function (e) {
                    setStatus('Something went wrong');
                    console.log('error generating sitemap of ' + url);
                    console.log(e);
                    es.close();
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

    // const test = () => {
    //     for (var $i = 0; $i < urls.length; $i++) {
    //         console.log('i=' + $i + ', ' + urls[$i].data.url);
    //     }
    // }

    // function stopTask() {
    //     es.close();
    //     console.log('Interrupted');
    // }

    const handleClick = async (e) => {
        const { id, checked } = e.target;
        setIsCheck([...isCheck, id]);
        if (!checked) {
            setIsCheck(isCheck.filter(item => item !== id));
        }

        // const handleCheck = async () => {
        const urlDocRef = doc(db, 'urls', id)
        // const check = (checked === true) ? false : true;
        try {
            await updateDoc(urlDocRef, {
                checked: checked
            })
        } catch (err) {
            alert(err)
        }
        // }
    };

    const handleSelectAll = async (e) => {
        setIsCheckAll(!isCheckAll);
        // setIsCheck(urls.map(li => li.id));
        setIsCheck(urls.map(async (li) => {
            const urlDocRef = doc(db, 'urls', li.id)
            try {
                await updateDoc(urlDocRef, {
                    checked: !isCheckAll
                })
            } catch (err) {
                alert(err)
            }
        }));
        if (isCheckAll) {
            setIsCheck([]);
        }

        // const urlDocRef = doc(db, 'urls')
        // try {
        //     await updateDoc(urlDocRef, {
        //         checked: isCheckAll
        //     })
        // } catch (err) {
        //     alert(err)
        // }
    };



    return (
        <>
            <div className="container">
                <div className="wrap">
                    <h1>Sitemap</h1>
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
                            <ul className="mb-3">
                                {urls.map((_url) => {
                                    return <Url key={_url.id} id={_url.id} url={_url.data.url} isChecked={isCheck.includes(_url.data.id)} checked={_url.data.checked} folder={_url.data.folder} handleClick={handleClick} />
                                })}
                            </ul>
                        </div>
                    </div>

                    {progressStyle === 'animated' ? <ProgressBar now={progress} animated className='mb-2' /> : <ProgressBar now={progress} className='mb-2' />}
                    {/* <button onClick={test}>click</button> */}

                    <div className='mb-4'>{status}</div>

                    <button className='btn btn-primary' onClick={generate}>Generate</button>
                    <p><button className='btn btn-link' onClick={handleLogout}>Logout</button></p>

                    {addModal && <UrlForm showModal={addModal} modalCloseHandle={addModalHandle} />}
                </div>
            </div>
        </>
    );
}

export default Home;