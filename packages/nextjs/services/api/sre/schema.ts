export type SocialLinks = {
  socialX?: string;
  socialGithub?: string;
  socialDiscord?: string;
  socialTelegram?: string;
  socialInstagram?: string;
  socialEmail?: string;
};

export type BuilderData = {
  userAddress: string;
  role?: "anonymous" | "user" | "admin";
  socialLinks?: SocialLinks;
  batchId?: { number: string; status: string };
};
