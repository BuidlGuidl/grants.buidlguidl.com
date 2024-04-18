"use client";

import Link from "next/link";
import { useAccount } from "wagmi";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/outline";
import { useBGBuilderData } from "~~/hooks/useBGBuilderData";

type BuilderStatus = "notConnected" | "notMember" | "eligible";

const FeedbackMessage = ({ builderStatus }: { builderStatus: BuilderStatus }) => {
  if (builderStatus === "notConnected") {
    return (
      <div className="leading-snug">
        <p>
          🔎 <strong>Connect your wallet</strong> to verify eligibility.
        </p>
      </div>
    );
  }
  if (builderStatus === "notMember") {
    return (
      <div className="leading-snug">
        <p className="-mb-2">
          ❌ <strong>Not a BuidlGuidl member.</strong>
        </p>
        <p>
          Join by completing challenges at{" "}
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
      <p>Participate in the grants program as a member.</p>
    </div>
  );
};

export const ApplyEligibilityLink = () => {
  const { isConnected, address: connectedAddress } = useAccount();
  const { isBuilderPresent, isLoading: isFetchingBuilderData } = useBGBuilderData(connectedAddress);

  const builderStatus: BuilderStatus =
    !isConnected || isFetchingBuilderData ? "notConnected" : !isBuilderPresent ? "notMember" : "eligible";

  return (
    <div className="flex flex-col items-start bg-white px-6 py-2 pb-6 font-spaceGrotesk space-y-1 w-4/5 rounded-2xl text-left">
      <p className="text-2xl font-semibold mb-0">Do you qualify?</p>
      <FeedbackMessage builderStatus={builderStatus} />
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
          className={`btn px-4 md:px-8 btn-md border-1 border-black hover:border-1 hover:border-black rounded-2xl shadow-none font-medium cursor-not-allowed ${
            builderStatus === "notConnected" ? "btn-primary" : "btn-warning"
          }`}
        >
          <LockClosedIcon className="h-5 w-5 mr-1 inline-block" />
          APPLY FOR A GRANT
        </button>
      )}
    </div>
  );
};
