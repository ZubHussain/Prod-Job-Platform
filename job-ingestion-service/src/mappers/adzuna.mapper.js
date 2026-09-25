export function mapAdzunaToRawJob(job, searchContext = {}) {
  return {
    schemaVersion: 1,
    source: "ADZUNA",
    sourceJobId: job?.id != null ? String(job.id) : null,
    sourceUrl: job?.redirect_url || null,
    fetchedAt: new Date().toISOString(),

    searchContext: {
      keyword: searchContext.keyword || null,
      location: searchContext.location || null
    },

    raw: {
      title: job?.title || null,
      company: job?.company?.display_name || null,
      description: job?.description || null,
      locationDisplayName: job?.location?.display_name || null,
      locationAreas: Array.isArray(job?.location?.area)
        ? job.location.area
        : [],
      category: job?.category?.label || null,
      categoryTag: job?.category?.tag || null,
      contractType: job?.contract_type || null,
      contractTime: job?.contract_time || null,
      salaryMin: job?.salary_min ?? null,
      salaryMax: job?.salary_max ?? null,
      created: job?.created || null,
      latitude: job?.latitude ?? null,
      longitude: job?.longitude ?? null
    }
  };
}