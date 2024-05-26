'use client'
import { NextPage } from 'next'
import { User } from 'next-auth'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import ModalTemplate from '../ModalTemplate'
import fetchClient from '@/helper/fetchClient'
import toast from 'react-hot-toast'
import { signIn } from 'next-auth/react'
import { Socket } from 'socket.io-client'
import { Spinner } from '@nextui-org/react'
import { delay } from '@/helper/delay'

interface Props {
    openModal: boolean,
    setopenModal: Dispatch<SetStateAction<boolean>>,
    user?: User,
    refresh: () => void,
    socket: Socket | null
}

const QRModal: NextPage<Props> = ({ openModal, refresh, setopenModal, user, socket }) => {

    const [isLoaded, setIsLoaded] = useState(false)
    const [qrData, setQrData] = useState('')
    const generateQR = async () => {
        const result = await fetchClient({
            method: "POST",
            body: JSON.stringify({
                deviceId: user?.deviceId,
            }),
            url: '/sessions/create',
            user: user
        })
        if (result?.ok) {
            const resultData = await result.json()
            setQrData(resultData.qr)
        } else {
            toast.error('Gagal generate QR')
        }
        setIsLoaded(true)
    }
    useEffect(() => {
        if (openModal) {
            generateQR()
        }
    }, [openModal])
    useEffect(() => {
        const refreshSession = async () => {
            await delay(1500)
            if (user) {
                const refresh = await signIn('refresh', {
                    user: JSON.stringify(user)
                })
                if (refresh?.error) {
                    toast.error(refresh.error)
                }

            }
        }
        return () => {

            refreshSession()
        }
    }, [])
    useEffect(() => {
        const channel = `device:${user?.deviceId}:status`
        console.log(channel)
        if (socket) {
            socket.on(channel, (status: string) => {
                console.log(status)
                if (status === 'open') {
                    toast.success('WhatsApp sudah terkoneksi!')
                    setopenModal(false)
                }
                if (status === 'connecting') {
                    toast('Connecting...')
                }
            })
        }
        return () => {
            socket?.off(channel)
        }
    }, [socket])
    return (<>
        <ModalTemplate
            openModal={openModal}
            setopenModal={setopenModal}
            outsideClose={false}
            title='Hubungkan WhatsApp'
        >
            <div className='flex items-center justify-center'>
                {isLoaded ? (<>
                    <img src={qrData} alt="" />
                </>) : (<>
                    <Spinner />
                </>)}
            </div>
        </ModalTemplate>
    </>)
}

export default QRModal