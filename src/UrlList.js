function UrlList() {
    return (
        <>
            <div className="url-list-wrap">
                <h3>URL List</h3>
                <div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="" id="selectall" />
                        <label class="form-check-label" for="selectall">
                            Select All
                        </label>
                    </div>
                    <hr />
                    <ul>
                        <li className="url-list-item">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" value="" id="" />
                                <label class="form-check-label" for="">
                                    rekmarketing.com
                                </label>
                                <span className="folder">/rekmarketing</span>
                            </div>

                            <div className="btn-wrap">
                                <button className="btn btn-edit"><i className="bi bi-pencil-square"></i></button>
                                <button className="btn btn-delete"><i className="bi bi-trash3-fill"></i></button>
                            </div>
                        </li>
                        <li className="url-list-item">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" value="" id="" />
                                <label class="form-check-label" for="">
                                    rekmarketing.com
                                </label>
                                <span className="folder">/rekmarketing</span>
                            </div>

                            <div className="btn-wrap">
                                <button className="btn"><i className="bi bi-pencil-square"></i></button>
                                <button className="btn btn-delete"><i className="bi bi-trash3-fill"></i></button>
                            </div>
                        </li>
                        <li className="url-list-item">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" value="" id="" />
                                <label class="form-check-label" for="">
                                    rekmarketing.com
                                </label>
                                <span className="folder">/rekmarketing</span>
                            </div>

                            <div className="btn-wrap">
                                <button className="btn"><i className="bi bi-pencil-square"></i></button>
                                <button className="btn btn-delete"><i className="bi bi-trash3-fill"></i></button>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}

export default UrlList;