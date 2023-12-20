import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import UserFormModal from './UserFormModal';
import { Spinner } from 'react-bootstrap';
import UserDeleteModal from './UserDeleteModal';

function ManageUsers() {

    const [users, setUsers] = useState([])
    const [addUserModal, setAddUserModal] = useState(false);
    const [deleteUserModal, setDeleteUserModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [deleteID, setDeleteID] = useState(0);

    let baseURL = process.env.REACT_APP_API_URL + "users/get";
    // console.log(baseURL)

    const fetchUsers = async () => {
        console.log('fetchUsers')

        await axios.get(baseURL).then((response) => {
            setUsers(response.data);
            setLoading(false)
        }).catch((error) => {
            if (error.response) {
                console.log(error.response.data);
                setLoading(false)
            }
        });
    }

    useEffect(() => {
        console.log('useeffect manageUsers')
        if (loading === true) {
            fetchUsers({})
        }
    }, [])

    const addUserModalCloseHandle = () => {
        setAddUserModal(false);
    }

    const deleteUserModalCloseHandle = () => {
        setDeleteUserModal(false);
    }

    const handleDelete = (id) => (e) => {
        e.preventDefault()
        setDeleteID(id)
        setDeleteUserModal(true)

        console.log(id);
    };

    return <>
        <div className="container">
            <div className="wrap">
                <div className='d-flex justify-content-center title'>
                    <Link to="/" className='btn btn-link btn-icon action--left'><i className='bi bi-chevron-left'></i> Back</Link>
                    <h1 className='mx-auto'>Sitemap Users</h1>
                    <button className='btn btn-primary' onClick={() => setAddUserModal(true)}>Add</button>
                </div>
                <hr />
                <div>
                    {loading ?
                        <div className='text-center mb-4'><Spinner animation="border" /></div> :
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    users.map((user, index) => {
                                        return <tr key={index}>
                                            <td className='align-middle'>{user.name}</td>
                                            <td className='align-middle'>{user.email}</td>
                                            <td className='align-middle'>{user.role}</td>
                                            <td className='align-middle'>
                                                <button className='btn btn-link text-danger' onClick={handleDelete(user.id)}><i className='bi bi-trash'></i></button>
                                            </td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    }

                    {addUserModal && <UserFormModal showModal={addUserModal} hideModal={addUserModalCloseHandle} confirmModal={fetchUsers} />}
                    {deleteUserModal && <UserDeleteModal showModal={deleteUserModal} hideModal={deleteUserModalCloseHandle} id={deleteID} doneDelete={fetchUsers} />}

                </div>
            </div>
        </div>
    </>
}

export default ManageUsers;