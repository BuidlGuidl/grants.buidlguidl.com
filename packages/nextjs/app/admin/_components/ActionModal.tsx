import { forwardRef, useRef } from "react";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { useAccount, useSignTypedData } from "wagmi";
import { GrantData } from "~~/services/database/schema";
import { EIP_712_DOMAIN, EIP_712_TYPES__REVIEW_GRANT } from "~~/utils/eip712";
import { PROPOSAL_STATUS, ProposalStatusType } from "~~/utils/grants";
import { notification } from "~~/utils/scaffold-eth";
import { postMutationFetcher } from "~~/utils/swr";

type ReqBody = {
  signer: string;
  signature: `0x${string}`;
  action: ProposalStatusType;
  txHash: string;
};

type ActionModalProps = {
  grant: GrantData;
  initialTxLink?: string;
};

// TODO: Clean up this
export const ActionModal = forwardRef<HTMLDialogElement, ActionModalProps>(({ grant, initialTxLink }, ref) => {
  const { address } = useAccount();
  const { signTypedDataAsync, isLoading: isSigningMessage } = useSignTypedData();
  const { trigger: postReviewGrant, isMutating: isPostingNewGrant } = useSWRMutation(
    `/api/grants/${grant.id}/review`,
    postMutationFetcher<ReqBody>,
  );
  const { mutate } = useSWRConfig();
  const inputRef = useRef<HTMLInputElement>(null);

  const isLoading = isSigningMessage || isPostingNewGrant;

  const handleReviewGrant = async (grant: GrantData, action: ProposalStatusType) => {
    if (!address) {
      notification.error("Please connect your wallet");
      return;
    }

    let signature;
    try {
      signature = await signTypedDataAsync({
        domain: EIP_712_DOMAIN,
        types: EIP_712_TYPES__REVIEW_GRANT,
        primaryType: "Message",
        message: {
          grantId: grant.id,
          action: action,
          txHash: inputRef.current?.value ?? "",
        },
      });
    } catch (e) {
      console.error("Error signing message", e);
      notification.error("Error signing message");
      return;
    }

    let notificationId;
    try {
      notificationId = notification.loading("Submitting review");
      await postReviewGrant({ signer: address, signature, action, txHash: inputRef.current?.value ?? "" });
      await mutate("/api/grants/review");
      notification.remove(notificationId);
      notification.success(`Grant reviewed: ${action}`);
    } catch (error) {
      notification.error("Error reviewing grant");
    } finally {
      if (notificationId) notification.remove(notificationId);
    }
  };

  const acceptStatus = grant.status === PROPOSAL_STATUS.PROPOSED ? PROPOSAL_STATUS.APPROVED : PROPOSAL_STATUS.COMPLETED;
  const acceptLabel = grant.status === PROPOSAL_STATUS.PROPOSED ? "Approve" : "Complete";
  return (
    <dialog id="action_modal" className="modal" ref={ref}>
      <div className="modal-box flex flex-col space-y-3">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <p className="font-bold text-lg m-0">{acceptLabel} this grant</p>
        <input
          type="text"
          ref={inputRef}
          defaultValue={initialTxLink ?? ""}
          placeholder="Transaction hash"
          className="input input-bordered"
        />
        <button
          className={`btn btn-sm btn-success ${isLoading ? "opacity-50" : ""}`}
          onClick={() => handleReviewGrant(grant, acceptStatus)}
          disabled={isLoading}
        >
          {isLoading && <span className="loading loading-spinner"></span>}
          {acceptLabel}
        </button>
      </div>
    </dialog>
  );
});

ActionModal.displayName = "ActionModal";
