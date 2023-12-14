import {NextRequest, NextResponse} from "next/server";
import {newSession} from "@/app/lib/sessionManagement";

export const POST = (req: NextRequest, res: NextResponse) => {
    return NextResponse.json({
        session: newSession()
    })
}