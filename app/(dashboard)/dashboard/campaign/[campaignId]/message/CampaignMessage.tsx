'use client'
import IconSearch from '@/components/assets/icons/search'
import Card from '@/components/Card'
import HeaderText from '@/components/Dashboard/HeaderText'
import fetchClient from '@/helper/fetchClient'
import { formatDate } from '@/helper/formatDate'
import { CampaignMessageTypes, CampaignTypes, ProductData } from '@/types'
import { Button, Input, Selection, Switch, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface Props {
    campaignId: string
}

const CampaignMessage: NextPage<Props> = ({ campaignId }) => {
    const { push } = useRouter()
    const { data: session } = useSession()
    const [campaignData, setcampaignData] = useState<CampaignTypes>()
    const [campaignMessage, setcampaignMessage] = useState<CampaignMessageTypes[]>([])
    const [searchMessage, setsearchMessage] = useState<CampaignMessageTypes[]>([])
    const [searchText, setsearchText] = useState('')
    const [selectedMessage, setselectedMessage] = useState<Selection>(new Set([]))
    const fetchCampaign = async () => {
        const result = await fetchClient({
            url: '/campaigns/' + campaignId,
            method: 'GET',
            user: session?.user
        })
        if (result?.ok) {
            setcampaignData(await result.json())
            return
        }
        if (result?.status === 404) {
            toast.error('Campaign tidak ditemukan')
            return
        }
        toast.error('Gagal fetch campaign')
    }
    const fetchCampaignMessage = async () => {
        const result = await fetchClient({
            url: `/campaigns/${campaignData?.id}/messages`,
            method: 'GET',
            user: session?.user
        })
        if (result?.ok) {
            setcampaignMessage(await result.json())
            return
        }
        toast.error('Gagal fetch campaign message')
    }
    const filterCampaign = (text: string) => {
        const regex = new RegExp(text.toLowerCase(), 'i')
        return campaignMessage.filter(item => (regex.test(item.name)))
    }
    useEffect(() => {
        if (session?.user) {
            fetchCampaign()
        }
    }, [session?.user])
    useEffect(() => {
        if (campaignData?.id) {
            fetchCampaignMessage()
        }
    }, [campaignData])
    useEffect(() => {
        if (searchText) {
            const searchResult = filterCampaign(searchText)
            setsearchMessage(searchResult)
        }
    }, [searchText])
    return (<>
        <HeaderText>{`Pesan Campaign: ${campaignData?.name}`}</HeaderText>
        <Card className='flex justify-between gap-4 items-center flex-col md:flex-row'>
            <div className='relative max-w-sm w-full'>
                <Input type='text' className='w-full' variant='underlined' placeholder='cari pesan campaign'
                    value={searchText}
                    onChange={e => setsearchText(e.target.value)} />
                <div className='absolute top-1/2 -translate-y-1/2 right-4'>
                    <IconSearch />
                </div>
            </div>
            {((selectedMessage as Set<string>).size > 0 || selectedMessage === 'all') ? (<>
                <Button variant="light" radius="none" color="danger" onClick={() => { }}>Hapus Message</Button>
            </>) : (<>
                <Button variant="light" radius="none" color="primary" onClick={() => push(`/dashboard/campaign/${campaignData?.id}/message/create`)}>Buat Pesan</Button>
            </>)}
        </Card>
        <Table
            aria-label="Product"
            color='default'
            selectionMode="multiple"
            aria-labelledby='product table'
            isHeaderSticky
            className='mt-4'
            classNames={{
                wrapper: 'max-w-full overflow-x-scroll dark:bg-boxdark allowed-scroll',
            }}
            radius='none'
            selectedKeys={selectedMessage}
            onSelectionChange={setselectedMessage}
        >
            <TableHeader>
                <TableColumn>Nama</TableColumn>
                <TableColumn>Terkirim?</TableColumn>
                <TableColumn>Dibuat Pada</TableColumn>
                <TableColumn>Terakhir Update</TableColumn>
                <TableColumn>Detail</TableColumn>
            </TableHeader>
            <TableBody emptyContent={<div className='w-full p-12'>
                <div className='w-full max-w-md mx-auto flex flex-col gap-4'>
                    <p className='text-[16px] font-bold'>Campaign Message masih kosong</p>
                </div>
            </div>}
                items={searchText ? searchMessage : campaignMessage}>
                {item => (
                    <TableRow key={item.id}>
                        <TableCell >{item.name}</TableCell>
                        <TableCell>
                            {item.isSent ? 'Ya' : 'Belum'}
                        </TableCell>
                        <TableCell>
                            {formatDate(item.createdAt)}
                        </TableCell>
                        <TableCell>
                            {formatDate(item.updatedAt)}
                        </TableCell>
                        <TableCell>
                            <Button radius='none' variant='bordered' onClick={() => push(`/dashboard/campaign/${campaignData?.id}/message/${item.id}`)}>
                                Detail
                            </Button>
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    </>)
}

export default CampaignMessage