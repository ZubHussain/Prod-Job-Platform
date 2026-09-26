import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowUpRight, Building2, CheckCircle2, MapPin } from "lucide-react";
import { toast } from "sonner";
import { api } from "../lib/api";
import { formatSalaryRange } from "../lib/formatSalary";
import { useAuth } from "../context/AuthContext";

export default function JobDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [profile, setProfile] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError("");
    setJob(null);

    api.get(`/jobs/${id}`)
      .then(response => {
        if (active) setJob(response.data);
      })
      .catch(requestError => {
        if (active) {
          setLoadError(
            requestError.response?.data?.message || "Unable to load this job."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    if (user?.role === "candidate") {
      api.get("/users/me")
        .then(response => {
          if (active) setProfile(response.data);
        })
        .catch(() => {
          if (active) setProfile(null);
        });
    } else {
      setProfile(null);
    }

    return () => {
      active = false;
    };
  }, [id, user?.role, retryCount]);

  const apply = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "candidate") {
      toast.error("Candidate account required");
      return;
    }
    if (!profile?.resume?.url) {
      toast.error("Upload your resume in Profile first");
      navigate("/profile");
      return;
    }

    setBusy(true);
    try {
      await api.post("/applications", {
        jobId: job._id,
        recruiterId: job.recruiterId,
        recruiterEmail: job.recruiterEmail,
        jobTitle: job.title,
        companyName: job.companyName,
        candidateName: profile.name,
        candidateEmail: profile.email,
        resumeUrl: profile.resume.url,
        skills: profile.skills,
        requiredSkills: job.skills,
        coverLetter
      });
      toast.success("Application sent");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not apply");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <section className="container page-section">
        <div className="skeleton detail-skeleton" />
      </section>
    );
  }

  if (loadError || !job) {
    return (
      <section className="container page-section narrow">
        <div role="alert" className="panel">
          <h1>Job unavailable</h1>
          <p>{loadError || "This job could not be found."}</p>
          <button
            className="btn primary"
            onClick={() => setRetryCount(count => count + 1)}
          >
            Try again
          </button>
          <Link className="btn glass" to="/jobs">Browse jobs</Link>
        </div>
      </section>
    );
  }

  const salaryRange = formatSalaryRange(job);

  return (
    <section className="container page-section">
      <div className="detail-layout">
        <article className="detail-main">
          <div className="detail-title">
            <div className="company-icon xl"><Building2 size={28} /></div>
            <div>
              <p className="eyebrow">
                {job.companyName}{job.autoImported ? " - External listing" : ""}
              </p>
              <h1>{job.title}</h1>
              <div className="job-meta">
                <span><MapPin size={15} />{job.location || "Flexible"}</span>
                <span>{job.workplaceType}</span>
                <span>{job.employmentType}</span>
                {salaryRange && <span>{salaryRange}</span>}
              </div>
            </div>
          </div>
          <div className="divider" />
          <section>
            <h2>About the role</h2>
            <p className="prose">{job.description}</p>
          </section>
          {job.responsibilities?.length > 0 && (
            <section>
              <h2>What you’ll do</h2>
              <div className="check-list">
                {job.responsibilities.map(item => (
                  <p key={item}><CheckCircle2 size={17} />{item}</p>
                ))}
              </div>
            </section>
          )}
          {job.requirements?.length > 0 && (
            <section>
              <h2>What we’re looking for</h2>
              <div className="check-list">
                {job.requirements.map(item => (
                  <p key={item}><CheckCircle2 size={17} />{item}</p>
                ))}
              </div>
            </section>
          )}
          {job.skills?.length > 0 && (
            <section>
              <h2>Skills</h2>
              <div className="skill-row">
                {job.skills.map(skill => (
                  <span className="pill" key={skill}>{skill}</span>
                ))}
              </div>
            </section>
          )}
        </article>
        <aside className="apply-card">
          <div>
            <p className="eyebrow">Apply now</p>
            <h3>
              {job.applyMode === "external"
                ? "Continue to company"
                : "Use your JobNova profile"}
            </h3>
          </div>
          {job.applyMode !== "external" && (
            <textarea
              rows="6"
              placeholder="Optional cover note..."
              value={coverLetter}
              onChange={event => setCoverLetter(event.target.value)}
            />
          )}
          {(job.applyMode === "internal" || job.applyMode === "both") && (
            <button
              className="btn primary large full"
              onClick={apply}
              disabled={busy}
            >
              {busy ? "Sending..." : "Apply with profile"}
            </button>
          )}
          {(job.applyMode === "external" || job.applyMode === "both") && (
            <a
              className="btn glass large full"
              href={job.externalApplyUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Company application <ArrowUpRight size={17} />
            </a>
          )}
          <small>
            Your saved resume and skills are shared only when you submit an
            internal application.
          </small>
        </aside>
      </div>
    </section>
  );
}
