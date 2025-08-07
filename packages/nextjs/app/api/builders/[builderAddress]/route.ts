import { NextResponse } from "next/server";
import { fetchBuilderData } from "~~/services/api/sre/builders";

export async function GET(_request: Request, { params }: { params: { builderAddress: string } }) {
  try {
    const builderAddress = params.builderAddress;
    const builderData = await fetchBuilderData(builderAddress);
    if (!builderData) {
      return NextResponse.json({ exists: false });
    }
    return NextResponse.json({ exists: true, data: builderData });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      {
        status: 500,
      },
    );
  }
}
