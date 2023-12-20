import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from 'axios';

const UserFormModal = ({ showModal, hideModal, confirmModal, id }) => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cpassword, setCPassword] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        let baseURL = process.env.REACT_APP_API_URL + "users/add";

        if (name === "" || email === "" || password === "" || cpassword === "" || role === "") {
            setError('All fields required')
        } else if (password !== cpassword) {
            setError('Passwords are not the same')
        } else {
            axios
                .post(baseURL, {
                    name: name,
                    email: email,
                    password: password,
                    role: role
                })
                .then((response) => {
                    hideModal()
                    confirmModal()
                }).catch(error => {
                    setError(error)
                });
        }
    }

    // useEffect(() => {
    //     console.log(role)
    // }, [role])

    return (
        <Modal className='modal-md' show={showModal} onHide={hideModal} aria-labelledby="contained-modal-title-vcenter" centered>
            <form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>User Form</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <p className="alert alert-danger">{error}</p>}
                    <div className='form-group mb-3'>
                        <input type="text" className='form-control' required placeholder='Name' value={name} onChange={(e) => { setName(e.target.value) }} />
                    </div>
                    <div className='form-group mb-3'>
                        <input type="email" className='form-control' required placeholder='Email' value={email} onChange={(e) => { setEmail(e.target.value) }} />
                    </div>
                    <div className='form-group mb-3'>
                        <input type="password" className='form-control' required placeholder='Password' value={password} onChange={(e) => { setPassword(e.target.value) }} />
                    </div>
                    <div className='form-group mb-3'>
                        <input type="password" className='form-control' required placeholder='Confirm Password' value={cpassword} onChange={(e) => { setCPassword(e.target.value) }} />
                    </div>
                    <div className='form-group mb-3'>
                        <select className="form-control" onChange={(e) => { setRole(e.target.value) }}>
                            <option value="">Role</option>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="default" onClick={hideModal}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" onClick={() => handleSubmit}>
                        Submit
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    )
}

export default UserFormModal;