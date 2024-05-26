'use client'
import HeaderText from '@/components/Dashboard/HeaderText'
import fetchClient from '@/helper/fetchClient'
import { BroadcastData } from '@/types'
import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface Props {
    broadcastId: string
}

const EditBroadcast: NextPage<Props> = ({ broadcastId }) => {
    const { push } = useRouter()
    const { data: session } = useSession()
    const [broadcast, setBroadcast] = useState<BroadcastData>()
    const fetchBroadcast = async () => {
        const result = await fetchClient({
            method: 'GET',
            url: '/broadcasts/' + broadcastId,
            user: session?.user
        })
        if (result?.ok) {
            const resultData = await result.json()
            setBroadcast(resultData)
            console.log(resultData)
            return
        }
        if (result?.status === 404) {
            toast.error('Broadcast tidak ditemukan')
            push('/broadcast')
            return
        }
        toast.error('Server Error')
        console.log(await result?.text())
    }
    useEffect(() => {
        if (session?.user) {
            fetchBroadcast()
        }
    }, [session?.user])
    return (<>
        <HeaderText>{`Edit Broadcast: ${broadcast?.name}`}</HeaderText>
    </>)
}

export default EditBroadcast