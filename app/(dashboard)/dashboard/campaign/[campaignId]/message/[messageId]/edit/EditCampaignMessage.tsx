'use client'
import Card from '@/components/Card'
import HeaderText from '@/components/Dashboard/HeaderText'
import UploadFile from '@/components/file/UploadFile'
import fetchClient from '@/helper/fetchClient'
import { getFileFromUrl } from '@/helper/fileHelper'
import { formatDatetoISO8601 } from '@/helper/utils'
import route from '@/routes'
import { CampaignMessageForm, CampaignMessageTypes, CampaignTypes } from '@/types'
import { Button, Breadcrumbs, BreadcrumbItem, Input, Select, Chip, SelectItem, Textarea } from '@nextui-org/react'
import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

interface Props {
    campaignId: string,
    messageId: string
}

const EditCampaignMessage: NextPage<Props> = ({ campaignId, messageId }) => {
    const { push } = useRouter()
    const { data: session } = useSession()
    const { formState: { errors }, register, handleSubmit, setValue } = useForm<CampaignMessageForm>()
    const [campaignData, setcampaignData] = useState<CampaignTypes>()
    const [files, setfiles] = useState<File[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [campaignMessageData, setcampaignMessageData] = useState<CampaignMessageTypes>()
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
            const resultData = await result.json()
            if (resultData.mediaPath) {
                getFileFromUrl(resultData.mediaPath, setfiles)
            }
            setcampaignMessageData(resultData)
            return
        }
        if (result?.status === 404) {
            toast.error("Pesan Campaign tidak ditemukan")
            push(`/dashboard/campaing/${campaignId}/message`)
            return
        }
        toast.error('Gagal fetch campaign message')
    }
    const onSubmit = async (data: CampaignMessageForm) => {
        setIsLoading(true)
        const formData = new FormData()
        const delay = 4000

        if (files.length > 0) {
            // @ts-ignore
            formData.set('media', files[0].file, files[0].name)
        }
        formData.append('name', data.name)
        formData.append('message', data.message)
        formData.append('campaignId', campaignId)
        formData.append('schedule', formatDatetoISO8601(data.schedule))
        formData.append('delay', delay.toString())
        const result = await fetchClient({
            url: '/campaigns/messages/' + campaignMessageData?.id,
            method: 'PUT',
            body: formData,
            isFormData: true,
            user: session?.user
        })
        if (result?.ok) {
            toast.success('Berhasil ubah campaign message!')
            push('/dashboard/campaign/' + campaignId + '/message')
        } else {
            toast.error('Gagal ubah campaign message')
        }
        setIsLoading(false)
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
    // useEffect(() => {
    //     if (campaignData && campaignMessageData) {
    //         setValue('name', campaignMessageData.name)
    //         setValue('schedule', (new Date(campaignMessageData.schedule).toISOString().slice(0, 16)))
    //         setValue('message', campaignMessageData.message)
    //     }
    // }, [campaignData, campaignMessageData])
    return (<>
        {campaignData && campaignMessageData && (<>

            <div className='flex flex-col lg:flex-row justify-between items-end mb-4'>
                <Button radius='none' variant={'faded'} as={Link} href={`/dashboard/campaign/${campaignId}/message`}>Kembali</Button>
                <Breadcrumbs
                    separator='/'
                    itemClasses={{
                        item: 'text-xs',
                        separator: "px-2"
                    }}>
                    <BreadcrumbItem href={route('dashboard')}>Dashboard</BreadcrumbItem>
                    <BreadcrumbItem href={route('campaign')}>Campaign</BreadcrumbItem>
                    <BreadcrumbItem href={`/dashboard/campaign/${campaignId}`}>Detail Campaign</BreadcrumbItem>
                    <BreadcrumbItem href={`/dashboard/campaign/${campaignId}/message`}>Pesan Campaign</BreadcrumbItem>
                    <BreadcrumbItem>Edit Pesan Campaign</BreadcrumbItem>
                </Breadcrumbs>
            </div>
            <HeaderText>{`Edit Pesan Campaign: ${campaignData?.name}`}</HeaderText>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 lg:flex-row'>
                <Card className='w-full max-w-sm flex flex-col gap-4 pt-4 pb-8'>
                    <div className="">
                        <label className="font-medium text-black dark:text-white">
                            Nama Pesan Campaign
                        </label>
                        <Input variant='underlined'
                            {...register('name', { required: true })}
                            type="text"
                            size='lg'
                            defaultValue={campaignMessageData?.name}
                            classNames={{
                                inputWrapper: errors.name && 'border-danger'
                            }}
                            placeholder='masukkan nama pesan campaign'
                            color={errors.name ? "danger" : "default"}
                        />
                    </div>
                    <div className="">
                        <label className="font-medium text-black dark:text-white">
                            Jadwal
                        </label>
                        <Input variant='underlined'
                            type="datetime-local"
                            size='lg'

                            defaultValue={(new Date(campaignMessageData.schedule).toISOString().slice(0, 16))}
                            classNames={{
                                inputWrapper: errors.schedule && 'border-danger'
                            }}
                            color={errors.schedule ? "danger" : "default"}
                            {...register('schedule', { required: true })} />
                    </div>
                    <div className="">
                        <label className="font-medium text-black dark:text-white">
                            Penerima <span className='text-xs font-light'>(tidak dapat diubah)</span>
                        </label>
                        <div className='flex gap-2'>
                            <Select
                                className='mt-4'
                                variant='underlined'
                                placeholder='nomor telepon penerima'
                                isDisabled
                                isMultiline
                                defaultSelectedKeys={campaignData?.recipients}
                                // items={campaignData.recipients}
                                renderValue={items => (
                                    <div className='flex gap-2 flex-wrap'>
                                        {items.map(item => (
                                            <Chip variant='faded' key={item.key}>{item.textValue}</Chip>
                                        ))}
                                    </div>
                                )}
                            >
                                {campaignData.recipients.map((e, idx) => (
                                    <SelectItem key={e} value={e}>
                                        {e}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                    </div>
                </Card>
                <Card className='w-full flex flex-col gap-4 py-4'>
                    <div>
                        <label className="font-medium text-black dark:text-white">
                            Pesan Campaign
                        </label>
                        <Textarea
                            radius='none'
                            className='mt-2'
                            variant='bordered'
                            defaultValue={campaignMessageData?.message}
                            minRows={5}
                            maxRows={7}
                            placeholder='tuliskan pesan disini'
                            {...register('message', { required: true })}
                        />
                        <div className='mt-4'>

                            <UploadFile
                                files={files}
                                setfiles={setfiles} />
                        </div>
                    </div>

                    <div className='flex justify-end'>
                        <Button
                            isLoading={isLoading} color='primary' radius='none' type='submit'>Edit Campaign</Button>
                    </div>
                </Card>
            </form>
        </>)}
    </>)
}

export default EditCampaignMessage