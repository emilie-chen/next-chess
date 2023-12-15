import {Chess} from "chess.ts";
const cron = require('node-cron') as any;
import {v4 as uuid} from 'uuid'

type SessionData = {
    fen: string,
    lastUpdate: Date
};

const getSessions = () => (global as unknown as {
    sessions: Map<string, SessionData>
}).sessions;

if (!getSessions()) {
    (global as unknown as {
        sessions: Map<string, SessionData>
    }).sessions = new Map<string, SessionData>();
}

const sessionLimit = 20;

const isCronJobSet = () => {
    return !!(global as unknown as {
        cronJobSet: boolean | undefined
    }).cronJobSet;
}

if (!isCronJobSet()) {
    (global as unknown as {
        cronJobSet: boolean | undefined
    }).cronJobSet = true;

    cron.schedule('*/1 * * * * *', () => {
        const sessions = getSessions();
        sessions.forEach((sessionData, session) => {
            const now = new Date();
            const diff = now.getSeconds() - sessionData.lastUpdate.getSeconds();
            // console.log("diff " + diff);
            const max = 10;
            // console.log("max " + max)
            if (diff > max) {
                //console.log("session " + session + " a écoulé")
                deleteSession(session);
            }
        });
    });
}

export const newSession = () => {
    if (getSessions().size > sessionLimit) {
        throw new Error("Session limit reached");
    }

    const session = (() => {
        // const idLength = Math.pow(2, 5);
        // let session = "";
        // //const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        //
        // for (let i = 0; i < idLength; i++) {
        //     if (Math.random() > 0.8) {
        //         // chinois
        //         session += String.fromCharCode(0x4e00 + Math.random() * (0x9fff-0x4e00+1));
        //     } else {
        //         // arabe
        //         session += String.fromCharCode(0x0600 + Math.random() * (0x06ff-0x0600+1));
        //     }
        // }
        //
        // return session;

        // uuid
        return uuid();
    })();
    const data = {
        fen: new Chess().fen(),
        lastUpdate: new Date()
    } as SessionData;
    getSessions().set(session, data);

    return session;
}

export const getSessionFen = (session: string) => {
    const sessionData = getSessions().get(session);
    if (!sessionData) {
        return null;
    }

    sessionData.lastUpdate = new Date();
    getSessions().set(session, sessionData);
    return sessionData.fen;
}

export const setSessionFen = (session: string, fen: string) => {
    getSessions().set(session, {
        fen,
        lastUpdate: new Date()
    });
}

const deleteSession = (session: string) => {
    getSessions().delete(session);
}

export const getAllSessions = () => {
    const sessions = getSessions();
    const allSessions = [] as string[];
    sessions.forEach((session, key) => {
        allSessions.push(key);
    });
    return allSessions;
}
