export const fetcher = async (...args: Parameters<typeof fetch>) => {
  const res = await fetch(...args);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Error fetching data");
  }
  return data;
};

export const postMutationFetcher = async <T = Record<any, any>>(url: string, { arg }: { arg: T }) => {
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(arg),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Error posting data");
  }
  return data;
};
