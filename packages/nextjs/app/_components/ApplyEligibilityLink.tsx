"use client";

import Link from "next/link";
import { useAccount } from "wagmi";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/outline";
import { useBGBuilderData } from "~~/hooks/useBGBuilderData";

export const ApplyEligibilityLink = () => {
  const { isConnected, address: connectedAddress } = useAccount();
  const { isBuilderPresent, isLoading: isFetchingBuilderData } = useBGBuilderData(connectedAddress);

  const applyButtonColor =
    !isConnected || isFetchingBuilderData
      ? "btn-primary disabled"
      : !isBuilderPresent
      ? "btn-warning disabled"
      : "btn-success";

  const notConnectedMessage = (
    <div className="leading-snug">
      <p>
        🔎 <strong>Connect your wallet</strong> to verify whether you qualify to apply or not.
      </p>
    </div>
  );

  const notBgMemberMessage = (
    <div className="leading-snug">
      <p className="-mb-2">
        ❌ <strong>Not a BuidlGuidl member.</strong>
      </p>
      <p>
        Join BuidlGuidl by completing the first 3 challenges of{" "}
        <a href="https://speedrunethereum.com" target="_blank" rel="noopener noreferrer" className="underline">
          speedrunethereum.com
        </a>
      </p>
    </div>
  );

  const eligibleToApplyMessage = (
    <div className="leading-snug">
      <p className="-mb-2">
        ✅ <strong>You are eligible to apply!</strong>
      </p>
      <p>As a member of BuidlGuidl, you can participate in the grants program.</p>
    </div>
  );

  const feedbackMessage =
    !isConnected || isFetchingBuilderData
      ? notConnectedMessage
      : !isBuilderPresent
      ? notBgMemberMessage
      : eligibleToApplyMessage;

  const Icon = !isConnected || !isBuilderPresent ? LockClosedIcon : LockOpenIcon;

  const ApplyButton = isBuilderPresent ? (
    <Link
      href="/apply"
      className={`btn ${applyButtonColor} hover:opacity-90 px-4 md:px-8 btn-md border-1 border-black hover:border-1 hover:border-black rounded-2xl shadow-none font-medium`}
    >
      <Icon className="h-5 w-5 mr-1 inline-block" />
      APPLY FOR A GRANT
    </Link>
  ) : (
    <div
      className={`btn ${applyButtonColor} px-4 md:px-8 btn-md border-1 border-black hover:border-1 hover:border-black rounded-2xl shadow-none font-medium cursor-not-allowed`}
    >
      <Icon className="h-5 w-5 mr-1 inline-block" />
      APPLY FOR A GRANT
    </div>
  );

  return (
    <div className="flex flex-col items-start bg-white px-6 py-2 pb-6 font-spaceGrotesk space-y-1 w-4/5 rounded-2xl text-left">
      <p className="text-2xl font-semibold mb-0">Do you qualify?</p>
      {feedbackMessage}
      {ApplyButton}
    </div>
  );
};
