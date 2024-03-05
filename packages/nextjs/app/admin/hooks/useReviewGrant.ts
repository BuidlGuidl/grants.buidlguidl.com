import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { useAccount, useSignTypedData } from "wagmi";
import { GrantData } from "~~/services/database/schema";
import { EIP_712_DOMAIN, EIP_712_TYPES__REVIEW_GRANT } from "~~/utils/eip712";
import { ProposalStatusType } from "~~/utils/grants";
import { notification } from "~~/utils/scaffold-eth";
import { postMutationFetcher } from "~~/utils/swr";

type ReqBody = {
  signer: string;
  signature: `0x${string}`;
  action: ProposalStatusType;
  txHash: string;
};

export const useReviewGrant = (grant: GrantData) => {
  const { address } = useAccount();
  const { signTypedDataAsync, isLoading: isSigningMessage } = useSignTypedData();
  const { trigger: postReviewGrant, isMutating: isPostingNewGrant } = useSWRMutation(
    `/api/grants/${grant.id}/review`,
    postMutationFetcher<ReqBody>,
  );
  const { mutate } = useSWRConfig();

  const isLoading = isSigningMessage || isPostingNewGrant;

  const handleReviewGrant = async (action: ProposalStatusType, txnHash = "") => {
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
          txHash: txnHash,
        },
      });
    } catch (e) {
      console.error("Error signing message", e);
      notification.error("Error signing message");
      return;
    }

    let notificationId;
    try {
      notificationId = notification.loading("Submitting review");
      await postReviewGrant({ signer: address, signature, action, txHash: txnHash });
      await mutate("/api/grants/review");
      notification.remove(notificationId);
      notification.success(`Grant reviewed: ${action}`);
    } catch (error) {
      notification.error("Error reviewing grant");
    } finally {
      if (notificationId) notification.remove(notificationId);
    }
  };

  return { handleReviewGrant, isLoading };
};
