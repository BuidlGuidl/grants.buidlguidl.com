"use client";

import { useRouter } from "next/navigation";
import SubmitButton from "./SubmitButton";
import { useAccount, useSignTypedData } from "wagmi";
import { EIP_712_DOMAIN, EIP_712_TYPES__APPLY_FOR_GRANT } from "~~/utils/eip712";
import { notification } from "~~/utils/scaffold-eth";

const selectOptions = [0.1, 0.25, 0.5, 1];

const Form = () => {
  const { address: connectedAddress } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();
  const router = useRouter();

  const clientFormAction = async (formData: FormData) => {
    if (!connectedAddress) {
      notification.error("Please connect your wallet");
      return;
    }

    try {
      const title = formData.get("title");
      const description = formData.get("description");
      const askAmount = formData.get("askAmount");
      if (!title || !description || !askAmount) {
        notification.error("Please fill all the fields");
        return;
      }

      const signature = await signTypedDataAsync({
        domain: EIP_712_DOMAIN,
        types: EIP_712_TYPES__APPLY_FOR_GRANT,
        primaryType: "Message",
        message: {
          title: title as string,
          description: description as string,
          askAmount: askAmount as string,
        },
      });

      const res = await fetch("/api/grants/new", {
        method: "POST",
        body: JSON.stringify({ title, description, askAmount, signature, signer: connectedAddress }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error submitting grant proposal");
      }

      notification.success("Proposal submitted successfully!");
      router.push("/");
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
              type="text"
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
                {option} ETH
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
