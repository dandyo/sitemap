
import { useNavigate } from 'react-router-dom';
import React from 'react';
import UrlList from './UrlList';
import { Fancybox } from "@fancyapps/ui";
import { UserAuth } from './AuthContext';
import UrlForm from './UrlForm';

Fancybox.bind('[data-fancybox]', {});

function Home() {
    const { logout } = UserAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
            console.log('You are logged out')
        } catch (e) {
            console.log(e.message);
        }
    };

    return (
        <>
            <div className="container">
                <div className="wrap">
                    <h1>Sitemap</h1>
                    <p>12 websites to generate. <a href='#list' data-fancybox>Edit list</a></p>

                    <div className="progress mb-2" role="progressbar" aria-label="Basic example" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                        <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: '25%' }}></div>
                    </div>

                    <div className='mb-4'>Status</div>

                    <button className='btn btn-primary'>Generate</button>

                    <div id='list' style={{ display: 'none' }}>
                        <UrlList />
                    </div>
                    <p><button className='btn btn-link' onClick={handleLogout}>Logout</button></p>

                    <div id='urlform' style={{ display: 'none' }}>
                        <UrlForm />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;