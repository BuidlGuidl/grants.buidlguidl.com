import useSWRImmutable from "swr/immutable";
import { BuilderData } from "~~/services/api/sre/schema";
import { fetchBuilderData } from "~~/services/api/sre/builders";

export const useBGBuilderData = (address?: string) => {
  const {
    data,
    isLoading,
    error,
  } = useSWRImmutable<BuilderData | undefined>(
    address ? `builder-${address}` : null,
    () => fetchBuilderData(address!)
  );

  return { isLoading, error, data };
};
