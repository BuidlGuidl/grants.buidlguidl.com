"use client";

import { useRouter } from "next/navigation";
import SubmitButton from "./SubmitButton";
import useSWRMutation from "swr/mutation";
import { useAccount, useSignTypedData } from "wagmi";
import { EIP_712_DOMAIN, EIP_712_TYPES__APPLY_FOR_GRANT } from "~~/utils/eip712";
import { notification } from "~~/utils/scaffold-eth";
import { postMutationFetcher } from "~~/utils/swr";

// TODO: move to a shared location
type ReqBody = {
  title?: string;
  description?: string;
  askAmount?: string;
  signature?: `0x${string}`;
  signer?: string;
};

const Form = () => {
  const { address: connectedAddress } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();
  const router = useRouter();
  const { trigger: postNewGrant } = useSWRMutation("/api/grants/new", postMutationFetcher<ReqBody>);

  const clientFormAction = async (formData: FormData) => {
    if (!connectedAddress) {
      notification.error("Please connect your wallet");
      return;
    }

    try {
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      const askAmount = "0.25";
      if (!title || !description || !askAmount) {
        notification.error("Please fill all the fields");
        return;
      }

      const signature = await signTypedDataAsync({
        domain: EIP_712_DOMAIN,
        types: EIP_712_TYPES__APPLY_FOR_GRANT,
        primaryType: "Message",
        message: {
          title: title,
          description: description,
        },
      });

      await postNewGrant({ title, description, askAmount, signature, signer: connectedAddress });

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
    <div className="card card-compact rounded-xl w-96 bg-secondary shadow-lg mb-12">
      <form action={clientFormAction} className="card-body space-y-3">
        <h2 className="card-title self-center text-3xl !mb-0">Submit Proposal</h2>
        <div className="space-y-2">
          <p className="m-0 text-xl ml-2">Title</p>
          <div className="flex border-2 border-base-300 bg-base-200 rounded-xl text-accent">
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
          <div className="flex border-2 border-base-300 bg-base-200 rounded-xl text-accent">
            <textarea
              className="input input-ghost focus-within:border-transparent focus:outline-none focus:bg-transparent focus:text-gray-400 px-4 pt-2 border w-full font-medium placeholder:text-accent/50 text-gray-400 h-28 rounded-none"
              placeholder="description"
              name="description"
              autoComplete="off"
            />
          </div>
        </div>
        <SubmitButton />
      </form>
    </div>
  );
};

export default Form;
