"use client";

import { useState } from "react";
import { GrantReview } from "./_components/GrantReview";
import { useBatchReviewGrants } from "./hooks/useBatchReviewGrants";
import useSWR from "swr";
import { GrantDataWithBuilder } from "~~/services/database/schema";
import { PROPOSAL_STATUS } from "~~/utils/grants";
import { notification } from "~~/utils/scaffold-eth";

const AdminPage = () => {
  const [selectedApproveGrants, setSelectedApproveGrants] = useState<string[]>([]);
  const [selectedCompleteGrants, setSelectedCompleteGrants] = useState<string[]>([]);

  const { data, isLoading } = useSWR<{ data: GrantDataWithBuilder[] }>("/api/grants/review", {
    onError: error => {
      console.error("Error fetching grants", error);
      notification.error("Error getting grants data");
    },
  });
  const grants = data?.data;

  const { handleBatchReview, isLoading: isBatchActionLoading } = useBatchReviewGrants();

  const toggleGrantSelection = (grantId: string, action: "approve" | "complete") => {
    if (action === "approve") {
      if (selectedApproveGrants.includes(grantId)) {
        setSelectedApproveGrants(selectedApproveGrants.filter(id => id !== grantId));
      } else {
        setSelectedApproveGrants([...selectedApproveGrants, grantId]);
      }
    } else if (action === "complete") {
      if (selectedCompleteGrants.includes(grantId)) {
        setSelectedCompleteGrants(selectedCompleteGrants.filter(id => id !== grantId));
      } else {
        setSelectedCompleteGrants([...selectedCompleteGrants, grantId]);
      }
    }
  };

  const completedGrants = grants?.filter(grant => grant.status === PROPOSAL_STATUS.SUBMITTED);
  const newGrants = grants?.filter(grant => grant.status === PROPOSAL_STATUS.PROPOSED);

  return (
    <div className="container mx-auto max-w-screen-md mt-12">
      <h1 className="text-4xl font-bold">Admin page</h1>
      {isLoading && <span className="loading loading-spinner"></span>}
      {grants && (
        <div className="flex flex-col gap-4 mt-4">
          <div>
            <div className="flex justify-between items-center">
              <h2 className="font-bold">Proposals submitted as completed:</h2>
              <button
                className="btn btn-sm btn-primary"
                onClick={async () => {
                  await handleBatchReview(selectedCompleteGrants, "completed");
                  setSelectedCompleteGrants([]);
                }}
                disabled={selectedCompleteGrants.length === 0 || isBatchActionLoading}
              >
                {isBatchActionLoading && <span className="loading loading-spinner"></span>}
                Send batch complete
              </button>
            </div>
            {completedGrants?.length === 0 && <p className="m-0">No completed grants</p>}
            {completedGrants?.map(grant => (
              <GrantReview
                key={grant.id}
                grant={grant}
                selected={selectedCompleteGrants.includes(grant.id)}
                toggleSelection={() => toggleGrantSelection(grant.id, "complete")}
              />
            ))}
          </div>
          <div>
            <div className="flex justify-between items-center">
              <h2 className="font-bold">New grant proposal:</h2>
              <button
                className="btn btn-sm btn-primary"
                onClick={async () => {
                  await handleBatchReview(selectedApproveGrants, "approved");
                  setSelectedApproveGrants([]);
                }}
                disabled={selectedApproveGrants.length === 0 || isBatchActionLoading}
              >
                {isBatchActionLoading && <span className="loading loading-spinner"></span>}
                Send batch approve
              </button>
            </div>
            {newGrants?.length === 0 && <p className="m-0">No new grants</p>}
            {newGrants?.map(grant => (
              <GrantReview
                key={grant.id}
                grant={grant}
                selected={selectedApproveGrants.includes(grant.id)}
                toggleSelection={() => toggleGrantSelection(grant.id, "approve")}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
