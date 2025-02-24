import { NextRequest, NextResponse } from "next/server";

export default async function middleware(_: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
