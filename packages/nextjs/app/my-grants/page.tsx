"use client";

import { SetStateAction, useState } from "react";
import { NextPage } from "next";
import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import { useAccount } from "wagmi";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { GrantData } from "~~/services/database/schema";
import { PROPOSAL_STATUS } from "~~/utils/grants";
import { notification } from "~~/utils/scaffold-eth";
import { postMutationFetcher } from "~~/utils/swr";

const badgeBgColor = {
  [PROPOSAL_STATUS.PROPOSED]: "bg-warning",
  [PROPOSAL_STATUS.APPROVED]: "bg-success",
  [PROPOSAL_STATUS.SUBMITTED]: "bg-warning",
  [PROPOSAL_STATUS.COMPLETED]: "bg-success",
  [PROPOSAL_STATUS.REJECTED]: "bg-error",
};

type ReqBody = {
  grantId?: string;
  status?: string;
  signer?: string;
  link?: string;
};

const MyGrants: NextPage = () => {
  const { address } = useAccount();
  const { data: builderGrants, isLoading } = useSWR<GrantData[]>(address ? `/api/builders/${address}/grants` : null);
  const { trigger: submitBuildLink } = useSWRMutation("/api/grants/submit", postMutationFetcher<ReqBody>);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [buildUrl, setBuildUrl] = useState("");
  const [currentGrantId, setCurrentGrantId] = useState("");

  const [currentGrantTitle, setCurrentGrantTitle] = useState("");

  const openModal = (grantId: SetStateAction<string>, grantTitle: string) => {
    setCurrentGrantId(grantId);
    setCurrentGrantTitle(grantTitle);
    setModalIsOpen(true);
  };
  const closeModal = () => {
    setModalIsOpen(false);
  };
  const handleBuildUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBuildUrl(event.target.value);
  };

  // TODO: check for a better validation in stackoverflow
  const handleSubmit = async () => {
    let processedUrl = buildUrl;

    if (!processedUrl.startsWith("http://") && !processedUrl.startsWith("https://")) {
      processedUrl = "https://" + processedUrl;
    }

    if (processedUrl.startsWith("http://")) {
      processedUrl = "https://" + processedUrl.substring(7);
    }

    const urlPattern = new RegExp("^(https://app\\.buidlguidl\\.com/build/)[a-z0-9-]+$");

    if (urlPattern.test(processedUrl.toLowerCase())) {
      let notificationId;
      try {
        notificationId = notification.loading("Submitting build URL");
        await submitBuildLink({ grantId: currentGrantId, link: processedUrl, signer: address });
        mutate(`/api/builders/${address}/grants`);
        closeModal();
        notification.remove(notificationId);
        notification.success("Build URL submitted successfully");
      } catch (error) {
        notification.error("Error submitting build URL");
      } finally {
        if (notificationId) notification.remove(notificationId);
      }
    } else {
      notification.error("You must submit a valid build URL (https://app.buidlguidl.com/build/...)");
    }
  };

  return (
    <div className="container mx-auto max-w-screen-md mt-12">
      <h1 className="text-4xl font-bold">My grants</h1>
      {isLoading && <span className="loading loading-spinner"></span>}
      {builderGrants?.length === 0 && <p>No grants found</p>}
      {builderGrants?.map(grant => (
        <div key={grant.id} className="border p-4 my-4">
          <h3 className="font-bold">
            {grant.title}
            <span className="text-sm text-gray-500 ml-2">({grant.id})</span>
          </h3>
          <p>{grant.description}</p>
          <p className={`badge ${badgeBgColor[grant.status]}`}>{grant.status}</p>
          {grant.status === PROPOSAL_STATUS.APPROVED && (
            <button onClick={() => openModal(grant.id, grant.title)} className="btn btn-primary float-right">
              Submit build
            </button>
          )}
        </div>
      ))}

      {modalIsOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-8 md:p-0 z-10"
          onClick={closeModal}
        >
          <div
            className="rounded-2xl bg-primary p-5 w-auto md:w-1/2 lg:w-1/3 xl:w-1/4"
            onClick={e => e.stopPropagation()}
          >
            <button onClick={closeModal} className="float-right text-xs hover:underline">
              Close
            </button>
            <h2 className="font-medium text-lg pb-2">{currentGrantTitle}</h2>
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
                  href={`https://app.buidlguidl.com/builders/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black-500 underline"
                >
                  BuidlGuidl profile
                </a>
                &nbsp;and then submit the URL of your BG build in this form. BG Grants team will review it to complete
                the grant.
              </span>
            </div>
            <label className="block mt-4">
              <span className="font-medium">Build URL</span> to be reviewed and complete grant:
            </label>
            <input
              type="text"
              value={buildUrl}
              onChange={handleBuildUrlChange}
              placeholder="https://app.buidlguidl.com/build/..."
              className="placeholder: pl-[14px] mt-4 w-full p-1 rounded-lg"
            />
            <button className="mt-8 btn btn-sm btn-secondary" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyGrants;
