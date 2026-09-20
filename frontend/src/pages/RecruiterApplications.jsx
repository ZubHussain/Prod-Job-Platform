import {
  useEffect,
  useState,
} from "react";

import {
  ExternalLink,
} from "lucide-react";

import { toast } from "sonner";

import { api } from "../lib/api";

import EmptyState from "../components/ui/EmptyState";

export default function RecruiterApplications() {
  const [items, setItems] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [updatingId, setUpdatingId] =
    useState(null);

  useEffect(() => {
    let active = true;

    const fetchApplications =
      async () => {
        try {
          const { data } =
            await api.get(
              "/applications/recruiter"
            );

          if (active) {
            setItems(
              Array.isArray(data)
                ? data
                : []
            );
          }
        } catch (err) {
          console.error(
            "Recruiter applications error:",
            err
          );

          if (active) {
            setItems([]);
          }

          toast.error(
            err.response?.data
              ?.message ||
              "Could not load applications"
          );
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      };

    fetchApplications();

    return () => {
      active = false;
    };
  }, []);

  const status = async (
    id,
    value
  ) => {
    setUpdatingId(id);

    try {
      const { data } =
        await api.patch(
          `/applications/${id}/status`,
          {
            status: value,
          }
        );

      setItems((current) =>
        current.map(
          (application) =>
            application._id === id
              ? {
                  ...application,
                  ...data,
                }
              : application
        )
      );

      toast.success(
        "Status updated and candidate notified"
      );
    } catch (err) {
      console.error(
        "Application status update error:",
        err
      );

      toast.error(
        err.response?.data?.message ||
          "Could not update application"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <section className="container page-section">
      <div className="page-hero compact">
        <p className="eyebrow">
          Candidate pipeline
        </p>

        <h1>
          Applicants
        </h1>

        <p>
          Ranked by skill match.
        </p>
      </div>

      {loading ? (
        <div className="panel">
          Loading applicants...
        </div>
      ) : items.length > 0 ? (
        <div className="applicant-grid">
          {items.map(
            (application) => (
              <article
                className="applicant-card"
                key={
                  application._id
                }
              >
                <div className="applicant-top">
                  <div className="avatar">
                    {application
                      .candidateName?.[0]
                      ?.toUpperCase() ||
                      "C"}
                  </div>

                  <div>
                    <h3>
                      {application.candidateName ||
                        "Candidate"}
                    </h3>

                    <p>
                      {application.jobTitle ||
                        "Job"}

                      {" · "}

                      {application.companyName ||
                        "Company"}
                    </p>
                  </div>

                  <div className="score-ring">
                    {Number(
                      application.matchScore ||
                        0
                    )}
                    %
                  </div>
                </div>

                <div className="skill-row">
                  {Array.isArray(
                    application.skills
                  ) &&
                    application.skills
                      .slice(
                        0,
                        6
                      )
                      .map(
                        (
                          skill,
                          index
                        ) => (
                          <span
                            className="pill"
                            key={`${skill}-${index}`}
                          >
                            {
                              skill
                            }
                          </span>
                        )
                      )}
                </div>

                {application.coverLetter && (
                  <p className="candidate-note">
                    {
                      application.coverLetter
                    }
                  </p>
                )}

                <div className="applicant-actions">
                  {application.resumeUrl ? (
                    <a
                      className="btn glass"
                      href={
                        application.resumeUrl
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      Resume

                      <ExternalLink
                        size={15}
                      />
                    </a>
                  ) : (
                    <button
                      type="button"
                      className="btn glass"
                      disabled
                    >
                      No resume
                    </button>
                  )}

                  <select
                    value={
                      application.status ||
                      "applied"
                    }
                    disabled={
                      updatingId ===
                      application._id
                    }
                    onChange={(e) =>
                      status(
                        application._id,
                        e.target.value
                      )
                    }
                  >
                    <option value="applied">
                      Applied
                    </option>

                    <option value="viewed">
                      Viewed
                    </option>

                    <option value="shortlisted">
                      Shortlisted
                    </option>

                    <option value="interview">
                      Interview
                    </option>

                    <option value="rejected">
                      Rejected
                    </option>

                    <option value="hired">
                      Hired
                    </option>
                  </select>
                </div>
              </article>
            )
          )}
        </div>
      ) : (
        <EmptyState
          title="No applicants yet"
          text="Applications will appear here as candidates apply."
        />
      )}
    </section>
  );
}
