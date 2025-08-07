import useSWRImmutable from "swr/immutable";
import { BuilderDataResponse } from "~~/services/api/sre/schema";

export const useBGBuilderData = (address?: string) => {
  const {
    data: responseData,
    isLoading,
    error,
  } = useSWRImmutable<BuilderDataResponse>(address ? `/api/builders/${address}` : null);

  const data = responseData?.data;
  const isBuilderPresent = responseData?.exists ?? false;

  return { isLoading, error, data, isBuilderPresent };
};
