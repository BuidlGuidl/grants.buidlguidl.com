"use client";

import { useRef, useState } from "react";
import { BatchActionModal } from "./_components/BatchActionModal";
import { GrantReview } from "./_components/GrantReview";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { useLocalStorage } from "usehooks-ts";
import { parseEther } from "viem";
import { useAccount, useSignTypedData } from "wagmi";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { GrantDataWithBuilder } from "~~/services/database/schema";
import { EIP_712_DOMAIN, EIP_712_TYPES__ADMIN_SIGN_IN } from "~~/utils/eip712";
import { PROPOSAL_STATUS } from "~~/utils/grants";
import { getParsedError, notification } from "~~/utils/scaffold-eth";
import { postMutationFetcher } from "~~/utils/swr";

const fetcherWithHeader = (url: string, address: string) =>
  fetch(url, {
    headers: {
      Address: address,
    },
  }).then(res => res.json());

const AdminPage = () => {
  const { address } = useAccount();
  const [selectedApproveGrants, setSelectedApproveGrants] = useState<string[]>([]);
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
    }>,
  );

  const { data, isLoading } = useSWR<{ data: GrantDataWithBuilder[] }>(
    address ? "/api/grants/review" : null,
    url => url && fetcherWithHeader(url, address as string),
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
    const totalAmount = selectedGrantsWithMetaData.reduce((acc, grant) => acc + grant.askAmount, 0);

    const value = parseEther((totalAmount / 2).toString());
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

      const resData = (await postAdminSignIn({ signer: address, signature })) as { data: { apiKey: string } };
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

  if (!apiKey) {
    return (
      <div className="flex items-center justify-center mt-28">
        <button className="btn btn-primary" onClick={handleSignIn} disabled={isSigningMessage || isSigningIn}>
          {(isSigningIn || isSigningMessage) && <span className="loading loading-spinner"></span>}
          Sign in to view
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-12 max-w-[95%]">
      {isLoading && <span className="loading loading-spinner"></span>}
      {grants && (
        <div className="flex flex-col lg:flex-row gap-12 mt-4">
          <div className="p-8 bg-warning/5 lg:w-1/2">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-xl">New Grant Proposals</h2>
              {newGrants && newGrants.length !== 0 && (
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => handleBatchAction(newGrants, "approve")}
                  disabled={selectedApproveGrants.length === 0}
                >
                  Batch Send + Approve
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
              <h2 className="font-bold text-xl">Completed Grants</h2>
              {completedGrants && completedGrants.length !== 0 && (
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => handleBatchAction(completedGrants, "complete")}
                  disabled={selectedCompleteGrants.length === 0}
                >
                  Batch Send + Complete
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
