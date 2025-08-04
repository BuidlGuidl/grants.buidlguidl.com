"use client";

import { useState } from "react";
import Image from "next/image";
import { SubmitModal } from "./_components/SubmitModal";
import { NextPage } from "next";
import useSWR from "swr";
import { useAccount } from "wagmi";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { GrantData } from "~~/services/database/schema";
import { PROPOSAL_STATUS } from "~~/utils/grants";
import { getBlockExplorerTxLink } from "~~/utils/scaffold-eth";

const badgeBgColor = {
  [PROPOSAL_STATUS.PROPOSED]: "bg-warning",
  [PROPOSAL_STATUS.APPROVED]: "bg-success",
  [PROPOSAL_STATUS.SUBMITTED]: "bg-warning",
  [PROPOSAL_STATUS.COMPLETED]: "bg-success",
  [PROPOSAL_STATUS.REJECTED]: "bg-error",
};

const MyGrants: NextPage = () => {
  const { address } = useAccount();
  const { data: builderGrants, isLoading } = useSWR<GrantData[]>(address ? `/api/builders/${address}/grants` : null);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentGrant, setCurrentGrant] = useState<GrantData | null>(null);

  const openModal = (grant: GrantData) => {
    setCurrentGrant(grant);
    setModalIsOpen(true);
  };

  return (
    <div className="container mx-auto max-w-screen-md mt-12">
      <h1 className="text-4xl font-bold">My grants</h1>
      {isLoading && <span className="loading loading-spinner"></span>}
      {builderGrants?.length === 0 && <p>No grants found</p>}
      {builderGrants?.map(grant => (
        <div key={grant.id} className="border p-4 my-4">
          <h3 className="text-lg m-0 font-bold">
            {grant.title}
            <span className="text-sm text-gray-500 ml-2">({grant.id})</span>
          </h3>
          {grant.status !== PROPOSAL_STATUS.PROPOSED && (
            <div className="flex mb-2 items-center">
              <Image src="/assets/eth-completed-grant.png" alt="ETH Icon" width={10} height={10} />
              <span className="ml-1 tooltip" data-tip="Total amount of the grant">
                {grant.askAmount} ETH
              </span>
            </div>
          )}
          <p className="m-0">{grant.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <p className={`badge ${badgeBgColor[grant.status]}`}>{grant.status}</p>
              {(grant.status === PROPOSAL_STATUS.SUBMITTED || grant.status === PROPOSAL_STATUS.COMPLETED) &&
                grant.link && (
                  <a
                    href={grant.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-600 underline underline-offset-4 text-xs align-middle font-bold"
                  >
                    view build <ArrowTopRightOnSquareIcon className="h-4 w-4 inline" />
                  </a>
                )}
              {grant.note &&
                grant.note.trim().length > 0 &&
                (grant.status === PROPOSAL_STATUS.REJECTED || grant.status === PROPOSAL_STATUS.APPROVED) && (
                  <div className="flex ml-1 tooltip tooltip-bottom cursor-pointer" data-tip={grant.note}>
                    <QuestionMarkCircleIcon className="h-5 w-5 inline" />
                  </div>
                )}
              {grant.approvedTx && (
                <a
                  href={getBlockExplorerTxLink(Number(grant.txChainId), grant.approvedTx)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-4 underline underline-offset-4 text-xs"
                >
                  50% approve tx <ArrowTopRightOnSquareIcon className="h-4 w-4 inline" />
                </a>
              )}
              {grant.completedTx && (
                <a
                  href={getBlockExplorerTxLink(Number(grant.txChainId), grant.completedTx)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-4 underline underline-offset-4 text-xs"
                >
                  50% complete tx <ArrowTopRightOnSquareIcon className="h-4 w-4 inline" />
                </a>
              )}
            </div>
            {grant.status === PROPOSAL_STATUS.APPROVED && (
              <button onClick={() => openModal(grant)} className="btn btn-primary justify-self-end">
                Submit build
              </button>
            )}
          </div>
        </div>
      ))}

      {modalIsOpen && currentGrant !== null && (
        <SubmitModal grant={currentGrant} closeModal={() => setModalIsOpen(false)} />
      )}
    </div>
  );
};

export default MyGrants;
