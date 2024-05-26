
import { User } from "next-auth"
import { signIn, signOut } from "next-auth/react"

interface FetchClientParams {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    body?: string | FormData | null,
    url: string,
    user: User | undefined,
    isFormData?: boolean
}
let isRefreshing = false
const fetchClient = async ({ method, body = null, url, user, isFormData = false }: FetchClientParams): Promise<Response | null> => {
    try {
        if (user) {
            let headers: any = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token,
            }
            if (isFormData) {
                headers = {
                    'Authorization': 'Bearer ' + user.token,
                }
            }
            const result = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + url, {
                method: method,
                headers: headers,
                body: body,
            })
            if (result.status === 401) {
                // return result
                //renew the session
                // return null
                if (isRefreshing) return null
                if (user?.refreshToken) {
                    console.log('refresh token')
                    isRefreshing = true
                    const refresh = await signIn('refresh', {
                        redirect: false,
                        user: JSON.stringify(user)
                    })
                    isRefreshing = false
                    if (refresh?.error) {
                        signOut()
                        window.location.replace('/signin')
                    } else {
                        window.location = window.location
                    }
                } else {
                    signOut()
                    window.location.replace('/signin')
                }
            }
            return result
        }
        return null
    } catch (error) {
        console.log(error)
        return null
    }
}

export default fetchClient