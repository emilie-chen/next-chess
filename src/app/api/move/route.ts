import {NextRequest, NextResponse} from "next/server";
import {getSessionFen, setSessionFen} from "@/app/lib/sessionManagement";
import {Chess, PieceSymbol} from "chess.ts";

export const POST = (req: NextRequest, res: NextResponse) => {
    const session = req.nextUrl.searchParams.get("session");
    const from = req.nextUrl.searchParams.get("from");
    const to = req.nextUrl.searchParams.get("to");
    const promotion = req.nextUrl.searchParams.get("promotion");

    if (!session || !from || !to) {
        return NextResponse.error();
    }

    const fen = getSessionFen(session);
    if (!fen) {
        return NextResponse.error();
    }

    const chess = new Chess(fen);
    const move = chess.move({from: from, to: to, promotion: promotion ? promotion as PieceSymbol : undefined});
    if (!move) {
        return NextResponse.error();
    }

    setSessionFen(session, chess.fen());

    return NextResponse.json({
        fen: chess.fen()
    });
}