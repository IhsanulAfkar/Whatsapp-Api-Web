import ModalTemplate from '@/components/ModalTemplate'
import { genderOpt } from '@/helper/constants'
import fetchClient from '@/helper/fetchClient'
import { ContactForm, MessengerList } from '@/types'
import { Button, Input, Select, SelectItem } from '@nextui-org/react'
import { NextPage } from 'next'
import { User } from 'next-auth'
import { useRouter } from 'next/navigation'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

interface Props {
    openModal: boolean,
    setopenModal: Dispatch<SetStateAction<boolean>>,
    user?: User,
    messenger: MessengerList
}

const AddContactModal: NextPage<Props> = ({ messenger, openModal, setopenModal, user }) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const { register, formState: { errors }, handleSubmit } = useForm<ContactForm>()
    const onSubmit = async (data: ContactForm) => {
        setIsLoading(true)
        if (!user || !user.deviceId) {
            toast.error('WhatsApp belum terkoneksi')
            return
        }
        data.phone = '62' + data.phone
        const createContact = await fetchClient({
            url: "/contacts/create",
            method: "POST",
            user: user,
            body: JSON.stringify({ ...data, deviceId: user.deviceId })
        })
        if (!createContact?.ok) {
            toast.error('Buat kontak gagal')
            return
        }
        toast.success('Buat kontak berhasil')
        router.refresh()
        setIsLoading(false)
        setopenModal(false)
    }

    return <>
        <ModalTemplate
            openModal={openModal}
            setopenModal={setopenModal}
            outsideClose={false}
            title='Tambah Kontak'
        >
            <form className='flex flex-col gap-4 w-full' onSubmit={handleSubmit(onSubmit)}>
                <div className="">
                    <label className="font-medium text-black dark:text-white">
                        First name <span className='text-danger'>*</span>
                    </label>
                    <Input variant='underlined'
                        type="text"
                        size='lg'
                        classNames={{
                            inputWrapper: errors.firstName && 'border-danger'
                        }}
                        placeholder='enter first name'
                        color={errors.firstName ? "danger" : "default"}
                        {...register('firstName', { required: true })} />
                </div>
                <div className="">
                    <label className="font-medium text-black dark:text-white">
                        Last name
                    </label>
                    <Input variant='underlined'
                        type="text"
                        size='lg'
                        classNames={{
                            inputWrapper: errors.lastName && 'border-danger'
                        }}
                        placeholder='enter first name'
                        color={errors.lastName ? "danger" : "default"}
                        {...register('lastName')} />
                </div>
                <div className="">
                    <label className="font-medium text-black dark:text-white">
                        Nomor Hp <span className='text-danger'>*</span>
                    </label>
                    <div className="relative flex">
                        <p className='absolute left-1 top-2'>+62</p>
                        <Input variant='underlined'
                            type="number"
                            size='lg'
                            className='pl-10'
                            classNames={{
                                inputWrapper: errors.phone && 'border-danger'
                            }}
                            defaultValue={messenger.phone.substring(2)}
                            placeholder='Enter phone number'
                            color={errors.phone ? "danger" : "default"}
                            {...register('phone', {
                                required: 'Required',
                                pattern: /^[0-9]+$/
                            })} />
                    </div>
                </div>
                <div className="">
                    <label className="font-medium text-black dark:text-white">
                        Email
                    </label>
                    <Input variant='underlined'
                        type="text"
                        size='lg'
                        classNames={{
                            inputWrapper: errors.email && 'border-danger'
                        }}
                        placeholder='enter first name'
                        color={errors.email ? "danger" : "default"}
                        {...register('email')} />
                </div>
                <div className="">
                    <label className="font-medium text-black dark:text-white">
                        Gender
                    </label>
                    <Select
                        variant='underlined'
                        className='w-full'
                        defaultSelectedKeys={['other']}
                        {...register('gender')}
                    >
                        {genderOpt.map(gender => (
                            <SelectItem key={gender.value} value={gender.value}>{gender.label}</SelectItem>
                        ))}
                    </Select>
                </div>
                <Button
                    type='submit'
                    fullWidth
                    isLoading={isLoading}
                    color="primary">
                    Buat Kontak
                </Button>

            </form>
        </ModalTemplate>
    </>
}

export default AddContactModal