'use client'
import IconSearch from '@/components/assets/icons/search';
import Card from '@/components/Card';
import UploadFile from '@/components/file/UploadFile';
import fetchClient from '@/helper/fetchClient';
import { getFileFromUrl } from '@/helper/fileHelper';
import { formatDatetoISO8601 } from '@/helper/utils';
import route from '@/routes';
import { CampaignMessageStatus, CampaignTypes, ContactTypes } from '@/types';
import { Button, Checkbox, Chip, Input, Select, Selection, SelectItem, Tab, Tabs, Textarea } from '@nextui-org/react';
import { NextPage } from 'next'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface Props {
    campaignId: string,
}

const EditCampaign: NextPage<Props> = ({ campaignId }) => {
    const { push } = useRouter()
    const { data: session } = useSession()
    const { register, formState: { errors }, handleSubmit, setValue } = useForm<CampaignTypes>()
    const [searchText, setSearchText] = useState('')
    const [files, setfiles] = useState<File[]>([])
    const [isLoading, setisLoading] = useState(false)
    const [selectedReceiver, setselectedReceiver] = useState<Selection>(new Set())
    const [isAllContact, setisAllContact] = useState(false);
    const [listContact, setlistContact] = useState<ContactTypes[]>([])
    const [searchedListContact, setsearchedListContact] = useState<ContactTypes[]>([])
    const [currentMessage, setcurrentMessage] = useState<CampaignMessageStatus>('registrationMessage')
    const [campaignData, setcampaignData] = useState<CampaignTypes>()
    const [registrationMessage, setregistrationMessage] = useState('')
    const [successMessage, setsuccessMessage] = useState('')
    const [failedMessage, setfailedMessage] = useState('')
    const [unregisteredMessage, setunregisteredMessage] = useState('')
    const [allowSubmit, setallowSubmit] = useState(false)

    const fetchContactList = async () => {
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
        toast.error('Gagal fetch contact')
        console.log(await result?.text())
    }
    const fetchCampaign = async () => {
        const result = await fetchClient({
            url: '/campaigns/' + campaignId,
            method: 'GET',
            user: session?.user
        })
        if (result?.ok) {
            const resultData: CampaignTypes = await result.json()
            // setValue('name', resultData.name)
            // setValue('schedule', resultData.schedule)
            if (resultData.recipients[0] === ' all') {
                setisAllContact(true)
            }
            if (resultData.mediaPath) {
                getFileFromUrl(resultData.mediaPath, setfiles)
            }
            // else {
            //     setValue('recipients', resultData.recipients)
            // }
            // setValue('registrationSyntax', resultData.registrationSyntax)
            // setValue('unregistrationSyntax', resultData.unregistrationSyntax)
            setcampaignData(resultData)
            setregistrationMessage(resultData.registrationMessage)
            setunregisteredMessage(resultData.unregisteredMessage)
            setsuccessMessage(resultData.successMessage)
            setfailedMessage(resultData.failedMessage)
            return
        }
        if (result?.status === 404) {
            push(route('campaign'))
            return
        }
        toast.error('server error')
    }
    const onSubmit = async (data: CampaignTypes) => {
        const formData = new FormData()
        const delay = 4000
        // media
        if (files.length > 0) {
            // @ts-ignore
            formData.set('media', files[0].file, files[0].name)
        }
        formData.append('name', data.name)
        if (isAllContact) {
            formData.append('recipients[0]', 'all')
        } else if ((selectedReceiver as Set<string>).size > 0) {
            Array.from(selectedReceiver).forEach((element, idx) => {
                formData.append(`recipients[${idx}]`, element.toString())
            })
        }
        formData.append('registrationMessage', registrationMessage)
        formData.append('successMessage', successMessage)
        formData.append('failedMessage', failedMessage)
        formData.append('unregisteredMessage', unregisteredMessage)
        formData.append('registrationSyntax', data.registrationSyntax)
        formData.append('unregistrationSyntax', data.unregistrationSyntax)
        formData.append('schedule', formatDatetoISO8601(data.schedule))
        formData.append('delay', delay.toString())

        const result = await fetchClient({
            url: '/campaigns/' + campaignId,
            method: 'PUT',
            body: formData,
            isFormData: true,
            user: session?.user
        })

        if (result?.ok) {
            toast.success('Berhasil ubah campaign')
            push(route('campaign'))
        } else {
            toast.error('Gagal ubah campaign')
            if (result) {
                const response = await result.json()
                toast.error(response.message)
            }
        }
    }
    const filterContact = () => {
        if (searchText === '') return
        const lowerSearchText = searchText.toLowerCase()
        const newContact = listContact.filter(contact => {
            if (contact.firstName.toLowerCase().includes(lowerSearchText) || contact.lastName.toLowerCase().includes(lowerSearchText) || `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(lowerSearchText) || contact.phone.includes(lowerSearchText))
                return true
        })
        setsearchedListContact(newContact)
    }
    useEffect(() => {
        if (registrationMessage && successMessage && failedMessage && unregisteredMessage) {
            setallowSubmit(false)
        } else {
            setallowSubmit(true)
        }
    }, [successMessage, failedMessage, unregisteredMessage, registrationMessage])
    useEffect(() => {
        if (session?.user) {
            fetchContactList()
            fetchCampaign()
        }
    }, [session?.user])
    useEffect(() => {
        if (searchText)
            filterContact()

    }, [searchText])
    return (
        <>
            {
                campaignData && (
                    <form className='flex gap-4' onSubmit={handleSubmit(onSubmit)}>
                        <Card className='w-full max-w-sm flex flex-col gap-4 pt-4 pb-8'>
                            <div className="">
                                <label className="font-medium text-black dark:text-white">
                                    Nama Campaign
                                </label>
                                <Input variant='underlined'
                                    type="text"
                                    size='lg'
                                    defaultValue={campaignData.name}
                                    classNames={{
                                        inputWrapper: errors.name && 'border-danger'
                                    }}
                                    placeholder='masukkan nama campaign'
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
                                    defaultValue={(new Date(campaignData.schedule).toISOString().slice(0, 16))}
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
                                    isDisabled={isAllContact}
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
                                <Checkbox
                                    radius='none'
                                    className='mt-2'
                                    isSelected={isAllContact}
                                    onValueChange={setisAllContact}>
                                    Kirim ke semua kontak?
                                </Checkbox>
                            </div>
                            <div className="">
                                <label className="font-medium text-black dark:text-white">
                                    Registration Syntax
                                </label>
                                <Input variant='underlined'
                                    type="text"
                                    size='lg'
                                    placeholder='cth: #REG123'
                                    classNames={{
                                        inputWrapper: errors.schedule && 'border-danger'
                                    }}

                                    defaultValue={campaignData.registrationSyntax}
                                    color={errors.schedule ? "danger" : "default"}
                                    {...register('registrationSyntax', { required: true })} />
                            </div>
                            <div className="">
                                <label className="font-medium text-black dark:text-white">
                                    Unregistration Syntax
                                </label>
                                <Input variant='underlined'
                                    type="text"
                                    size='lg'
                                    placeholder='cth: #UNREG123'
                                    classNames={{
                                        inputWrapper: errors.schedule && 'border-danger'
                                    }}

                                    defaultValue={campaignData.unregistrationSyntax}
                                    color={errors.schedule ? "danger" : "default"}
                                    {...register('unregistrationSyntax', { required: true })} />
                            </div>
                        </Card>
                        <Card className='w-full flex flex-col gap-4 py-4'>
                            <Tabs aria-label="Options" variant="light" color="primary" radius="none"
                                selectedKey={currentMessage}
                                onSelectionChange={setcurrentMessage as any}>
                                <Tab key="registrationMessage" title="Subscribe" >
                                    <div>
                                        <label className="font-medium text-black dark:text-white">
                                            Pesan Registrasi Campaign
                                        </label>
                                        <Textarea
                                            radius='none'
                                            className='mt-2'
                                            variant='bordered'
                                            minRows={5}
                                            maxRows={7}
                                            placeholder='tuliskan pesan disini'
                                            value={registrationMessage}
                                            onChange={e => setregistrationMessage(e.target.value)}
                                        />
                                        <div className='mt-4'>
                                            <UploadFile
                                                files={files}
                                                setfiles={setfiles} />
                                        </div>
                                    </div>
                                </Tab>
                                <Tab key="successMessage" title="Success" >
                                    <div>
                                        <label className="font-medium text-black dark:text-white">
                                            Pesan Sukses Registrasi Campaign
                                        </label>
                                        <Textarea
                                            radius='none'
                                            className='mt-2'
                                            variant='bordered'
                                            minRows={5}
                                            maxRows={7}
                                            placeholder='tuliskan pesan disini'
                                            value={successMessage}
                                            onChange={e => setsuccessMessage(e.target.value)}
                                        />
                                    </div>
                                </Tab>
                                <Tab key="failedMessage" title="Failed" >
                                    <div>
                                        <label className="font-medium text-black dark:text-white">
                                            Pesan Gagal Registrasi Campaign
                                        </label>
                                        <Textarea
                                            radius='none'
                                            className='mt-2'
                                            variant='bordered'
                                            minRows={5}
                                            maxRows={7}
                                            placeholder='tuliskan pesan disini'
                                            value={failedMessage}
                                            onChange={e => setfailedMessage(e.target.value)}
                                        />
                                    </div>
                                </Tab>
                                <Tab key="unregisteredMessage" title="Unsubscribe" >
                                    <div>
                                        <label className="font-medium text-black dark:text-white">
                                            Pesan Unsubscribe Campaign
                                        </label>
                                        <Textarea
                                            radius='none'
                                            className='mt-2'
                                            variant='bordered'
                                            minRows={5}
                                            maxRows={7}
                                            placeholder='tuliskan pesan disini'
                                            value={unregisteredMessage}
                                            onChange={e => setunregisteredMessage(e.target.value)}
                                        />
                                    </div>
                                </Tab>
                            </Tabs>

                            <div className='flex justify-end'>
                                <Button
                                    isDisabled={allowSubmit}
                                    isLoading={isLoading} color='primary' radius='none' type='submit'>Ubah Campaign</Button>
                            </div>
                        </Card>
                    </form>
                )
            }
        </>
    )
}

export default EditCampaign