import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { useAccount, useNetwork, usePublicClient, useSignTypedData } from "wagmi";
import { GrantData } from "~~/services/database/schema";
import { EIP_712_DOMAIN, EIP_712_TYPES__REVIEW_GRANT, EIP_712_TYPES__REVIEW_GRANT_WITH_NOTE } from "~~/utils/eip712";
import { PROPOSAL_STATUS, ProposalStatusType } from "~~/utils/grants";
import { isSafeContext } from "~~/utils/safe-signature";
import { notification } from "~~/utils/scaffold-eth";
import { postMutationFetcher } from "~~/utils/swr";

type ReqBody = {
  signer: string;
  signature: `0x${string}`;
  action: ProposalStatusType;
  txHash: string;
  txChainId: string;
  note?: string;
  isSafeSignature?: boolean;
  link: string;
};

export const useReviewGrant = (grant: GrantData) => {
  const { address } = useAccount();
  const { chain: connectedChain } = useNetwork();
  const publicClient = usePublicClient({ chainId: connectedChain?.id });
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
            link: grant.link ?? "",
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
            link: grant.link ?? "",
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
      const isSafeSignature = await isSafeContext(publicClient, address);
      await postReviewGrant({
        signer: address,
        signature,
        action,
        txHash: txnHash,
        txChainId: connectedChain.id.toString(),
        note,
        isSafeSignature,
        link: grant.link ?? "",
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
