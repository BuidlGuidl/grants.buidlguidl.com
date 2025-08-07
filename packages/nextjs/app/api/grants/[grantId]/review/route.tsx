import { NextRequest, NextResponse } from "next/server";
import { EIP712TypedData } from "@safe-global/safe-core-sdk-types";
import { recoverTypedDataAddress } from "viem";
import { reviewGrant } from "~~/services/database/grants";
import { findUserByAddress } from "~~/services/database/users";
import { EIP_712_DOMAIN, EIP_712_TYPES__REVIEW_GRANT, EIP_712_TYPES__REVIEW_GRANT_WITH_NOTE } from "~~/utils/eip712";
import { PROPOSAL_STATUS, ProposalStatusType } from "~~/utils/grants";
import { validateSafeSignature } from "~~/utils/safe-signature";

type ReqBody = {
  signer: string;
  signature: `0x${string}`;
  action: ProposalStatusType;
  txHash: string;
  txChainId: string;
  link: string;
  note?: string;
  isSafeSignature?: boolean;
};

export async function POST(req: NextRequest, { params }: { params: { grantId: string } }) {
  const { grantId } = params;
  const { signature, signer, action, txHash, txChainId, note, isSafeSignature, link } = (await req.json()) as ReqBody;

  // Validate action is valid
  const validActions = Object.values(PROPOSAL_STATUS);
  if (!validActions.includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  // For COMPLETED, require link to be a non-empty string
  if (action === PROPOSAL_STATUS.COMPLETED && (typeof link !== "string" || !link.length)) {
    return NextResponse.json({ error: "Missing or invalid link for completed grant" }, { status: 400 });
  }

  let isValidSignature: boolean;

  // If action is approved or rejected, include note in signature
  if (action === PROPOSAL_STATUS.APPROVED || action === PROPOSAL_STATUS.REJECTED) {
    const typedData = {
      domain: { ...EIP_712_DOMAIN, chainId: Number(txChainId) },
      types: EIP_712_TYPES__REVIEW_GRANT_WITH_NOTE,
      primaryType: "Message",
      message: {
        grantId: grantId,
        action: action,
        txHash,
        txChainId,
        link: link ?? "",
        note: note ?? "",
      },
      signature,
    } as const;
    if (isSafeSignature) {
      isValidSignature = await validateSafeSignature({
        chainId: Number(txChainId),
        typedData: typedData as unknown as EIP712TypedData,
        signature,
        safeAddress: signer,
      });
    } else {
      const recoveredAddress = await recoverTypedDataAddress(typedData);
      isValidSignature = recoveredAddress === signer;
    }
  } else {
    // Validate Signature
    const typedData = {
      domain: { ...EIP_712_DOMAIN, chainId: Number(txChainId) },
      types: EIP_712_TYPES__REVIEW_GRANT,
      primaryType: "Message",
      message: {
        grantId: grantId,
        action: action,
        txHash,
        txChainId,
        link: link ?? "",
      },
      signature,
    } as const;
    if (isSafeSignature) {
      isValidSignature = await validateSafeSignature({
        chainId: Number(txChainId),
        typedData: typedData as unknown as EIP712TypedData,
        signature,
        safeAddress: signer,
      });
    } else {
      const recoveredAddress = await recoverTypedDataAddress(typedData);
      isValidSignature = recoveredAddress === signer;
    }
  }

  if (!isValidSignature) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only admins can review grants
  const signerData = await findUserByAddress(signer);

  if (signerData.data?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await reviewGrant({
      grantId,
      action,
      txHash,
      note,
      txChainId,
    });

    // If the action is COMPLETED, forward the signed payload to SRE
    if (action === PROPOSAL_STATUS.COMPLETED) {
      const grant = await import("~~/services/database/grants").then(m => m.getGrantById(grantId));
      if (grant && grant.link) {
        const srePayload = {
          grantId,
          action,
          txHash,
          txChainId,
          link: grant.link,
          signature,
          signer,
          note,
          isSafeSignature,
        };
        try {
          await fetch(process.env.SRE_API_URL || "https://speedrunethereum.com/api/builds/grant-completed", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(srePayload),
          });
        } catch (sreError) {
          console.error("Error forwarding grant completion to SRE", sreError);
        }
      } else {
        console.warn("No build link found for grant, not forwarding to SRE", grantId);
      }
    }
  } catch (error) {
    return NextResponse.json({ error: "Error approving grant" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
