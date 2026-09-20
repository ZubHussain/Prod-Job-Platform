import { ArrowUpRight, Building2, MapPin, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function JobCard({ job }) {
  return (
    <Link to={`/jobs/${job._id}`} className="job-card">
      <div className="job-card-top">
        <div className="company-icon"><Building2 size={22}/></div>
        <ArrowUpRight size={19} className="muted"/>
      </div>
      <div>
        <p className="eyebrow">{job.companyName}</p>
        <h3>{job.title}</h3>
      </div>
      <div className="job-meta">
        <span><MapPin size={15}/>{job.location || "Flexible"}</span>
        <span>{job.workplaceType}</span>
        <span>{job.employmentType}</span>
      </div>
      <div className="skill-row">
        {(job.skills || []).slice(0,4).map(s=><span className="pill" key={s}>{s}</span>)}
      </div>
      <div className="job-card-footer">
        <span>{job.experienceLevel}</span>
        <span className="accent-text"><Sparkles size={14}/> View role</span>
      </div>
    </Link>
  );
}
