import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { useAccount, useNetwork, usePublicClient, useSignTypedData } from "wagmi";
import { EIP_712_DOMAIN, EIP_712_TYPES__REVIEW_GRANT_BATCH } from "~~/utils/eip712";
import { ProposalStatusType } from "~~/utils/grants";
import { isSafeContext } from "~~/utils/safe-signature";
import { getParsedError, notification } from "~~/utils/scaffold-eth";
import { postMutationFetcher } from "~~/utils/swr";

type BatchReqBody = {
  signer: string;
  signature: `0x${string}`;
  reviews: {
    grantId: string;
    action: ProposalStatusType;
    txHash: string;
    txChainId: string;
  }[];
  isSafeSignature?: boolean;
};

export const useBatchReviewGrants = () => {
  const { signTypedDataAsync, isLoading: isSigningMessage } = useSignTypedData();
  const { mutate } = useSWRConfig();
  const { address: connectedAddress } = useAccount();
  const { chain: connectedChain } = useNetwork();
  const publicClient = usePublicClient({ chainId: connectedChain?.id });
  const { trigger: postBatchReviewGrant, isMutating: isPostingBatchReviewGrant } = useSWRMutation(
    `/api/grants/review`,
    postMutationFetcher<BatchReqBody>,
  );

  const handleBatchReview = async (selectedGrants: string[], action: ProposalStatusType, txHash = "") => {
    if (!connectedAddress || !connectedChain) {
      notification.error("No connected address");
      return;
    }

    const grantReviews = selectedGrants.map(grantId => {
      return {
        grantId,
        action,
        txHash,
        txChainId: connectedChain.id.toString(),
      };
    });

    try {
      const message = { reviews: grantReviews };
      const signature = await signTypedDataAsync({
        domain: { ...EIP_712_DOMAIN, chainId: connectedChain.id },
        types: EIP_712_TYPES__REVIEW_GRANT_BATCH,
        primaryType: "Message",
        message: message,
      });

      const isSafeSignature = await isSafeContext(publicClient, connectedAddress);

      await postBatchReviewGrant({
        signature: signature,
        reviews: grantReviews,
        signer: connectedAddress,
        isSafeSignature: isSafeSignature,
      });
      await mutate("/api/grants/review");
      notification.success(`Grants reviews successfully submitted!`);
    } catch (error) {
      const parsedError = getParsedError(error);
      notification.error(parsedError);
    }
  };

  return {
    handleBatchReview,
    isLoading: isSigningMessage || isPostingBatchReviewGrant,
  };
};
