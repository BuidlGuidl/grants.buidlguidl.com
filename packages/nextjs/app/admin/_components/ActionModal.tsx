import { forwardRef, useRef } from "react";
import { useReviewGrant } from "../hooks/useReviewGrant";
import { useNetwork } from "wagmi";
import { getNetworkColor } from "~~/hooks/scaffold-eth";
import { GrantData } from "~~/services/database/schema";
import { PROPOSAL_STATUS, ProposalStatusType } from "~~/utils/grants";
import { NETWORKS_EXTRA_DATA } from "~~/utils/scaffold-eth";

type ActionModalProps = {
  grant: GrantData;
  initialTxLink?: string;
  action: ProposalStatusType;
};

export const ActionModal = forwardRef<HTMLDialogElement, ActionModalProps>(({ grant, initialTxLink, action }, ref) => {
  const transactionInputRef = useRef<HTMLInputElement>(null);
  const noteInputRef = useRef<HTMLTextAreaElement>(null);

  const { chain } = useNetwork();
  const chainWithExtraAttributes = chain ? { ...chain, ...NETWORKS_EXTRA_DATA[chain.id] } : undefined;

  const { handleReviewGrant, isLoading } = useReviewGrant(grant);

  const actionLabel =
    action === PROPOSAL_STATUS.REJECTED ? "Reject" : action === PROPOSAL_STATUS.APPROVED ? "Approve" : "Complete";
  return (
    <dialog id="action_modal" className="modal" ref={ref}>
      <div className="modal-box flex flex-col space-y-3">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <div className="flex justify-between items-center">
          <p className="font-bold text-lg m-0">{actionLabel} this grant</p>
          {chainWithExtraAttributes && (
            <p className="m-0 text-sm" style={{ color: getNetworkColor(chainWithExtraAttributes, true) }}>
              {chainWithExtraAttributes.name}
            </p>
          )}
        </div>
        {action !== PROPOSAL_STATUS.REJECTED && (
          <div className="w-full flex-col space-y-1">
            <p className="m-0 font-semibold text-base">Transaction Hash</p>
            <input
              type="text"
              ref={transactionInputRef}
              defaultValue={initialTxLink ?? ""}
              placeholder="Transaction hash"
              className="input input-bordered w-full"
            />
          </div>
        )}
        {(action === PROPOSAL_STATUS.APPROVED || action === PROPOSAL_STATUS.REJECTED) && (
          <div className="w-full flex-col space-y-1">
            <p className="m-0 font-semibold text-base">Note (optional)</p>
            <textarea
              ref={noteInputRef}
              placeholder={`Note for the builder (${actionLabel})`}
              className="input input-bordered w-full py-2 h-24"
            />
          </div>
        )}
        <button
          className={`btn btn-sm ${action === PROPOSAL_STATUS.REJECTED ? "btn-error" : "btn-success"} ${
            isLoading ? "opacity-50" : ""
          }`}
          onClick={() => handleReviewGrant(action, transactionInputRef?.current?.value, noteInputRef?.current?.value)}
          disabled={isLoading}
        >
          {isLoading && <span className="loading loading-spinner"></span>}
          {actionLabel}
        </button>
      </div>
    </dialog>
  );
});

ActionModal.displayName = "ActionModal";
