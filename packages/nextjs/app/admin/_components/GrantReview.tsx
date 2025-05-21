import { useRef, useState } from "react";
import Image from "next/image";
import { ActionModal } from "./ActionModal";
import { EditGrantModal } from "./EditGrantModal";
import useSWR from "swr";
import { parseEther } from "viem";
import { useNetwork } from "wagmi";
import { ArrowTopRightOnSquareIcon, QuestionMarkCircleIcon } from "@heroicons/react/20/solid";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import TelegramIcon from "~~/components/assets/TelegramIcon";
import TwitterIcon from "~~/components/assets/TwitterIcon";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { GrantData, GrantDataWithPrivateNote, SocialLinks } from "~~/services/database/schema";
import { PROPOSAL_STATUS, ProposalStatusType } from "~~/utils/grants";

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

const getImpersonatorLink = (address: string) => {
  return `https://impersonator.vision/?address=${address}&url=https://grants.buidlguidl.com/my-grants`;
};

type GrantReviewProps = {
  grant: GrantDataWithPrivateNote;
  selected: boolean;
  toggleSelection: () => void;
};
export const GrantReview = ({ grant, selected, toggleSelection }: GrantReviewProps) => {
  const actionModalRef = useRef<HTMLDialogElement>(null);
  const editGrantModalRef = useRef<HTMLDialogElement>(null);
  const [reviewAction, setReviewAction] = useState<ProposalStatusType>(
    grant.status === PROPOSAL_STATUS.PROPOSED ? PROPOSAL_STATUS.APPROVED : PROPOSAL_STATUS.COMPLETED,
  );
  const { chain: connectedChain } = useNetwork();

  const { data: txResult, writeAsync: splitEqualETH } = useScaffoldContractWrite({
    contractName: "BGGrants",
    functionName: "splitETH",
    args: [undefined, undefined],
  });

  // Fetch all grants for this builder to show count and detail in tooltip
  const { data: grants, error } = useSWR<GrantData[]>(`/api/builders/${grant.builder}/grants`);

  if (error) {
    console.error("Error fetching grants data for this builder: ", error);
  }

  if (grant.status !== PROPOSAL_STATUS.PROPOSED && grant.status !== PROPOSAL_STATUS.SUBMITTED) return null;

  const acceptLabel = grant.status === PROPOSAL_STATUS.PROPOSED ? "Approve" : "Complete";

  // Disable complete action if chain is mismatch
  const isCompleteAction = grant.status === PROPOSAL_STATUS.SUBMITTED;
  const isChainMismatch = !connectedChain || connectedChain.id.toString() !== grant.txChainId;
  // Boolean(grant.txChainId) => We want to enable btn in this case nd allow admin to send txn on any chain
  const isCompleteActionDisabled = Boolean(grant.txChainId) && isCompleteAction && isChainMismatch;
  const completeActionDisableClassName = isCompleteActionDisabled ? "tooltip !pointer-events-auto" : "";
  const completeActionDisableToolTip = isCompleteActionDisabled && `Please switch to chain: ${grant.txChainId}`;

  // Filter out current grant from grantsCount and grantsDetail (tooltip content)
  const grantsCount = grants ? grants.filter(g => g.id !== grant.id).length : 0;

  const grantsDetail = grants
    ? grants
        .filter(g => g.id !== grant.id)
        .reduce<{ [key: string]: number }>((acc, curr: GrantData) => {
          acc[curr.status] = (acc[curr.status] || 0) + 1;
          return acc;
        }, {})
    : {};

  const otherGrantsTooltip = Object.entries(grantsDetail)
    .map(([status, count]) => `${status}: ${count}`)
    .join(" | ");

  return (
    <div className="border-4 rounded-lg my-4">
      <div className="flex justify-between items-center bg-white py-3 px-4 text-sm">
        <div className="flex items-center">
          <Image src="/assets/eth-completed-grant.png" alt="ETH Icon" width={10} height={10} />
          <span className="ml-1 font-bold tooltip" data-tip="Total amount of the grant">
            {grant.askAmount} ETH
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span>
            {grant.proposedAt
              ? new Date(grant.proposedAt).toLocaleString(undefined, {
                  year: "numeric",
                  month: "2-digit",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""}
          </span>
          <button className="cursor-pointer self-center" onClick={() => editGrantModalRef?.current?.showModal()}>
            <PencilSquareIcon className="h-6 w-6" />
          </button>
          <input
            type="checkbox"
            className={`checkbox checkbox-primary ${completeActionDisableClassName}`}
            data-tip={completeActionDisableToolTip}
            disabled={isCompleteActionDisabled}
            checked={selected}
            onChange={toggleSelection}
          />
        </div>
      </div>
      <div className="bg-base-300 p-4">
        <div className="flex justify-between mb-2">
          <div className="font-bold flex flex-col gap-1 lg:gap-2 lg:flex-row lg:flex-wrap items-baseline">
            <h1 className="text-lg m-0">{grant.title}</h1>
            <span className="text-sm text-gray-500">({grant.id})</span>
            {grant.link && (
              <a href={grant.link} className="underline text-sm" target="_blank" rel="noopener noreferrer">
                View Build <ArrowTopRightOnSquareIcon className="h-4 w-4 inline" />
              </a>
            )}
          </div>
        </div>
        <div className="flex gap-4 items-center relative">
          <Address address={grant.builder} link={`https://speedrunethereum.com/builders/${grant.builder}`} />
          {grantsCount > 0 && (
            <a href={getImpersonatorLink(grant.builder)} target="_blank" rel="noreferrer">
              <span className="group text-sm text-gray-500 tooltip" data-tip={otherGrantsTooltip}>
                {grantsCount} {grantsCount === 1 ? "submission" : "submissions"}{" "}
                <QuestionMarkCircleIcon className="h-4 w-4 inline" />
              </span>
            </a>
          )}
        </div>
        <div className="flex gap-4 items-center mt-3">
          <BuilderSocials socialLinks={grant.builderData?.socialLinks} />
          {grant.builderData?.batch?.number && (
            <div className="badge badge-outline">Batch #{grant.builderData.batch?.number}</div>
          )}
          {grant.builderData?.builderCohort?.map(cohort => {
            return (
              <a href={cohort.url} target="_blank" rel="noreferrer" key={cohort.id} className="link">
                <div className="badge badge-secondary">{cohort.name}</div>
              </a>
            );
          })}
        </div>
      </div>
      <div className="p-4">
        <p>{grant.description}</p>
        <div className="flex gap-2 lg:gap-4 mt-4 justify-between">
          <button
            className="btn btn-sm btn-error "
            onClick={() => {
              setReviewAction(PROPOSAL_STATUS.REJECTED);
              actionModalRef.current?.showModal();
            }}
            disabled={isCompleteActionDisabled}
          >
            Reject
          </button>
          <div className="flex gap-2 lg:gap-4">
            <button
              className={`btn btn-sm btn-success border-2 bg-transparent ${completeActionDisableClassName}`}
              data-tip={completeActionDisableToolTip}
              onClick={async () => {
                const resHash = await splitEqualETH({
                  args: [[grant.builder], [parseEther((grant.askAmount / 2).toString())]],
                  value: parseEther((grant.askAmount / 2).toString()),
                });

                setReviewAction(
                  grant.status === PROPOSAL_STATUS.PROPOSED ? PROPOSAL_STATUS.APPROVED : PROPOSAL_STATUS.COMPLETED,
                );
                // Transactor eats the error, so we need to handle by checking resHash
                if (resHash && actionModalRef.current) actionModalRef.current.showModal();
              }}
              disabled={isCompleteActionDisabled}
            >
              Send 50%
            </button>
            <button
              className={`btn btn-sm btn-success ${completeActionDisableClassName}`}
              data-tip={completeActionDisableToolTip}
              onClick={() => {
                setReviewAction(
                  grant.status === PROPOSAL_STATUS.PROPOSED ? PROPOSAL_STATUS.APPROVED : PROPOSAL_STATUS.COMPLETED,
                );
                if (actionModalRef.current) actionModalRef.current.showModal();
              }}
              disabled={isCompleteActionDisabled}
            >
              {acceptLabel}
            </button>
          </div>
        </div>
        {grant.private_note && grant.private_note.trim().length > 0 && (
          <p className="mb-0 text-orange-500 whitespace-pre-wrap">{grant.private_note}</p>
        )}
      </div>
      <EditGrantModal ref={editGrantModalRef} grant={grant} closeModal={() => editGrantModalRef?.current?.close()} />
      <ActionModal ref={actionModalRef} grant={grant} initialTxLink={txResult?.hash} action={reviewAction} />
    </div>
  );
};
