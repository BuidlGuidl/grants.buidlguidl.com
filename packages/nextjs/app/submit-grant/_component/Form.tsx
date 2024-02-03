"use client";

import { subgmitGrantAction } from "../_actions";
import SubmitButton from "./SubmitButton";
import { useAccount, useSignMessage } from "wagmi";
import { notification } from "~~/utils/scaffold-eth";

const selectOptions = [0.1, 0.25, 0.5, 1];

const Form = () => {
  const { signMessageAsync } = useSignMessage();
  const { address: connectedAddress } = useAccount();

  const clientFormAction = async (formData: FormData) => {
    try {
      const formState = Object.fromEntries(formData.entries());
      if (formState.title === "" || formState.description === "") {
        notification.error("Title and description are required");
        return;
      }

      const message = JSON.stringify(formState);
      const signature = await signMessageAsync({ message });
      const signedMessageObject = {
        signature: signature,
        address: connectedAddress,
        message,
      };

      // server action
      const submitGrantActionWithSignedMessage = subgmitGrantAction.bind(null, signedMessageObject);
      await submitGrantActionWithSignedMessage(formData);
    } catch (error: any) {
      if (error instanceof Error) {
        notification.error(error.message);
        return;
      }
      notification.error("Something went wrong");
    }
  };

  return (
    <div className="card card-compact w-96 bg-base-100 shadow-xl">
      <form action={clientFormAction} className="card-body space-y-4">
        <h2 className="card-title self-center text-3xl !mb-0">Submit Proposal</h2>
        <div className="space-y-2">
          <p className="m-0 text-xl ml-2">Title</p>
          <div className="flex border-2 border-base-300 bg-base-200 rounded-full text-accent">
            <input
              className="input input-ghost focus-within:border-transparent focus:outline-none focus:bg-transparent focus:text-gray-400 h-[2.2rem] min-h-[2.2rem] px-4 border w-full font-medium placeholder:text-accent/50 text-gray-400"
              placeholder="title"
              name="title"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="space-y-2">
          <p className="m-0 text-xl ml-2">Description</p>
          <div className="flex border-2 border-base-300 bg-base-200 rounded-3xl text-accent">
            <textarea
              className="input input-ghost focus-within:border-transparent focus:outline-none focus:bg-transparent focus:text-gray-400 px-4 pt-2 border w-full font-medium placeholder:text-accent/50 text-gray-400 h-28 rounded-none"
              placeholder="description"
              name="description"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="space-y-2">
          <p className="m-0 text-xl ml-2">Ask amount</p>
          <select className="select bg-base-200 select-primary select-md select-bordered w-full" name="askAmount">
            <option disabled>Select amount</option>
            {selectOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <SubmitButton />
      </form>
    </div>
  );
};

export default Form;
