import { forwardRef } from "react";
import { GrantData } from "~~/services/database/schema";

export const ActionModal = forwardRef<HTMLDialogElement, { grant: GrantData }>(({ grant }, ref) => {
  console.log("grant", grant);

  return (
    <dialog id="action_modal" className="modal" ref={ref}>
      <div className="modal-box">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h3 className="font-bold text-lg">Hello!</h3>
        <p className="py-4">Press ESC key or click on ✕ button to close</p>
      </div>
    </dialog>
  );
});

ActionModal.displayName = "ActionModal";
