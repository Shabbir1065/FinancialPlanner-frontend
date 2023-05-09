import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export const Navbar = () => {
    const [cookies, setCookies] = useCookies(["access_token"]);
    const navigate = useNavigate();
    
    const logout = () => {
        setCookies("access_token", "");
        window.localStorage.removeItem("userID");
        navigate("/auth");
    };
    
    return (
        <header>
            <h3 class="logo">Financial Planner App</h3>
            <div className="logout">
                {!cookies.access_token ? (<Link to="/"></Link>) : (<button onClick={logout}> Logout </button>)}
            </div>
        </header>
        
    );
}