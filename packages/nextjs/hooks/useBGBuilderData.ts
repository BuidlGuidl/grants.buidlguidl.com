import { useEffect, useState } from "react";

type SocialLinks = {
  twitter?: string;
  github?: string;
  discord?: string;
  telegram?: string;
  instagram?: string;
  email?: string;
};

type Build = {
  submittedTimestamp: number;
  id: string;
};

type Status = {
  text: string;
  timestamp: number;
};

type Graduated = {
  reason: string;
  status: boolean;
};

type BuilderData = {
  id: string;
  socialLinks: SocialLinks;
  role: string;
  function: string;
  creationTimestamp: number;
  builds: Build[];
  status: Status;
  graduated: Graduated;
};

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
        const response = await fetch(`https://buidlguidl-v3.ew.r.appspot.com/builders/${address}`);
        if (!response.ok) {
          if (response.status === 404) {
            // server send 404 if User doesn't exist
            setData(null);
            setIsBuilderPresent(false);
          } else {
            throw new Error("An error occurred while fetching the data");
          }
        } else {
          const jsonData: BuilderData = await response.json();
          setData(jsonData);
          setIsBuilderPresent(true);
        }
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
