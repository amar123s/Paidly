import { useState } from "react";
import {useNavigate} from "react-router-dom";
import { useAuth} from "../context/AuthContext.jsx"


export default function Login(){
    const {login} = useAuth();
    const navigate= useNavigate();
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [error,setError] = useState("");
    

    async function submit(e) {
        e.preventDefault();
        try{
            await login(email,password);
            navigate("/");
        }catch{
            setError("Invalid email or password");
        }
    }

return (
    <form className="card stack" style={{ maxWidth: 380, margin: "60px auto" }} onSubmit={submit}>
      <h1>Sign in</h1>
      <div><label>Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
      <div><label>Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
      {error && <p className="error">{error}</p>}
      <button className="btn">Sign in</button>
    </form>
  );
}