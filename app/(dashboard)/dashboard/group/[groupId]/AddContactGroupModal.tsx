import IconSearch from '@/components/assets/icons/search'
import ModalTemplate from '@/components/ModalTemplate'
import fetchClient from '@/helper/fetchClient'
import { ContactTypes } from '@/types'
import { Button, Chip, Input, Select, Selection, SelectItem } from '@nextui-org/react'
import { NextPage } from 'next'
import { User } from 'next-auth'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface Props {
  openModal: boolean,
  setopenModal: Dispatch<SetStateAction<boolean>>,
  user?: User,
  refresh: () => void,
  groupId: string,
  listContact: ContactTypes[]
}

const AddContactGroupModal: NextPage<Props> = ({ openModal, setopenModal, user, listContact, refresh, groupId }) => {
  const [isLoading, setisLoading] = useState(false)
  const [selectedContact, setselectedContact] = useState<Selection>(new Set())
  const [searchText, setSearchText] = useState('')
  const [searchedListContact, setsearchedListContact] = useState<ContactTypes[]>([])
  const filterContact = () => {
    if (searchText === '') return
    const newContact = listContact.filter(contact => {
      if (contact.firstName.toLowerCase().includes(searchText) || contact.lastName.toLowerCase().includes(searchText) || `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchText) || contact.phone.includes(searchText))
        return true
    })
    setsearchedListContact(newContact)
  }
  const addMember = async () => {
    setisLoading(true)
    // console.log(contactData)
    let memberList: string[] = []
    if (selectedContact === 'all') {
      memberList = listContact.map(contact => contact.id)
    } else {
      memberList = Array.from(selectedContact).map(item => item.toString())
    }
    if (memberList.length === 0) {
      toast.error('Kontak belum dipilih')
      setisLoading(false)
      return
    }
    const result = await fetchClient({
      url: '/groups/add',
      method: 'POST',
      body: JSON.stringify({
        groupId: groupId,
        contactIds: memberList
      }),
      user: user
    })
    const resultData = await result?.json()
    if (result?.ok) {
      setselectedContact(new Set())
      toast.success('Berhasil menambah member!')
      refresh()
      setopenModal(false)
    }
    else {
      toast.error('Gagal menambah member')
      console.log(resultData)
    }
    setisLoading(false)
  }
  useEffect(() => {
    if (searchText)
      filterContact()

  }, [searchText])
  return (<>
    <ModalTemplate
      openModal={openModal}
      setopenModal={setopenModal}
      outsideClose={false}
      title='Tambah Kontak'
    >
      <div className="">
        <label className="font-medium text-black dark:text-white">
          Penerima
        </label>
        <div className='relative mt-2'>
          <div className='absolute left-0 z-10 top-1/2 -translate-y-1/2 '>
            <IconSearch />
          </div>
          <Input
            className='pl-8'
            variant='bordered'
            size='sm'
            placeholder='cari kontak'
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
        </div>
        <Select
          className='mt-4'
          variant='underlined'
          placeholder='nomor telepon penerima'
          selectionMode='multiple'
          selectedKeys={selectedContact}
          isMultiline
          onChange={e => {
            setselectedContact(new Set(e.target.value.split(",")));
          }}
          items={searchText ? searchedListContact : listContact}
          renderValue={items => (
            <div className='flex gap-2 flex-wrap'>
              {items.map(item => (
                <Chip variant='faded' key={item.key}>{item.data?.firstName}</Chip>
              ))}
            </div>
          )}
        >
          {(e => (
            <SelectItem key={e.id} value={e.id}>
              <div className='flex flex-col '>
                <span className='text-small'>{e.firstName} {e.lastName}</span>
                <span className='text-tiny'>{e.phone}</span>
              </div>
            </SelectItem>
          ))}
        </Select>
      </div>
      <Button
        isLoading={isLoading}
        isDisabled={(selectedContact as Set<string>).size === 0 || selectedContact === 'all'} className='mt-2' color='primary' fullWidth onClick={addMember}>Tambah ke Group</Button>
    </ModalTemplate>
  </>)
}

export default AddContactGroupModal