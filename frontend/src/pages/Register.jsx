import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

export default function Register(){
  const [form,setForm]=useState({name:"",email:"",password:"",role:"candidate",companyName:""});
  const {register,loading}=useAuth(); const nav=useNavigate();
  const submit=async e=>{e.preventDefault();try{const d=await register(form);toast.success("Account created");nav(d.user.role==="recruiter"?"/recruiter":"/profile");}catch(e){toast.error(e.response?.data?.message||"Could not create account");}};
  return <div className="auth-page"><div className="auth-card wide"><Link to="/" className="brand center"><span className="brand-mark">J</span><span>JobNova</span></Link><div className="auth-title"><h1>Create your account</h1><p>One profile. Better opportunities.</p></div><form onSubmit={submit} className="form-stack"><div className="segmented"><button type="button" className={form.role==="candidate"?"active":""} onClick={()=>setForm({...form,role:"candidate"})}>I’m a candidate</button><button type="button" className={form.role==="recruiter"?"active":""} onClick={()=>setForm({...form,role:"recruiter"})}>I’m hiring</button></div><label>Full name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label><label>Email<input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label>{form.role==="recruiter"&&<label>Company name<input required value={form.companyName} onChange={e=>setForm({...form,companyName:e.target.value})}/></label>}<label>Password<input type="password" minLength="8" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></label><button className="btn primary large full" disabled={loading}>{loading?"Creating...":"Create account"}</button></form><p className="auth-switch">Already a member? <Link to="/login">Sign in</Link></p></div></div>
}
