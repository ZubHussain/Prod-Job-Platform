export function formatSalaryRange(job) {
  if (job.minSalary == null && job.maxSalary == null) return "";

  const currency = String(job.currency || "INR").toUpperCase();
  const formatter = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
  const formatAmount = value => `${currency} ${formatter.format(value)}`;

  if (job.minSalary != null && job.maxSalary != null) {
    return `${formatAmount(job.minSalary)} - ${formatAmount(job.maxSalary)}`;
  }
  if (job.minSalary != null) return `From ${formatAmount(job.minSalary)}`;
  return `Up to ${formatAmount(job.maxSalary)}`;
}