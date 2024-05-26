'use client'
import IconSearch from '@/components/assets/icons/search'
import ModalTemplate from '@/components/ModalTemplate'
import fetchClient from '@/helper/fetchClient'
import { ContactTypes, SelectedKeyState } from '@/types'
import { Input, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Modal, ModalContent } from '@nextui-org/react'
import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import AddContactModal from './AddContactModal'
import { formatDate } from '@/helper/formatDate'
import DeleteContactModal from './DeleteContactModal'
import Link from 'next/link'
import route from '@/routes'

interface Props { }

const Contact: NextPage<Props> = ({ }) => {
    const { data: session } = useSession()
    const [contactList, setcontactList] = useState<ContactTypes[]>([])
    const [selectedContact, setselectedContact] = useState<SelectedKeyState>(new Set([]))
    const [openDeleteModal, setopenDeleteModal] = useState(false)
    const [openAddContactModal, setOpenAddContactModal] = useState(false)
    const fetchContactList = async () => {
        const result = await fetchClient({
            url: "/contacts",
            method: "GET",
            user: session?.user
        })
        if (!result) {
            toast.error('error')
        }
        const resultData = await result?.json()
        console.log(resultData)
        setcontactList(resultData)
    }
    const deleteContact = async () => {
        if (!session?.user) return
        let deletedContact
        if (selectedContact === 'all') {
            deletedContact = contactList.map(contact => contact.id)
        } else {
            deletedContact = Array.from(selectedContact)
        }
        const result = await fetchClient({
            url: '/contacts',
            method: "DELETE",
            body: JSON.stringify({ contactIds: deletedContact }),
            user: session.user
        })
        if (result?.ok) {
            toast.success('Kontak berhasil dihapus')
            setopenDeleteModal(false)
            fetchContactList()
        } else {
            toast.error('Kontak gagal dihapus')
        }
        deletedContact = null
    }
    useEffect(() => {
        if (session?.user)
            fetchContactList()
    }, [session?.user])
    return (<>
        <AddContactModal
            openModal={openAddContactModal}
            setopenModal={setOpenAddContactModal}
            user={session?.user}
            refresh={() => fetchContactList()}
        />
        <DeleteContactModal
            openModal={openDeleteModal}
            setopenModal={setopenDeleteModal}
            deleteFunc={deleteContact}
            count={selectedContact === "all" ? selectedContact : selectedContact.size}
            user={session?.user}
        />
        <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark flex justify-between w-full py-3 px-7.5 items-center'>
            <div className='relative max-w-sm w-full'>
                <Input type='text' className='w-full' variant='underlined' placeholder='cari kontak' />
                <div className='absolute top-1/2 -translate-y-1/2 right-4'>
                    <IconSearch />
                </div>
            </div>
            {((selectedContact as Set<string>).size > 0 || selectedContact === 'all') ? (<>
                <Button variant="light" radius="none" color="danger" onClick={() => setopenDeleteModal(!openDeleteModal)}>Hapus Kontak</Button>
            </>) : (<>
                <Button variant="light" radius="none" color="primary" onClick={() => setOpenAddContactModal(!openAddContactModal)}>Tambah Kontak</Button>
            </>)}
        </div>
        <Table
            selectionMode="multiple"
            aria-label="Broadcast table"
            radius='none'
            className=' mt-4 md:mt-6'
            classNames={{
                wrapper: 'max-w-full overflow-x-scroll dark:bg-boxdark allowed-scroll',
            }}
            selectedKeys={selectedContact}
            onSelectionChange={setselectedContact as any}
        >
            <TableHeader>
                <TableColumn>Name</TableColumn>
                <TableColumn>Phone</TableColumn>
                <TableColumn>Email</TableColumn>
                <TableColumn>Created At</TableColumn>
                <TableColumn>Detail</TableColumn>
            </TableHeader>
            <TableBody
                items={contactList}>
                {(item) => (
                    <TableRow key={item.id}>
                        <TableCell>{item.firstName} {item.lastName || ''}</TableCell>
                        <TableCell>{item.phone}</TableCell>
                        <TableCell>{item.email}</TableCell>
                        <TableCell>{formatDate(item.createdAt)}</TableCell>
                        <TableCell>
                            <Button as={Link} href={route('contact') + `/${item.id}`} variant='bordered' radius='none' size='sm'>
                                Detail
                            </Button>
                        </TableCell>
                    </TableRow>)}
            </TableBody>
        </Table>
    </>)
}

export default Contact