import React, { useState, useEffect } from 'react'
import { Modal, Button, Spinner, Tab, Tabs } from "react-bootstrap";
import SettingsCheckbox from './SettingsCheckbox';
import axios from 'axios';

const ListSettingsModal = ({ showModal, hideModal, confirmModal, id }) => {
    const [urls, setUrls] = useState([])
    const [dailyUrls, setDailyUrls] = useState('')
    const [monthlyUrls, setMonthlyUrls] = useState('')
    const [asNeededUrls, setAsNeededUrls] = useState('')
    const [loading, setLoading] = useState(true);
    const [types, setTypes] = useState([])

    const [dailyCheckedUrls, setDailyCheckedUrls] = useState([])
    const [monthlyCheckedUrls, setMonthlyCheckedUrls] = useState([])
    const [asNeededCheckedUrls, setAsNeededCheckedUrls] = useState([])

    const [istypecheck, setistypecheck] = useState([]);

    let baseUrlApi = process.env.REACT_APP_API_URL + "urls";
    let baseTypesApi = process.env.REACT_APP_API_URL + "types?type=";

    useEffect(() => {
        fetchUrls()
        fetchTypes()
        // fetchdailyUrls()
    }, [])


    const fetchUrls = () => {
        console.log('fetchUrls')
        axios.get(baseUrlApi).then((response) => {
            if (response.data) {
                setUrls(response.data)
            }
            setLoading(false)
        }).catch((error) => {
            if (error.response) {
                console.log(error.response.data);
            }
        });
    }

    const fetchTypes = () => {
        console.log('fetchdailyUrls')
        axios.get(baseTypesApi).then((response) => {
            if (response.data) {
                setTypes(response.data)
            }
            setLoading(false)
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
        let _dailyUrls = []
        if (dailyUrls !== '') {
            if (dailyUrls.indexOf(',') != -1) {
                _dailyUrls = dailyUrls.split(',')
                // console.log(_dailyUrls)
            } else {
                _dailyUrls = [dailyUrls]
            }
            setDailyCheckedUrls(_dailyUrls)
        }
    }, [dailyUrls])

    useEffect(() => {
        let _monthlyUrls = []
        if (monthlyUrls !== '') {
            if (monthlyUrls.indexOf(',') != -1) {
                _monthlyUrls = monthlyUrls.split(',')
                // console.log(_dailyUrls)
            } else {
                _monthlyUrls = [monthlyUrls]
            }
            setMonthlyCheckedUrls(_monthlyUrls)
        }
    }, [monthlyUrls])

    useEffect(() => {
        let _asNeededUrls = []
        if (asNeededUrls !== '') {
            if (asNeededUrls.indexOf(',') != -1) {
                _asNeededUrls = asNeededUrls.split(',')
                // console.log(_dailyUrls)
            } else {
                _asNeededUrls = [asNeededUrls]
            }
            setAsNeededCheckedUrls(_asNeededUrls)
        }
    }, [asNeededUrls])

    useEffect(() => {
        if (loading == false) {
            console.log(dailyCheckedUrls)
            let arrString = dailyCheckedUrls.join(',')
            // console.log(arrString)

            let apiUrl = process.env.REACT_APP_API_URL + "types/save";
            axios.post(apiUrl, {
                type: 'daily',
                sitemap_id: arrString
            }).then((response) => {
                // console.log(response);
                // if (response.data) {
                //     // setUrls(response.data)
                // }
            }).catch((error) => {
                if (error.response) {
                    console.log(error.response);
                }
            });
        }
    }, [dailyCheckedUrls])

    useEffect(() => {
        if (loading == false) {
            console.log(monthlyCheckedUrls)
            let arrString = monthlyCheckedUrls.join(',')
            // console.log(arrString)

            let apiUrl = process.env.REACT_APP_API_URL + "types/save";
            axios.post(apiUrl, {
                type: 'monthly',
                sitemap_id: arrString
            }).then((response) => {
                // if (response.data) {
                //     // setUrls(response.data)
                // }
            }).catch((error) => {
                if (error.response) {
                    console.log(error.response.data);
                }
            });
        }
    }, [monthlyCheckedUrls])

    useEffect(() => {
        if (loading == false) {
            console.log(asNeededCheckedUrls)
            let arrString = asNeededCheckedUrls.join(',')
            // console.log(arrString)

            let apiUrl = process.env.REACT_APP_API_URL + "types/save";
            axios.post(apiUrl, {
                type: 'asneeded',
                sitemap_id: arrString
            }).then((response) => {
                // if (response.data) {
                //     // setUrls(response.data)
                // }
            }).catch((error) => {
                if (error.response) {
                    console.log(error.response.data);
                }
            });
        }
    }, [asNeededCheckedUrls])


    const [key, setKey] = useState('daily');

    const handleTypeClick = async (e) => {
        const { id, checked, value } = e.target;
        // console.log('value=' + value)
        const utype = e.target.getAttribute('data-utype');
        // const utype = e.target.dataset.utype;
        console.log(utype)
        // console.log(checked)
        if (utype === 'daily') {
            setDailyCheckedUrls([...dailyCheckedUrls, value]);
            if (!checked) {
                setDailyCheckedUrls(dailyCheckedUrls.filter(item => item !== value));
            }
        }

        if (utype === 'monthly') {
            setMonthlyCheckedUrls([...monthlyCheckedUrls, value]);
            if (!checked) {
                setMonthlyCheckedUrls(monthlyCheckedUrls.filter(item => item !== value));
            }
        }

        if (utype === 'asneeded') {
            setAsNeededCheckedUrls([...asNeededCheckedUrls, value]);
            if (!checked) {
                setAsNeededCheckedUrls(asNeededCheckedUrls.filter(item => item !== value));
            }
        }
    }

    // useEffect(() => {
    //     console.log(istypecheck)
    // }, [istypecheck])

    return (
        <Modal className='details-modal modal-lg' show={showModal} onHide={hideModal} aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title>List Settings</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ?
                    <div className='text-center'><Spinner animation="border" /></div> :
                    <>
                        <div className='settings-tab'>
                            <Tabs id="tab-example"
                                activeKey={key}
                                onSelect={(k) => setKey(k)}
                                className="mb-3">
                                <Tab eventKey="daily" title="Daily">
                                    <table className='table'>
                                        <tbody>
                                            {urls.map((_url, index) => {
                                                let checked = dailyCheckedUrls.includes('' + _url.id + '')
                                                // console.log(_url.id)
                                                return <tr key={index}>
                                                    <td>
                                                        <SettingsCheckbox
                                                            key={index}
                                                            url={_url.url}
                                                            id={'t-' + _url.id}
                                                            value={_url.id}
                                                            handleTypeClick={handleTypeClick}
                                                            checked={checked}
                                                            utype={'daily'} />
                                                    </td>
                                                </tr>
                                            })}
                                        </tbody>
                                    </table>
                                </Tab>
                                <Tab eventKey="monthly" title="Monthly">
                                    <table className='table'>
                                        <tbody>
                                            {urls.map((_url, index) => {
                                                let checked = monthlyCheckedUrls.includes('' + _url.id + '')
                                                // console.log(_url.id)
                                                return <tr key={index}>
                                                    <td>
                                                        <SettingsCheckbox
                                                            key={index}
                                                            url={_url.url}
                                                            id={'m-' + _url.id}
                                                            value={_url.id}
                                                            handleTypeClick={handleTypeClick}
                                                            checked={checked}
                                                            utype={'monthly'} />
                                                    </td>
                                                </tr>
                                            })}
                                        </tbody>
                                    </table>
                                </Tab>
                                <Tab eventKey="needed" title="As Needed">
                                    <table className='table'>
                                        <tbody>
                                            {urls.map((_url, index) => {
                                                let checked = asNeededCheckedUrls.includes('' + _url.id + '')
                                                // console.log(_url.id)
                                                return <tr key={index}>
                                                    <td>
                                                        <SettingsCheckbox
                                                            key={index}
                                                            url={_url.url}
                                                            id={'as-' + _url.id}
                                                            value={_url.id}
                                                            handleTypeClick={handleTypeClick}
                                                            checked={checked}
                                                            utype={'asneeded'} />
                                                    </td>
                                                </tr>
                                            })}
                                        </tbody>
                                    </table>
                                </Tab>
                            </Tabs>
                        </div>

                    </>
                }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="default" onClick={hideModal}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={hideModal}>
                    Done
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ListSettingsModal;