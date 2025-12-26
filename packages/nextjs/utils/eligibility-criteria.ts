import { SRE_ENDPOINT } from "~~/services/api/sre/builders";

export const REQUIRED_CHALLENGE_COUNT = 5;

export async function fetchAcceptedChallengeCount(address: string): Promise<number> {
  if (!address) return 0;
  try {
    const res = await fetch(`${SRE_ENDPOINT}/api/user-challenges/${address}`);
    if (!res.ok) return 0;
    const data = await res.json();
    return data.challenges?.filter((ch: any) => ch.reviewAction === "ACCEPTED").length ?? 0;
  } catch {
    return 0;
  }
}
