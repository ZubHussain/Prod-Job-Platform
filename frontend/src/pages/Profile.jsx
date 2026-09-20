
import { useEffect, useMemo, useState } from "react";
import {
  BrainCircuit,
  FileText,
  Save,
  UploadCloud,
  X,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "../lib/api";

const SKILL_OPTIONS = [
  "Java",
  "JavaScript",
  "TypeScript",
  "Python",
  "C",
  "C++",
  "C#",
  "Go",
  "Rust",

  "React.js",
  "Next.js",
  "Angular",
  "Vue.js",
  "HTML",
  "CSS",
  "Tailwind CSS",
  "Bootstrap",

  "Node.js",
  "Express.js",
  "Spring Boot",
  "Spring Security",
  "Spring MVC",
  "Hibernate",
  "JPA",
  "REST API",
  "GraphQL",
  "Microservices",

  "MongoDB",
  "MySQL",
  "PostgreSQL",
  "SQL",
  "Redis",

  "Kafka",
  "RabbitMQ",

  "Docker",
  "Kubernetes",
  "Jenkins",
  "Terraform",
  "AWS",
  "Azure",
  "Google Cloud",

  "Git",
  "GitHub",
  "Linux",

  "Data Structures",
  "Algorithms",
  "Object Oriented Programming",
  "System Design",

  "Machine Learning",
  "Artificial Intelligence",
  "Generative AI",
  "OpenAI API",
  "Prompt Engineering",

  "Computer Networks",
  "Operating Systems",
  "Cybersecurity",

  "Software Engineering",
  "Backend Development",
  "Frontend Development",
  "Full Stack Development",
  "DevOps",
  "Cloud Computing",
];

const FIELD_OPTIONS = [
  "Software Engineering",
  "Backend Development",
  "Frontend Development",
  "Full Stack Development",
  "Web Development",
  "Mobile App Development",
  "DevOps Engineering",
  "Cloud Engineering",
  "Site Reliability Engineering",
  "Data Engineering",
  "Data Science",
  "Machine Learning",
  "Artificial Intelligence",
  "Generative AI",
  "Cybersecurity",
  "Quality Assurance",
  "Automation Testing",
  "Database Engineering",
  "Product Engineering",
  "Platform Engineering",
  "Blockchain Development",
  "Game Development",
  "Embedded Systems",
  "Network Engineering",
  "Technical Support",
  "Software Testing",
];

function SearchableMultiSelect({
  label,
  placeholder,
  options,
  values,
  onChange,
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return options
        .filter(
          (option) =>
            !values.some(
              (value) =>
                value.toLowerCase() ===
                option.toLowerCase()
            )
        )
        .slice(0, 8);
    }

    return options
      .filter(
        (option) =>
          option
            .toLowerCase()
            .includes(normalizedQuery) &&
          !values.some(
            (value) =>
              value.toLowerCase() ===
              option.toLowerCase()
          )
      )
      .slice(0, 8);
  }, [query, options, values]);

  const addValue = (value) => {
    const cleaned = value.trim();

    if (!cleaned) return;

    const alreadyExists = values.some(
      (item) =>
        item.toLowerCase() ===
        cleaned.toLowerCase()
    );

    if (alreadyExists) {
      setQuery("");
      setOpen(false);
      return;
    }

    onChange([...values, cleaned]);

    setQuery("");
    setOpen(false);
  };

  const removeValue = (value) => {
    onChange(
      values.filter((item) => item !== value)
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (filteredOptions.length > 0) {
        addValue(filteredOptions[0]);
      } else if (query.trim()) {
        addValue(query);
      }
    }

    if (e.key === ",") {
      e.preventDefault();

      if (query.trim()) {
        addValue(query);
      }
    }

    if (
      e.key === "Backspace" &&
      query === "" &&
      values.length > 0
    ) {
      removeValue(
        values[values.length - 1]
      );
    }
  };

  return (
    <label className="multi-select-label">
      {label}

      <div className="multi-select">
        <div className="multi-select-input-wrap">
          {values.map((value) => (
            <span
              className="multi-select-chip"
              key={value}
            >
              {value}

              <button
                type="button"
                onClick={() =>
                  removeValue(value)
                }
              >
                <X size={13} />
              </button>
            </span>
          ))}

          <input
            value={query}
            placeholder={
              values.length === 0
                ? placeholder
                : "Add more..."
            }
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
          />

          <ChevronDown
            size={17}
            className="multi-select-chevron"
          />
        </div>

        {open &&
          (filteredOptions.length > 0 ||
            query.trim()) && (
            <div className="multi-select-dropdown">
              {filteredOptions.map(
                (option) => (
                  <button
                    type="button"
                    key={option}
                    onMouseDown={(e) =>
                      e.preventDefault()
                    }
                    onClick={() =>
                      addValue(option)
                    }
                  >
                    <span>{option}</span>
                  </button>
                )
              )}

              {query.trim() &&
                !options.some(
                  (option) =>
                    option.toLowerCase() ===
                    query
                      .trim()
                      .toLowerCase()
                ) &&
                !values.some(
                  (value) =>
                    value.toLowerCase() ===
                    query
                      .trim()
                      .toLowerCase()
                ) && (
                  <button
                    type="button"
                    className="create-option"
                    onMouseDown={(e) =>
                      e.preventDefault()
                    }
                    onClick={() =>
                      addValue(query)
                    }
                  >
                    Add "{query.trim()}"
                  </button>
                )}
            </div>
          )}
      </div>
    </label>
  );
}

export default function Profile() {
  const [p, setP] = useState({
    name: "",
    headline: "",
    bio: "",
    phone: "",
    location: "",
    preferredFields: [],
    skills: [],
    links: {
      linkedin: "",
      github: "",
      portfolio: "",
    },
  });

  const [saving, setSaving] =
    useState(false);

  const [aiBusy, setAiBusy] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const load = async () => {
    try {
      const { data } =
        await api.get("/users/me");

      setP({
        ...data,
        preferredFields:
          data.preferredFields || [],
        skills: data.skills || [],
        links: {
          linkedin:
            data.links?.linkedin || "",
          github:
            data.links?.github || "",
          portfolio:
            data.links?.portfolio || "",
        },
      });
    } catch (err) {
      console.error(
        "Profile load error:",
        err
      );
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    setSaving(true);

    try {
      const { data } =
        await api.put("/users/me", p);

      setP(data);

      toast.success(
        "Profile updated"
      );
    } catch (err) {
      console.error(
        "Profile save error:",
        err
      );

      toast.error(
        err.response?.data?.message ||
          "Profile update failed"
      );
    } finally {
      setSaving(false);
    }
  };

  const upload = async (e) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (
      !allowedTypes.includes(file.type)
    ) {
      toast.error(
        "Only PDF, DOC and DOCX files are allowed"
      );

      e.target.value = "";
      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      toast.error(
        "Resume must be smaller than 5 MB"
      );

      e.target.value = "";
      return;
    }

    setUploading(true);

    const fd =
      new FormData();

    fd.append(
      "resume",
      file
    );

    try {
      await api.post(
        "/users/me/resume",
        fd
      );

      toast.success(
        "Resume saved"
      );

      await load();
    } catch (err) {
      console.error(
        "Resume upload error:",
        err
      );

      toast.error(
        err.response?.data?.message ||
          "Resume upload failed"
      );
    } finally {
      setUploading(false);

      e.target.value = "";
    }
  };

  const extract =
    async (e) => {
      const file =
        e.target.files?.[0];

      if (!file) return;

      setAiBusy(true);

      const fd =
        new FormData();

      fd.append(
        "resume",
        file
      );

      try {
        const { data } =
          await api.post(
            "/ai/extract-skills",
            fd
          );

        const extractedSkills =
          data.skills || [];

        const extractedFields =
          data.jobFields || [];

        const mergedSkills = [
          ...new Set([
            ...(p.skills || []),
            ...extractedSkills,
          ]),
        ];

        const mergedFields = [
          ...new Set([
            ...(p.preferredFields ||
              []),
            ...extractedFields,
          ]),
        ];

        setP((current) => ({
          ...current,
          skills: mergedSkills,
          preferredFields:
            mergedFields,
        }));

        toast.success(
          "AI extracted your skills"
        );
      } catch (err) {
        console.error(
          "AI extraction error:",
          err
        );

        toast.error(
          err.response?.data
            ?.message ||
            "AI extraction failed"
        );
      } finally {
        setAiBusy(false);

        e.target.value = "";
      }
    };

  return (
    <section className="container page-section">
      <div className="page-hero compact">
        <p className="eyebrow">
          Career identity
        </p>

        <h1>Your profile</h1>

        <p>
          Keep your career
          information ready for
          one-click applications.
        </p>
      </div>

      <div className="profile-layout">
        <div className="panel form-stack">
          <div className="two-col">
            <label>
              Full name

              <input
                placeholder="Your full name"
                value={
                  p.name || ""
                }
                onChange={(e) =>
                  setP({
                    ...p,
                    name:
                      e.target.value,
                  })
                }
              />
            </label>

            <label>
              Headline

              <input
                placeholder="Backend Engineer"
                value={
                  p.headline ||
                  ""
                }
                onChange={(e) =>
                  setP({
                    ...p,
                    headline:
                      e.target
                        .value,
                  })
                }
              />
            </label>
          </div>

          <label>
            About

            <textarea
              rows="5"
              placeholder="Tell recruiters about yourself..."
              value={
                p.bio || ""
              }
              onChange={(e) =>
                setP({
                  ...p,
                  bio:
                    e.target.value,
                })
              }
            />
          </label>

          <div className="two-col">
            <label>
              Phone

              <input
                placeholder="+91..."
                value={
                  p.phone || ""
                }
                onChange={(e) =>
                  setP({
                    ...p,
                    phone:
                      e.target.value,
                  })
                }
              />
            </label>

            <label>
              Location

              <input
                placeholder="Bhopal, Madhya Pradesh"
                value={
                  p.location || ""
                }
                onChange={(e) =>
                  setP({
                    ...p,
                    location:
                      e.target.value,
                  })
                }
              />
            </label>
          </div>

          <SearchableMultiSelect
            label="Preferred job fields"
            placeholder="Start typing a job field..."
            options={FIELD_OPTIONS}
            values={
              p.preferredFields ||
              []
            }
            onChange={(values) =>
              setP({
                ...p,
                preferredFields:
                  values,
              })
            }
          />

          <SearchableMultiSelect
            label="Skills"
            placeholder="Start typing a skill..."
            options={SKILL_OPTIONS}
            values={
              p.skills || []
            }
            onChange={(values) =>
              setP({
                ...p,
                skills: values,
              })
            }
          />

          <div className="two-col">
            <label>
              LinkedIn

              <input
                type="url"
                placeholder="https://linkedin.com/in/..."
                value={
                  p.links
                    ?.linkedin ||
                  ""
                }
                onChange={(e) =>
                  setP({
                    ...p,
                    links: {
                      ...(p.links ||
                        {}),
                      linkedin:
                        e.target
                          .value,
                    },
                  })
                }
              />
            </label>

            <label>
              GitHub

              <input
                type="url"
                placeholder="https://github.com/..."
                value={
                  p.links?.github ||
                  ""
                }
                onChange={(e) =>
                  setP({
                    ...p,
                    links: {
                      ...(p.links ||
                        {}),
                      github:
                        e.target
                          .value,
                    },
                  })
                }
              />
            </label>
          </div>

          <label>
            Portfolio

            <input
              type="url"
              placeholder="https://yourportfolio.com"
              value={
                p.links
                  ?.portfolio || ""
              }
              onChange={(e) =>
                setP({
                  ...p,
                  links: {
                    ...(p.links ||
                      {}),
                    portfolio:
                      e.target
                        .value,
                  },
                })
              }
            />
          </label>

          <button
            className="btn primary"
            onClick={save}
            disabled={saving}
          >
            <Save size={17} />

            {saving
              ? "Saving..."
              : "Save profile"}
          </button>
        </div>

        <aside className="sidebar-stack">
          <div className="panel resume-card">
            <FileText size={30} />

            <div>
              <h3>
                Saved resume
              </h3>

              <p>
                {p.resume
                  ?.fileName ||
                  "No resume uploaded yet"}
              </p>
            </div>

            {p.resume?.url && (
              <a
                href={
                  p.resume.url
                }
                target="_blank"
                rel="noreferrer"
              >
                Open current
                resume
              </a>
            )}

            <label className="btn glass full cursor">
              <UploadCloud
                size={17}
              />

              {uploading
                ? "Uploading..."
                : "Upload resume"}

              <input
                hidden
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={
                  upload
                }
                disabled={
                  uploading
                }
              />
            </label>
          </div>

          <div className="panel ai-card">
            <BrainCircuit
              size={30}
            />

            <h3>
              AI Skill Scanner
            </h3>

            <p>
              Upload your resume
              and JobNova will
              automatically detect
              your skills and
              recommended job
              fields.
            </p>

            <label className="btn primary full cursor">
              <BrainCircuit
                size={17}
              />

              {aiBusy
                ? "Scanning..."
                : "Scan resume with AI"}

              <input
                hidden
                type="file"
                accept=".pdf,.docx"
                onChange={
                  extract
                }
                disabled={
                  aiBusy
                }
              />
            </label>
          </div>

          {p.skills?.length >
            0 && (
            <div className="panel">
              <p className="eyebrow">
                Your skills
              </p>

              <div
                className="skill-row"
                style={{
                  marginTop:
                    "14px",
                }}
              >
                {p.skills.map(
                  (skill) => (
                    <span
                      className="pill"
                      key={skill}
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            </div>
          )}

          {p
            .preferredFields
            ?.length > 0 && (
            <div className="panel">
              <p className="eyebrow">
                Preferred fields
              </p>

              <div
                className="skill-row"
                style={{
                  marginTop:
                    "14px",
                }}
              >
                {p.preferredFields.map(
                  (field) => (
                    <span
                      className="pill"
                      key={field}
                    >
                      {field}
                    </span>
                  )
                )}
              </div>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
