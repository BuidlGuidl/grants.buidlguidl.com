export const extractBuildId = (link: string | undefined | null): string | null => {
  if (!link) return null;

  try {
    const url = new URL(link);
    // Only try to extract the buildId from speedrunethereum.com
    if (!url.hostname.endsWith("speedrunethereum.com")) {
      return null;
    }

    const parts = url.pathname.split("/").filter(Boolean);
    const id = parts.pop();
    if (parts[parts.length - 1] !== "builds" || !id) {
      return null;
    }
    return id;
  } catch {
    return null;
  }
};

export const sendBuildToSRE = async (buildId: string): Promise<void> => {
  const apiUrl = process.env.SRE_API_URL;
  const apiKey = process.env.SRE_API_KEY;

  if (!apiUrl) {
    console.warn("[SRE] SRE_API_URL env var is not set, skipping call to SRE");
    return;
  }
  if (!apiKey) {
    console.warn("[SRE] SRE_API_KEY env var is not set, skipping call to SRE");
    return;
  }
  if (!buildId) {
    console.warn("[SRE] No buildId supplied, nothing to send to SRE");
    return;
  }

  try {
    await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ buildId, apiKey }),
    });
  } catch (error) {
    console.error("[SRE] Failed to send build information to SRE", error);
  }
};
