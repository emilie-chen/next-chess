'use client'

import Image from 'next/image'
import Chessboard from "@/app/components/chess/Chessboard";
import {Chess} from 'chess.ts'
import {Fragment, useCallback, useEffect, useMemo, useRef, useState} from "react";
import React from "react";
import {redirect, useRouter} from "next/navigation";
import assert from "assert";

const fenDiff = (fen1: string, fen2: string) => {
    if (fen1 === fen2) return 'same_fen';
    const chess = new Chess(fen1);
    const moves = chess.moves({ verbose: true });

    for (let move of moves) {
        chess.move(move);
        if (chess.fen() === fen2) {
            return move;
        }
    }

    return null;
}

const updateChessToFen = (chess: Chess, fen: string) => {
    const move = fenDiff(chess.fen(), fen);
    if (move === 'same_fen') return true;
    if (move) {
        const out = chess.move(move);
        if (out) {
            return true;
        }
    }

    return false;
}

const Page = ({ params: { id }} : {
    params: {
        id: string
    }
}) => {
    const router = useRouter();
    const chess = useRef<Chess | null>(null);

    const [fen, setFen] = useState(chess.current?.fen());
    const forceUpdate = useCallback(() => {
        setFen(chess.current?.fen());
    }, [chess]);
    const [session, setSession] = useState(null as string | null);
    if (session !== id) {
        setSession(id);
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (!session) return;
            fetch(`/api/get-session-fen?session=${session}`, {
                method: "GET"
            }).then(async (res) => {
                const data = await res.json() as any;
                if (data!.fen) {
                    if (!chess.current) {
                        chess.current = new Chess();
                    }
                    if (fen !== data.fen) {
                        assert(chess.current);
                        if (!updateChessToFen(chess.current, data.fen)) {
                            console.log("Failed to update chess to fen");
                            chess.current.load(data.fen);
                        }
                        forceUpdate();
                    }
                }
            }).catch((err) => {
                router.push("/", {
                    replace: true
                })
            })
        }, 250);
        return () => clearInterval(interval);
    }, [chess, fen, forceUpdate, session]);

    return (
        <main className="min-h-screen w-full">
            <div className={"container grid grid-cols-12"}>
                <>
                    {
                        fen && chess.current && <>
                        <div className={"col-start-2 col-span-6 border-2 border-black shadow-lg"}>
                            <Chessboard
                                showBoardNotation={true}
                                animationDuration={1000}
                                position={fen}
                                onPieceDrop={(from, to, piece) => {
                                    assert(chess.current);

                                    const move = chess.current!.move({from, to, promotion: "q"});
                                    console.log(move);

                                    if (!move) return false;

                                    fetch(`/api/move?session=${session}&from=${from}&to=${to}&promotion=${move.promotion}`, {
                                        method: "POST"
                                    }).then((res) => {
                                        if (res.status !== 200) {
                                            console.error(res);
                                        }

                                        return res.json();
                                    }).then((data) => {
                                        if (data.fen) {
                                            if (fen !== data.fen) {
                                                assert(chess.current);
                                                if (!updateChessToFen(chess.current, data.fen)) {
                                                    console.log("Failed to update chess to fen");

                                                    chess.current.load(data.fen);
                                                }
                                                forceUpdate();
                                            }
                                        }
                                    })

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
                        <div className={"col-start-9 col-span-3 border-2 border-black p-3"}>
                            <p>{chess.current.turn() === "w" ? "Blanc" : "Noir"}</p>
                            <p>{chess.current?.inCheck() ? "Échec" : ""}</p>
                            <p>{chess.current?.inCheckmate() ? "Échec et mat" : ""}</p>
                            <p>{chess.current?.inStalemate() ? "Pat" : ""}</p>
                            <p>{chess.current?.inThreefoldRepetition() ? "Répétition 3 fois" : ""}</p>
                            <p>{chess.current?.insufficientMaterial() ? "Matériel insuffisant" : ""}</p>
                            <p>{chess.current?.inDraw() ? "Nulle" : ""}</p>
                            <p>{chess.current?.history({
                                verbose: true,
                            }).map((history, i) => {
                                return (<Fragment key={i}>
                                    <p>De {history.from} à {history.to}</p>
                                </Fragment>)
                            })}</p>
                        </div>
                        </>
                    }
                </>
            </div>
        </main>
    )
}

export default Page;
