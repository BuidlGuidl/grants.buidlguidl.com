import { NextRequest, NextResponse } from "next/server";
import { recoverTypedDataAddress } from "viem";
import { reviewGrant } from "~~/services/database/grants";
import { EIP_712_DOMAIN, EIP_712_TYPES__REVIEW_GRANT } from "~~/utils/eip712";

export async function POST(req: NextRequest, { params }: { params: { grantId: string } }) {
  const { grantId } = params;
  const { signature, signer, action } = await req.json();

  // Validate Signature
  const recoveredAddress = await recoverTypedDataAddress({
    domain: EIP_712_DOMAIN,
    types: EIP_712_TYPES__REVIEW_GRANT,
    primaryType: "Message",
    message: {
      grantId: grantId,
      action: action,
    },
    signature,
  });

  if (recoveredAddress !== signer) {
    console.error("Signature error", recoveredAddress, signer);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await reviewGrant(grantId, action);
  } catch (error) {
    console.error("Error approving grant", error);
    return NextResponse.json({ error: "Error approving grant" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
