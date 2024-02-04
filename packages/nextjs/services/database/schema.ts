type SocialLinks = {
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
  role?: string;
  function?: string;
  creationTimestamp?: number;
  builds?: Build[];
  status?: Status;
  graduated?: Graduated;
};

export type BuilderDataResponse = {
  exists: boolean;
  data?: BuilderData;
};

export type GrantData = {
  id: string;
  title: string;
  description: string;
  askAmount: number;
  builder: string;
  timestamp: number;
  status: "pending" | "approved" | "completed" | "rejected";
};
