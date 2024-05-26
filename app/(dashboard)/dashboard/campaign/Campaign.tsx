'use client'
import IconSearch from '@/components/assets/icons/search'
import fetchClient from '@/helper/fetchClient'
import { formatDate } from '@/helper/formatDate'
import { formatCurrencyIDR } from '@/helper/utils'
import route from '@/routes'
import { GetCampaign } from '@/types'
import { Button, Input, Selection, Switch, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import DeleteCampaignModal from './DeleteCampaignModal'

interface Props { }

const Campaign: NextPage<Props> = ({ }) => {
    const { push } = useRouter()
    const { data: session } = useSession()
    const [searchText, setSearchText] = useState('')
    const [deleteModal, setdeleteModal] = useState(false)
    const [selectedCampaign, setselectedCampaign] = useState<Selection>(new Set())
    const [campaignData, setCampaignData] = useState<GetCampaign[]>([])
    const fetchCampaign = async () => {
        const result = await fetchClient({
            url: '/campaigns',
            method: 'GET',
            user: session?.user
        })
        if (result?.ok) {
            setCampaignData(await result.json())
            return
        }
        toast.error('Gagal fetch campaign')
        console.log(await result?.text())
    }
    const handleToggleCampaign = async (id: string, status: boolean) => {
        const result = await fetchClient({
            url: '/campaigns/' + id + '/status',
            method: 'PATCH',
            body: JSON.stringify({ status: status }),
            user: session?.user,
        })
        if (result?.ok) {
            // toast.success('Ber')
            fetchCampaign()
        }
    }
    const deleteCampaigns = async () => {
        let deletedCampaign
        if (selectedCampaign === 'all') {
            deletedCampaign = campaignData.map(cp => cp.id)
        } else {
            deletedCampaign = Array.from(selectedCampaign)
        }
        const result = await fetchClient({
            url: '/campaigns',
            method: 'DELETE',
            body: JSON.stringify({ campaignIds: deletedCampaign }),
            user: session?.user
        })
        if (result?.ok) {
            toast.success('Campaign berhasil dihapus')
            setdeleteModal(false)
            fetchCampaign()
        } else {

            toast.error('Campaign gagal dihapus')
        }
        deletedCampaign = null
    }
    useEffect(() => {
        if (session?.user) {
            fetchCampaign()
        }
    }, [session?.user])
    return (<>
        <DeleteCampaignModal
            openModal={deleteModal}
            setopenModal={setdeleteModal}
            deleteFunc={deleteCampaigns}
            count={selectedCampaign === "all" ? selectedCampaign : selectedCampaign.size}
        />
        <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark flex justify-between w-full py-3 px-7.5 items-center'>
            <div className='relative max-w-sm w-full'>
                <Input
                    type='text'
                    className='w-full'
                    variant='underlined'
                    placeholder='cari campaign'
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)} />
                <div className='absolute top-1/2 -translate-y-1/2 right-4'>
                    <IconSearch />
                </div>
            </div>
            {((selectedCampaign as Set<string>)?.size > 0 || selectedCampaign === 'all') ? (<>
                <Button variant="light" radius="none" color="danger" onClick={() => setdeleteModal(!deleteModal)}>Hapus Campaign</Button>
            </>) : (<>
                <Button as={Link} href={route('create.campaign')} variant='light' color='primary' radius='none'>Buat Campaign</Button>
            </>)}

        </div>
        <Table
            aria-label="Campaign"
            color='default'
            selectionMode="multiple"
            isHeaderSticky
            className='mt-4'
            classNames={{
                wrapper: 'max-w-full overflow-x-scroll dark:bg-boxdark allowed-scroll',
                // table: 'block overflow-x-scroll allowed-scroll'
            }}
            radius='none'
            selectedKeys={selectedCampaign}
            onSelectionChange={setselectedCampaign}
        >
            <TableHeader>
                <TableColumn>Nama</TableColumn>
                <TableColumn>Status</TableColumn>
                <TableColumn>Register Syntax</TableColumn>
                <TableColumn>Subcscriber</TableColumn>
                <TableColumn>Device</TableColumn>
                <TableColumn>Tanggal Kirim</TableColumn>
                <TableColumn>Tanggal diupdate</TableColumn>
                <TableColumn>Detail</TableColumn>
            </TableHeader>
            <TableBody emptyContent={<div className='w-full p-12'>
                <div className='w-full max-w-md mx-auto flex flex-col gap-4'>
                    <p className='text-[16px] font-bold'>Campaign masih kosong</p>
                </div>
            </div>}
                items={searchText ? [] : campaignData}>
                {item => (
                    <TableRow key={item.id}>
                        <TableCell >{item.name}</TableCell>
                        <TableCell>
                            <div className='flex gap-1 items-center'>
                                <Switch size='sm' isSelected={item.status}
                                    onClick={() => handleToggleCampaign(item.id, !item.status)}
                                />
                                {item.status ? (
                                    <p className='text-primary font-bold'>Live</p>
                                ) : (
                                    <p className='text-customGray'>off</p>
                                )}
                            </div>
                        </TableCell>
                        <TableCell>
                            <p>{item.registrationSyntax}</p>
                        </TableCell>
                        <TableCell>
                            <p>
                                {item.recipients[0] === 'all' ? 'Semua' : item.recipients.length}
                            </p>
                        </TableCell>
                        <TableCell>
                            <p>
                                {item.device.name}
                            </p>
                        </TableCell>
                        <TableCell>
                            {formatDate(item.createdAt)}
                        </TableCell>
                        <TableCell>
                            {formatDate(item.updatedAt)}
                        </TableCell>
                        <TableCell>
                            <Button as={Link} href={'/dashboard/campaign/' + item.id}
                                radius='none'
                                variant='bordered' >
                                Detail
                            </Button>
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table></>)
}

export default Campaign