import { useState, useContext } from 'react';
import { UserContext } from './AuthContext';
import { useNavigate } from 'react-router-dom'

function Login() {
    const { loginUser, wait, loggedInCheck } = useContext(UserContext);
    const [redirect, setRedirect] = useState(false);
    const [errMsg, setErrMsg] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!Object.values(formData).every(val => val.trim() !== '')) {
            setErrMsg('Please fill in all required fields!');
            return;
        }

        const data = await loginUser(formData);
        if (data.success) {
            e.target.reset();
            setRedirect('Redirecting...');
            await loggedInCheck();
            return;
        }
        setErrMsg(data.message);
    };

    const onChangeInput = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    return (
        <>
            <div className="login-wrap">
                <form method="post" onSubmit={handleSubmit}>
                    <h4 className="text-center caps mb-3">Login</h4>
                    {errMsg && <div className='mb-3'>{errMsg}</div>}
                    <div className="form-group mb-3">
                        <input type="text" className="form-control w-100" placeholder="Email" name="email" value={formData.email} onChange={onChangeInput} />
                    </div>
                    <div className="form-group mb-3">
                        <input type="password" className="form-control w-100" placeholder="Password" name="password" value={formData.password} onChange={onChangeInput} />
                    </div>
                    <div>
                        <input type="submit" value="Submit" disabled={wait} className="btn btn-primary btn-block w-100" />
                    </div>
                </form>
            </div>
        </>
    );
}
export default Login;