import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./userProvider";

function Login({ base }) {

    const [formData, setFormData] = useState({username:"", password:""});
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();
    const [user, setUser] = useContext(UserContext);

    function signIn(evt) {
        evt.preventDefault();
        if (formData.username && formData.password) {
            setMessage(null);
            fetch("http://localhost:3001/users").then(resp => resp.json()).then((users) => {
                const user = users.find(u => u.username === formData.username && u.password === formData.password);
                if (user) {
                    delete user.password;
                    // sessionStorage.setItem("user", JSON.stringify(user));
                    setUser(user);
                }
                else{
                    setMessage("Invalid username or password");
                }
            })
            .catch(e=>{
                setMessage("Something went wrong");
            });
        }
        else{
            setMessage("Invalid username or password");
        }
    }

    function setField(event) {
        const name = event.target.name;
        const value = event.target.value;
        setFormData({ ...formData, [name]: value });
    }

    useEffect(()=>{
        console.log("Effect is run")
        if(user){
            navigate("order")
        }
    }, [user]);

    return (
        <div className="pos-display-flex pos-flex-justify-center pos-flex-column pos-flex-justify-between pos-page">
            <form id="login" className="pos-align-self-center pos-card pos-w-30" onSubmit={signIn}>
                <div className="pos-card-header">
                    <h3>Sign In</h3>
                </div>
                <hr />
                <div className="pos-card-body">
                    {message && <div style={{color:"red"}}>{message}</div>}
                    <div className="form-group pos-w-100">
                        <label>Username</label>
                        <input type="text" name="username" value={formData.username} onChange={setField} className="pos-w-90" required />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={setField} className="pos-w-90" required />
                    </div>
                </div>
                <div className="pos-card-footer">
                    <button className="pos-btn">Sign In</button>
                </div>
            </form>
        </div>

    );
}

export default Login;