import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from "firebase/firestore"
import { db } from './firebase'
import { doc, updateDoc } from "firebase/firestore";
import Url from './Url';

function Test() {

    const [urls, setUrls] = useState([])
    useEffect(() => {
        // const taskColRef = query(collection(db, 'urls'), orderBy('order', 'asc'), orderBy('datecreated', 'asc'))
        const urlsColRef = query(collection(db, 'urls'), orderBy('url', 'asc'))
        const snapshot = onSnapshot(urlsColRef, (snapshot) => {
            setUrls(snapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            })))

            // setLoading(false)
        })

        return snapshot
    }, [])


    return (
        <>
            <ul>
                {urls.map((_url, index) => (
                    <div>('{_url.data.url}','',0),</div>
                ))}
            </ul>
        </>
    )
}
export default Test;