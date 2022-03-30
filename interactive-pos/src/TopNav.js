import "./assets/css/style.css";
import { NavLink } from 'react-router-dom';

export function TopNav({user, onSignOut, base}){
    
    return (
        <div className="pos-top-bar pos-display-flex pos-flex-center pos-flex-justify-between">
            <h3 className="pos-padding-5">AIPOS</h3>
            {user && <nav className="pos-display-flex">
                <NavLink to={base+"/order"} className="pos-padding-5 pos-btn">Order</NavLink>
                <NavLink to={base+"/orders"} className="pos-padding-5 pos-btn">Orders</NavLink>
                <NavLink to={base} className="pos-padding-5 pos-btn">{user.name}</NavLink>
                <a href className="pos-padding-5" onClick={onSignOut}>Sign Out</a>
            </nav>}
        </div>
    )
}