import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { UserAuth } from './AuthContext'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const navigate = useNavigate();
    const { signIn } = UserAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('')
        try {
            await signIn(email, password)
            navigate('/')
        } catch (e) {
            setError(e.message)
            console.log(e.message)
        }
    };

    return (
        <>
            <div className="login-wrap">
                <form method="post" onSubmit={handleSubmit}>
                    <h4 className="text-center caps mb-3">Login</h4>
                    {error && <div className='mb-3'>{error}</div>}
                    <div className="form-group mb-3">
                        <input type="text" className="form-control w-100" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="form-group mb-3">
                        <input type="password" className="form-control w-100" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div>
                        <input type="submit" value={'Submit'} className="btn btn-primary btn-block w-100" />
                    </div>
                </form>
            </div>
        </>
    );
}
export default Login;