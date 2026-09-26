import { useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import JobCard from "../components/jobs/JobCard";
import EmptyState from "../components/ui/EmptyState";

 export default function Jobs() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    q: searchParams.get("q") || "",
    field: searchParams.get("field") || "",
    location: "",
    workplaceType: ""
  });
  const [data, setData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async (searchFilters = filters) => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/jobs", { params: searchFilters });
      if (!Array.isArray(response.data?.items)) {
        throw new Error("Unexpected jobs response");
      }
      setData({
        items: response.data.items,
        total: Number(response.data.total) || 0
      });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to load jobs right now."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const submit = event => {
    event.preventDefault();
    void load();
  };
  return (
    <section className="container page-section">
      <div className="page-hero">
        <p className="eyebrow">Opportunity marketplace</p>
        <h1>Find work worth doing.</h1>
        <p>{data.total} roles across ambitious teams.</p>
      </div>
      <form className="search-bar" onSubmit={submit}>
        <div className="search-field grow">
          <Search size={18} />
          <input
            placeholder="Job title, skill, or company"
            value={filters.q}
            onChange={event => setFilters({ ...filters, q: event.target.value })}
          />
        </div>
        <div className="search-field">
          <input
            placeholder="Field"
            value={filters.field}
            onChange={event => setFilters({ ...filters, field: event.target.value })}
          />
        </div>
        <div className="search-field">
          <input
            placeholder="Location"
            value={filters.location}
            onChange={event => setFilters({ ...filters, location: event.target.value })}
          />
        </div>
        <select
          value={filters.workplaceType}
          onChange={event =>
            setFilters({ ...filters, workplaceType: event.target.value })
          }
        >
          <option value="">Workplace</option>
          <option>Remote</option>
          <option>Hybrid</option>
          <option>On-site</option>
          <option>Unspecified</option>
        </select>
        <button className="btn primary" disabled={loading}>
          <SlidersHorizontal size={17} />
          Search
        </button>
      </form>
      {error ? (
        <div role="alert" className="panel">
          <p>{error}</p>
          <button className="btn glass" onClick={() => void load()}>
            Try again
          </button>
        </div>
      ) : loading ? (
        <div className="skeleton-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="skeleton" key={index} />
          ))}
        </div>
      ) : data.items.length ? (
        <div className="job-grid">
          {data.items.map(job => <JobCard key={job._id} job={job} />)}
        </div>
      ) : (
        <EmptyState
          title="No matching roles"
          text="Try broadening your search filters."
        />
      )}
    </section>
  );
}
