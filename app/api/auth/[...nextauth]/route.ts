import nextAuth, { DefaultSession } from "next-auth"
import { config } from "./options"

declare module "next-auth" {
    interface User {
        id: string | undefined,
        token: string | undefined,
        refreshToken: string | undefined,
        image: string | undefined,
        firstName: string,
        lastName: string,
        username: string,
        phone: string,
        email: string,
        googleId: string,
        emailVerifiedAt: string,
        deviceId?: string,
        sessionId?: string,
        googleToken?: string
    }
    interface Session extends DefaultSession {
        user?: User
    }
}


export const handler = nextAuth(config)
export { handler as GET, handler as POST }