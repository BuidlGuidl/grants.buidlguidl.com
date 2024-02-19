export const PROPOSAL_STATUS = {
  PROPOSED: "proposed",
  APPROVED: "approved",
  SUBMITTED: "submitted",
  COMPLETED: "completed",
  REJECTED: "rejected",
} as const;

export type ProposalStatusType = (typeof PROPOSAL_STATUS)[keyof typeof PROPOSAL_STATUS];
