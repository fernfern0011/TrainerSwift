import { AccessToken } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req) {
  const room = req.nextUrl.searchParams.get("room");
  const username = req.nextUrl.searchParams.get("username");
  if (!room) {
    return NextResponse.json(
      { error: 'Missing "room" query parameter' },
      { status: 400 }
    );
  } else if (!username) {
    return NextResponse.json(
      { error: 'Missing "username" query parameter' },
      { status: 400 }
    );
  }

  const apiKey = 'APIaX9NURNVCvZK';
  const apiSecret = 'itsL4kBHOHm4Kll8JHYF5ube5C7qoxVeXCUy38OSfLiB';
  const wsUrl = "wss://esd-4lxjb4te.livekit.cloud";

  if (!apiKey || !apiSecret || !wsUrl) {
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 }
    );
  }

  const at = new AccessToken(apiKey, apiSecret, { identity: username });

  at.addGrant({ room, roomJoin: true, canPublish: true, canSubscribe: true });

  return NextResponse.json({ token: await at.toJwt() });
}
