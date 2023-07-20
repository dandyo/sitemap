import React from 'react'

const Checkbox = ({ id, url, folder, handleClick, isChecked, checked }) => {
    return (
        <div className="form-check">
            <input className="form-check-input" type="checkbox" value={id} id={id} checked={checked} onChange={handleClick} />
            <label className="form-check-label" htmlFor={id}>
                {url}
            </label>
            <span className="folder">{folder}</span>
        </div>
    );
};

export default Checkbox;