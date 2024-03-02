import { useRef } from "react";
import { useReviewGrant } from "../hooks/useReviewGrant";
import { ActionModal } from "./ActionModal";
import { parseEther } from "viem";
import { useSendTransaction } from "wagmi";
import TelegramIcon from "~~/components/assets/TelegramIcon";
import TwitterIcon from "~~/components/assets/TwitterIcon";
import { Address } from "~~/components/scaffold-eth";
import { useTransactor } from "~~/hooks/scaffold-eth";
import { GrantDataWithBuilder, SocialLinks } from "~~/services/database/schema";
import { PROPOSAL_STATUS } from "~~/utils/grants";

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
  const modalRef = useRef<HTMLDialogElement>(null);

  const { data: txnHash, sendTransactionAsync } = useSendTransaction({
    to: grant.builder,
    value: parseEther((grant.askAmount / 2).toString()),
  });
  const sendTx = useTransactor();

  const { handleReviewGrant, isLoading } = useReviewGrant(grant);

  if (grant.status !== PROPOSAL_STATUS.PROPOSED && grant.status !== PROPOSAL_STATUS.SUBMITTED) return null;

  const acceptLabel = grant.status === PROPOSAL_STATUS.PROPOSED ? "Approve" : "Complete";
  return (
    <div className="border p-4 my-4">
      <h3 className="font-bold">
        {grant.title}
        <span className="text-sm text-gray-500 ml-2">({grant.id})</span>
        {grant.link && (
          <a href={grant.link} className="ml-4 underline" target="_blank" rel="noopener noreferrer">
            View Build
          </a>
        )}
      </h3>
      <div className="flex gap-4 items-center">
        <Address address={grant.builder} link={`https://app.buidlguidl.com/builders/${grant.builder}`} />
        <BuilderSocials socialLinks={grant.builderData?.socialLinks} />
      </div>
      <p>{grant.description}</p>
      <div className="flex gap-4 mt-4 justify-between">
        <button
          className={`btn btn-sm btn-error ${isLoading ? "opacity-50" : ""}`}
          onClick={() => handleReviewGrant(PROPOSAL_STATUS.REJECTED)}
          disabled={isLoading}
        >
          Reject
        </button>
        <div className="flex gap-4">
          <button
            className={`btn btn-sm btn-success ${isLoading ? "opacity-50" : ""}`}
            onClick={() => {
              if (modalRef.current) modalRef.current.showModal();
            }}
            disabled={isLoading}
          >
            {acceptLabel}
          </button>
          <button
            className={`btn btn-sm btn-neutral ${isLoading ? "opacity-50" : ""}`}
            onClick={async () => {
              const resHash = await sendTx(sendTransactionAsync);
              // Transactor eats the error, so we need to handle by checking resHash
              if (resHash && modalRef.current) modalRef.current.showModal();
            }}
            disabled={isLoading}
          >
            Send 50%
          </button>
        </div>
      </div>
      <ActionModal ref={modalRef} grant={grant} initialTxLink={txnHash?.hash} />
    </div>
  );
};
