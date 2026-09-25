import axios from "axios";
import { env } from "../config/env.js";

const client = axios.create({
  baseURL: "https://api.adzuna.com/v1/api",
  timeout: 20000,
  headers: { Accept: "application/json" }
});

export async function fetchAdzunaJobs({ keyword, location, page = 1 }) {
  const response = await client.get(
    `/jobs/${env.adzuna.country}/search/${page}`,
    {
      params: {
        app_id: env.adzuna.appId,
        app_key: env.adzuna.appKey,
        results_per_page: env.adzuna.resultsPerPage,
        what: keyword,
        where: location,
        "content-type": "application/json"
      }
    }
  );

  return Array.isArray(response.data?.results)
    ? response.data.results
    : [];
}