import { NextResponse } from "next/server";
import { recoverTypedDataAddress } from "viem";
import { getGrantById, submitGrantBuild } from "~~/services/database/grants";
import { EIP_712_DOMAIN, EIP_712_TYPES__SUBMIT_GRANT } from "~~/utils/eip712";
import { PROPOSAL_STATUS } from "~~/utils/grants";

type ReqBody = {
  grantId?: string;
  signer?: string;
  link?: string;
  signature?: `0x${string}`;
};

// TODO: Maybe we could fetch submmited build on BG app from firebase and check if its really present,
// also check that build was actually submitted by the same builder
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
        action: "submit",
        link,
      },
      signature,
    });
    if (recoveredAddress !== signer) {
      console.error("Signature error", recoveredAddress, signer);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate if the grant is approved and owned by the builder
    const grant = await getGrantById(grantId);
    if (!grant) {
      return NextResponse.json({ error: "Invalid grant" }, { status: 400 });
    }
    if (grant.builder !== signer) {
      return NextResponse.json({ error: "Builder does not own this grant" }, { status: 401 });
    }
    if (grant.status !== PROPOSAL_STATUS.APPROVED) {
      return NextResponse.json({ error: "Grant is not approved" }, { status: 400 });
    }

    await submitGrantBuild(grantId, link);

    return NextResponse.json({}, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error processing form" }, { status: 500 });
  }
}
