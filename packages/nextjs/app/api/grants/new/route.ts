import { NextResponse } from "next/server";
import { recoverTypedDataAddress } from "viem";
import { createGrant } from "~~/services/database/grants";
import { EIP_712_DOMAIN, EIP_712_TYPES__APPLY_FOR_GRANT } from "~~/utils/eip712";
import { REQUIRED_CHALLENGE_COUNT, fetchAcceptedChallengeCount } from "~~/utils/eligibility-criteria";

type ReqBody = {
  title?: string;
  description?: string;
  askAmount?: string;
  signature?: `0x${string}`;
  signer?: string;
};

// Hardcoded default ask amount
const askAmount = 0.08;
// TODO: We could also add extra validation of nonce
export async function POST(req: Request) {
  try {
    const { title, description, signature, signer } = (await req.json()) as ReqBody;

    if (!title || !description || !signature || !signer || description.length > 750 || title.length > 75) {
      return NextResponse.json({ error: "Invalid form details submitted" }, { status: 400 });
    }

    // Legacy BG builder presence check removed. All eligibility is now based on the new SpeedRunEthereum system. If needed we could try do some kind of ROLE validation and make sure OG BuidlGuidl members that that certain ROLE in new SRE database.
    const completed = await fetchAcceptedChallengeCount(signer);
    if (completed < REQUIRED_CHALLENGE_COUNT) {
      return NextResponse.json(
        {
          error: `Only builders with at least ${REQUIRED_CHALLENGE_COUNT} accepted SpeedRun Ethereum challenges can submit for grants`,
        },
        { status: 401 },
      );
    }

    const recoveredAddress = await recoverTypedDataAddress({
      domain: EIP_712_DOMAIN,
      types: EIP_712_TYPES__APPLY_FOR_GRANT,
      primaryType: "Message",
      message: { title, description },
      signature: signature,
    });

    if (recoveredAddress !== signer) {
      return NextResponse.json({ error: "Recovered address did not match signer" }, { status: 401 });
    }

    const grant = await createGrant({
      title: title,
      description: description,
      askAmount: askAmount,
      builder: signer,
    });

    return NextResponse.json({ grant }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error processing form" }, { status: 500 });
  }
}
