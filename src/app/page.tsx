'use client'

import Image from 'next/image'
import Chessboard from "@/app/components/chess/Chessboard";
import {Chess} from 'chess.ts'
import {useCallback, useEffect, useMemo, useState} from "react";

export default function Home() {
    const chess = useMemo(() => new Chess(), []);
    // const [emptyState, setEmptyState] = useState({});
    const [fen, setFen] = useState(chess.fen());
    const forceUpdate = useCallback(() => {
        setFen(chess.fen());
    }, [chess]);

    useEffect(() => {
        const interval = setInterval(() => {
            forceUpdate();
        }, 1000);

        return () => clearInterval(interval);
    }, [fen, forceUpdate]);

    return (
        <main className="min-h-screen w-full">
            <div className={"max-h-screen max-w-screen sm:w-2/3 lg:w-1/2 2xl:w-2/5"}>
                <div className={"flex items-center justify-center"}>
                    <Chessboard
                        showBoardNotation={true}
                        animationDuration={1000}
                        position={fen}
                        onPieceDrop={(from, to, piece) => {
                            const move = chess.move({from, to, promotion: "q"});
                            console.log(move);
                            if (move) {
                                try {
                                    return true;
                                } finally {
                                    forceUpdate();
                                }
                            }

                            return false;
                        }}
                    />
                </div>
            </div>
        </main>
    )
}
