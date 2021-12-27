import React, {FunctionComponent} from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import LoginButton from "../Button/Login/LoginButton";
import LogoutButton from "../Button/Logout/LogoutButton";
import {Link} from "react-router-dom";
   
const Menu : FunctionComponent = () => {    
    const user = useSelector((state: RootState) => {
        return state?.userReducer?.user });    
    return (
    <nav className="nav flex flex column">
        <span className="app-name">Crypto Dashboard</span>
        <ul>
            {user?.imageUrl && <li className="flex user-menu"><img className="avatar" src={user?.imageUrl} alt="avatar"/><span className="user-name">{user?.givenName}</span></li>}
            <li>            
            </li>
            <li>
                <Link to="/dashboard"><span>Transactions</span><img src="transactions.png" alt="transactions"/></Link>
            </li>
            <li>
                <Link to="/wallets"><span>Wallets</span><img src="wallets.png" alt="wallets"/></Link>
            </li>
            <li>
                {user.email ? <LogoutButton /> : <LoginButton />}            
            </li>
            <li>            
            </li>
        </ul>
    </nav>);
}
export default Menu;