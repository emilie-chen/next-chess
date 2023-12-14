import {newSession} from "@/app/lib/sessionManagement";
import {redirect} from "next/navigation";

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
                            redirect(`/session/${sessionId}`);
                        }}>
                            <button type={"submit"} className={"btn"}>Créature de session</button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Page;