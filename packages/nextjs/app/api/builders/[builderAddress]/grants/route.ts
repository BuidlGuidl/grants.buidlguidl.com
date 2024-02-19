import { NextResponse } from "next/server";
import { getAllGrantsForUser } from "~~/services/database/grants";

export async function GET(_request: Request, { params }: { params: { builderAddress: string } }) {
  try {
    const builderAddress = params.builderAddress;
    const grants = await getAllGrantsForUser(builderAddress);
    return NextResponse.json(grants);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      {
        status: 500,
      },
    );
  }
}
