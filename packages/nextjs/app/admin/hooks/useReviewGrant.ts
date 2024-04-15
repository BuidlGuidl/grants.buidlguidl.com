import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { useAccount, useNetwork, useSignTypedData } from "wagmi";
import { GrantData } from "~~/services/database/schema";
import { EIP_712_DOMAIN, EIP_712_TYPES__REVIEW_GRANT, EIP_712_TYPES__REVIEW_GRANT_WITH_NOTE } from "~~/utils/eip712";
import { PROPOSAL_STATUS, ProposalStatusType } from "~~/utils/grants";
import { notification } from "~~/utils/scaffold-eth";
import { postMutationFetcher } from "~~/utils/swr";

type ReqBody = {
  signer: string;
  signature: `0x${string}`;
  action: ProposalStatusType;
  txHash: string;
  txChainId: string;
  note?: string;
};

export const useReviewGrant = (grant: GrantData) => {
  const { address } = useAccount();
  const { chain: connectedChain } = useNetwork();
  const { signTypedDataAsync, isLoading: isSigningMessage } = useSignTypedData();
  const { trigger: postReviewGrant, isMutating: isPostingNewGrant } = useSWRMutation(
    `/api/grants/${grant.id}/review`,
    postMutationFetcher<ReqBody>,
  );
  const { mutate } = useSWRConfig();

  const isLoading = isSigningMessage || isPostingNewGrant;

  const handleReviewGrant = async (action: ProposalStatusType, txnHash = "", note: string | undefined = undefined) => {
    if (!address || !connectedChain) {
      notification.error("Please connect your wallet");
      return;
    }

    let signature;
    try {
      if (action === PROPOSAL_STATUS.APPROVED || action === PROPOSAL_STATUS.REJECTED) {
        signature = await signTypedDataAsync({
          domain: { ...EIP_712_DOMAIN, chainId: connectedChain.id },
          types: EIP_712_TYPES__REVIEW_GRANT_WITH_NOTE,
          primaryType: "Message",
          message: {
            grantId: grant.id,
            action: action,
            txHash: txnHash,
            txChainId: connectedChain.id.toString(),
            note: note ?? "",
          },
        });
      } else {
        signature = await signTypedDataAsync({
          domain: { ...EIP_712_DOMAIN, chainId: connectedChain.id },
          types: EIP_712_TYPES__REVIEW_GRANT,
          primaryType: "Message",
          message: {
            grantId: grant.id,
            action: action,
            txHash: txnHash,
            txChainId: connectedChain.id.toString(),
          },
        });
      }
    } catch (e) {
      console.error("Error signing message", e);
      notification.error("Error signing message");
      return;
    }

    let notificationId;
    try {
      notificationId = notification.loading("Submitting review");
      await postReviewGrant({
        signer: address,
        signature,
        action,
        txHash: txnHash,
        txChainId: connectedChain.id.toString(),
        note,
      });
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
