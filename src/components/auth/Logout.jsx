import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../AppContext'; // Importe o AppContext

function Logout() {
    const navigate = useNavigate();
    const { auth } = React.useContext(AppContext); // Obtenha 'auth' do contexto

    React.useEffect(() => {
        const performFirebaseLogout = async () => {
            try {
                if (auth) { 
                    await auth.signOut(); 
                    console.log("Usuário deslogado do Firebase Auth.");
                }
                localStorage.clear(); 
                console.log("LocalStorage limpo.");
                navigate('/'); 
            } catch (error) {
                console.error("Erro ao deslogar do Firebase:", error);
                localStorage.clear();
                navigate('/');
            }
        };
        performFirebaseLogout();
    }, [auth, navigate]);

    return null;
}

export default Logout;