import {getAllSessions, newSession} from "@/app/lib/sessionManagement";
import {redirect} from "next/navigation";
import {Fragment} from "react";
import Link from "next/link";
import {ArrowLongRightIcon} from "@heroicons/react/24/solid";

export const metadata = {
    title: "nextChess"
}

const Page = () => {
    return (
        <main className={"h-screen w-screen"}>
            <div className={"container"}>
                <div className={"grid grid-cols-12"}>
                    <div className={"col-start-3 col-span-9"}>
                        <form action={async (formData) => {
                            'use server'
                            const sessionId = newSession();
                            redirect(`/session/${encodeURI(sessionId)}/w`);
                        }}>
                            <button type={"submit"} className={"btn"}>Créer une session</button>

                            <>
                                <div className="overflow-x-auto">
                                    <table className="table">
                                        {/* head */}
                                        <thead>
                                        <tr>
                                            <th>Session</th>
                                            <th>Joindre en tant que blanc</th>
                                            <th>Joindre en tant que noir</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            getAllSessions().map((session, i) => {
                                                return (<Fragment key={i}>
                                                    <tr className="hover">
                                                        <td>{session.substring(0, 10)}</td>
                                                        <td><Link href={`/session/${session}/w`} className={"btn "}>
                                                            <div className={"h-2/3 w-2/3"}>
                                                                <ArrowLongRightIcon className={"h-full w-full"}/>
                                                            </div>
                                                        </Link></td>
                                                        <td><Link href={`/session/${session}/b`} className={"btn"}>
                                                            <div className={"h-2/3 w-2/3"}>
                                                                <ArrowLongRightIcon className={"h-full w-full"}/>
                                                            </div>
                                                        </Link></td>
                                                    </tr>
                                                </Fragment>)
                                            })
                                        }
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Page;