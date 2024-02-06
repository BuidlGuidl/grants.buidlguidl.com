import { useEffect, useState } from "react";
import { BuilderData, BuilderDataResponse } from "~~/services/database/schema";

export const useBGBuilderData = (address?: string) => {
  const [data, setData] = useState<BuilderData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isBuilderPresent, setIsBuilderPresent] = useState(false);

  useEffect(() => {
    if (!address) {
      setData(null);
      setError(null);
      setIsBuilderPresent(false);
      return;
    }

    const fetchBuilderData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/builders/${address}`);
        if (!response.ok) {
          throw new Error("An error occurred while fetching builder data");
        }
        const jsonData: BuilderDataResponse = await response.json();
        if (!jsonData.exists || !jsonData.data) {
          setData(null);
          setIsBuilderPresent(false);
          return;
        }

        setData(jsonData.data);
        setIsBuilderPresent(true);
      } catch (err: any) {
        setError(err);
        setIsBuilderPresent(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBuilderData();
  }, [address]);

  return { isLoading, error, data, isBuilderPresent };
};
