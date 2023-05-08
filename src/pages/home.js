import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";


export const Home = () => {
    const [cookies, setCookies] = useCookies(["access_token"])
    const navigate = useNavigate()

    const logout = () => {
        setCookies("access_token", "");
        window.localStorage.removeItem("userID");
        navigate("/auth");
    };

    return (
    <div>
        <h2>Financial Planner</h2>
        <button onClick={logout}>Logout</button>
    </div>
    );
}