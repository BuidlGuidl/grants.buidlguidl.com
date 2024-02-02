"use client";

import { useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { InputBase } from "~~/components/scaffold-eth";
import { useBGBuilderData } from "~~/hooks/useBGBuilderData";
import { notification } from "~~/utils/scaffold-eth";

/*
 * 1. Disable submit button when wallet is not connected, and show a tooltip
 * 2. Fetch for bg status once the wallet connected
 */

const selectOptions = [0.1, 0.25, 0.5, 1];

const Form = () => {
  const [formState, setFormState] = useState({ title: "", description: "", askAmount: 0.1 });
  const { signMessageAsync } = useSignMessage();
  const { isConnected, address: connectedAddress } = useAccount();
  const { isBuilderPresent, isLoading: isFetchingBuilderData } = useBGBuilderData(connectedAddress);

  const handleSubmit = async () => {
    if (formState.title === "" || formState.description === "") {
      notification.error("Title and description are required");
      return;
    }

    const signedMessage = await signMessageAsync({ message: JSON.stringify(formState) });

    console.log("Signed message", signedMessage);
    console.log("Form data", formState);
  };

  const isSubmitDisabled = !isConnected || isFetchingBuilderData || !isBuilderPresent;

  return (
    <div className="card card-compact w-96 bg-base-100 shadow-xl">
      <div className="card-body space-y-4">
        <h2 className="card-title self-center text-3xl !mb-0">Submit Proposal</h2>
        <div className="space-y-2">
          <p className="m-0 text-xl ml-2">Title</p>
          <InputBase
            placeholder="title"
            value={formState.title}
            onChange={value => setFormState({ ...formState, title: value })}
          />
        </div>
        {/* TODO: Probably we want this to WYSIWYG editor */}
        <div className="space-y-2">
          <p className="m-0 text-xl ml-2">Description</p>
          <div className="flex border-2 border-base-300 bg-base-200 rounded-3xl text-accent">
            <textarea
              className="input input-ghost focus-within:border-transparent focus:outline-none focus:bg-transparent focus:text-gray-400 px-4 pt-2 border w-full font-medium placeholder:text-accent/50 text-gray-400 h-28 rounded-none"
              placeholder="description"
              value={formState.description}
              onChange={e => setFormState({ ...formState, description: e.target.value })}
              autoComplete="off"
            />
          </div>
        </div>
        <div className="space-y-2">
          <p className="m-0 text-xl ml-2">Ask amount</p>
          <select
            className="select bg-base-200 select-primary select-md select-bordered w-full"
            value={formState.askAmount}
            onChange={e => setFormState({ ...formState, askAmount: parseFloat(e.target.value) })}
          >
            <option disabled>Select amount</option>
            {selectOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div
          className={`flex ${isSubmitDisabled && "tooltip tooltip-bottom"}`}
          data-tip={`${!isConnected ? "Please connect your wallet" : !isBuilderPresent ? "Builder not found" : ""}`}
        >
          <button className="btn btn-primary w-full" disabled={isSubmitDisabled} onClick={handleSubmit}>
            {isFetchingBuilderData && <span className="loading loading-spinner loading-md"></span>}
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Form;
