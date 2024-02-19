"use client";

import { useFormStatus } from "react-dom";
import { useAccount } from "wagmi";
import { useBGBuilderData } from "~~/hooks/useBGBuilderData";

// To use useFormStatus we need to make sure button is child of form
const SubmitButton = () => {
  const { pending } = useFormStatus();
  const { isConnected, address: connectedAddress } = useAccount();
  // ToDo. We could use builderData from global state
  const { isBuilderPresent, isLoading: isFetchingBuilderData } = useBGBuilderData(connectedAddress);
  const isSubmitDisabled = !isConnected || isFetchingBuilderData || pending || !isBuilderPresent;

  return (
    <div
      className={`flex ${(!isConnected || !isBuilderPresent) && "tooltip tooltip-bottom"}`}
      data-tip={`${
        !isConnected
          ? "Please connect your wallet"
          : !isBuilderPresent
          ? "You should be a buidlguidl builder to submit grant"
          : ""
      }`}
    >
      <button className="btn btn-primary w-full" disabled={isSubmitDisabled} aria-disabled={isSubmitDisabled}>
        {(isFetchingBuilderData || pending) && <span className="loading loading-spinner loading-md"></span>}
        Submit
      </button>
    </div>
  );
};

export default SubmitButton;
