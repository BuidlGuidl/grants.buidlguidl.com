"use client";

import { useState } from "react";
import { GrantReview } from "./_components/GrantReview";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { useAccount, useSignTypedData } from "wagmi";
import { GrantDataWithBuilder } from "~~/services/database/schema";
import { EIP_712_DOMAIN, EIP_712_TYPES__REVIEW_GRANT_BATCH } from "~~/utils/eip712";
import { PROPOSAL_STATUS, ProposalStatusType } from "~~/utils/grants";
import { getParsedError, notification } from "~~/utils/scaffold-eth";
import { postMutationFetcher } from "~~/utils/swr";

type BatchReqBody = {
  signer: string;
  signature: `0x${string}`;
  reviews: {
    grantId: string;
    action: ProposalStatusType;
    txHash: string;
  }[];
};

// ToDo. "Protect" with address header or PROTECT with signing the read.
const AdminPage = () => {
  // State to keep track of selected grants
  const [selectedGrants, setSelectedGrants] = useState<string[]>([]);

  const { signTypedDataAsync, isLoading: isSigningMessage } = useSignTypedData();

  const {
    data,
    isLoading,
    mutate: mutateGetGrantsReivew,
  } = useSWR<{ data: GrantDataWithBuilder[] }>("/api/grants/review", {
    onError: error => {
      console.error("Error fetching grants", error);
      notification.error("Error getting grants data");
    },
  });
  const grants = data?.data;

  const { address: connectedAddress } = useAccount();
  const { trigger: postBatchReviewGrant, isMutating: isPostingBatchRevewGrant } = useSWRMutation(
    `/api/grants/review`,
    postMutationFetcher<BatchReqBody>,
  );

  // Toggle grant selection
  const toggleGrantSelection = (grantId: string) => {
    if (selectedGrants.includes(grantId)) {
      setSelectedGrants(selectedGrants.filter(id => id !== grantId));
    } else {
      setSelectedGrants([...selectedGrants, grantId]);
    }
  };

  const handleBatchAction = async () => {
    if (!connectedAddress) {
      notification.error("No connected address");
      return;
    }

    let notificationId;
    try {
      const grantReviews = selectedGrants.map(grantId => {
        return {
          grantId,
          action: PROPOSAL_STATUS.APPROVED,
          txHash: "0x12345",
        };
      });
      // Construct the message for EIP-712 signature
      const message = {
        reviews: grantReviews,
      };
      const signature = await signTypedDataAsync({
        domain: EIP_712_DOMAIN,
        types: EIP_712_TYPES__REVIEW_GRANT_BATCH,
        primaryType: "Message",
        message: message,
      });

      notificationId = notification.loading("Submitting review");
      await postBatchReviewGrant({
        signature: signature,
        reviews: grantReviews,
        signer: connectedAddress,
      });
      await mutateGetGrantsReivew();

      notification.remove(notificationId);
      notification.success(`Grants reviews successfully submitted!`);
      console.log("Signature", signature);
    } catch (error) {
      console.error("Error sending batch action", error);
      const parsedError = getParsedError(error);
      notification.error(parsedError);
    } finally {
      if (notificationId) notification.remove(notificationId);
    }
  };
  const isBatchBtnLoading = isSigningMessage || isPostingBatchRevewGrant;

  const completedGrants = grants?.filter(grant => grant.status === PROPOSAL_STATUS.SUBMITTED);
  const newGrants = grants?.filter(grant => grant.status === PROPOSAL_STATUS.PROPOSED);

  return (
    <div className="container mx-auto max-w-screen-md mt-12">
      <h1 className="text-4xl font-bold">Admin page</h1>
      {isLoading && <span className="loading loading-spinner"></span>}
      {grants && (
        <div className="flex flex-col gap-4 mt-4">
          <h2 className="font-bold">Proposals submitted as completed:</h2>
          {completedGrants?.length === 0 && <p className="m-0">No completed grants</p>}
          {completedGrants?.map(grant => (
            <GrantReview key={grant.id} grant={grant} />
          ))}
          <div>
            <div className="flex justify-between items-center">
              <h2 className="font-bold">New grant proposal:</h2>
              <button
                className="btn btn-sm btn-primary"
                onClick={handleBatchAction}
                disabled={selectedGrants.length === 0 || isBatchBtnLoading}
              >
                {isBatchBtnLoading && <span className="loading loading-spinner"></span>}
                Send batch action
              </button>
            </div>
            {newGrants?.length === 0 && <p className="m-0">No new grants</p>}
            {newGrants?.map(grant => (
              <GrantReview
                key={grant.id}
                grant={grant}
                selected={selectedGrants.includes(grant.id)}
                toggleSelection={() => toggleGrantSelection(grant.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
