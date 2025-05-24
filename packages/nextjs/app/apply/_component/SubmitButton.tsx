"use client";

import { useFormStatus } from "react-dom";
import { useAccount } from "wagmi";
import { useBGBuilderData } from "~~/hooks/useBGBuilderData";
import { useSpeedRunChallengeEligibility } from "~~/hooks/useSpeedRunChallengeEligibility";
import { REQUIRED_CHALLENGE_COUNT } from "~~/utils/eligibility-criteria";

// To use useFormStatus we need to make sure button is child of form
const SubmitButton = () => {
  const { pending } = useFormStatus();
  const { isConnected, address: connectedAddress } = useAccount();
  const { isBuilderPresent, isLoading: isFetchingBuilderData } = useBGBuilderData(connectedAddress);
  const {
    isLoading: isLoadingSRE,
    isEligible: isEligibleSRE,
    completedChallengesCount,
  } = useSpeedRunChallengeEligibility(connectedAddress);

  const isEligible = isEligibleSRE || isBuilderPresent;
  const isFetching = isLoadingSRE || (isEligibleSRE === false && isFetchingBuilderData);
  const isSubmitDisabled = !isConnected || isFetching || !isEligible || pending;

  let tooltip = "";
  if (!isConnected) {
    tooltip = "Please connect your wallet";
  } else if (!isEligible) {
    tooltip = `You need to complete at least ${REQUIRED_CHALLENGE_COUNT} SpeedRun Ethereum challenges to submit a grant${
      typeof completedChallengesCount === "number" ? `. You have completed ${completedChallengesCount}.` : "."
    }`;
  }

  return (
    <div className={`flex ${(!isConnected || !isEligible) && "tooltip tooltip-bottom"}`} data-tip={tooltip}>
      <button className="btn btn-primary w-full" disabled={isSubmitDisabled} aria-disabled={isSubmitDisabled}>
        {(isFetching || pending) && <span className="loading loading-spinner loading-md"></span>}
        Submit
      </button>
    </div>
  );
};

export default SubmitButton;
