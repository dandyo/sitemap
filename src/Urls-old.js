import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

function Urls() {
    const [urls, setUrls] = useState([]);

    const fetchUrls = async () => {

        await getDocs(collection(db, "urls"))
            .then((querySnapshot) => {
                const newData = querySnapshot.docs
                    .map((doc) => ({ ...doc.data(), id: doc.id }));
                setUrls(newData);
                // console.log(users, newData);
            })

    }

    useEffect(() => {
        fetchUrls();
    }, []);

    return (
        <>
            <div className="url-list-wrap">
                <h3>URL List</h3>
                <div>
                    <div className="d-flex align-items-center">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="" id="selectall" />
                            <label className="form-check-label" htmlFor="selectall">
                                Select All
                            </label>
                        </div>
                        <div className="ms-auto">
                            <a className="btn py-0 px-1 fw-bold" href="#urlform" data-fancybox="urlform"><i className="bi bi-plus-lg"></i></a>
                        </div>
                    </div>
                    <hr />
                    <ul className="mb-3">
                        {urls?.map((url, i) => (
                            <li className="url-list-item" key={i}>
                                <span className="drag-handle"><i className="bi bi-grip-vertical"></i></span>
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" value="{url.id}" id="url-{url.id}" />
                                    <label className="form-check-label" htmlFor="url-{{url.id}}">
                                        {url.url}
                                    </label>
                                    <span className="folder">{url.folder}</span>
                                </div>

                                <div className="btn-wrap">
                                    <button className="btn btn-edit"><i className="bi bi-pencil-square"></i></button>
                                    <button className="btn btn-delete"><i className="bi bi-trash3-fill"></i></button>
                                </div>
                            </li>
                        ))
                        }
                    </ul>

                    {/* <div className="text-center">
                        <a href="#" className="btn btn-primary px-md-5">ADD</a>
                    </div> */}
                </div>
            </div>
        </>
    );
}

export default Urls;