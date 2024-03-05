import { NextRequest, NextResponse } from "next/server";
import { recoverTypedDataAddress } from "viem";
import { getAllGrantsForReview, reviewGrant } from "~~/services/database/grants";
import { findUserByAddress } from "~~/services/database/users";
import { EIP_712_DOMAIN, EIP_712_TYPES__REVIEW_GRANT_BATCH } from "~~/utils/eip712";
import { PROPOSAL_STATUS, ProposalStatusType } from "~~/utils/grants";

export async function GET() {
  try {
    const grants = await getAllGrantsForReview();
    return NextResponse.json({ data: grants });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      {
        status: 500,
      },
    );
  }
}

type BatchReqBody = {
  signer: string;
  signature: `0x${string}`;
  reviews: {
    grantId: string;
    action: ProposalStatusType;
    txHash: string;
  }[];
};

// Updated for batch processing
export async function POST(req: NextRequest) {
  const { signer, signature, reviews } = (await req.json()) as BatchReqBody;

  // Ensure all actions are valid
  const validActions = Object.values(PROPOSAL_STATUS);
  if (!reviews.every(review => validActions.includes(review.action))) {
    console.error("Invalid action in batch", reviews);
    return NextResponse.json({ error: "Invalid action in batch" }, { status: 400 });
  }

  // Only admins can review grants
  const signerData = await findUserByAddress(signer);
  if (signerData.data?.role !== "admin") {
    console.error("Unauthorized", signer);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Assuming you have a method to recover the address for the entire batch
  const recoveredAddress = await recoverTypedDataAddress({
    domain: EIP_712_DOMAIN,
    types: EIP_712_TYPES__REVIEW_GRANT_BATCH,
    primaryType: "Message",
    message: { reviews },
    signature,
  });

  if (recoveredAddress !== signer) {
    console.error("Signature error in batch", recoveredAddress, signer);
    return NextResponse.json({ error: "Unauthorized in batch" }, { status: 401 });
  }

  try {
    for (const review of reviews) {
      await reviewGrant(review.grantId, review.action, review.txHash);
    }
  } catch (error) {
    console.error("Error processing batch grant review", error);
    return NextResponse.json({ error: "Error processing batch grant review" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
