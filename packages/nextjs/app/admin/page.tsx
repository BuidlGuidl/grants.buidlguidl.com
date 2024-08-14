"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { BatchActionModal } from "./_components/BatchActionModal";
import { GrantReview } from "./_components/GrantReview";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { useLocalStorage } from "usehooks-ts";
import { parseEther } from "viem";
import { useAccount, useNetwork, usePublicClient, useSignTypedData } from "wagmi";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { GrantDataWithBuilder } from "~~/services/database/schema";
import { EIP_712_DOMAIN, EIP_712_TYPES__ADMIN_SIGN_IN } from "~~/utils/eip712";
import { PROPOSAL_STATUS } from "~~/utils/grants";
import { isSafeContext } from "~~/utils/safe-signature";
import { getParsedError, notification } from "~~/utils/scaffold-eth";
import { postMutationFetcher } from "~~/utils/swr";

type ReqHeaders = {
  address: string;
  apiKey: string;
};

const fetcherWithHeader = async (url: string, headers: { address: string; apiKey: string }) => {
  const res = await fetch(url, {
    headers: {
      Address: headers.address,
      "Admin-Api-Key": headers.apiKey,
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Error getting data`);
  }
  return data;
};

const AdminPage = () => {
  const { address } = useAccount();
  const [selectedApproveGrants, setSelectedApproveGrants] = useState<string[]>([]);
  const { chain: connectedChain } = useNetwork();
  const publicClient = usePublicClient({ chainId: connectedChain?.id });
  const [selectedCompleteGrants, setSelectedCompleteGrants] = useState<string[]>([]);
  const [modalBtnLabel, setModalBtnLabel] = useState<"Approve" | "Complete">("Approve");
  const modalRef = useRef<HTMLDialogElement>(null);
  const [apiKey, setApiKey] = useLocalStorage("admin-api-key", "", { initializeWithValue: false });
  const { signTypedDataAsync, isLoading: isSigningMessage } = useSignTypedData();
  const { trigger: postAdminSignIn, isMutating: isSigningIn } = useSWRMutation(
    "/api/admin/signin",
    postMutationFetcher<{
      signer?: string;
      signature?: `0x${string}`;
      isSafeSignature?: boolean;
      chainId?: number;
    }>,
  );

  const {
    data,
    isLoading,
    error: grantsError,
  } = useSWR<{ data: GrantDataWithBuilder[] }>(
    address && apiKey ? "/api/grants/review" : null,
    url => url && fetcherWithHeader(url, { address, apiKey } as ReqHeaders),
    {
      onError: error => {
        console.error("Error fetching grants", error);
        notification.error("Error getting grants data");
      },
      onSuccess: () => {
        // reset states whenver any of action is performed
        setSelectedApproveGrants([]);
        setSelectedCompleteGrants([]);
      },
    },
  );
  const grants = data?.data;

  const toggleGrantSelection = (grantId: string, action: "approve" | "complete") => {
    if (action === "approve") {
      if (selectedApproveGrants.includes(grantId)) {
        setSelectedApproveGrants(selectedApproveGrants.filter(id => id !== grantId));
      } else {
        setSelectedApproveGrants([...selectedApproveGrants, grantId]);
      }
    } else if (action === "complete") {
      if (selectedCompleteGrants.includes(grantId)) {
        setSelectedCompleteGrants(selectedCompleteGrants.filter(id => id !== grantId));
      } else {
        setSelectedCompleteGrants([...selectedCompleteGrants, grantId]);
      }
    }
  };

  const { data: txResult, writeAsync: splitEqualETH } = useScaffoldContractWrite({
    contractName: "BGGrants",
    functionName: "splitETH",
    args: [undefined, undefined],
  });

  const handleBatchAction = async (filteredGrants: GrantDataWithBuilder[], action: "approve" | "complete") => {
    const selectedGrantsWithMetaData = filteredGrants.filter(grant => {
      if (action === "approve") return selectedApproveGrants.includes(grant.id);
      return selectedCompleteGrants.includes(grant.id);
    });
    const builders = selectedGrantsWithMetaData.map(grant => grant.builder);
    const buildersAmount = selectedGrantsWithMetaData.map(grant => parseEther((grant.askAmount / 2).toString()));
    const totalAmount = selectedGrantsWithMetaData.reduce(
      (acc, grant) => acc + parseEther(grant.askAmount.toString()),
      BigInt(0),
    );

    const value = totalAmount / BigInt(2);

    const hash = await splitEqualETH({
      args: [builders, buildersAmount],
      value: value,
    });
    setModalBtnLabel(action === "approve" ? "Approve" : "Complete");
    if (hash && modalRef.current) modalRef.current.showModal();
  };

  const handleSignIn = async () => {
    try {
      if (!address) {
        notification.error("Please connect your wallet");
        return;
      }

      const signature = await signTypedDataAsync({
        domain: EIP_712_DOMAIN,
        types: EIP_712_TYPES__ADMIN_SIGN_IN,
        primaryType: "Message",
        message: { action: "Sign In", description: "I authorize myself as admin" },
      });

      const isSafeSignature = await isSafeContext(publicClient, address);

      const resData = (await postAdminSignIn({
        signer: address,
        signature,
        isSafeSignature,
        chainId: connectedChain?.id,
      })) as {
        data: { apiKey: string };
      };
      setApiKey(resData.data.apiKey);
    } catch (error) {
      console.error("Error signing in", error);
      const errMessage = getParsedError(error);
      notification.error(errMessage);
    }
  };

  const completedGrants = grants
    ?.filter(grant => grant.status === PROPOSAL_STATUS.SUBMITTED)
    .sort((a, b) => (b?.submittedAt && a?.submittedAt ? b.submittedAt - a.submittedAt : 0));
  const newGrants = grants
    ?.filter(grant => grant.status === PROPOSAL_STATUS.PROPOSED)
    .sort((a, b) => (b?.proposedAt && a?.proposedAt ? b.proposedAt - a.proposedAt : 0));

  if (!apiKey || !address) {
    return (
      <div className="container mx-auto mt-12 max-w-[95%]">
        <div className="p-8 bg-success/5">
          <h2 className="font-bold text-xl">Sign in to review</h2>
          <p className="m-0">Please sign a message to reivew the grants</p>
          <button
            className="btn btn-primary btn-md mt-4"
            onClick={handleSignIn}
            disabled={isSigningMessage || isSigningIn}
          >
            {(isSigningIn || isSigningMessage) && <span className="loading loading-spinner"></span>}
            Sign in
          </button>
        </div>
      </div>
    );
  }

  if (grantsError) {
    return (
      <div className="container mx-auto mt-12 max-w-[95%]">
        <div className="p-8 bg-error/5">
          <h2 className="font-bold text-xl">Error fetching data</h2>
          <p className="m-0">Please make you are connected to right address.</p>
          <Link href="/" className="underline underline-offset-2">
            Go back to home page
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-12 max-w-[95%]">
      {isLoading && <span className="loading loading-spinner"></span>}
      <Link href="/active-grants" className="block mb-2 link text-right">
        Active Grants &gt;
      </Link>
      {grants && (
        <div className="flex flex-col lg:flex-row gap-12 mt-4">
          <div className="p-8 bg-warning/5 lg:w-1/2">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-xl">
                New Grant Proposals {newGrants && newGrants.length > 0 && <>({newGrants.length})</>}
              </h2>
              {newGrants && newGrants.length !== 0 && (
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => handleBatchAction(newGrants, "approve")}
                  disabled={selectedApproveGrants.length === 0}
                >
                  Batch Send + Approve{" "}
                  {selectedApproveGrants && selectedApproveGrants.length > 0 && <>({selectedApproveGrants.length})</>}
                </button>
              )}
            </div>
            {newGrants?.length === 0 && <p className="m-0">No new grants</p>}
            {newGrants?.map(grant => (
              <GrantReview
                key={grant.id}
                grant={grant}
                selected={selectedApproveGrants.includes(grant.id)}
                toggleSelection={() => toggleGrantSelection(grant.id, "approve")}
              />
            ))}
          </div>
          <div className="p-8 bg-success/5 lg:w-1/2">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-xl">
                Completed Grants {completedGrants && completedGrants.length > 0 && <>({completedGrants.length})</>}
              </h2>
              {completedGrants && completedGrants.length !== 0 && (
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => handleBatchAction(completedGrants, "complete")}
                  disabled={selectedCompleteGrants.length === 0}
                >
                  Batch Send + Complete{" "}
                  {selectedCompleteGrants && selectedCompleteGrants.length > 0 && (
                    <>({selectedCompleteGrants.length})</>
                  )}
                </button>
              )}
            </div>
            {completedGrants?.length === 0 && <p className="m-0">No completed grants</p>}
            {completedGrants?.map(grant => (
              <GrantReview
                key={grant.id}
                grant={grant}
                selected={selectedCompleteGrants.includes(grant.id)}
                toggleSelection={() => toggleGrantSelection(grant.id, "complete")}
              />
            ))}
          </div>
        </div>
      )}
      <BatchActionModal
        ref={modalRef}
        selectedGrants={modalBtnLabel === "Approve" ? selectedApproveGrants : selectedCompleteGrants}
        btnLabel={modalBtnLabel}
        initialTxLink={txResult?.hash}
        closeModal={() => {
          if (modalRef.current) modalRef.current.close();
        }}
      />
    </div>
  );
};

export default AdminPage;
