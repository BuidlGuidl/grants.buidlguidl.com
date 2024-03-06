import { forwardRef, useRef } from "react";
import { useBatchReviewGrants } from "../hooks/useBatchReviewGrants";
import { PROPOSAL_STATUS } from "~~/utils/grants";

type BatchActionModalProps = {
  selectedGrants: string[];
  initialTxLink?: string;
  btnLabel: "Approve" | "Complete";
  closeModal: () => void;
};

export const BatchActionModal = forwardRef<HTMLDialogElement, BatchActionModalProps>(
  ({ selectedGrants, initialTxLink, closeModal, btnLabel }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const { handleBatchReview, isLoading } = useBatchReviewGrants();

    return (
      <dialog id="action_modal" className="modal" ref={ref}>
        <div className="modal-box flex flex-col space-y-3">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <p className="font-bold text-lg m-0">{btnLabel} this grant</p>
          <input
            type="text"
            ref={inputRef}
            defaultValue={initialTxLink ?? ""}
            placeholder="Transaction hash"
            className="input input-bordered"
          />
          <button
            className={`btn btn-sm btn-success ${isLoading ? "opacity-50" : ""}`}
            onClick={async () => {
              await handleBatchReview(
                selectedGrants,
                btnLabel === "Approve" ? PROPOSAL_STATUS.APPROVED : PROPOSAL_STATUS.COMPLETED,
                inputRef.current?.value,
              );
              closeModal();
            }}
            disabled={isLoading}
          >
            {isLoading && <span className="loading loading-spinner"></span>}
            {btnLabel}
          </button>
        </div>
      </dialog>
    );
  },
);

BatchActionModal.displayName = "BatchActionModal";
