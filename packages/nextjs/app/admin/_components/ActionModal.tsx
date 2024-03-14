import { forwardRef, useRef } from "react";
import { useReviewGrant } from "../hooks/useReviewGrant";
import { useNetwork } from "wagmi";
import { getNetworkColor } from "~~/hooks/scaffold-eth";
import { GrantData } from "~~/services/database/schema";
import { PROPOSAL_STATUS } from "~~/utils/grants";
import { NETWORKS_EXTRA_DATA } from "~~/utils/scaffold-eth";

type ActionModalProps = {
  grant: GrantData;
  initialTxLink?: string;
};

export const ActionModal = forwardRef<HTMLDialogElement, ActionModalProps>(({ grant, initialTxLink }, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { chain } = useNetwork();
  const chainWithExtraAttributes = chain ? { ...chain, ...NETWORKS_EXTRA_DATA[chain.id] } : undefined;

  const { handleReviewGrant, isLoading } = useReviewGrant(grant);

  const acceptStatus = grant.status === PROPOSAL_STATUS.PROPOSED ? PROPOSAL_STATUS.APPROVED : PROPOSAL_STATUS.COMPLETED;
  const acceptLabel = grant.status === PROPOSAL_STATUS.PROPOSED ? "Approve" : "Complete";
  return (
    <dialog id="action_modal" className="modal" ref={ref}>
      <div className="modal-box flex flex-col space-y-3">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <div className="flex justify-between items-center">
          <p className="font-bold text-lg m-0">{acceptLabel} this grant</p>
          {chainWithExtraAttributes && (
            <p className="m-0 text-sm" style={{ color: getNetworkColor(chainWithExtraAttributes, true) }}>
              {chainWithExtraAttributes.name}
            </p>
          )}
        </div>
        <input
          type="text"
          ref={inputRef}
          defaultValue={initialTxLink ?? ""}
          placeholder="Transaction hash"
          className="input input-bordered"
        />
        <button
          className={`btn btn-sm btn-success ${isLoading ? "opacity-50" : ""}`}
          onClick={() => handleReviewGrant(acceptStatus, inputRef.current?.value)}
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
