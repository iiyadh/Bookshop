import { Navigate } from "react-router-dom";
import { useEffect, useState ,useContext } from 'react';
import {UserC} from '../Context/UserContext';
import axios from "axios";

function DashboardAuth({ children }) {
    const {user, setUser} = useContext(UserC);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const resp = await axios.get('http://localhost:5000/check', { withCredentials: true });
                console.log(resp.data.user);
                if (resp.data.user){
                    setUser(resp.data.user);
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    },[]);

    if (loading) {
        return (
            <h1>Loading ....</h1>
        );
    }

    return user ? children : <Navigate to="/" />;
}

export default DashboardAuth;