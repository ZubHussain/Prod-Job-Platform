import { useEffect, useState } from "react";
import { api } from "../lib/api";
import EmptyState from "../components/ui/EmptyState";

export default function CandidateApplications(){
  const [items,setItems]=useState([]);
  useEffect(()=>{api.get("/applications/me").then(r=>setItems(r.data));},[]);
  return <section className="container page-section"><div className="page-hero compact"><p className="eyebrow">Application tracker</p><h1>Your applications</h1></div>{items.length?<div className="table-card"><div className="table-row table-head"><span>Role</span><span>Company</span><span>Match</span><span>Status</span></div>{items.map(a=><div className="table-row" key={a._id}><span><strong>{a.jobTitle}</strong><small>{new Date(a.createdAt).toLocaleDateString()}</small></span><span>{a.companyName}</span><span>{a.matchScore}%</span><span><b className={`status ${a.status}`}>{a.status}</b></span></div>)}</div>:<EmptyState title="No applications yet" text="Explore jobs and send your first application."/>}</section>
}
