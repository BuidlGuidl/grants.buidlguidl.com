import { ChangeEvent, forwardRef, useState } from "react";
import { GrantDataWithBuilder } from "~~/services/database/schema";

type EditGrantModalProps = {
  grant: GrantDataWithBuilder;
};

export const EditGrantModal = forwardRef<HTMLDialogElement, EditGrantModalProps>(({ grant }, ref) => {
  const [formData, setFormData] = useState({
    title: grant.title,
    description: grant.description,
    askAmount: grant.askAmount,
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
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
      </div>
    </dialog>
  );
});

EditGrantModal.displayName = "EditGrantModal";
