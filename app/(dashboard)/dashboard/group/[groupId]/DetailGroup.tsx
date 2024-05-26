'use client'
import IconSearch from '@/components/assets/icons/search'
import Card from '@/components/Card'
import HeaderText from '@/components/Dashboard/HeaderText'
import fetchClient from '@/helper/fetchClient'
import { formatDate } from '@/helper/formatDate'
import route from '@/routes'
import { ContactTypes, GroupDataTypes } from '@/types'
import { Button, Input, Selection, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import AddContactGroupModal from './AddContactGroupModal'
import EditGroup from './EditGroup'
import DeleteMemberModal from './DeleteMemberModal'
import DeleteGroupModal from './DeleteGroupModal'

interface Props {
    groupId: string
}

const DetailGroup: NextPage<Props> = ({ groupId }) => {
    const { push } = useRouter()
    const { data: session } = useSession()
    const [selectedContact, setselectedContact] = useState<Selection>(new Set([]))
    const [contactList, setcontactList] = useState<ContactTypes[]>([])
    const [groupContactList, setgroupContactList] = useState<ContactTypes[]>([])
    const [searchText, setsearchText] = useState('')
    const [searchedContact, setsearchedContact] = useState<ContactTypes[]>([])
    const [addContactModal, setaddContactModal] = useState(false)
    const [editGroupModal, seteditGroupModal] = useState(false)
    const [deleteMemberModal, setdeleteMemberModal] = useState(false)
    const [deleteGroupModal, setdeleteGroupModal] = useState(false)
    const [groupData, setgroupData] = useState<GroupDataTypes>()
    const fetchDetailGroup = async () => {
        const result = await fetchClient({
            url: '/groups/' + groupId,
            method: 'GET',
            user: session?.user
        })
        if (result?.ok) {
            setgroupData(await result?.json())
        } else if (result?.status === 404) {
            toast.error('Group tidak ditemukan')
            push(route('group'))
        } else {
            toast.error('server error')
        }
    }
    const fetchContact = async () => {
        const result = await fetchClient({
            method: 'GET',
            url: '/contacts',
            user: session?.user
        })
        if (result?.ok) {
            const resultData = await result.json()
            setcontactList(resultData)
            return
        }
        toast.error('Gagal fetch contact')
        console.log(await result?.text())
    }
    const deleteGroup = async () => {
        const result = await fetchClient({
            method: 'DELETE',
            url: '/groups',
            body: JSON.stringify({
                groupIds: [groupData?.id]
            }),
            user: session?.user
        })
        if (result?.ok) {
            const resultData = await result.json()
            setcontactList(resultData)
            return
        }
        toast.error('Gagal delete group')
        console.log(await result?.text())
    }
    const deleteMember = async () => {
        if (!session?.user) return
        let deletedContact
        if (selectedContact === 'all') {
            deletedContact = groupData?.contactGroups?.map(contact => contact.contact.id)
        } else {
            deletedContact = Array.from(selectedContact)
        }
        const result = await fetchClient({
            url: "/groups/remove",
            method: 'DELETE',
            body: JSON.stringify({
                groupId: groupData?.id,
                contactIds: deletedContact
            }),
            user: session?.user
        })
        if (result?.ok) {
            toast.success('Member berhasil dihapus')
            setselectedContact(new Set())
            setdeleteMemberModal(false)
            fetchDetailGroup()
        } else {
            toast.error('Member gagal dihapus')
        }
        deletedContact = null
    }
    useEffect(() => {

    }, [])
    useEffect(() => {
        if (session?.user) {
            fetchDetailGroup()
            fetchContact()
        }
    }, [session?.user])
    return (<>
        {groupData && (<>
            <DeleteGroupModal
                groupName={groupData.name}
                openModal={deleteGroupModal}
                setopenModal={setdeleteGroupModal}
                deleteFunc={deleteGroup}
            />
            <DeleteMemberModal
                openModal={deleteMemberModal}
                setopenModal={setdeleteMemberModal}
                deleteFunc={deleteMember}
                count={selectedContact === "all" ? selectedContact : selectedContact.size}
            />
            <AddContactGroupModal
                listContact={contactList?.filter(contact => !groupData.contactGroups?.find(groupContact => groupContact.contact.id === contact.id))}
                openModal={addContactModal}
                setopenModal={setaddContactModal}
                user={session?.user}
                groupId={groupData.id}
                refresh={fetchDetailGroup} />
            <EditGroup
                groupData={groupData}
                refresh={fetchDetailGroup}
                openModal={editGroupModal}
                setopenModal={seteditGroupModal}
                user={session?.user}
            />
        </>
        )}
        <Button className='mb-4' radius='none' variant={'faded'} as={Link} href={route('group')}>Kembali</Button>
        <HeaderText>{`Group: ${groupData?.name}`}</HeaderText>
        <Card className='w-full gap-2 flex flex-wrap-reverse justify-between'>
            <div className='relative max-w-sm w-full'>
                <Input type='text' className='w-full' variant='underlined' placeholder='cari kontak' />
                <div className='absolute top-1/2 -translate-y-1/2 right-4'>
                    <IconSearch />
                </div>
            </div>
            <div className='flex justify-end gap-2 max-w-sm w-full'>
                <Button radius='none' variant='light' color='danger'
                    onClick={() => setdeleteGroupModal(true)}>Hapus Group</Button>
                <Button radius='none' variant='light' color='primary'
                    onClick={() => seteditGroupModal(true)}>Edit Group</Button>
                {(selectedContact as Set<string>).size > 0 || selectedContact === 'all' ? (
                    <Button
                        onClick={() => setdeleteMemberModal(true)}
                        radius='none' variant='solid' color='danger'>Hapus Member</Button>
                ) : (
                    <Button
                        onClick={() => setaddContactModal(true)}
                        radius='none' variant='solid' color='primary'>Tambah Member</Button>
                )}
            </div>
        </Card>
        <Table
            selectionMode="multiple"
            aria-label="Group table"
            radius='none'
            classNames={{
                wrapper: 'max-w-full overflow-x-scroll dark:bg-boxdark allowed-scroll',
            }}
            className=' mt-4 md:mt-6'
            selectedKeys={selectedContact}
            onSelectionChange={setselectedContact}
        >
            <TableHeader>
                <TableColumn>Nama</TableColumn>
                <TableColumn>Nomor HP</TableColumn>
                <TableColumn>Email</TableColumn>
                <TableColumn>Dibuat pada</TableColumn>
                <TableColumn>Detail</TableColumn>
            </TableHeader>
            <TableBody emptyContent={
                <div className='w-full bg-white p-12'>
                    <div className='w-full max-w-md mx-auto flex flex-col gap-4  items-center'>
                        <p className='text-[16px] font-bold'>Member grup masih kosong</p>
                        <p className='text-xs text-[#777C88]'>Tambahkan kontak ke dalam grup anda.</p>
                        <Button
                            className='max-w-sm'
                            onClick={() => setaddContactModal(true)}
                            radius='none' color='primary'>
                            Tambah Member
                        </Button>
                    </div>
                </div>

            } items={groupData?.contactGroups || []}>
                {item => (
                    <TableRow key={item.contact.id}>
                        <TableCell>{item.contact.firstName} {item.contact?.lastName || ''}</TableCell>
                        <TableCell >{item.contact.phone}</TableCell>
                        <TableCell >{item.contact.email}</TableCell>
                        <TableCell >
                            {formatDate(item.contact.createdAt)}
                        </TableCell>
                        <TableCell>
                            <Button
                                as={Link}
                                href={route('contact') + `/${item.contact.id}`}
                                radius='none'
                                variant='bordered'
                                size='sm'
                            >Detail</Button>
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    </>)
}

export default DetailGroup