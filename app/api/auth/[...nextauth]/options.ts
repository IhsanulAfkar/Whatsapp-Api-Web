
import NextAuth, { AuthOptions } from "next-auth"
import type { DefaultSession, User } from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { DeviceTypes, GetSessionType, UserProfile } from "@/types";
export const config: AuthOptions = {
    session: {
        strategy: "jwt",
        maxAge: 43200
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
        CredentialsProvider({
            id: 'credentials',
            name: "Credentials",
            credentials: {
                identifier: {},
                password: {}
            },
            authorize: async (credentials) => {
                try {
                    const result = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/auth/login', {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(credentials)
                    })
                    if (!result.ok) {
                        console.log('error')
                        return null
                    }
                    const resultData = await result.json()
                    const fetchUser = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {
                        method: "GET",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + resultData.accessToken
                        },
                    })
                    if (!fetchUser.ok) {
                        console.log('error')
                        console.log(await fetchUser.text())
                        return null
                    }

                    const userProfile: User = await fetchUser.json()
                    const fetchSessions = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sessions`, {
                        method: 'GET',
                        headers: {
                            'Authorization': "Bearer " + resultData.accessToken
                        }
                    })
                    if (fetchSessions.ok) {
                        const sessionData: GetSessionType[] = await fetchSessions.json()
                        if (sessionData.length > 0) {
                            userProfile.sessionId = sessionData[0].sessionId
                        }
                    }
                    userProfile.image = resultData.image || ""
                    userProfile.token = resultData.accessToken
                    userProfile.refreshToken = resultData.refreshToken
                    return userProfile
                } catch (error) {
                    return null
                }
            }
        }),
        CredentialsProvider({
            id: 'refresh',
            name: 'refresh',
            credentials: {
                user: {}
            },
            authorize: async (credentials) => {
                try {

                    const userData: User = JSON.parse(credentials?.user!)
                    const result = await fetch(process.env.BACKEND_URL + '/auth/refresh-token', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ refreshToken: userData.refreshToken })
                    })
                    if (result.ok) {
                        const resultData = await result.json()
                        userData.token = resultData.accessToken
                        return userData
                    }
                    return null
                } catch (error) {
                    return null
                }
            }
        })
    ],
    pages: {
        signIn: '/auth/signin',
    },
    callbacks: {
        async jwt({ token, user, trigger, session, account }) {
            if (trigger === "update") {
                token.user = session.user
            }
            else if (account?.user) {
                token.user = account.user
            }
            else if (user) {
                token.user = user
            }
            return Promise.resolve(token)
        },
        async session({ session, token, user }: any) {
            if (token.user)
                session.user = token.user
            return Promise.resolve(session)
        },

        async signIn({ user, account }: any) {
            // console.log('user', user)
            if (account?.provider === 'google') {
                // return null
                const result = await fetch(process.env.BACKEND_URL + '/auth/google', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        accessToken: account.access_token
                    })
                })
                if (result.ok) {
                    const resultData = await result.json()

                    const fetchUser = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {
                        method: "GET",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + resultData.accessToken
                        },
                    })
                    if (!fetchUser.ok) {
                        console.log('error')
                        console.log(await fetchUser.text())
                        return null
                    }

                    const userProfile: User = await fetchUser.json()
                    delete userProfile.id
                    const fetchSessions = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sessions`, {
                        method: 'GET',
                        headers: {
                            'Authorization': "Bearer " + resultData.accessToken
                        }
                    })
                    if (fetchSessions.ok) {
                        const sessionData: GetSessionType[] = await fetchSessions.json()
                        if (sessionData.length > 0) {
                            user.sessionId = sessionData[0].sessionId
                        }
                    }
                    // user.token = resultData.accessToken
                    // user.refreshToken = resultData.refreshToken
                    // user.googleToken = account.access_token
                    // user =
                    // userProfile.token = resultData.accessToken
                    // userProfile.refreshToken = resultData.refreshToken
                    user = {
                        ...user,
                        ...userProfile,
                        token: resultData.accessToken,
                        refreshToken: resultData.refreshToken,
                        googleToken: account.access_token,
                    }
                    account.user = user
                    // account.apiRefreshToken = resultData.refreshToken
                    return Promise.resolve(account)
                } else {
                    return null
                }
            }
            return user
        }
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
    },
    secret: process.env.NEXTAUTH_SECRET
}