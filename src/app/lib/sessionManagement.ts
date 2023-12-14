import {Chess} from "chess.ts";
const cron = require('node-cron') as any;

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

export const newSession = () => {
    if (getSessions().size > sessionLimit) {
        throw new Error("Session limit reached");
    }

    const session = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const data = {
        fen: new Chess().fen(),
        lastUpdate: new Date()
    } as SessionData;
    getSessions().set(session, data);

    const newRef = <T> (obj: T) => {
        return {
            current: obj
        };
    }

    const task = newRef(null as any);
    task.current = cron.schedule('*/0.05 * * * *', () => {
        const now = new Date();
        if (getSessions().get(session)!.lastUpdate.getTime() + new Date(0, 0, 0, 0, 1 , 0).getTime() < now.getTime()) {
            getSessions().delete(session);
            task.current.stop();
        }
    });

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