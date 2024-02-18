"use client";

import { useEffect, useState } from "react";
import { useAccount, useSignTypedData } from "wagmi";
import { GrantData } from "~~/services/database/schema";
import { EIP_712_DOMAIN, EIP_712_TYPES__REVIEW_GRANT } from "~~/utils/eip712";
import { PROPOSAL_STATUS, ProposalStatusType } from "~~/utils/grants";
import { notification } from "~~/utils/scaffold-eth";

// ToDo. "Protect" with address header or PROTECT with signing the read.
// ToDo. Submitted grants
// ToDo. Loading states (initial, actions, etc)
// ToDo. Refresh list after action
const AdminPage = () => {
  const { address } = useAccount();
  const [grants, setGrants] = useState<GrantData[]>([]);
  const { signTypedDataAsync } = useSignTypedData();

  useEffect(() => {
    const getGrants = async () => {
      try {
        const response = await fetch("/api/grants/review");
        const grants: GrantData[] = (await response.json()).data;
        setGrants(grants);
      } catch (error) {
        notification.error("Error getting grants for review");
      }
    };

    getGrants();
  }, []);

  const reviewGrant = async (grant: GrantData, action: ProposalStatusType) => {
    let signature;
    try {
      signature = await signTypedDataAsync({
        domain: EIP_712_DOMAIN,
        types: EIP_712_TYPES__REVIEW_GRANT,
        primaryType: "Message",
        message: {
          grantId: grant.id,
          action: action,
        },
      });
    } catch (e) {
      console.error("Error signing message", e);
      notification.error("Error signing message");
      return;
    }

    try {
      await fetch(`/api/grants/${grant.id}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ signature, signer: address, action }),
      });
      notification.success(`Grant reviewed: ${action}`);
    } catch (error) {
      notification.error("Error reviewing grant");
    }
  };

  return (
    <div className="container mx-auto max-w-screen-md mt-12">
      <h1 className="text-4xl font-bold">Admin page</h1>
      {grants && (
        <>
          <h2 className="font-bold mt-8">All grants that need review:</h2>
          {grants.map(grant => (
            <div key={grant.id} className="border p-4 my-4">
              <h3 className="font-bold">
                {grant.title}
                <span className="text-sm text-gray-500 ml-2">({grant.id})</span>
              </h3>
              <p>{grant.description}</p>
              {grant.status === PROPOSAL_STATUS.PROPOSED && (
                <div className="mt-4">
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => reviewGrant(grant, PROPOSAL_STATUS.APPROVED)}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-4"
                    onClick={() => reviewGrant(grant, PROPOSAL_STATUS.REJECTED)}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default AdminPage;
