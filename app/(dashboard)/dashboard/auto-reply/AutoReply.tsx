'use client'
import IconSearch from '@/components/assets/icons/search'
import Card from '@/components/Card'
import HeaderText from '@/components/Dashboard/HeaderText'
import fetchClient from '@/helper/fetchClient'
import { DeviceTypes } from '@/types'
import { Button, Input, Switch, Textarea } from '@nextui-org/react'
import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface Props { }

const AutoReply: NextPage<Props> = ({ }) => {
    const { refresh } = useRouter()
    const [isActive, setisActive] = useState(false)
    const [paymentReply, setPaymentReply] = useState("")
    const [storeName, setStoreName] = useState("")
    const { data: session } = useSession()
    const fetchDevice = async () => {
        const result = await fetchClient({
            url: "/devices",
            method: "GET",
            user: session?.user
        })
        if (result?.ok) {
            const devices: DeviceTypes[] = await result.json()
            setisActive(devices[0].isAutoReply)
            return
        }
        toast.error("gagal fetch device")
    }
    const fetchAutoReply = async () => {
        const result = await fetchClient({
            url: '/autoreply',
            method: 'GET',
            user: session?.user
        })
        if (result?.ok) {
            const resultData = await result.json()
            setPaymentReply(resultData?.paymentReply || "")
            setStoreName(resultData?.storeName || "")
        }

    }
    const toggleAutoReply = async () => {
        const result = await fetchClient({
            url: "/autoreply/status",
            method: "PATCH",
            user: session?.user,
            body: JSON.stringify({ status: !isActive })
        })
        if (result?.ok) {
            setisActive(!isActive)
        }
    }
    const handleClick = async () => {
        const result = await fetchClient({
            method: "PUT",
            url: "/autoreply",
            body: JSON.stringify({
                paymentMessage: paymentReply,
                storeName
            }),
            user: session?.user
        })
        if (result?.ok) {
            toast.success("Berhasil update auto reply")
            return
        }
        toast.error("Gagal update auto reply")
    }
    useEffect(() => {
        if (session?.user) {
            fetchDevice()
            fetchAutoReply()
        }
    }, [session?.user])
    return <>
        <div className='w-full items-start flex gap-4'>
            <Card className='w-full'>
                <div className=''>
                    <label className='font-medium text-black dark:text-white'>Nama Toko</label>

                    <Input variant='underlined'
                        type="text"
                        size='lg'
                        value={storeName}
                        onChange={e => setStoreName(e.target.value)}
                    />
                </div>
                <div className=' mt-4'>
                    <label className='font-medium text-black dark:text-white'>Chat Pembayaran</label>
                    <Textarea
                        radius='none'
                        className='mt-2'
                        variant='bordered'
                        minRows={5}
                        maxRows={7}
                        placeholder='tuliskan pesan disini'
                        value={paymentReply}
                        onChange={e => setPaymentReply(e.target.value)}
                    />
                </div>
                <div className='mt-4 flex justify-end'>
                    <Button radius='none' color='primary' onClick={handleClick}>Ubah Pesan</Button>
                </div>
            </Card>
            <Card className='w-full max-w-md flex justify-between gap-4'>
                <p className='text-xl font-bold text-black dark:text-white w-full'>Aktifkan Auto Reply</p>
                <Switch size='sm' isSelected={isActive}
                    onClick={() => toggleAutoReply()}
                />

            </Card>
        </div>
    </>
}

export default AutoReply