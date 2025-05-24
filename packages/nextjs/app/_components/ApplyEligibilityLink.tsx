"use client";

import Link from "next/link";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/outline";
import { useBGBuilderData } from "~~/hooks/useBGBuilderData";
import { useSpeedRunChallengeEligibility } from "~~/hooks/useSpeedRunChallengeEligibility";
import { REQUIRED_CHALLENGE_COUNT } from "~~/utils/eligibility-criteria";

type BuilderStatus = "notConnected" | "notElegible" | "eligible";

const FeedbackMessage = ({
  builderStatus,
  completedChallengesCount,
}: {
  builderStatus: BuilderStatus;
  completedChallengesCount?: number;
}) => {
  if (builderStatus === "notConnected") {
    return (
      <div className="leading-snug">
        <p>
          🔎 <strong>Connect your wallet</strong> to verify eligibility.
        </p>
      </div>
    );
  }
  if (builderStatus === "notElegible") {
    return (
      <div className="leading-snug">
        <p className="-mb-2">
          ❌ <strong>Not eligible.</strong>
        </p>
        <p>
          You need to complete at least <strong>{REQUIRED_CHALLENGE_COUNT} SpeedRun Ethereum challenges</strong> to
          apply for a grant.
          <br />
          {typeof completedChallengesCount === "number" && (
            <span>
              You have completed <strong>{completedChallengesCount}</strong> challenge
              {completedChallengesCount === 1 ? "" : "s"}.
            </span>
          )}
          <br />
          <a href="https://speedrunethereum.com" target="_blank" rel="noopener noreferrer" className="underline">
            speedrunethereum.com
          </a>
        </p>
      </div>
    );
  }
  // builderStatus is "eligible"
  return (
    <div className="leading-snug">
      <p className="-mb-2">
        ✅ <strong>You are eligible to apply!</strong>
      </p>
      <p>Participate in the grants program.</p>
    </div>
  );
};

export const ApplyEligibilityLink = () => {
  const { isConnected, address: connectedAddress } = useAccount();
  const { isBuilderPresent, isLoading: isFetchingBuilderData } = useBGBuilderData(connectedAddress);
  const { openConnectModal } = useConnectModal();
  const {
    isLoading: isLoadingSRE,
    isEligible: isEligibleSRE,
    completedChallengesCount,
  } = useSpeedRunChallengeEligibility(connectedAddress);

  let builderStatus: BuilderStatus = "notConnected";
  if (!isConnected || isLoadingSRE) {
    builderStatus = "notConnected";
  } else if (isEligibleSRE || isBuilderPresent) {
    builderStatus = "eligible";
  } else {
    builderStatus = "notElegible";
  }

  const isFetching = isLoadingSRE || (isEligibleSRE === false && isFetchingBuilderData);

  return (
    <div className="mx-auto lg:m-0 flex flex-col items-start bg-white px-6 py-2 pb-6 font-spaceGrotesk space-y-1 w-4/5 rounded-2xl text-left">
      <p className="text-2xl font-semibold mb-0">Do you qualify?</p>
      <FeedbackMessage builderStatus={builderStatus} completedChallengesCount={completedChallengesCount} />
      {builderStatus === "eligible" ? (
        <Link
          href="/apply"
          className="btn px-4 md:px-8 btn-md border-1 border-black hover:border-1 hover:border-black rounded-2xl shadow-none font-medium bg-customGreen hover:bg-customGreen hover:opacity-80"
        >
          <LockOpenIcon className="h-5 w-5 mr-1 inline-block" />
          APPLY FOR A GRANT
        </Link>
      ) : (
        <button
          className={`btn px-4 md:px-8 btn-md border-1 border-black hover:border-1 hover:border-black rounded-2xl shadow-none font-medium ${
            builderStatus === "notConnected" ? "btn-primary" : "btn-warning cursor-not-allowed"
          }`}
          onClick={() => {
            if (!isConnected && openConnectModal) openConnectModal();
          }}
        >
          {isFetching ? (
            <span className="loading loading-spinner h-5 w-5"></span>
          ) : (
            <LockClosedIcon className="h-5 w-5 mr-1 inline-block" />
          )}
          {!isConnected ? "CONNECT WALLET" : "APPLY FOR A GRANT"}
        </button>
      )}
    </div>
  );
};
