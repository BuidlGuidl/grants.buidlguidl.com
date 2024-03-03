import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { getAllGrantsForReview } from "~~/services/database/grants";

export async function GET(request: NextRequest) {
  try {
    const path = request.nextUrl.searchParams.get("path");
    const grants = await getAllGrantsForReview();
    if (path) revalidatePath(path);
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
