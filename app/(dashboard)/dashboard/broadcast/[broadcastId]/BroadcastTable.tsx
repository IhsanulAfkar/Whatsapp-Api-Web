import ProfileAvatar from '@/components/ProfileAvatar'
import { formatDate } from '@/helper/formatDate'
import { getNumberFromString } from '@/helper/utils'
import { BroadcastData, ContactBroadcast, MessageTableStatus, SelectedKeyState } from '@/types'
import { Button, Popover, PopoverContent, PopoverTrigger, Tab, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tabs } from '@nextui-org/react'
import { NextPage } from 'next'
import { User } from 'next-auth'
import BubbleChat from '../../messenger/BubbleChat'
import { useEffect, useState } from 'react'
import fetchClient from '@/helper/fetchClient'

interface Props {
    broadcast: BroadcastData
    user: User,
}

const BroadcastTable: NextPage<Props> = ({ broadcast, user }) => {

    const currentDate = new Date()
    const [selectedKeys, setSelectedKeys] = useState<SelectedKeyState>()
    const [broadcastDetail, setbroadcastDetail] = useState({
        Terkirim: [],
        Diterima: [],
        Terbaca: []
    })

    const [currentPage, setcurrentPage] = useState<MessageTableStatus>('Terkirim')
    const fetchAllBroadcast = async () => {
        // server_ack, read, delivery_ack
        const fetchSent = await fetchClient({
            url: '/broadcasts/' + broadcast.id + '/outgoing?status=server_ack',
            method: 'GET',
            user: user
        })
        const fetchReceived = await fetchClient({
            url: '/broadcasts/' + broadcast.id + '/outgoing?status=delivery_ack',
            method: 'GET',
            user: user
        })
        const fetchRead = await fetchClient({
            url: '/broadcasts/' + broadcast.id + '/outgoing?status=read',
            method: 'GET',
            user: user
        })
        if (fetchSent?.ok && fetchRead?.ok && fetchReceived?.ok) {
            setbroadcastDetail({
                Terkirim: (await fetchSent.json()).outgoingBroadcasts,
                Terbaca: (await fetchRead.json()).outgoingBroadcasts,
                Diterima: (await fetchReceived.json()).outgoingBroadcasts,
            })
        }
        // setisDetailBroadcastLoaded(true)
    }
    useEffect(() => {
        if (user)
            fetchAllBroadcast()
    }, [user])
    return (<>
        <div className="w-full bg-white dark:bg-boxdark rounded-md px-3 py-3 pb-6 mt-6">
            <div className="flex gap-2">
                <Tabs aria-label="Options" variant="light" color="primary" radius="none" size="lg"
                    selectedKey={currentPage}
                    onSelectionChange={setcurrentPage as any}>
                    <Tab key="Terkirim" title="Terkirim" />
                    <Tab key="Diterima" title="Diterima" />
                    <Tab key="Terbaca" title="Terbaca" />
                </Tabs>
            </div>

            <div className="w-full">
                <Table
                    aria-label="Incoming Chat"
                    color='default'
                    selectionMode="none"
                    isHeaderSticky
                    // removeWrapper
                    classNames={{
                        wrapper: 'shadow-none max-w-full overflow-x-scroll dark:bg-boxdark allowed-scroll',
                    }}
                    radius='md'
                    selectedKeys={selectedKeys as any}
                    onSelectionChange={setSelectedKeys as any}
                >
                    <TableHeader>
                        <TableColumn>Nama Penerima</TableColumn>
                        <TableColumn>Nomor HP</TableColumn>
                        <TableColumn>Tanggal</TableColumn>
                        <TableColumn>Pesan</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent={
                        <div className='w-full p-12'>
                            <div className='w-full max-w-md mx-auto flex flex-col gap-4'>
                                <p className='text-[16px] font-bold'>Belum ada pesan {currentPage}
                                </p>
                            </div>
                        </div>

                    } items={broadcastDetail[currentPage]}>
                        {(item: ContactBroadcast) => (
                            <TableRow key={item.id}>
                                <TableCell className='flex gap-2 items-center'>
                                    <p>{item.contact?.firstName || ""} {item.contact?.lastName || ''}</p>
                                </TableCell>
                                <TableCell >{item.contact?.phone || ''}</TableCell>

                                <TableCell >{formatDate(item.createdAt)}</TableCell>

                                <TableCell>
                                    <Popover placement="left-end"
                                        className='font-inter'
                                        radius='sm'
                                        showArrow={true}
                                    >
                                        <PopoverTrigger>
                                            <Button
                                                variant='bordered'
                                                size='sm'
                                            >Lihat Chat</Button>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <div className="px-1 py-2">
                                                <div className='flex gap-2 items-center'>
                                                    <ProfileAvatar profile={item.contact} />
                                                    <div className='text-xs'>
                                                        {item.contact ? item.contact.firstName + ' ' + item.contact.lastName : getNumberFromString(item.from! + item.to)}
                                                    </div>
                                                </div>
                                                <BubbleChat
                                                    text={item.message}
                                                    received={item.updatedAt}
                                                    status={'delivery_ack'}
                                                    mediaPath={item.mediaPath}
                                                    isOutgoing={false}
                                                    currentDate={currentDate}
                                                />
                                                {!item.contact && (
                                                    <div className='mt-4 bg-neutral-75 p-3 rounded-md flex gap-4 justify-between items-center'>
                                                        <p className='text-xs text-customGray'>
                                                            Nomor ini tidak ada di kontak
                                                        </p>
                                                        <div className='flex justify-end '>

                                                            {/* <Button onClick={() => handleAddContactClick(item.from! + item.to)}
                                                                color='primary'
                                                                radius='md'
                                                            >
                                                                Tambah ke Kontak
                                                            </Button> */}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

        </div>
    </>)
}

export default BroadcastTable