import { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const Axios = axios.create({
    baseURL: process.env.REACT_APP_API_URL
});

export const UserContextProvider = ({ children }) => {
    const [theUser, setUser] = useState({});
    const [wait, setWait] = useState(false);

    const loginUser = async ({ email, password }) => {
        setWait(true);
        try {
            const { data } = await Axios.post('users/signin', {
                email,
                password
            });

            if (data.success && data.token) {
                localStorage.setItem('loginToken', data.token);
                setWait(false);
                return { success: 1 };
            }
            setWait(false);
            return { success: 0, message: data.message };
        }
        catch (err) {
            setWait(false);
            return { success: 0, message: 'Server Error!' };
        }
    }

    const loggedInCheck = async () => {
        const loginToken = localStorage.getItem('loginToken');
        Axios.defaults.headers.common['Authorization'] = 'Bearer ' + loginToken;

        if (loginToken) {
            const { data } = await Axios.get('users');
            if (data.success && data.user) {
                setUser(data.user);
                return;
            }
            setUser(null);
        } else {
            logout()
        }
    }

    useEffect(() => {
        async function asyncCall() {
            await loggedInCheck();
        }
        asyncCall();
    }, []);

    const logout = () => {
        localStorage.removeItem('loginToken');
        setUser(null);
    }

    return (
        <UserContext.Provider value={{ loginUser, wait, user: theUser, loggedInCheck, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContextProvider;
// export const UserAuth = () => {
//     return useContext(UserContext);
// };