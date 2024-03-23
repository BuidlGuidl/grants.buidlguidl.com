import { ChangeEvent, forwardRef, useState } from "react";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { useAccount, useNetwork, useSignTypedData } from "wagmi";
import { GrantDataWithBuilder } from "~~/services/database/schema";
import { EIP_712_DOMAIN, EIP_712_TYPES_EDIT_GRANT } from "~~/utils/eip712";
import { getParsedError, notification } from "~~/utils/scaffold-eth";
import { patchMutationFetcher } from "~~/utils/swr";

type EditGrantModalProps = {
  grant: GrantDataWithBuilder;
  closeModal: () => void;
};

type ReqBody = {
  title?: string;
  description?: string;
  askAmount?: number;
  signature?: `0x${string}`;
  signer?: string;
};

export const EditGrantModal = forwardRef<HTMLDialogElement, EditGrantModalProps>(({ grant, closeModal }, ref) => {
  const [formData, setFormData] = useState({
    title: grant.title,
    description: grant.description,
    askAmount: grant.askAmount,
  });

  const { address } = useAccount();
  const { chain: connectedChain } = useNetwork();
  const { signTypedDataAsync, isLoading: isSigningMessage } = useSignTypedData();

  const { trigger: editGrant, isMutating } = useSWRMutation(`/api/grants/${grant.id}`, patchMutationFetcher<ReqBody>);
  const { mutate } = useSWRConfig();

  const isLoading = isSigningMessage || isMutating;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleEditGrant = async () => {
    if (!address || !connectedChain) {
      notification.error("Please connect your wallet");
      return;
    }

    let notificationId: string | undefined;
    try {
      const signature = await signTypedDataAsync({
        domain: EIP_712_DOMAIN,
        types: EIP_712_TYPES_EDIT_GRANT,
        primaryType: "Message",
        message: {
          grantId: grant.id,
          title: formData.title,
          description: formData.description,
          askAmount: formData.askAmount.toString(),
        },
      });
      notificationId = notification.loading("Updating grant");
      await editGrant({
        signer: address,
        signature,
        ...formData,
      });
      await mutate("/api/grants/review");
      notification.remove(notificationId);
      notification.success(`Successfully updated grant ${grant.id}`);
      closeModal();
    } catch (error) {
      console.error("Error editing grant", error);
      const errorMessage = getParsedError(error);
      notification.error(errorMessage);
    } finally {
      if (notificationId) notification.remove(notificationId);
    }
  };

  return (
    <dialog id="edit_grant_modal" className="modal" ref={ref}>
      <div className="modal-box flex flex-col space-y-3">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <div className="flex justify-between items-center">
          <p className="font-bold text-lg m-0">
            Edit grant
            <span className="text-sm text-gray-500 ml-2">({grant.id})</span>
          </p>
        </div>
        <div className="w-full flex-col gap-1">
          <p className="m-0 font-semibold text-base">Title</p>
          <input
            type="text"
            placeholder="title"
            name="title"
            value={formData.title}
            className="input input-sm input-bordered w-full"
            onChange={handleInputChange}
          />
        </div>
        <div className="w-full flex-col gap-1">
          <p className="m-0 font-semibold text-base">Description</p>
          <textarea
            name="description"
            placeholder="description"
            value={formData.description}
            className="textarea textarea-md textarea-bordered  w-full"
            rows={5}
            onChange={handleInputChange}
          />
        </div>
        <div className="w-full flex-col gap-1">
          <p className="m-0 font-semibold text-base">Amount</p>
          <input
            type="number"
            name="askAmount"
            placeholder="ask amount"
            value={formData.askAmount}
            className="input input-sm input-bordered w-full"
            onChange={handleInputChange}
          />
        </div>
        <button
          className={`btn btn-md btn-success ${isLoading ? "opacity-50" : ""}`}
          onClick={handleEditGrant}
          disabled={isLoading}
        >
          {isLoading && <span className="loading loading-spinner"></span>}
          Submit
        </button>
      </div>
    </dialog>
  );
});

EditGrantModal.displayName = "EditGrantModal";
