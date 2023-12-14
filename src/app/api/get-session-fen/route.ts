import {NextRequest, NextResponse} from "next/server";
import {getSessionFen} from "@/app/lib/sessionManagement";

export const GET = (req: NextRequest, res: NextResponse) => {

    const session = req.nextUrl.searchParams.get("session");
    if (!session) {
        return NextResponse.error();
    }
    const fen = getSessionFen(session);
    if (!fen) {
        return NextResponse.error();
    }
    return NextResponse.json({
        fen: fen
    });
}