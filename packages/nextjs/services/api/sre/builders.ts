import { BuilderData, SocialLinks } from "./schema";

export async function fetchBuilderData(address: string): Promise<BuilderData | undefined> {
  const res = await fetch(`https://speedrunethereum.com/api/users/${address}`);
  if (!res.ok) return undefined;
  const apiData = await res.json();
  const user = apiData.user;
  const socialLinks: SocialLinks = {
    telegram: user.socialTelegram,
    twitter: user.socialX,
    github: user.socialGithub,
    instagram: user.socialInstagram,
    discord: user.socialDiscord,
    email: user.socialEmail,
  };
  return {
    id: user.userAddress,
    role: user.role ? user.role.toLowerCase() : undefined,
    socialLinks,
    batch: user.batchId
      ? { number: String(Number(user.batchId) - 1), status: user.batchStatus }
      : undefined,
  };
}
