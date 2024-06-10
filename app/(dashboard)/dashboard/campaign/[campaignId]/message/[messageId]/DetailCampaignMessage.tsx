'use client'
import HeaderText from '@/components/Dashboard/HeaderText'
import route from '@/routes'
import { Button, Accordion, AccordionItem, Popover, PopoverContent, PopoverTrigger, Tab, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tabs, Selection } from '@nextui-org/react'
import { NextPage } from 'next'
import Link from 'next/link'
import DetailCampaignTable from '../../DetailCampaignTable'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CampaignMessageTypes, CampaignTypes, ContactBroadcast, MessageTableStatus } from '@/types'
import toast from 'react-hot-toast'
import fetchClient from '@/helper/fetchClient'
import Card from '@/components/Card'
import { formatDate, getNumberFromString } from '@/helper/utils'
import { isFileImage } from '@/helper/fileHelper'
import DisplayImage from '@/components/file/DisplayImage'
import DisplayFile from '@/app/(dashboard)/dashboard/messenger/DisplayFile'
import BubbleChat from '@/app/(dashboard)/dashboard/messenger/BubbleChat'
import ProfileAvatar from '@/components/ProfileAvatar'

interface Props { campaignId: string, messageId: string }

const DetailCampaignMessage: NextPage<Props> = ({ campaignId, messageId }) => {
    const currentDate = new Date()
    const { push } = useRouter()
    const { data: session } = useSession()
    const [selectedKeys, setSelectedKeys] = useState<Selection>()
    const [campaignMessageData, setcampaignMessageData] = useState<CampaignMessageTypes>()
    const [campaignData, setcampaignData] = useState<CampaignTypes>()
    const [campaignMessageDetail, setcampaignMessageDetail] = useState<any>({
        Terkirim: [],
        Diterima: [],
        Terbaca: []
    })
    const [currentPage, setcurrentPage] = useState<MessageTableStatus>('Terkirim')
    const fetchCampaign = async () => {
        const result = await fetchClient({
            url: "/campaigns/" + campaignId,
            method: 'GET',
            user: session?.user
        })
        if (result?.ok) {
            setcampaignData(await result.json())
            return
        }
        if (result?.status === 404) {
            toast.error('Campaign tidak ditemukan')
            push(route('campaign'))
            return
        }
        toast.error('Gagal fetch campaign')
    }
    const fetchCampaignMessage = async () => {
        const result = await fetchClient({
            url: `/campaigns/messages/${messageId}`,
            method: 'GET',
            user: session?.user
        })
        if (result?.ok) {
            setcampaignMessageData(await result.json())
            return
        }
        if (result?.status === 404) {
            toast.error("Pesan Campaign tidak ditemukan")
            push(`/dashboard/campaing/${campaignId}/message`)
            return
        }
        toast.error('Gagal fetch campaign message')
    }
    const fetchCampaignMessages = async () => {
        // server_ack, read, delivery_ack
        const fetchSent = await fetchClient({
            url: '/campaigns/messages/' + campaignMessageData?.id + '/outgoing?status=server_ack',
            method: 'GET',
            user: session?.user
        })
        const fetchReceived = await fetchClient({
            url: '/campaigns/messages/' + campaignMessageData?.id + '/outgoing?status=delivery_ack',
            method: 'GET',
            user: session?.user
        })
        const fetchRead = await fetchClient({
            url: '/campaigns/messages/' + campaignMessageData?.id + '/outgoing?status=read',
            method: 'GET',
            user: session?.user
        })
        if (fetchSent?.ok && fetchRead?.ok && fetchReceived?.ok) {
            setcampaignMessageDetail({
                Terkirim: (await fetchSent.json()).outgoingCampaignMessages,
                Terbaca: (await fetchRead.json()).outgoingCampaignMessages,
                Diterima: (await fetchReceived.json()).outgoingCampaignMessages
            })
        }
    }
    useEffect(() => {
        if (session?.user) {
            fetchCampaign()
        }
    }, [session?.user])
    useEffect(() => {
        if (campaignData) {
            fetchCampaignMessage()
        }
    }, [campaignData])
    useEffect(() => {
        if (campaignMessageData) {
            fetchCampaignMessages()
        }
    }, [campaignMessageData])
    return (<>
        <Button className='mb-4' radius='none' variant={'faded'} as={Link} href={route('campaign') + `/${campaignData?.id}/message/${campaignMessageData?.id}`}>Kembali</Button>
        <div className='flex gap-4 justify-between'>
            <HeaderText>{`Campaign Message: ${campaignData?.name}/${campaignMessageData?.name}`}</HeaderText>
        </div>
        <Card className='w-full flex gap-4 flex-col md:flex-row'>
            <div className='w-full max-w-sm'>
                <p className='font-medium text-black dark:text-white'>Detail Campaign</p>
                <table className='w-full border-spacing-y-2 border-spacing-x-2 -mx-2 border-separate '>
                    <tbody >
                        <tr>
                            <th className='font-medium text-start'>Nama Pesan</th>
                            <td>{campaignMessageData?.name}</td>
                        </tr>
                        <tr>
                            <th className='font-medium text-start '>Terkirim</th>
                            <td>{campaignMessageData?.isSent ? 'Ya' : 'Belum'}</td>
                        </tr>
                        <tr>
                            <th className='font-medium text-start'>Penerima</th>
                            <td>{campaignData?.recipients.length}</td>
                        </tr>
                        <tr>
                            <th className='font-medium text-start'>Jadwal</th>
                            <td>{formatDate(campaignMessageData?.schedule!)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className='w-full'>
                <p className="font-medium text-black dark:text-white">Tampilan Pesan</p>
                <div className="relative">
                    <div className="border border-customGray px-4 py-3 mt-4">
                        {campaignMessageData?.message}
                    </div>
                    {/* <div className="absolute bottom-1 right-2 text-customGray text-sm">
                        <p>now &#10003;</p>
                    </div> */}
                </div>
                {campaignMessageData?.mediaPath && (
                    <>
                        <p className="my-2">Media</p>
                        {isFileImage(campaignMessageData?.mediaPath) ? (
                            <DisplayImage imageUrl={campaignMessageData?.mediaPath} />
                        ) : (
                            <DisplayFile fileUrl={campaignMessageData?.mediaPath} />
                        )}
                    </>
                )}
                <div className='flex justify-end mt-4'>
                    <Button as={Link} href={`/dashboard/campaign/${campaignData?.id}/message/${campaignMessageData?.id}/edit`} radius='none' color='primary' variant='bordered'>Edit</Button>
                </div>
            </div>
        </Card>
        {campaignData && (
            <div className="w-full bg-white rounded-md px-3 py-3 pb-6 mt-6">
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
                            <div className='w-full bg-white p-12'>
                                <div className='w-full max-w-md mx-auto flex flex-col gap-4'>
                                    <p className='text-[16px] font-bold'>Belum ada pesan {currentPage}
                                    </p>
                                </div>
                            </div>

                        } items={campaignMessageDetail[currentPage]}>
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
        )}
    </>)
}

export default DetailCampaignMessage