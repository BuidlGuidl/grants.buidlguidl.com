import { NextResponse } from "next/server";
import { findUserByAddress } from "~~/services/database/users";

export async function GET(_request: Request, { params }: { params: { builderAddress: string } }) {
  try {
    const builderAddress = params.builderAddress;
    const builderData = await findUserByAddress(builderAddress);
    return NextResponse.json(builderData);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      {
        status: 500,
      },
    );
  }
}
