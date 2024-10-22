import { Outlet, useNavigate } from "react-router-dom";
import { deleteLocalStorage } from "./helpers/authFetch";

export function Layout() {
    const isAuthenticated = !!localStorage.getItem('accessToken');
    const navigate = useNavigate();
    const handleLogout = () => {
        deleteLocalStorage();
        navigate('/login');
    }
    return (<div>
        {isAuthenticated &&
            <div className="logout">
                <button type="button" onClick={handleLogout}>Logout</button>
            </div>
        }
        <div className="content">
            <Outlet />
        </div>
    </div>);
}