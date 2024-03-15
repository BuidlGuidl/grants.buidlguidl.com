"use client";

import { useState } from "react";
import Image from "next/image";
import { SubmitModal } from "./_components/SubmitModal";
import { NextPage } from "next";
import useSWR from "swr";
import { useAccount } from "wagmi";
import { GrantData } from "~~/services/database/schema";
import { PROPOSAL_STATUS } from "~~/utils/grants";

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
          <div className="flex mb-2 items-center">
            <Image src="/assets/eth-completed-grant.png" alt="ETH Icon" width={10} height={10} />
            <span className="ml-1 tooltip" data-tip="Total amount of the grant">
              {grant.askAmount} ETH
            </span>
          </div>
          <p className="m-0">{grant.description}</p>
          <p className={`badge ${badgeBgColor[grant.status]}`}>{grant.status}</p>
          {grant.status === PROPOSAL_STATUS.APPROVED && (
            <button onClick={() => openModal(grant)} className="btn btn-primary float-right">
              Submit build
            </button>
          )}
        </div>
      ))}

      {modalIsOpen && currentGrant !== null && (
        <SubmitModal grant={currentGrant} closeModal={() => setModalIsOpen(false)} />
      )}
    </div>
  );
};

export default MyGrants;
