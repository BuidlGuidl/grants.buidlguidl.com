import { BuilderData, SocialLinks } from "./schema";

export const SRE_ENDPOINT = "https://speedrunethereum.com";

export async function fetchBuilderData(address: string): Promise<BuilderData | undefined> {
  try {
    const res = await fetch(`${SRE_ENDPOINT}/api/users/${address}`);

    if (!res.ok) return undefined;

    const apiData = await res.json();
    const user = apiData.user;

    const socialLinks: SocialLinks = {
      socialX: user.socialX,
      socialGithub: user.socialGithub,
      socialDiscord: user.socialDiscord,
      socialTelegram: user.socialTelegram,
      socialInstagram: user.socialInstagram,
      socialEmail: user.socialEmail,
    };

    return {
      userAddress: user.userAddress,
      role: user.role ? user.role.toLowerCase() : undefined,
      socialLinks,
      batchId: user.batchId ? { number: String(Number(user.batchId) - 1), status: user.batchStatus } : undefined,
    };
  } catch (error) {
    console.error("Failed to fetch builder data:", error);
    return undefined;
  }
}
