export type SocialLinks = {
  twitter?: string;
  github?: string;
  discord?: string;
  telegram?: string;
  instagram?: string;
  email?: string;
};

export type BuilderData = {
  id: string;
  role?: "anonymous" | "user" | "admin";
  socialLinks?: SocialLinks;
  batch?: { number: string; status: string };
};

export type BuilderDataResponse = {
  exists: boolean;
  data?: BuilderData;
};
