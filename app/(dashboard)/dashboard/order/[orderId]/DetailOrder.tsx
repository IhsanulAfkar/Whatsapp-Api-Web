'use client'
import Card from '@/components/Card'
import HeaderText from '@/components/Dashboard/HeaderText'
import fetchClient from '@/helper/fetchClient'
import { formatCurrencyIDR } from '@/helper/utils'
import route from '@/routes'
import { OrderStatus, OrderTypes } from '@/types'
import { Button, Input, Select, Selection, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

interface Props {
    orderId: string
}

const DetailOrder: NextPage<Props> = ({ orderId }) => {
    const { push } = useRouter()
    const { register, formState: { errors }, handleSubmit, setValue } = useForm<OrderTypes>()
    const { data: session } = useSession()
    const [isLoading, setisLoading] = useState(false)
    const [orderData, setorderData] = useState<OrderTypes>()
    const [isEdit, setIsEdit] = useState(false)
    const [selectedOrderData, setselectedOrderData] = useState<Selection>()
    const fetchDetailOrder = async () => {
        const result = await fetchClient({
            url: `/orders/${orderId}`,
            method: 'GET',
            user: session?.user
        })
        if (result?.ok) {
            setorderData(await result.json())
        } else {
            toast.error('Order tidak ada')
            push(route('order'))
        }
    }
    const onSubmit = async (data: OrderTypes) => {
        setisLoading(true)

        setisLoading(false)
    }
    useEffect(() => {
        if (session?.user) {
            fetchDetailOrder()
        }
    }, [session?.user])
    const statusOpt: { id: number, status: OrderStatus }[] = [
        {
            id: 1,
            status: 'PROCESSING'
        },
        {
            id: 2,
            status: 'DELIVERED'
        },
        {
            id: 3,
            status: 'COMPLETED'
        },
    ]
    const cancelledOpt = [{
        id: 1,
        status: 'CANCELLED'
    }]
    return <>
        <Button className='mb-4' radius='none' variant={'faded'} as={Link} href={route('order')}>Kembali</Button>
        {orderData && (<>
            <HeaderText>{`Order: ${orderData.name}`}</HeaderText>
            <form className='flex gap-4' onSubmit={handleSubmit(onSubmit)}>
                <Card className='w-full max-w-sm flex flex-col gap-4 pt-4 pb-8'>
                    <div className="">
                        <label className="font-medium text-black dark:text-white">
                            Nama Order
                        </label>
                        {isEdit ? (
                            <Input variant='underlined'
                                type="text"
                                size='lg'
                                classNames={{
                                    inputWrapper: errors.name && 'border-danger'
                                }}
                                defaultValue={orderData.name}
                                placeholder='masukkan nama produk'
                                color={errors.name ? "danger" : "default"}
                                {...register('name', { required: true })} />
                        ) : (
                            <div className='my-2 font-medium'>
                                {orderData.name}
                            </div>
                        )}
                    </div>
                    <div className="">
                        <label className="font-medium text-black dark:text-white">
                            Nomor
                        </label>
                        {isEdit ? (
                            <Input variant='underlined'
                                type="string"
                                size='lg'
                                defaultValue={orderData.phoneNumber}
                                classNames={{
                                    inputWrapper: errors.phoneNumber && 'border-danger'
                                }}
                                color={errors.phoneNumber ? "danger" : "default"}
                                {...register('phoneNumber', {
                                    required: true
                                })} />
                        ) : (
                            <div className='my-2 font-medium'>
                                {orderData.phoneNumber}
                            </div>
                        )}
                    </div>
                    <div className="">
                        <label className="font-medium text-black dark:text-white">
                            Status
                        </label>

                        {isEdit ? (
                            <Select variant='underlined'
                                size='lg'
                                // defaultValue={orderData.status}
                                defaultSelectedKeys={[orderData.status]}
                                selectionMode='single'
                                items={orderData.status === 'CANCELLED' ? cancelledOpt : statusOpt}
                                color={errors.status ? "danger" : "default"}
                                isDisabled={orderData.status === 'CANCELLED'}
                                {...register('status', {
                                    required: true,
                                })} >
                                {item => <SelectItem key={item.status}>{item.status}</SelectItem>
                                }
                            </Select>
                        ) : (
                            <div className='my-2 font-medium'>
                                {orderData.status}
                            </div>
                        )}
                    </div>
                </Card>
                <Card className='w-full flex flex-col justify-between gap-4 py-4'>
                    <div>
                        <label className="font-medium text-black dark:text-white">
                            Deskripsi Order
                        </label>
                        <Table
                            // hideHeader
                            aria-label="Order table"
                            removeWrapper
                            className='mt-4'
                            selectionMode={isEdit ? 'multiple' : 'none'}
                            selectedKeys={selectedOrderData}
                            onSelectionChange={setselectedOrderData}
                        >
                            <TableHeader>
                                <TableColumn>Produk</TableColumn>
                                <TableColumn>Jumlah</TableColumn>
                            </TableHeader>
                            <TableBody
                                emptyContent={<div className='w-full p-12'>
                                    <div className='w-full max-w-md mx-auto flex flex-col gap-4'>
                                        <p className='text-[16px] font-bold'>Order masih kosong</p>
                                    </div>
                                </div>}
                                items={orderData.OrderProduct}>
                                {item => (
                                    <TableRow key={item.productId}>
                                        <TableCell
                                            className='w-full'>
                                            {item.product.name}
                                        </TableCell>
                                        <TableCell>
                                            {item.quantity}
                                        </TableCell>
                                    </TableRow>
                                )}


                            </TableBody>
                        </Table>

                    </div>
                    <div className='flex justify-end'>
                        {!isEdit && <Button id='edit' color='primary' radius='none' onClick={() => setIsEdit(true)}>Edit Order</Button>}
                        {
                            isEdit && <Button id='save' color='primary' radius='none' type='submit' isLoading={isLoading}>Simpan</Button>
                        }
                    </div>
                </Card>
            </form>
        </>
        )}
    </>
}

export default DetailOrder