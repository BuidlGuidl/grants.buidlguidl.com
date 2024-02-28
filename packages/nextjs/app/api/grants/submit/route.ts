import { NextResponse } from "next/server";
import { submitGrantBuild } from "~~/services/database/grants";
import { findUserByAddress } from "~~/services/database/users";

type ReqBody = {
  grantId?: string;
  signer?: string;
  link?: string;
};

export async function POST(req: Request) {
  try {
    const { grantId, link, signer } = (await req.json()) as ReqBody;

    if (!grantId || !signer || !link) {
      return NextResponse.json({ error: "Invalid form details submitted" }, { status: 400 });
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
