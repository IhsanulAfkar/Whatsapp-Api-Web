'use client'
import IconSearch from '@/components/assets/icons/search';
import fetchClient from '@/helper/fetchClient';
import { formatDate } from '@/helper/formatDate';
import route from '@/routes';
import { GetBroadcast, SelectedKeyState } from '@/types';
import { Button, Input, Switch, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import { NextPage } from 'next'
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import DeleteBroadcastModal from './DeleteBroadcastModal';

interface Props { }

const Broadcast: NextPage<Props> = ({ }) => {
    const { push } = useRouter()
    const { data: session } = useSession()
    const [isChecked, setisChecked] = useState(false)
    const [isLoaded, setisLoaded] = useState(false)
    const [selectedBroadcast, setselectedBroadcast] = useState<SelectedKeyState>(new Set([]))
    const [broadcastData, setbroadcastData] = useState<GetBroadcast[]>([])
    const [deleteModal, setDeleteModal] = useState(false)

    const handleToggleBroadcast = async (id: string, status: boolean) => {
        const result = await fetchClient({
            url: '/broadcasts/' + id + '/status',
            method: 'PATCH',
            body: JSON.stringify({ status: status }),
            user: session?.user,
        })
        if (result?.ok) {
            // toast.success('Ber')
            fetchBroadcast()
        }
    }
    const fetchBroadcast = async () => {
        const result = await fetchClient({
            url: '/broadcasts/',
            method: 'GET',
            user: session?.user
        })
        if (result?.ok) {
            const resultData = await result.json()
            console.log(resultData)
            setbroadcastData(resultData)
            setisLoaded(true)
        } else {
            toast.error('gagal fetch broadcast')

        }
    }
    const deleteBroadcast = async () => {
        if (!session?.user) return
        let deletedBroadcast

        if (selectedBroadcast === 'all')
            deletedBroadcast = broadcastData.map(bc => bc.id)
        else
            deletedBroadcast = Array.from(selectedBroadcast)
        const result = await fetchClient({
            url: '/broadcasts',
            method: 'DELETE',
            body: JSON.stringify({
                broadcastIds: deletedBroadcast
            }),
            user: session.user
        })
        if (result?.ok) {
            toast.success('Broadcast berhasil dihapus')
            setDeleteModal(false)
            fetchBroadcast()

        } else
            toast.error('Broadcast gagal dihapus')
        deletedBroadcast = null
    }
    useEffect(() => {
        if (session?.user) {
            fetchBroadcast()
        }
    }, [session?.user])
    return (<>
        <DeleteBroadcastModal
            count={selectedBroadcast === "all" ? selectedBroadcast : selectedBroadcast.size}
            deleteFunc={deleteBroadcast}
            openModal={deleteModal}
            setopenModal={setDeleteModal}
        />
        <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark flex justify-between w-full py-3 px-7.5 items-center'>
            <div className='relative max-w-sm w-full'>
                <Input type='text' className='w-full' variant='underlined' placeholder='cari broadcast' />
                <div className='absolute top-1/2 -translate-y-1/2 right-4'>
                    <IconSearch />
                </div>
            </div>
            {((selectedBroadcast as Set<string>).size > 0 || selectedBroadcast === 'all') ?
                <Button radius='none' variant='light' color='danger' onClick={() => setDeleteModal(true)}>Hapus Broadcast</Button>
                :
                <Button as={Link} href={route('create.broadcast')} variant="light" radius="none" color="primary">Buat Broadcast</Button>
            }
        </div>

        <Table
            aria-label="Incoming Chat"
            color='default'
            selectionMode="multiple"
            aria-labelledby='broadcast table'
            isHeaderSticky
            className='mt-4'
            classNames={{
                wrapper: 'max-w-full overflow-x-scroll dark:bg-boxdark allowed-scroll',
            }}
            radius='none'
            selectedKeys={selectedBroadcast as any}
            onSelectionChange={setselectedBroadcast as any}
        >
            <TableHeader>
                <TableColumn>Nama</TableColumn>
                <TableColumn>Status</TableColumn>
                {/* <TableColumn>Device</TableColumn> */}
                <TableColumn>Dibuat Pada</TableColumn>
                <TableColumn>Terakhir Update</TableColumn>
                <TableColumn>Detail</TableColumn>
            </TableHeader>
            <TableBody emptyContent={<div className='w-full p-12'>
                <div className='w-full max-w-md mx-auto flex flex-col gap-4'>
                    <p className='text-[16px] font-bold'>Broadcast masih kosong</p>
                </div>
            </div>}
                items={broadcastData}
            >
                {(item: GetBroadcast) => (
                    <TableRow key={item.id}>
                        <TableCell >{item.name}</TableCell>
                        <TableCell>
                            <Switch size='sm' isSelected={item.status} onClick={() => handleToggleBroadcast(item.id, !item.status)} />
                        </TableCell>
                        {/* <TableCell>
                            {item.device.name}
                        </TableCell> */}
                        <TableCell>
                            {formatDate(item.createdAt)}
                        </TableCell>
                        <TableCell>
                            {formatDate(item.updatedAt)}
                        </TableCell>
                        <TableCell>
                            <Button radius='none' variant='bordered' onClick={() => push('/dashboard/broadcast/' + item.id)}>
                                Detail
                            </Button>
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    </>)
}

export default Broadcast