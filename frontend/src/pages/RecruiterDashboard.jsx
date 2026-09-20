import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BriefcaseBusiness, Plus, Users } from "lucide-react";
import { api } from "../lib/api";

export default function RecruiterDashboard(){
  const [jobs,setJobs]=useState([]); const [apps,setApps]=useState([]);
  useEffect(()=>{api.get("/jobs/mine").then(r=>setJobs(r.data));api.get("/applications/recruiter").then(r=>setApps(r.data));},[]);
  return <section className="container page-section"><div className="dashboard-head"><div><p className="eyebrow">Recruiter workspace</p><h1>Hiring, simplified.</h1></div><Link className="btn primary" to="/recruiter/jobs/new"><Plus size={17}/> Post a job</Link></div><div className="stats-grid"><div className="stat-card"><BriefcaseBusiness/><span><strong>{jobs.length}</strong><small>Jobs posted</small></span></div><div className="stat-card"><Users/><span><strong>{apps.length}</strong><small>Applicants</small></span></div><div className="stat-card"><Users/><span><strong>{apps.filter(x=>x.status==="shortlisted").length}</strong><small>Shortlisted</small></span></div></div><div className="panel"><div className="section-head"><div><p className="eyebrow">Recent roles</p><h2>Your job posts</h2></div><Link to="/recruiter/applications">View applicants</Link></div><div className="table-card flat"><div className="table-row table-head"><span>Role</span><span>Type</span><span>Location</span><span>Status</span></div>{jobs.map(j=><div className="table-row" key={j._id}><span><strong>{j.title}</strong><small>{j.field}</small></span><span>{j.employmentType}</span><span>{j.location}</span><span><b className="status published">{j.status}</b></span></div>)}</div></div></section>
}
