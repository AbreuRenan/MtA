import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../AppContext'; // Importe o AppContext

function Logout() {
    const navigate = useNavigate();
    const { auth, setLoggedIn } = React.useContext(AppContext); // Obtenha 'auth' do contexto

    React.useEffect(() => {
        const performFirebaseLogout = async () => {
            try {
                if (auth) { 
                    await auth.signOut(); 
                }
                localStorage.clear(); 
                setLoggedIn(false)
                navigate('/'); 
            } catch (error) {
                setLoggedIn(false)
                localStorage.clear();
                navigate('/');
            }
        };
        performFirebaseLogout();
    }, [auth, navigate]);

    return null;
}

export default Logout;