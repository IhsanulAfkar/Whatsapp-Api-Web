'use client'
import fetchClient from '@/helper/fetchClient'
import { BroadcastData } from '@/types'
import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import DetailBroadcast from './DetailBroadcast'
import BroadcastTable from './BroadcastTable'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import { BreadcrumbItem, Breadcrumbs, Button } from '@nextui-org/react'
import HeaderText from '@/components/Dashboard/HeaderText'
import route from '@/routes'
import Link from 'next/link'

interface Props {
    broadcastId: string
}

const ClientPage: NextPage<Props> = ({ broadcastId }) => {
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
        if (session?.user)
            fetchBroadcast()
    }, [session?.user])
    return (<>
        {broadcast && (
            <>
                <div className='flex justify-between items-center mb-4'>
                    <Button radius='none' variant={'faded'} as={Link} href={route('broadcast')}>Kembali</Button>

                    <Breadcrumbs
                        separator='/'
                        itemClasses={{
                            item: 'text-xs',
                            separator: "px-2"
                        }}>
                        <BreadcrumbItem href={route('dashboard')}>Dashboard</BreadcrumbItem>
                        <BreadcrumbItem href={route('broadcast')}>Broadcast</BreadcrumbItem>
                        <BreadcrumbItem>Detail</BreadcrumbItem>
                    </Breadcrumbs>
                </div>
                <HeaderText>{`Broadcast: ${broadcast.name}`}</HeaderText>

                <DetailBroadcast broadcast={broadcast} user={session?.user!} />

                <BroadcastTable broadcast={broadcast} user={session?.user!} />
            </>
        )}
    </>)
}

export default ClientPage