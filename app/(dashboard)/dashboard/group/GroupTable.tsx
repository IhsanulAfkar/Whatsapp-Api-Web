'use client'
import IconSearch from '@/components/assets/icons/search'
import fetchClient from '@/helper/fetchClient'
import { formatDate } from '@/helper/formatDate'
import route from '@/routes'
import { GroupDataTypes } from '@/types'
import { Input, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Selection } from '@nextui-org/react'
import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import AddGroupModal from './AddGroupModal'

interface Props { }

const GroupTable: NextPage<Props> = ({ }) => {
    const { data: session } = useSession()
    const [groupList, setgroupList] = useState<GroupDataTypes[]>([])
    const [selectedGroup, setselectedGroup] = useState<Selection>(new Set([]))
    const [openDeleteModal, setopenDeleteModal] = useState(false)
    const [openAddGroupModal, setopenAddGroupModal] = useState(false)
    const fetchGroup = async () => {
        const result = await fetchClient({
            url: '/groups',
            method: 'GET',
            user: session?.user
        })
        if (result?.ok) {
            setgroupList(await result.json())
            return
        }
        toast.error('Gagal fetch grup')
        console.log(await result?.text())
    }
    useEffect(() => {
        if (session?.user) {
            fetchGroup()
        }
    }, [session?.user])
    return (<>
        <AddGroupModal
            openModal={openAddGroupModal}
            refresh={fetchGroup}
            setopenModal={setopenAddGroupModal}
            user={session?.user} />
        <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark flex justify-between w-full py-3 px-7.5 items-center'>
            <div className='relative max-w-sm w-full'>
                <Input type='text' className='w-full' variant='underlined' placeholder='cari kontak' />
                <div className='absolute top-1/2 -translate-y-1/2 right-4'>
                    <IconSearch />
                </div>
            </div>
            {((selectedGroup as Set<string>).size > 0 || selectedGroup === 'all') ? (<>
                {/* TODO */}
                <Button variant="light" radius="none" color="danger" onClick={() => setopenDeleteModal(!openDeleteModal)}>Hapus Group</Button>
            </>) : (<>
                <Button variant="light" radius="none" color="primary" onClick={() => setopenAddGroupModal(true)}>Buat Group</Button>
            </>)}
        </div>
        <Table
            selectionMode="multiple"
            aria-label="Broadcast table"
            radius='none'
            classNames={{
                wrapper: 'max-w-full overflow-x-scroll dark:bg-boxdark allowed-scroll',
            }}
            className=' mt-4 md:mt-6'
            selectedKeys={selectedGroup}
            onSelectionChange={setselectedGroup as any}
        >
            <TableHeader>
                <TableColumn>Nama</TableColumn>
                <TableColumn>Tipe</TableColumn>
                <TableColumn>Jumlah Anggota</TableColumn>
                <TableColumn>Dibuat pada</TableColumn>
                <TableColumn>Terakhir diupdate</TableColumn>
                <TableColumn>Detail</TableColumn>
            </TableHeader>
            <TableBody
                items={groupList}>
                {(item) => (
                    <TableRow key={item.id}>
                        <TableCell >{item.name}</TableCell>
                        <TableCell >{item.type}</TableCell>
                        <TableCell >{item.membersCount}</TableCell>
                        <TableCell >{formatDate(item.createdAt)}</TableCell>
                        <TableCell >{formatDate(item.updatedAt)}</TableCell>
                        <TableCell>
                            <Button as={Link} href={route('group') + `/${item.id}`} variant='bordered' radius='none' size='sm'>
                                Detail
                            </Button>
                        </TableCell>
                    </TableRow>)}
            </TableBody>
        </Table></>)
}

export default GroupTable