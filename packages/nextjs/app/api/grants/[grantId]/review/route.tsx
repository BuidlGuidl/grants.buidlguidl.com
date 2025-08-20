import { NextRequest, NextResponse } from "next/server";
import { EIP712TypedData } from "@safe-global/safe-core-sdk-types";
import { waitUntil } from "@vercel/functions";
import { recoverTypedDataAddress } from "viem";
import { fetchBuilderData } from "~~/services/api/sre/builders";
import { getGrantById, reviewGrant } from "~~/services/database/grants";
import { extractBuildId, sendBuildToSRE } from "~~/services/sre";
import { EIP_712_DOMAIN, EIP_712_TYPES__REVIEW_GRANT, EIP_712_TYPES__REVIEW_GRANT_WITH_NOTE } from "~~/utils/eip712";
import { PROPOSAL_STATUS, ProposalStatusType } from "~~/utils/grants";
import { validateSafeSignature } from "~~/utils/safe-signature";

type ReqBody = {
  signer: string;
  signature: `0x${string}`;
  action: ProposalStatusType;
  txHash: string;
  txChainId: string;
  note?: string;
  isSafeSignature?: boolean;
};

export async function POST(req: NextRequest, { params }: { params: { grantId: string } }) {
  const { grantId } = params;
  const { signature, signer, action, txHash, txChainId, note, isSafeSignature } = (await req.json()) as ReqBody;

  // Validate action is valid
  const validActions = Object.values(PROPOSAL_STATUS);
  if (!validActions.includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
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
  const signerData = await fetchBuilderData(signer);
  if (signerData?.role !== "admin") {
    console.error("Unauthorized", signer);
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
  } catch (error) {
    return NextResponse.json({ error: "Error approving grant" }, { status: 500 });
  }

  // Send build to SRE to mark it as bgGrant
  if (action === PROPOSAL_STATUS.COMPLETED) {
    // Use waitUntil for background processing
    waitUntil(
      (async () => {
        try {
          const grant = await getGrantById(grantId);
          const buildId = extractBuildId(grant?.link);
          if (buildId) {
            await sendBuildToSRE(buildId);
          } else {
            console.warn("[SRE] Could not derive buildId from link – skipping SRE sync", grantId);
          }
        } catch (sreError) {
          // Log SRE errors but don't fail the main operation
          console.error("[SRE] Error notifying SpeedRunEthereum:", sreError);
        }
      })(),
    );
  }

  return NextResponse.json({ success: true });
}
