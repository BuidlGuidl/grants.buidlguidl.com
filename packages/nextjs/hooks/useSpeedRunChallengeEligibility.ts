import { useEffect, useState } from "react";
import { REQUIRED_CHALLENGE_COUNT, fetchAcceptedChallengeCount } from "~~/utils/eligibility-criteria";

export const useSpeedRunChallengeEligibility = (address?: string) => {
  const [completedChallengesCount, setCompletedCount] = useState<number>(0);
  const [isEligible, setIsEligible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!address) return;
    setIsLoading(true);
    fetchAcceptedChallengeCount(address)
      .then(count => {
        setCompletedCount(count);
        setIsEligible(count >= REQUIRED_CHALLENGE_COUNT);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err);
        setIsLoading(false);
      });
  }, [address]);

  return { isLoading, error, completedChallengesCount, isEligible };
};
