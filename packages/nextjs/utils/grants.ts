export const PROPOSAL_STATUS = {
  PROPOSED: "proposed",
  APPROVED: "approved",
  SUBMITTED: "submitted",
  COMPLETED: "completed",
  REJECTED: "rejected",
} as const;

export type ProposalStatusType = (typeof PROPOSAL_STATUS)[keyof typeof PROPOSAL_STATUS];

export function formatDateFromNow(timestamp: number) {
  const timestampDate = new Date(timestamp);
  const now = new Date().getTime();
  const delta = now - timestampDate.getTime();
  // Number of days calculated from the given delta.
  const days = delta / (1000 * 60 * 60 * 24);

  // less than 14 days => n days ago
  if (days < 14) {
    const roundedDays = Math.floor(days);
    return `${roundedDays} day${roundedDays > 1 ? "s" : ""} ago`;
  }
  // Less than 8 weeks => n weeks ago
  else if (days < 8 * 7) {
    const weeks = Math.floor(days / 7);
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  }
  // Less than 24 months => n months ago
  else if (days < 24 * 30) {
    const months = Math.floor(days / 30);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  }
  // More than 24 months => n years ago
  else {
    const years = Math.floor(days / 365);
    return `${years} year${years > 1 ? "s" : ""} ago`;
  }
}
