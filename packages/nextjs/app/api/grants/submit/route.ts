import { NextResponse } from "next/server";
import { recoverTypedDataAddress } from "viem";
import { submitGrantBuild } from "~~/services/database/grants";
import { findUserByAddress } from "~~/services/database/users";
import { EIP_712_DOMAIN, EIP_712_TYPES__SUBMIT_GRANT } from "~~/utils/eip712";
import { PROPOSAL_STATUS } from "~~/utils/grants";

type ReqBody = {
  grantId?: string;
  signer?: string;
  link?: string;
  signature?: `0x${string}`;
};

// TODO: Check if the grants is owned by the builder
// TODO: Check if the grant status is accepted
export async function POST(req: Request) {
  try {
    const { grantId, link, signer, signature } = (await req.json()) as ReqBody;

    if (!grantId || !signer || !link || !signature) {
      return NextResponse.json({ error: "Invalid form details submitted" }, { status: 400 });
    }

    // Validate Signature
    const recoveredAddress = await recoverTypedDataAddress({
      domain: EIP_712_DOMAIN,
      types: EIP_712_TYPES__SUBMIT_GRANT,
      primaryType: "Message",
      message: {
        grantId: grantId,
        action: PROPOSAL_STATUS.SUBMITTED,
        link,
      },
      signature,
    });

    if (recoveredAddress !== signer) {
      console.error("Signature error", recoveredAddress, signer);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify if the builder is present
    const builder = await findUserByAddress(signer);
    if (!builder.exists) {
      return NextResponse.json(
        { error: "Only buidlguild builders can submit their builds for active grants" },
        { status: 401 },
      );
    }

    const submitBuild = await submitGrantBuild(grantId, link);

    return NextResponse.json({ submitBuild }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error processing form" }, { status: 500 });
  }
}
