import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { recoverTypedDataAddress } from "viem";
import { getAllGrantsForReview, reviewGrant } from "~~/services/database/grants";
import { findUserByAddress } from "~~/services/database/users";
import { EIP_712_DOMAIN, EIP_712_TYPES__REVIEW_GRANT_BATCH } from "~~/utils/eip712";
import { PROPOSAL_STATUS, ProposalStatusType } from "~~/utils/grants";

export const dynamic = "force-dynamic";

export async function GET() {
  // Soft check.
  const reqHeaders = headers();
  const address = reqHeaders.get("Address");
  const adminApiKey = reqHeaders.get("Admin-Api-Key");
  const serverAdminApiKey = process.env.ADMIN_API_KEY;

  if (!serverAdminApiKey) {
    return NextResponse.json({ error: "No API key configured on server" }, { status: 500 });
  }

  if (!address || adminApiKey !== serverAdminApiKey) {
    console.error("Unauthorized");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const signerData = await findUserByAddress(address);
  if (signerData.data?.role !== "admin") {
    console.error("Unauthorized", address);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
    txChainId: string;
  }[];
};

export async function POST(req: NextRequest) {
  const { signer, signature, reviews } = (await req.json()) as BatchReqBody;

  if (!reviews.length) {
    console.error("No reviews in batch");
    return NextResponse.json({ error: "No reviews in batch" }, { status: 400 });
  }

  // Assuming all reviews are for the same chain
  const txChainId = reviews[0].txChainId;

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

  const recoveredAddress = await recoverTypedDataAddress({
    domain: { ...EIP_712_DOMAIN, chainId: Number(txChainId) },
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
      await reviewGrant(review);
    }
  } catch (error) {
    console.error("Error processing batch grant review", error);
    return NextResponse.json({ error: "Error processing batch grant review" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
