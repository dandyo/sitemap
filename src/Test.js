import React, { useState, useEffect } from 'react';
import { ProgressBar } from 'react-bootstrap';
import axios from 'axios';

function Test() {

    const [urls, setUrls] = useState([])
    // const [loading, setLoading] = useState(true);
    let [progress, setProgress] = useState(0)
    let [currentUrl, setCurrentUrl] = useState(0)
    let [activeUrl, setActiveUrl] = useState('');
    const [generating, setGenerating] = useState(false)
    let [progressStyle, setProgressStyle] = useState('animated');
    // let [status, setStatus] = useState('');

    let baseURL = process.env.REACT_APP_API_URL + "api/index.php/url/list";

    useEffect(() => {
        fetchUrls()
    }, [])

    const fetchUrls = () => {
        console.log('fetching urls...')
        axios.get(baseURL).then((response) => {
            setUrls(response.data);
            // setLoading(false)

            console.log(response.data)
        }).catch((error) => {
            if (error.response) {
                console.log(error.response.data); // => the response payload 
            }
        });
    }
    const delay = ms => new Promise(res => setTimeout(res, ms));

    useEffect(() => {
        if (progress > 99) {
            setProgressStyle('')
            setCurrentUrl(0)
            setGenerating(false)
        } else {
            setProgressStyle('animated')
        }

        // console.log('progress=' + progress)
    }, [progress])

    // useEffect(() => {
    //     getActiveUrl()
    // }, [currentUrl, urls])

    const generate = async () => {
        setGenerating(true)
        // setStatus('generating = ' + currentUrl);
        setProgress(((currentUrl) / urls.length) * 100)
        // console.log(currentUrl)

        // console.log(urls[currentUrl].url)

        if (currentUrl < urls.length) {
            console.log('generating= ' + urls[currentUrl].url)
            setActiveUrl(urls[currentUrl].url)
            // setStatus('generating = ' + currentUrl);
            await delay(500);
            setCurrentUrl(currentUrl++)
            generate()
        }
    }

    // const getActiveUrl = () => {
    //     urls.map((_url, index) => {
    //         if (currentUrl === index) {
    //             console.log(index + ' - ' + _url.url)
    //             setActiveUrl(_url.url)
    //         }
    //         return index
    //     })
    // }

    const reset = () => {
        setCurrentUrl(0)
        setProgress(0)
        setActiveUrl('')
        setGenerating(false)
    }

    return (
        <>
            <div className='container text-center'>
                <p>{urls.length} urls</p>
                <p className='text-center'>
                    <button onClick={() => { reset(); generate(); }}>Generate</button>
                </p>
                <p>Scanning: {activeUrl}</p>
                {/* <p>status: {status}</p> */}
                <p>progress: {progress}</p>
                {(progressStyle === 'animated' && generating === true) && <ProgressBar now={progress} animated className='mb-2' />}
                {/* <p>{activeUrl}</p> */}
                <ul>
                    {urls.map((_url, index) => (
                        <p key={index}>{_url.url}</p>
                    ))}
                </ul>
            </div>
        </>
    )
}
export default Test;