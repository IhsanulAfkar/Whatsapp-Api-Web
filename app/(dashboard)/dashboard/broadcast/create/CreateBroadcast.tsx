'use client'
import IconSearch from '@/components/assets/icons/search'
import Card from '@/components/Card'
import UploadFile from '@/components/file/UploadFile'
import fetchClient from '@/helper/fetchClient'
import { formatDatetoISO8601 } from '@/helper/utils'
import { ContactTypes, SelectedKeyState } from '@/types'
import { Button, Chip, Input, Select, SelectItem, Textarea } from '@nextui-org/react'
import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

interface Props { }
interface BroadcastForm {
    name: string,
    recipients: string[],
    message: string,
    delay: number,
    schedule: string
}
const CreateBroadcast: NextPage<Props> = ({ }) => {
    const { push } = useRouter()
    const { data: session } = useSession()
    const { register, formState: { errors }, handleSubmit, setValue } = useForm<BroadcastForm>()
    const [isLoading, setIsLoading] = useState(false)
    const [selectedReceiver, setselectedReceiver] = useState<SelectedKeyState>(new Set())
    const [searchText, setSearchText] = useState('')
    const [listContact, setlistContact] = useState<ContactTypes[]>([])
    const [searchedListContact, setsearchedListContact] = useState<ContactTypes[]>([])
    const [broadcastText, setBroadcastText] = useState('')
    const [files, setfiles] = useState<File[]>([])
    const fetchListContact = async () => {
        const result = await fetchClient({
            method: 'GET',
            url: '/contacts',
            user: session?.user
        })
        if (result?.ok) {
            const resultData = await result.json()
            setlistContact(resultData)
            return
        }
        toast.error('Gagal fetch penerima')
        console.log(await result?.text())

    }
    const filterContact = () => {
        if (searchText === '') return

        const newContact = listContact.filter(contact => {
            console.log(contact)
            console.log(searchText)
            if (contact.firstName.toLowerCase().includes(searchText) || contact.lastName.toLowerCase().includes(searchText) || `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchText) || contact.phone.includes(searchText))
                return true
        })
        console.log(newContact)
        setsearchedListContact(newContact)
    }
    const onSubmit = async (broadcastFormData: BroadcastForm) => {
        try {
            setIsLoading(true)
            let mark = true
            if (Array.from(selectedReceiver).length === 0) {
                toast.error('Penerima masih kosong!')
                mark = false
            }
            // if (textInput.length === 0) {
            //     toast.error('Response masih kosong!')
            //     mark = false
            // }
            if (!session?.user?.deviceId) {
                toast.error('Device masih kosong!')
                mark = false
            }
            if (mark) {
                // error here
                const formData = new FormData()
                const delay = 4000
                if (files.length > 0) {
                    // @ts-ignore
                    formData.set('media', files[0].file, files[0].name)
                }
                formData.append('name', broadcastFormData.name)
                formData.append('deviceId', session?.user?.deviceId!)

                Array.from(selectedReceiver).forEach((element, idx) => {
                    formData.append(`recipients[${idx}]`, element)
                })
                formData.append('message', broadcastText)
                formData.append('delay', delay.toString())
                formData.append('schedule', formatDatetoISO8601(broadcastFormData.schedule))
                const result = await fetchClient({
                    url: '/broadcasts',
                    method: 'POST',
                    body: formData,
                    isFormData: true,
                    user: session?.user
                })
                if (result?.ok) {
                    toast.success('Berhasil buat broadcast')
                    push('/dashboard/broadcast')
                } else {
                    toast.error('Gagal buat broadcast')
                }
            }
            setIsLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (session?.user) {
            fetchListContact()
        }
    }, [session?.user])
    useEffect(() => {
        if (searchText)
            filterContact()

    }, [searchText])
    useEffect(() => {
        console.log('selected', selectedReceiver)
    }, [selectedReceiver])
    return (<>
        <form className='flex gap-4' onSubmit={handleSubmit(onSubmit)}>
            <Card className='w-full max-w-sm flex flex-col gap-4 pt-4 pb-8'>
                <div className="">
                    <label className="font-medium text-black dark:text-white">
                        Nama Broadcast
                    </label>
                    <Input variant='underlined'
                        type="text"
                        size='lg'
                        classNames={{
                            inputWrapper: errors.name && 'border-danger'
                        }}
                        placeholder='masukkan nama broadcast'
                        color={errors.name ? "danger" : "default"}
                        {...register('name', { required: true })} />
                </div>
                <div className="">
                    <label className="font-medium text-black dark:text-white">
                        Jadwal
                    </label>
                    <Input variant='underlined'
                        type="datetime-local"
                        size='lg'
                        classNames={{
                            inputWrapper: errors.schedule && 'border-danger'
                        }}
                        color={errors.schedule ? "danger" : "default"}
                        {...register('schedule', { required: true })} />
                </div>
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
                        selectedKeys={selectedReceiver}
                        isMultiline
                        onChange={e => {
                            setselectedReceiver(new Set(e.target.value.split(",")));
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
                            <SelectItem key={e.phone} value={e.phone}>
                                <div className='flex flex-col '>
                                    <span className='text-small'>{e.firstName} {e.lastName}</span>
                                    <span className='text-tiny'>{e.phone}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </Select>
                </div>
            </Card>
            <Card className='w-full flex flex-col gap-4 py-4'>
                <div>
                    <label className="font-medium text-black dark:text-white">
                        Pesan Broadcast
                    </label>
                    <Textarea
                        radius='none'
                        className='mt-2'
                        variant='bordered'
                        minRows={5}
                        maxRows={7}
                        placeholder='tuliskan pesan disini'
                        value={broadcastText}
                        onChange={e => setBroadcastText(e.target.value)}
                    />
                    <div className='mt-4'>

                        <UploadFile
                            files={files}
                            setfiles={setfiles} />
                    </div>
                </div>
                <div className='flex justify-end'>
                    <Button isLoading={isLoading} color='primary' radius='none' type='submit'>Buat Broadcast</Button>
                </div>
            </Card>
        </form>
    </>)
}

export default CreateBroadcast