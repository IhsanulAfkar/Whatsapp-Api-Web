'use client'
import ChatCard from '@/components/Chat/ChatCard'
import { NextPage } from 'next'
import Chats from './Chats'
import { useEffect, useState } from 'react'
import { ContactLatestMessage, ContactTypes, ConversationMessage, GetMessage, MessageMetadata, MessengerList } from '@/types'
import { useSession } from 'next-auth/react'
import fetchClient from '@/helper/fetchClient'
import toast from 'react-hot-toast'
import { PAGINATION_BATCH } from '@/helper/constants'
import IconChain from '@/components/assets/icons/chain'
import { Button, Input, Textarea } from '@nextui-org/react'
import { useRouter, useSearchParams } from 'next/navigation'
import UploadFile from '@/components/file/UploadFile'
import IconSend from '@/components/assets/icons/send'
import route from '@/routes'

interface Props { }

const Messenger: NextPage<Props> = ({ }) => {
    const { push } = useRouter()
    const searchParams = useSearchParams()
    const { data: session } = useSession()
    const [listMessenger, setlistMessenger] = useState<ContactLatestMessage[]>([])
    const [currentMessenger, setcurrentMessenger] = useState<MessengerList>()
    const [messageMetadata, setmessageMetadata] = useState<MessageMetadata>()
    const [listMessage, setlistMessage] = useState<ConversationMessage[]>([])
    const [sendMessageLoading, setsendMessageLoading] = useState(false)
    const [inputFile, setinputFile] = useState<File[]>([]);
    const [inputText, setInputText] = useState('')
    const [showFile, setshowFile] = useState(false)
    const fetchListMessenger = async () => {
        if (!session?.user?.sessionId) return
        const result = await fetchClient({
            method: 'GET',
            url: `/messages/${session?.user?.sessionId}/list`,
            user: session?.user
        })
        const result2 = await fetchClient({
            url: '/contacts',
            method: 'GET',
            user: session?.user
        })
        if (result?.ok && result2?.ok) {
            const resultData: GetMessage<MessengerList> = await result.json()
            const resultData2: ContactTypes[] = await result2.json()
            const fetchPromises: (() => Promise<void>)[] = []
            const fetchMessage = async (element: string) => {
                const response = await fetchClient({
                    url: `/messages/${session.user?.sessionId}/?phoneNumber=${element}&pageSize=1&sort=asc`,
                    method: 'GET',
                    user: session.user
                })
                if (response?.ok) {
                    const data = await response.json()
                    console.log('element message', element, data)
                    return data
                }
                throw new Error(`Failed to fetch data for element ${element}`)
            }
            const newArray: ContactLatestMessage[] = []
            resultData.data.forEach(async (element) => {
                if (element.phone) {
                    fetchPromises.push(async () => {
                        try {
                            console.log('element', element)
                            const message: GetMessage<ConversationMessage> = await fetchMessage(element.phone)
                            console.log(`fetch message for phone ${element.phone}`)
                            if (message.data.length > 0) {
                                const withMessage: ContactLatestMessage = {
                                    messenger: element,
                                    latestMessage: message.data[0],
                                    unreadMessages: message.data.filter(msg => msg.status !== 'read').length
                                }
                                newArray.push(withMessage)
                                return
                            }
                            const withoutMessage: ContactLatestMessage = {
                                messenger: element,
                                latestMessage: null,
                                unreadMessages: 0
                            }
                            newArray.push(withoutMessage)
                            return
                        } catch (error) {
                            console.error(error)
                        }
                    })
                }
            })
            await Promise.all(fetchPromises.map(callback => callback()))
            newArray.sort((a, b) => {
                const timestampA = a.latestMessage ? new Date(a.latestMessage.createdAt).getTime() : 0;
                const timestampB = b.latestMessage ? new Date(b.latestMessage.createdAt).getTime() : 0;

                return timestampB - timestampA;
            })
            const newContactArray: ContactLatestMessage[] = resultData2.filter(contact => !newArray.some(element => element.messenger.phone === contact.phone)).map(contact => {
                return {
                    latestMessage: null,
                    unreadMessages: 0,
                    messenger: {
                        contact: contact,
                        phone: contact.phone,
                        createdAt: contact.createdAt
                    }
                }
            })
            setlistMessenger([...newArray, ...newContactArray])
        } else {
            toast.error('Gagal muat list kontak')
        }
    }
    const fetchChatMessage = async (page: number) => {
        if (!session?.user?.sessionId && !currentMessenger) return
        const sessionId = session?.user?.sessionId!

        const result = await fetchClient({
            url: `/messages/${sessionId}/?phoneNumber=${currentMessenger?.phone}&page=${page}&pageSize=${PAGINATION_BATCH}&sort=asc`,
            method: 'GET',
            user: session?.user
        })
        if (result && result.ok) {
            const resultData = await result.json()
            console.log(resultData)
            if (page === 1)
                setlistMessage(resultData.data)
            else
                setlistMessage(prev => [...prev, ...resultData.data])
            setmessageMetadata(resultData.metadata)
        }
    }
    const sendMessage = async () => {
        setsendMessageLoading(true)
        const sessionId = session?.user?.sessionId
        if (!sessionId) return
        if (inputFile.length > 0) {
            if (currentMessenger && inputFile) {
                const formdata = new FormData()
                formdata.append("caption", inputText)
                // @ts-ignore
                formdata.set('document', inputFile[0].file, inputFile[0].name)
                formdata.append("recipients[0]", currentMessenger.phone)
                formdata.append("sessionId", sessionId)
                try {
                    const result = await fetch('/api/message/media', {
                        method: 'POST',
                        body: formdata
                    })
                    if (result.status === 401) {
                        toast.error('Gagal mengirim pesan')
                    }
                    // console.log(result.body)
                    if (result?.ok) {
                        const resultData = await result.json()
                        console.log(resultData)
                        setinputFile([])
                        setInputText('')
                        fetchChatMessage(1)
                        toast.success('Berhasil kirim file')

                    } else {
                        const resultData = await result.text()
                        console.log(resultData)
                        toast.error('gagal kirim file')
                    }
                } catch (error) {
                    console.log(error)
                }

            }

        }

        else {
            console.log('currentMessenger', currentMessenger)
            console.log('inputText', inputText)
            if (currentMessenger && inputText.length > 0) {
                const result = await fetchClient({
                    url: '/messages/' + sessionId + '/send',
                    method: 'POST',
                    body: JSON.stringify([
                        {
                            recipient: currentMessenger.phone,
                            message: {
                                text: inputText
                            }
                        }
                    ]),
                    user: session?.user
                })
                if (result && result.ok) {
                    toast.success('Berhasil kirim pesan')
                    fetchChatMessage(1)
                    setInputText('')
                }
            }
        }
        setsendMessageLoading(false)
    }
    useEffect(() => {
        if (session?.user) {
            if (!session.user.sessionId) {
                toast.error('WhatsApp tidak terkoneksi')
                push(route('dashboard'))
            }
            fetchListMessenger()
        }
    }, [session?.user])
    useEffect(() => {
        if (session?.user?.sessionId && listMessage.length === 0)
            fetchChatMessage(1)
    }, [currentMessenger])
    useEffect(() => {
        const paramsPhone = searchParams?.get('phone')
        if (paramsPhone) {
            const findMessenger = listMessenger.find(item => item.messenger.phone === paramsPhone)
            if (findMessenger) {
                setcurrentMessenger(findMessenger.messenger)
            }
        }
    }, [listMessenger])
    return (<>
        <div className='flex flex-col md:flex-row gap-4'>
            <div className='w-full md:max-w-sm'>
                <ChatCard
                    currentMessenger={currentMessenger}
                    listMessenger={listMessenger}
                    setcurrentMessenger={setcurrentMessenger}
                    setlistMessage={setlistMessage} />
            </div>
            <div className={"rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark flex flex-col justify-between items-stretch w-full relative h-[70vh] " + (!currentMessenger && 'opacity-50 pointer-events-none')}>
                {session?.user && (
                    <Chats
                        currentDate={new Date()}
                        sessionId={session?.user?.sessionId}
                        currentMessenger={currentMessenger}
                        listMessage={listMessage}
                        metadata={messageMetadata}
                        user={session.user}
                        setlistMessage={setlistMessage}
                        fetchChatMessage={fetchChatMessage}
                    />
                )}
                <div className='flex flex-col absolute bottom-4 w-full z-10 px-6 bg-white rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10
'>

                    {showFile && (<div className=''>
                        <UploadFile files={inputFile} setfiles={setinputFile} />
                    </div>
                    )}
                    <div className='flex gap-2 items-center'>
                        <div className='flex items-center gap-2 w-full'>

                            <Textarea
                                placeholder="Tuliskan pesan anda"
                                className="w-full"
                                value={inputText}
                                onChange={e => setInputText(e.target.value)}
                                minRows={2}
                                maxRows={3}
                            />
                            <Button color='primary'
                                onClick={sendMessage}
                                isLoading={sendMessageLoading}>Kirim</Button>
                        </div>
                        <div className='flex flex-col justify-center gap-2'>

                            <div className='rounded-full border-2 border-black/25 dark:border-white/25 dark:hover:border-white/60 hover:border-black/60 bg-white dark:bg-boxdark w-10 h-10 flex items-center justify-center cursor-pointer shadow-md' onClick={() => setshowFile(!showFile)}>
                                <IconChain />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default Messenger