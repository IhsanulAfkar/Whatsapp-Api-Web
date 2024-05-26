'use client'
import Card from '@/components/Card'
import { PAGINATION_BATCH } from '@/helper/constants'
import fetchClient from '@/helper/fetchClient'
import route from '@/routes'
import { ContactTypes, GetMessage, IncomingMessage, MessageMetadata } from '@/types'
import { Button, Chip } from '@nextui-org/react'
import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import InfiniteScroll from 'react-infinite-scroll-component'
import { ChatDetails } from '../../messenger/ChatDetail'
import BubbleChat from '../../messenger/BubbleChat'
import { formatDate } from '@/helper/utils'
import EditContactModal from './EditContactModal'

interface Props {
    contactId: string
}

const DetailContact: NextPage<Props> = ({ contactId }) => {
    const { push } = useRouter()
    const { data: session } = useSession()
    const [contactData, setcontactData] = useState<ContactTypes>()
    const [messages, setmessages] = useState<IncomingMessage[]>([])
    const [messageMetadata, setmessageMetadata] = useState<MessageMetadata>()
    const [editModal, seteditModal] = useState(false)
    const currentDate = new Date()
    const fetchContact = async () => {
        const result = await fetchClient({
            url: '/contacts/' + contactId,
            method: 'GET',
            user: session?.user
        })
        if (result?.ok) {
            setcontactData(await result.json())
        } else if (result?.status === 404) {
            toast.error('Contact tidak ditemukan')
            push(route('contact'))
        } else {
            toast.error('Gagal fetch contact')
        }
    }
    const fetchContactMessage = async (page: number) => {
        if (!session?.user?.sessionId) {
            toast.error('Device belum terhubung!')
            return
        }
        const result = await fetchClient({
            url: `/messages/${session.user.sessionId}/incoming?phoneNumber=${contactData?.phone}&page=${page}&pageSize=${PAGINATION_BATCH}&sort=asc`,
            method: 'GET',
            user: session?.user
        })
        if (result && result.ok) {
            const resultData: GetMessage<IncomingMessage> = await result.json()
            if (page === 1) {
                setmessages(resultData.data)
            } else {
                setmessages(prev => [...prev, ...resultData.data])
            }
            setmessageMetadata(resultData.metadata)
        } else {
            toast.error('gagal fetch message')
        }

    }
    useEffect(() => {
        if (session?.user) {
            fetchContact()
        }
    }, [session?.user])
    useEffect(() => {
        if (contactData)
            fetchContactMessage(1)
    }, [contactData])
    return (<>
        {contactData && (
            <EditContactModal
                contact={contactData}
                openModal={editModal}
                setopenModal={seteditModal}
                refresh={fetchContact}
                user={session?.user} />
        )}
        <div className='flex gap-4'>
            <Card className='w-full max-w-sm flex flex-col pt-4 pb-8'>
                <p className='font-medium text-black dark:text-white'>Data Kontak</p>
                <table className='w-full border-spacing-y-2 border-spacing-x-2 -mx-2 border-separate '>
                    <tbody >
                        <tr>
                            <th className='font-medium text-start'>First Name</th>
                            <td>{contactData?.firstName}</td>
                        </tr>
                        <tr>
                            <th className='font-medium text-start '>Last Name</th>
                            <td>{contactData?.lastName}</td>
                        </tr>
                        <tr>
                            <th className='font-medium text-start'>Email</th>
                            <td>{contactData?.email}</td>
                        </tr>
                        <tr>
                            <th className='font-medium text-start'>Phone Number</th>
                            <td>+{contactData?.phone}</td>
                        </tr>
                        <tr>
                            <th className='font-medium text-start'>Gender</th>
                            <td>{contactData?.gender ? contactData?.gender : '-'}</td>
                        </tr>

                        <tr>
                            <th className='font-medium text-start'>Birthdate</th>
                            <td>{contactData?.dob ? contactData?.dob : '-'}</td>
                        </tr>

                    </tbody>
                </table>
                <div className='mt-4'>
                    <label className="font-medium text-black dark:text-white">
                        Groups
                    </label>
                    <div className='flex gap-2 mt-2'>
                        {contactData?.contactGroups?.map(item => (
                            <Chip key={item.group.id} variant='bordered' color='primary' as={Link} href={route('group') + `/${item.group.id}`}>{item.group.name}</Chip>
                        ))}
                    </div>
                </div>
            </Card>
            <Card className='w-full flex flex-col justify-between gap-4 py-4'>
                <div>
                    <label className="font-medium text-black dark:text-white">
                        Riwayat Chat
                    </label>
                    {messageMetadata && (
                        <InfiniteScroll
                            dataLength={messages.length}
                            next={() => fetchContactMessage(messageMetadata.currentPage + 1)}
                            hasMore={messageMetadata.hasMore}
                            loader={<p className="text-center">Loading...</p>}
                            endMessage={<p className="text-center text-xs">End of conversation</p>}
                            inverse
                            scrollThreshold={1}
                            style={{ display: 'flex', flexDirection: 'column-reverse' }}
                            className='mb-20'
                            scrollableTarget="scrollableChat"
                        >
                            {messages.map(message => (
                                <div key={message.id} className="w-full mt-4">
                                    <p className='text-sm'>{formatDate(message.createdAt)}</p>
                                    <BubbleChat text={message.message} received={message.createdAt} currentDate={currentDate} isOutgoing={false} mediaPath={message.mediaPath} />
                                </div>
                            ))}
                        </InfiniteScroll>
                    )}
                </div>
                <div className='flex justify-between mt-4 gap-4'>
                    <Button radius='none' as={Link} href={route('messenger') + `?phone=${contactData?.phone}`}>Chat</Button>
                    <Button color='primary' radius='none'
                        onClick={() => seteditModal(true)}>Edit Kontak</Button>
                </div>
            </Card>
        </div>
    </>)
}

export default DetailContact