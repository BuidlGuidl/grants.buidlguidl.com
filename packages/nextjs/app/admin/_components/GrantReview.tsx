import { useRef } from "react";
import Image from "next/image";
import { useReviewGrant } from "../hooks/useReviewGrant";
import { ActionModal } from "./ActionModal";
import { EditGrantModal } from "./EditGrantModal";
import { parseEther } from "viem";
import { useNetwork } from "wagmi";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import TelegramIcon from "~~/components/assets/TelegramIcon";
import TwitterIcon from "~~/components/assets/TwitterIcon";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
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

type GrantReviewProps = {
  grant: GrantDataWithBuilder;
  selected: boolean;
  toggleSelection: () => void;
};
export const GrantReview = ({ grant, selected, toggleSelection }: GrantReviewProps) => {
  const actionModalRef = useRef<HTMLDialogElement>(null);
  const editGrantModalRef = useRef<HTMLDialogElement>(null);
  const { chain: connectedChain } = useNetwork();

  const { data: txResult, writeAsync: splitEqualETH } = useScaffoldContractWrite({
    contractName: "BGGrants",
    functionName: "splitETH",
    args: [undefined, undefined],
  });

  const { handleReviewGrant, isLoading } = useReviewGrant(grant);

  if (grant.status !== PROPOSAL_STATUS.PROPOSED && grant.status !== PROPOSAL_STATUS.SUBMITTED) return null;

  const acceptLabel = grant.status === PROPOSAL_STATUS.PROPOSED ? "Approve" : "Complete";

  // Disable complete action if chain is mismatch
  const isCompleteAction = grant.status === PROPOSAL_STATUS.SUBMITTED;
  const isChainMismatch = !connectedChain || connectedChain.id.toString() !== grant.txChainId;
  // Boolean(grant.txChainId) => We want to enable btn in this case nd allow admin to send txn on any chain
  const isCompleteActionDisabled = Boolean(grant.txChainId) && isCompleteAction && isChainMismatch;
  const completeActionDisableClassName = isCompleteActionDisabled ? "tooltip !pointer-events-auto" : "";
  const completeActionDisableToolTip = isCompleteActionDisabled && `Please switch to chain: ${grant.txChainId}`;

  return (
    <div className="border-4 rounded-lg p-4 my-4">
      <div className="flex justify-between mb-2">
        <div className="font-bold flex flex-col gap-1 lg:gap-2 lg:flex-row items-baseline">
          <h1 className="text-lg m-0">{grant.title}</h1>
          <span className="text-sm text-gray-500">({grant.id})</span>
          <button className="cursor-pointer" onClick={() => editGrantModalRef?.current?.showModal()}>
            <PencilSquareIcon className="h-5 w-5" />
          </button>
          {grant.link && (
            <a href={grant.link} className="underline text-sm" target="_blank" rel="noopener noreferrer">
              View Build <ArrowTopRightOnSquareIcon className="h-4 w-4 inline" />
            </a>
          )}
        </div>
        <input
          type="checkbox"
          className={`checkbox checkbox-primary ${completeActionDisableClassName}`}
          data-tip={completeActionDisableToolTip}
          disabled={isCompleteActionDisabled}
          checked={selected}
          onChange={toggleSelection}
        />
      </div>
      <div className="flex mb-2 items-center">
        <Image src="/assets/eth-completed-grant.png" alt="ETH Icon" width={10} height={10} />
        <span className="ml-1 tooltip" data-tip="Total amount of the grant">
          {grant.askAmount} ETH
        </span>
      </div>
      <div className="flex gap-4 items-center">
        <Address address={grant.builder} link={`https://app.buidlguidl.com/builders/${grant.builder}`} />
        <BuilderSocials socialLinks={grant.builderData?.socialLinks} />
        {grant.builderData?.builderBatch && (
          <div className="badge badge-outline">Batch #{grant.builderData.builderBatch}</div>
        )}
      </div>
      <p>{grant.description}</p>
      <div className="flex gap-2 lg:gap-4 mt-4 justify-between">
        <button
          className={`btn btn-sm btn-error ${isLoading ? "opacity-50" : ""}`}
          onClick={() => handleReviewGrant(PROPOSAL_STATUS.REJECTED)}
          disabled={isLoading}
        >
          Reject
        </button>
        <div className="flex gap-2 lg:gap-4">
          <button
            className={`btn btn-sm btn-success border-2 bg-transparent ${
              isLoading ? "opacity-50" : ""
            } ${completeActionDisableClassName}`}
            data-tip={completeActionDisableToolTip}
            onClick={async () => {
              const resHash = await splitEqualETH({
                args: [[grant.builder], [parseEther((grant.askAmount / 2).toString())]],
                value: parseEther((grant.askAmount / 2).toString()),
              });
              // Transactor eats the error, so we need to handle by checking resHash
              if (resHash && actionModalRef.current) actionModalRef.current.showModal();
            }}
            disabled={isLoading || isCompleteActionDisabled}
          >
            Send 50%
          </button>
          <button
            className={`btn btn-sm btn-success ${isLoading ? "opacity-50" : ""} ${completeActionDisableClassName}`}
            data-tip={completeActionDisableToolTip}
            onClick={() => {
              if (actionModalRef.current) actionModalRef.current.showModal();
            }}
            disabled={isLoading || isCompleteActionDisabled}
          >
            {acceptLabel}
          </button>
        </div>
      </div>
      <EditGrantModal ref={editGrantModalRef} grant={grant} closeModal={() => editGrantModalRef?.current?.close()} />
      <ActionModal ref={actionModalRef} grant={grant} initialTxLink={txResult?.hash} />
    </div>
  );
};
