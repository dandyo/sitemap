import React from 'react'
// import { useUrlsContext } from './hooks/useUrlsContext';

const Checkbox = ({ index, id, url, folder, isChecked, handleClick, checked, moreClass }) => {
    // const { dispatch } = useUrlsContext()
    console.log(checked)
    const check = (checked == "1") ? true : false

    var inputProps = {
        checked: 0
    };

    if (checked) {
        inputProps.checked = true;
    }

    // const handleClick = () => {
    //     console.log('asd')
    // }
    return (
        <div className={'form-check ' + moreClass}>
            <input className="form-check-input" type="checkbox" name='url' value={id} id={id} onChange={handleClick} data-checked={checked} data-index={index} {...inputProps} />
            <label className="form-check-label" htmlFor={id}>
                {url}
            </label>
            <span className="folder">{folder}</span>
        </div>
    );
};

export default Checkbox;