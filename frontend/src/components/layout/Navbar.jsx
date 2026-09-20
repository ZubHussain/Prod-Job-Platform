import { BriefcaseBusiness, Bell, LogOut, Plus, UserRound } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar(){
  const { user, logout } = useAuth();
  return (
    <header className="nav-wrap">
      <nav className="container nav">
        <Link className="brand" to="/"><span className="brand-mark">J</span><span>JobNova</span></Link>
        <div className="nav-links">
          <NavLink to="/jobs">Explore jobs</NavLink>
          {user?.role==="candidate" && <NavLink to="/applications">Applications</NavLink>}
          {user?.role==="recruiter" && <NavLink to="/recruiter">Recruiter</NavLink>}
        </div>
        <div className="nav-actions">
          {!user ? <>
            <Link className="btn ghost" to="/login">Sign in</Link>
            <Link className="btn primary" to="/register">Join now</Link>
          </> : <>
            {user.role==="recruiter" && <Link className="icon-btn" to="/recruiter/jobs/new" title="Post job"><Plus size={18}/></Link>}
            <Link className="icon-btn" to="/notifications"><Bell size={18}/></Link>
            <Link className="avatar-link" to="/profile"><UserRound size={17}/><span>{user.name?.split(" ")[0]}</span></Link>
            <button className="icon-btn" onClick={logout}><LogOut size={18}/></button>
          </>}
        </div>
      </nav>
    </header>
  );
}
