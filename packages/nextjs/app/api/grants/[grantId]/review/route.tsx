import { NextRequest, NextResponse } from "next/server";
import { recoverTypedDataAddress } from "viem";
import { reviewGrant } from "~~/services/database/grants";
import { findUserByAddress } from "~~/services/database/users";
import { EIP_712_DOMAIN, EIP_712_TYPES__REVIEW_GRANT, EIP_712_TYPES__REVIEW_GRANT_WITH_NOTE } from "~~/utils/eip712";
import { PROPOSAL_STATUS, ProposalStatusType } from "~~/utils/grants";

type ReqBody = {
  signer: string;
  signature: `0x${string}`;
  action: ProposalStatusType;
  txHash: string;
  txChainId: string;
  note?: string;
};

export async function POST(req: NextRequest, { params }: { params: { grantId: string } }) {
  const { grantId } = params;
  const { signature, signer, action, txHash, txChainId, note } = (await req.json()) as ReqBody;

  // Validate action is valid
  const validActions = Object.values(PROPOSAL_STATUS);
  if (!validActions.includes(action)) {
    console.error("Invalid action", action);
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  let recoveredAddress: string;

  // If action is approved or rejected, include note in signature
  if (action === PROPOSAL_STATUS.APPROVED || action === PROPOSAL_STATUS.REJECTED) {
    recoveredAddress = await recoverTypedDataAddress({
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
    });
  } else {
    // Validate Signature
    recoveredAddress = await recoverTypedDataAddress({
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
    });
  }

  if (recoveredAddress !== signer) {
    console.error("Signature error", recoveredAddress, signer);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only admins can review grants
  const signerData = await findUserByAddress(signer);

  if (signerData.data?.role !== "admin") {
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
    console.error("Error approving grant", error);
    return NextResponse.json({ error: "Error approving grant" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
