import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { useAccount, useSignTypedData } from "wagmi";
import TelegramIcon from "~~/components/assets/TelegramIcon";
import TwitterIcon from "~~/components/assets/TwitterIcon";
import { Address } from "~~/components/scaffold-eth";
import { GrantData, GrantDataWithBuilder, SocialLinks } from "~~/services/database/schema";
import { EIP_712_DOMAIN, EIP_712_TYPES__REVIEW_GRANT } from "~~/utils/eip712";
import { PROPOSAL_STATUS, ProposalStatusType } from "~~/utils/grants";
import { notification } from "~~/utils/scaffold-eth";
import { postMutationFetcher } from "~~/utils/swr";

type ReqBody = {
  signer: string;
  signature: `0x${string}`;
  action: ProposalStatusType;
};

const BuilderSocials = ({ socialLinks }: { socialLinks?: SocialLinks }) => {
  if (!socialLinks) return null;

  return (
    <>
      {socialLinks?.twitter && (
        <a
          className="inline-block w-[20px] hover:opacity-80"
          href={`https://twitter.com/${socialLinks?.twitter}`}
          target="_blank"
          rel="noreferrer"
        >
          <TwitterIcon />
        </a>
      )}
      {socialLinks?.telegram && (
        <a
          className="inline-block w-[20px] hover:opacity-80"
          href={`https://telegram.me/${socialLinks?.telegram}`}
          target="_blank"
          rel="noreferrer"
        >
          <TelegramIcon />
        </a>
      )}
    </>
  );
};

export const GrantReview = ({ grant }: { grant: GrantDataWithBuilder }) => {
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
      notificationId = notification.loading("Submitting review");
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
      <div className="flex gap-4 items-center">
        <Address address={grant.builder} link={`https://app.buidlguidl.com/builders/${grant.builder}`} />
        <BuilderSocials socialLinks={grant.builderData?.socialLinks} />
      </div>
      <p>{grant.description}</p>
      <div className="flex gap-4 mt-4 justify-end">
        <button
          className={`btn btn-sm btn-error ${isLoading ? "opacity-50" : ""}`}
          onClick={() => handleReviewGrant(grant, PROPOSAL_STATUS.REJECTED)}
          disabled={isLoading}
        >
          Reject
        </button>
        <button
          className={`btn btn-sm btn-success ${isLoading ? "opacity-50" : ""}`}
          onClick={() => handleReviewGrant(grant, acceptStatus)}
          disabled={isLoading}
        >
          {acceptLabel}
        </button>
      </div>
    </div>
  );
};
