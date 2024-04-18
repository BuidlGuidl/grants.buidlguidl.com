import type { Simplify } from "type-fest";

export type SocialLinks = {
  twitter?: string;
  github?: string;
  discord?: string;
  telegram?: string;
  instagram?: string;
  email?: string;
};

type Build = {
  submittedTimestamp: number;
  id: string;
};

type Status = {
  text: string;
  timestamp: number;
};

type Graduated = {
  reason: string;
  status: boolean;
};

export type BuilderData = {
  id: string;
  socialLinks?: SocialLinks;
  role?: "anonymous" | "builder" | "admin";
  function?: string;
  creationTimestamp?: number;
  builds?: Build[];
  status?: Status;
  graduated?: Graduated;
  builderBatch?: string;
  builderCohort?: { id: string; name: string; url: string }[];
  stream?: {
    balance: string;
    cap: string;
    frequency: number;
    lastContract: number;
    lastIndexedBlock: number;
    streamAddress: string;
  };
};

export type BuilderDataResponse = {
  exists: boolean;
  data?: BuilderData;
};

export type GrantWithoutTimestamps = {
  id: string;
  title: string;
  description: string;
  askAmount: number;
  builder: string;
  link?: string;
  status: "proposed" | "approved" | "submitted" | "completed" | "rejected";
  approvedTx?: string;
  completedTx?: string;
  note?: string;
  txChainId?: string;
};

export type GrantData = Simplify<
  GrantWithoutTimestamps & {
    [k in GrantWithoutTimestamps["status"] as `${k}At`]?: number;
  }
>;

export type GrantDataWithBuilder = Simplify<GrantData & { builderData?: BuilderData }>;
export type GrantDataWithPrivateNote = Simplify<GrantDataWithBuilder & { private_note?: string }>;
