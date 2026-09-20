import { useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import JobCard from "../components/jobs/JobCard";
import EmptyState from "../components/ui/EmptyState";

export default function Jobs(){
  const [sp]=useSearchParams();
  const [filters,setFilters]=useState({q:sp.get("q")||"",field:sp.get("field")||"",location:"",workplaceType:""});
  const [data,setData]=useState({items:[],total:0});
  const [loading,setLoading]=useState(true);
  const load=async()=>{setLoading(true);try{const {data}=await api.get("/jobs",{params:filters});setData(data);}finally{setLoading(false);}};
  useEffect(()=>{load();},[]);
  const submit=e=>{e.preventDefault();load();};

  return <section className="container page-section"><div className="page-hero"><p className="eyebrow">Opportunity marketplace</p><h1>Find work worth doing.</h1><p>{data.total} roles across ambitious teams.</p></div><form className="search-bar" onSubmit={submit}><div className="search-field grow"><Search size={18}/><input placeholder="Job title, skill, or company" value={filters.q} onChange={e=>setFilters({...filters,q:e.target.value})}/></div><div className="search-field"><input placeholder="Field" value={filters.field} onChange={e=>setFilters({...filters,field:e.target.value})}/></div><div className="search-field"><input placeholder="Location" value={filters.location} onChange={e=>setFilters({...filters,location:e.target.value})}/></div><select value={filters.workplaceType} onChange={e=>setFilters({...filters,workplaceType:e.target.value})}><option value="">Workplace</option><option>Remote</option><option>Hybrid</option><option>On-site</option></select><button className="btn primary"><SlidersHorizontal size={17}/> Search</button></form>{loading?<div className="skeleton-grid">{Array.from({length:6}).map((_,i)=><div className="skeleton" key={i}/>)}</div>:data.items.length?<div className="job-grid">{data.items.map(j=><JobCard key={j._id} job={j}/>)}</div>:<EmptyState title="No matching roles" text="Try broadening your search filters."/>}</section>
}
