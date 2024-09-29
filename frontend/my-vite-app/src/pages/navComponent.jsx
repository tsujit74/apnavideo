import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

export default function NavComponent() {
    const navigate = useNavigate();
    //const [username, setUsername] = useState(null);
    const {user,setUser} = useUser();

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUser(storedUsername);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove token
        localStorage.removeItem('username'); // Remove username
        setUser(null); // Clear local state
        navigate('/auth'); // Redirect to login
    };

    return (
        <div className='navBar'>
            <nav>
                <div className="navLogo" onClick={() => navigate("/")}>
                    <h2>Apna Video</h2>
                </div>
                <div className="navList">
                {user ? (
            <>
              <p style={{fontWeight:"bold"}}>{user}</p>
              <p onClick={handleLogout}>Logout</p>
            </>
          ) : (
            <>
              <p onClick={() => navigate("/g1u2e3s4t")}>Guest</p>
              <p onClick={() => navigate("/auth")}>Register</p>
              <div role="button" onClick={() => navigate("/auth")}>
                <p>Login</p>
              </div>
            </>
          )}
                </div>
            </nav>
        </div>
    );
}
