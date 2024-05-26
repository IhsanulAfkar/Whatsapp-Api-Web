'use client'
import Card from '@/components/Card'
import HeaderText from '@/components/Dashboard/HeaderText'
import DisplayImage from '@/components/file/DisplayImage'
import UploadFile from '@/components/file/UploadFile'
import fetchClient from '@/helper/fetchClient'
import { getFileFromUrl } from '@/helper/fileHelper'
import { formatCurrencyIDR } from '@/helper/utils'
import route from '@/routes'
import { ProductData, ProductForm } from '@/types'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Popover, PopoverContent, PopoverTrigger, Textarea } from '@nextui-org/react'
import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

interface Props {
    productId: string
}

const DetailProduct: NextPage<Props> = ({ productId }) => {
    const { push, refresh } = useRouter()
    const { data: session } = useSession()
    const { register, formState: { errors }, handleSubmit, setValue } = useForm<ProductForm>()
    const [product, setproduct] = useState<ProductData>()
    const [files, setfiles] = useState<File[]>([])
    const [isLoading, setisLoading] = useState(false)
    const [isEdit, setisEdit] = useState(false)
    const fetchProduct = async () => {
        const result = await fetchClient({
            url: '/products/' + productId,
            method: 'GET',
            user: session?.user
        })
        if (result?.ok) {
            const resultData = await result.json()
            if (resultData.media) {
                getFileFromUrl(resultData.media, setfiles)
            }
            setproduct(resultData)
            return
        }
        if (result?.status === 404) {
            toast.error('Produk tidak ditemukan')
            push(route('product'))
            return
        }
        toast.error('Server Error')
        console.log(await result?.text())
    }
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
                url: `/products/${productId}/edit`,
                method: 'PUT',
                isFormData: true,
                body: formData,
                user: session?.user
            })
            if (result?.ok) {
                toast.success('Berhasil ubah produk')
                window.location.reload()
                // push(route('product'))
            }

        } catch (error) {
            console.log(error)
            toast.error('Gagal buat produk')
        }
        setisLoading(false)
    }

    useEffect(() => {
        if (session?.user) {
            fetchProduct()
        }
    }, [session?.user])

    return (<>
        <Button className='mb-4' radius='none' variant={'faded'} as={Link} href={route('product')}>Kembali</Button>
        {product && (<>
            <HeaderText>{`Produk: ${product.name}`}</HeaderText>
            <form className='flex gap-4' onSubmit={handleSubmit(onSubmit)}>
                <Card className='w-full max-w-sm flex flex-col gap-4 pt-4 pb-8'>
                    <div className="">
                        <label className="font-medium text-black dark:text-white">
                            Nama Produk
                        </label>
                        {isEdit ? (
                            <Input variant='underlined'
                                type="text"
                                size='lg'
                                classNames={{
                                    inputWrapper: errors.name && 'border-danger'
                                }}
                                defaultValue={product.name}
                                placeholder='masukkan nama produk'
                                color={errors.name ? "danger" : "default"}
                                {...register('name', { required: true })} />
                        ) : (
                            <div className='my-2 font-medium'>
                                {product.name}
                            </div>
                        )}
                    </div>
                    <div className="">
                        <label className="font-medium text-black dark:text-white">
                            Harga
                        </label>
                        {isEdit ? (
                            <Input variant='underlined'
                                type="number"
                                size='lg'
                                defaultValue={product.price.toString()}
                                classNames={{
                                    inputWrapper: errors.price && 'border-danger'
                                }}
                                color={errors.price ? "danger" : "default"}
                                {...register('price', {
                                    required: true
                                })} />
                        ) : (
                            <div className='my-2 font-medium'>
                                {formatCurrencyIDR(product.price)}
                            </div>
                        )}
                    </div>
                    <div className="">
                        <label className="font-medium text-black dark:text-white">
                            Jumlah
                        </label>

                        {isEdit ? (

                            <Input variant='underlined'
                                type="number"
                                size='lg'
                                defaultValue={product.amount.toString()}
                                classNames={{
                                    inputWrapper: errors.amount && 'border-danger'
                                }}
                                color={errors.amount ? "danger" : "default"}
                                {...register('amount', {
                                    required: true,
                                    value: product.amount
                                })} />
                        ) : (
                            <div className='my-2 font-medium'>
                                {product.amount}
                            </div>
                        )}
                    </div>
                </Card>
                <Card className='w-full flex flex-col justify-between gap-4 py-4'>
                    <div>
                        <label className="font-medium text-black dark:text-white">
                            Deskripsi Produk
                        </label>
                        {isEdit ? (

                            <Textarea
                                radius='none'
                                className='mt-2'
                                variant='bordered'
                                minRows={5}
                                maxRows={7}
                                placeholder='tuliskan deskripsi produk disini'
                                defaultValue={product.description}
                                {...register('description', {
                                    value: product.description
                                })}
                            />
                        ) : (
                            <div className='my-2 font-medium'>
                                {product.description}
                            </div>
                        )}
                        <div className='mt-4'>
                            {isEdit ? (
                                <UploadFile
                                    files={files}
                                    setfiles={setfiles} />
                            ) : (<>
                                {product.media &&
                                    <DisplayImage imageUrl={product.media} />
                                }
                            </>
                            )}
                        </div>
                    </div>
                    <div className='flex justify-end'>
                        {!isEdit && <Button id='edit' color='primary' radius='none' onClick={() => setisEdit(true)}>Edit Produk</Button>}
                        {
                            isEdit && <Button id='save' color='primary' radius='none' type='submit' isLoading={isLoading}>Simpan</Button>
                        }
                    </div>
                </Card>
            </form>
        </>
        )}
    </>)
}

export default DetailProduct