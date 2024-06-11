
import { Avatar, Button, Input, Switch } from '@nextui-org/react'
import { NextPage } from 'next'
import { ChatbotSession, ConversationMessage, MessageMetadata, MessengerList } from '@/types'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import ProfileAvatar from '@/components/ProfileAvatar'
import { formatDate } from '@/helper/formatDate'
import BubbleChat from './BubbleChat'
import OrderModal from './OrderModal'
import { User } from 'next-auth'
import { ChatDetails } from './ChatDetail'
import AddContactModal from './AddContactModal'
import fetchClient from '@/helper/fetchClient'
import toast from 'react-hot-toast'

interface Props {
    currentMessenger: MessengerList | undefined,
    currentDate: Date,
    sessionId: string | undefined,
    listMessage: ConversationMessage[],
    setlistMessage: Dispatch<SetStateAction<ConversationMessage[]>>,
    metadata: MessageMetadata | undefined,
    fetchChatMessage: (page: number) => void,
    user: User
}

const Chats: NextPage<Props> = ({ currentDate, currentMessenger, fetchChatMessage, listMessage, metadata, sessionId, setlistMessage, user }) => {
    const [orderModal, setorderModal] = useState(false)
    const [contactModal, setcontactModal] = useState(false)
    const [toggleAR, settoggleAR] = useState(false)
    const fetchARStatus = async () => {
        if (!user.sessionId || !currentMessenger?.phone)
            return
        const result = await fetchClient({
            method: "GET",
            url: `/autoreply/${user.deviceId}/${currentMessenger?.phone}`,
            user: user
        })
        if (result?.ok) {
            const resultData: ChatbotSession = await result.json()
            // console.log(resultData)
            settoggleAR(resultData.isActive)
        }
    }
    const handleToggle = async () => {
        // change status
        const result = await fetchClient({
            method: "PUT",
            url: `/autoreply/${user.deviceId}/${currentMessenger?.phone}`,
            body: JSON.stringify({
                status: !toggleAR
            }),
            user: user
        })
        if (result?.ok) {
            settoggleAR(!toggleAR)
            toast.success("Berhasil update auto reply")
            return
        }
        toast.error("Gagal update auto reply")
    }
    useEffect(() => {
        fetchARStatus()
    }, [user, currentMessenger])
    return (<>
        {currentMessenger && (
            <>
                <OrderModal
                    messenger={currentMessenger}
                    openModal={orderModal}
                    setopenModal={setorderModal}
                    user={user}
                />
                <AddContactModal
                    messenger={currentMessenger}
                    openModal={contactModal}
                    setopenModal={setcontactModal}
                    user={user}
                />
            </>
        )}
        <div className={`px-6 py-4 shadow-md flex justify-between items-center gap-4`}>
            <div className='flex gap-4'>
                <div>
                    <Avatar isBordered src='' />
                </div>
                <div className=''>
                    <p className='font-medium text-black dark:text-white'>{currentMessenger?.contact ? `${currentMessenger.contact.firstName} ${currentMessenger.contact.lastName}` : currentMessenger?.phone}</p>
                    {currentMessenger?.contact && (
                        <p className='text-xs'>{currentMessenger?.phone}</p>
                    )}
                </div>
            </div>
            <div className='flex gap-4 items-center justify-end'>
                <Switch size='sm' isSelected={toggleAR}
                    onClick={() => handleToggle()} className='text-xs'>Status auto reply</Switch>
                {!currentMessenger?.contact &&
                    <Button
                        radius='none'
                        onClick={() => setcontactModal(!contactModal)}
                    >Tambah ke kontak</Button>
                }
                {currentMessenger &&
                    <Button
                        color='primary'
                        radius='none'
                        onClick={() => setorderModal(!orderModal)}
                    >Buat Order</Button>
                }

            </div>
        </div>
        <div className='h-full px-6 overflow-y-auto flex flex-col'>
            {metadata && (
                <InfiniteScroll
                    dataLength={listMessage.length}
                    next={() => fetchChatMessage(metadata.currentPage + 1)}
                    hasMore={metadata.hasMore}
                    loader={<p className="text-center">Loading...</p>}
                    endMessage={<p className="text-center text-xs">End of conversation</p>}
                    inverse
                    scrollThreshold={1}
                    style={{ display: 'flex', flexDirection: 'column-reverse' }}
                    className='mb-20'
                    scrollableTarget="scrollableChat"
                >
                    {listMessage.map(message => (
                        <div key={message.id} className="w-full mt-4">
                            <ChatDetails message={message} />
                            <BubbleChat text={message.message} received={message.createdAt} status={message.status} currentDate={currentDate} isOutgoing={(message.to ? true : false)} mediaPath={message.mediaPath} />
                        </div>
                    ))}
                </InfiniteScroll>
            )}
        </div>

    </>)
}

export default Chats
