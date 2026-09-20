import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

export default function Login(){
  const [form,setForm]=useState({email:"",password:""});
  const {login,loading}=useAuth();
  const nav=useNavigate();
  const submit=async e=>{e.preventDefault();try{const d=await login(form);toast.success("Welcome back");nav(d.user.role==="recruiter"?"/recruiter":"/jobs");}catch(e){toast.error(e.response?.data?.message||"Could not sign in");}};
  return <div className="auth-page"><div className="auth-card"><Link to="/" className="brand center"><span className="brand-mark">J</span><span>JobNova</span></Link><div className="auth-title"><h1>Welcome back</h1><p>Sign in to continue your job journey.</p></div><form onSubmit={submit} className="form-stack"><label>Email<input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label><label>Password<input type="password" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></label><button className="btn primary large full" disabled={loading}>{loading?"Signing in...":"Sign in"}</button></form><p className="auth-switch">New to JobNova? <Link to="/register">Create account</Link></p></div></div>
}
