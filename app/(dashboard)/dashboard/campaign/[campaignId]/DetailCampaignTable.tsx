import ProfileAvatar from '@/components/ProfileAvatar'
import { formatDate } from '@/helper/formatDate'
import { getNumberFromString } from '@/helper/utils'
import { CampaignTypes, ContactBroadcast, MessageTableStatus } from '@/types'
import { Tabs, Tab, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Popover, PopoverTrigger, Button, PopoverContent, Selection } from '@nextui-org/react'
import { NextPage } from 'next'
import BubbleChat from '../../messenger/BubbleChat'
import { useEffect, useState } from 'react'
import { User } from 'next-auth'
import fetchClient from '@/helper/fetchClient'

interface Props {
    campaign: CampaignTypes,
    user?: User,
}

const DetailCampaignTable: NextPage<Props> = ({ campaign, user }) => {
    const [isLoaded, setIsLoaded] = useState(false)
    const currentDate = new Date()
    const [selectedKeys, setSelectedKeys] = useState<Selection>()
    const [currentPage, setcurrentPage] = useState<MessageTableStatus>('Terkirim')
    const [campaignDetail, setcampaignDetail] = useState<any>()
    const fetchCampaignMessages = async () => {
        // server_ack, read, delivery_ack
        const fetchSent = await fetchClient({
            url: '/campaigns/' + campaign.id + '/outgoing?status=server_ack',
            method: 'GET',
            user: user
        })
        const fetchReceived = await fetchClient({
            url: '/campaigns/' + campaign.id + '/outgoing?status=delivery_ack',
            method: 'GET',
            user: user
        })
        const fetchRead = await fetchClient({
            url: '/campaigns/' + campaign.id + '/outgoing?status=read',
            method: 'GET',
            user: user
        })
        const fetchReply = await fetchClient({
            url: '/campaigns/' + campaign.id + '/replies',
            method: 'GET',
            user: user
        })

        if (fetchSent?.ok && fetchRead?.ok && fetchReceived?.ok && fetchReply?.ok) {
            setcampaignDetail({
                Terkirim: (await fetchSent.json()).outgoingCampaigns,
                Terbaca: (await fetchRead.json()).outgoingCampaigns,
                Diterima: (await fetchReceived.json()).outgoingCampaigns,
                Balasan: (await fetchReply.json()).campaignReplies
            })
        }
    }
    useEffect(() => {
        if (user)
            fetchCampaignMessages()
    }, [user])
    useEffect(() => {
        if (campaignDetail) {
            setIsLoaded(true)
        }
    }, [campaignDetail])
    if (!isLoaded) return null
    return (<>
        <div className="w-full bg-white rounded-md px-3 py-3 pb-6 mt-6">
            <div className="flex gap-2">
                <Tabs aria-label="Options" variant="light" color="primary" radius="none" size="lg"
                    selectedKey={currentPage}
                    onSelectionChange={setcurrentPage as any}>
                    <Tab key="Terkirim" title="Terkirim" />
                    <Tab key="Diterima" title="Diterima" />
                    <Tab key="Terbaca" title="Terbaca" />
                    <Tab key="Balasan" title="Balasan" />
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
                        <div className='w-full bg-white p-12'>
                            <div className='w-full max-w-md mx-auto flex flex-col gap-4'>
                                <p className='text-[16px] font-bold'>Belum ada pesan {currentPage}
                                </p>
                            </div>
                        </div>

                    } items={campaignDetail[currentPage]}>
                        {(item: ContactBroadcast) => (
                            <TableRow key={item.id}>
                                <TableCell className='flex gap-2 items-center'>
                                    <p>{item.contact.firstName} {item.contact.lastName}</p>
                                </TableCell>
                                <TableCell >{item.contact.phone}</TableCell>

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

export default DetailCampaignTable