import React from 'react'

const SettingsCheckbox = ({ id, value, url, handleTypeClick, checked, moreClass = '', utype }) => {
    return (
        <div className={'form-check ' + moreClass}>
            <input className="form-check-input" type="checkbox" name='type' value={value} id={id} checked={checked} onChange={handleTypeClick} data-utype={utype} />
            <label className="form-check-label" htmlFor={id}>
                {url}
            </label>
        </div>
    );
};

export default SettingsCheckbox;