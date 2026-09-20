import { ArrowRight, BadgeCheck, BrainCircuit, Search, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const categories = ["Software Engineering","Data & AI","Product","Design","Finance","Marketing","Operations","Cybersecurity"];

export default function Landing(){
  return (
    <>
      <section className="hero container">
        <div className="hero-copy">
          <div className="badge"><Sparkles size={15}/> Work, intelligently matched.</div>
          <h1>Find the role that feels <span>made for you.</span></h1>
          <p>Discover high-quality opportunities, keep one career profile, apply in a few clicks, and let AI surface roles aligned with your actual skills.</p>
          <div className="hero-actions">
            <Link className="btn primary large" to="/jobs">Explore jobs <ArrowRight size={18}/></Link>
            <Link className="btn glass large" to="/profile">Build your profile</Link>
          </div>
          <div className="trust-row">
            <span><BadgeCheck size={17}/> Curated opportunities</span>
            <span><ShieldCheck size={17}/> Private resume storage</span>
          </div>
        </div>
        <div className="hero-panel">
          <div className="glass-orb orb-a"/>
          <div className="glass-orb orb-b"/>
          <div className="preview-card">
            <div className="preview-header"><span className="preview-logo">N</span><span><strong>Backend Engineer</strong><small>Nova Systems • Remote</small></span></div>
            <div className="match-meter"><div style={{width:"92%"}}/><span>92% match</span></div>
            <div className="skill-row"><span className="pill">Node.js</span><span className="pill">MongoDB</span><span className="pill">Kafka</span></div>
            <button className="btn primary full">Apply with profile</button>
          </div>
          <div className="floating-card">
            <BrainCircuit size={20}/><div><strong>AI skill map ready</strong><small>18 verified skills found</small></div>
          </div>
        </div>
      </section>
      <section className="container section">
        <div className="section-head"><div><p className="eyebrow">Explore by field</p><h2>Your next chapter starts here.</h2></div></div>
        <div className="category-grid">
          {categories.map(c=><Link to={`/jobs?field=${encodeURIComponent(c)}`} className="category-card" key={c}><Search size={18}/><span>{c}</span><ArrowRight size={17}/></Link>)}
        </div>
      </section>
    </>
  );
}
