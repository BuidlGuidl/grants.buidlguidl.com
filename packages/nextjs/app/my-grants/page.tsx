"use client";

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

// ToDo. Action (v1.0 = submit grant after completion)
const MyGrants: NextPage = () => {
  const { address } = useAccount();
  const { data: builderGrants, isLoading } = useSWR<GrantData[]>(address ? `/api/builders/${address}/grants` : null);

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
        </div>
      ))}
    </div>
  );
};

export default MyGrants;
