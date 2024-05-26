import ModalTemplate from '@/components/ModalTemplate'
import { genderOpt } from '@/helper/constants'
import fetchClient from '@/helper/fetchClient'
import { ContactForm, ContactTypes } from '@/types'
import { Button, Input, Select, SelectItem } from '@nextui-org/react'
import { NextPage } from 'next'
import { User } from 'next-auth'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

interface Props {
    contact: ContactTypes,
    openModal: boolean,
    setopenModal: Dispatch<SetStateAction<boolean>>,
    user?: User,
    refresh: () => void
}

const EditContactModal: NextPage<Props> = ({ contact, user, refresh, openModal, setopenModal }) => {
    const { register, formState: { errors }, handleSubmit, setValue } = useForm<ContactForm>({})
    const [isLoading, setIsLoading] = useState(false)
    const onSubmit = async (data: ContactForm) => {
        setIsLoading(true)
        if (!user || !user.deviceId) {
            toast.error('WhatsApp belum terkoneksi')
            return
        }
        data.phone = '62' + data.phone
        const result = await fetchClient({
            url: "/contacts/" + contact.id,
            method: "PUT",
            user: user,
            body: JSON.stringify({ ...data, deviceId: user.deviceId })
        })
        if (result?.ok) {
            toast.success('Ubah kontak berhasil')
            setopenModal(false)
            refresh()
        } else {
            toast.error('Gagal ubah kontak')
        }
        setIsLoading(false)
    }

    return <ModalTemplate
        openModal={openModal}
        setopenModal={setopenModal}
        outsideClose={false}
        title='Edit Kontak'
    >
        <form className='flex flex-col gap-4 w-full' onSubmit={handleSubmit(onSubmit)}>
            <div className="">
                <label className="font-medium text-black dark:text-white">
                    First name <span className='text-danger'>*</span>
                </label>
                <Input variant='underlined'
                    type="text"
                    size='lg'
                    defaultValue={contact.firstName}
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
                    defaultValue={contact.lastName}
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

                        defaultValue={contact.phone.slice(2)}
                        classNames={{
                            inputWrapper: errors.phone && 'border-danger'
                        }}
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

                    defaultValue={contact.email}
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
                    defaultSelectedKeys={[contact.gender]}
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
                Edit Kontak
            </Button>

        </form>
    </ModalTemplate>
}

export default EditContactModal