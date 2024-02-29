import { useState } from "react";
import { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import { useAccount } from "wagmi";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { notification } from "~~/utils/scaffold-eth";
import { postMutationFetcher } from "~~/utils/swr";

type ReqBody = {
  grantId?: string;
  status?: string;
  signer?: string;
  link?: string;
};

export const SubmitModal = ({
  grantTitle,
  grantId,
  closeModal,
}: {
  grantTitle: string;
  grantId: string;
  closeModal: () => void;
}) => {
  const { address: connectedAddress } = useAccount();
  const [buildUrl, setBuildUrl] = useState("");
  const { trigger: submitBuildLink } = useSWRMutation("/api/grants/submit", postMutationFetcher<ReqBody>);

  const handleSubmit = async () => {
    const urlPattern = new RegExp("^(https://app\\.buidlguidl\\.com/build/)[a-z0-9-]+$");

    if (!urlPattern.test(buildUrl.toLowerCase()))
      return notification.error("You must submit a valid build URL (https://app.buidlguidl.com/build/...)");

    let notificationId;
    try {
      notificationId = notification.loading("Submitting build URL");
      await submitBuildLink({ grantId: grantId, link: buildUrl, signer: connectedAddress });
      await mutate(`/api/builders/${connectedAddress}/grants`);
      closeModal();
      notification.remove(notificationId);
      notification.success("Build URL submitted successfully");
    } catch (error) {
      notification.error("Error submitting build URL");
    } finally {
      if (notificationId) notification.remove(notificationId);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-8 md:p-0 z-10"
      onClick={closeModal}
    >
      <div className="rounded-2xl bg-primary p-5 w-auto md:w-1/2 lg:w-1/3 xl:w-1/4" onClick={e => e.stopPropagation()}>
        <button onClick={closeModal} className="float-right text-xs hover:underline">
          Close
        </button>
        <h2 className="font-medium text-lg pb-2">{grantTitle}</h2>
        <div role="alert" className="alert border-0">
          <span className="text-sm text-gray-400">
            <InformationCircleIcon
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              className="stroke-info shrink-0 w-5 h-5 inline-block mr-2"
            />
            First you&apos;ll need to register the build in your&nbsp;
            <a
              href={`https://app.buidlguidl.com/builders/${connectedAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-black-500 underline"
            >
              BuidlGuidl profile
            </a>
            &nbsp;and then submit the URL of your BG build in this form. BG Grants team will review it to complete the
            grant.
          </span>
        </div>
        <label className="block mt-4">
          <span className="font-medium">Build URL</span> to be reviewed and complete grant:
        </label>
        <input
          type="text"
          value={buildUrl}
          onChange={e => setBuildUrl(e.target.value)}
          placeholder="https://app.buidlguidl.com/build/..."
          className="placeholder: pl-[14px] mt-4 w-full p-1 rounded-lg"
        />
        <button className="mt-8 btn btn-sm btn-secondary" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};
