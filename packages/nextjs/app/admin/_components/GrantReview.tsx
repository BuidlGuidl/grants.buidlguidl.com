import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { useAccount, useSignTypedData } from "wagmi";
import { GrantData } from "~~/services/database/schema";
import { EIP_712_DOMAIN, EIP_712_TYPES__REVIEW_GRANT } from "~~/utils/eip712";
import { PROPOSAL_STATUS, ProposalStatusType } from "~~/utils/grants";
import { notification } from "~~/utils/scaffold-eth";
import { postMutationFetcher } from "~~/utils/swr";

type ReqBody = {
  signer: string;
  signature: `0x${string}`;
  action: ProposalStatusType;
};

export const GrantReview = ({ grant }: { grant: GrantData }) => {
  const { address } = useAccount();
  const { signTypedDataAsync, isLoading: isSigningMessage } = useSignTypedData();
  const { trigger: postReviewGrant, isMutating: isPostingNewGrant } = useSWRMutation(
    `/api/grants/${grant.id}/review`,
    postMutationFetcher<ReqBody>,
  );
  const { mutate } = useSWRConfig();
  const isLoading = isSigningMessage || isPostingNewGrant;

  const handleReviewGrant = async (grant: GrantData, action: ProposalStatusType) => {
    if (!address) {
      notification.error("Please connect your wallet");
      return;
    }

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

    let notificationId;
    try {
      notificationId = notification.loading("Submiting reivew");
      await postReviewGrant({ signer: address, signature, action });
      await mutate("/api/grants/review");
      notification.remove(notificationId);
      notification.success(`Grant reviewed: ${action}`);
    } catch (error) {
      notification.error("Error reviewing grant");
    } finally {
      if (notificationId) notification.remove(notificationId);
    }
  };

  if (grant.status !== PROPOSAL_STATUS.PROPOSED && grant.status !== PROPOSAL_STATUS.SUBMITTED) return null;

  const acceptStatus = grant.status === PROPOSAL_STATUS.PROPOSED ? PROPOSAL_STATUS.APPROVED : PROPOSAL_STATUS.COMPLETED;
  const acceptLabel = grant.status === PROPOSAL_STATUS.PROPOSED ? "Approve" : "Complete";
  return (
    <div className="border p-4 my-4">
      <h3 className="font-bold">
        {grant.title}
        <span className="text-sm text-gray-500 ml-2">({grant.id})</span>
      </h3>
      <p>{grant.description}</p>
      <div className="mt-4">
        <button
          className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ${
            isLoading ? "opacity-50" : ""
          }`}
          onClick={() => handleReviewGrant(grant, acceptStatus)}
          disabled={isLoading}
        >
          {acceptLabel}
        </button>
        <button
          className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-4 ${
            isLoading ? "opacity-50" : ""
          }`}
          onClick={() => handleReviewGrant(grant, PROPOSAL_STATUS.REJECTED)}
          disabled={isLoading}
        >
          Reject
        </button>
      </div>
    </div>
  );
};
