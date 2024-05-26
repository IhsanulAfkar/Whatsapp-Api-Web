'use client'
import UploadFile from '@/components/file/UploadFile';
import Card from '@/components/Card'
import { Button, Input, Textarea } from '@nextui-org/react';
import { NextPage } from 'next'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import fetchClient from '@/helper/fetchClient';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import route from '@/routes';
import { ProductForm } from '@/types';

interface Props { }

const CreateProduct: NextPage<Props> = ({ }) => {
    const { push } = useRouter()
    const { data: session } = useSession()
    const { register, formState: { errors }, handleSubmit, setValue } = useForm<ProductForm>()
    const [files, setfiles] = useState<File[]>([])
    const [isLoading, setisLoading] = useState(false)
    const onSubmit = async (data: ProductForm) => {
        try {
            setisLoading(true)
            const formData = new FormData()
            if (files.length > 0) {
                // @ts-ignore
                formData.set('media', files[0].file, files[0].name)
            }
            formData.append('name', data.name)
            formData.append('description', data.description)
            formData.append('price', data.price.toString())
            formData.append('amount', data.amount.toString())
            const result = await fetchClient({
                url: '/products/create',
                method: 'POST',
                isFormData: true,
                body: formData,
                user: session?.user
            })
            if (result?.ok) {
                toast.success('Berhasil buat produk')
                push(route('product'))
            }

        } catch (error) {
            console.log(error)
            toast.error('Gagal buat produk')
        }
        setisLoading(false)
    }
    return (<>
        <form className='flex gap-4' onSubmit={handleSubmit(onSubmit)}>
            <Card className='w-full max-w-sm flex flex-col gap-4 pt-4 pb-8'>
                <div className="">
                    <label className="font-medium text-black dark:text-white">
                        Nama Produk
                    </label>
                    <Input variant='underlined'
                        type="text"
                        size='lg'
                        classNames={{
                            inputWrapper: errors.name && 'border-danger'
                        }}
                        placeholder='masukkan nama produk'
                        color={errors.name ? "danger" : "default"}
                        {...register('name', { required: true })} />
                </div>
                <div className="">
                    <label className="font-medium text-black dark:text-white">
                        Harga
                    </label>
                    <Input variant='underlined'
                        type="number"
                        size='lg'
                        classNames={{
                            inputWrapper: errors.price && 'border-danger'
                        }}
                        color={errors.price ? "danger" : "default"}
                        {...register('price', { required: true })} />
                </div>
                <div className="">
                    <label className="font-medium text-black dark:text-white">
                        Jumlah
                    </label>
                    <Input variant='underlined'
                        type="number"
                        size='lg'
                        classNames={{
                            inputWrapper: errors.amount && 'border-danger'
                        }}
                        color={errors.amount ? "danger" : "default"}
                        {...register('amount', { required: true })} />
                </div>
            </Card>
            <Card className='w-full flex flex-col gap-4 py-4'>
                <div>
                    <label className="font-medium text-black dark:text-white">
                        Deskripsi Produk
                    </label>
                    <Textarea
                        radius='none'
                        className='mt-2'
                        variant='bordered'
                        minRows={5}
                        maxRows={7}
                        placeholder='tuliskan deskripsi produk disini'
                        {...register('description')}
                    // value={ProductText}
                    // onChange={e => setProductText(e.target.value)}
                    />
                    <div className='mt-4'>
                        <UploadFile
                            files={files}
                            setfiles={setfiles} />
                    </div>
                </div>
                <div className='flex justify-end'>
                    <Button isLoading={isLoading} color='primary' radius='none' type='submit'>Tambah Produk</Button>
                </div>
            </Card>
        </form>
    </>)
}

export default CreateProduct