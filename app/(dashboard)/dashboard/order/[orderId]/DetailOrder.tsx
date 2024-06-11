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
    useEffect(() => {
        if (session?.user) {
            fetchDetailOrder()
        }
    }, [session?.user])
    return <>
        <Button className='mb-4' radius='none' variant={'faded'} as={Link} href={route('order')}>Kembali</Button>
        {orderData && (<>
            <HeaderText>{`Order: ${orderData.name}`}</HeaderText>
            <div className='flex gap-4' >
                <Card className='w-full max-w-sm flex flex-col gap-4 pt-4 pb-8'>
                    <div className="">
                        <label className="font-medium text-black dark:text-white">
                            Nama Order
                        </label>
                        <div className='my-2 font-medium'>
                            {orderData.name}
                        </div>
                    </div>
                    <div className="">
                        <label className="font-medium text-black dark:text-white">
                            Nomor
                        </label>
                        <div className='my-2 font-medium'>
                            {orderData.phoneNumber}
                        </div>

                    </div>
                    <div className="">
                        <label className="font-medium text-black dark:text-white">
                            Status
                        </label>


                        <div className='my-2 font-medium'>
                            {orderData.status}
                        </div>
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
                </Card>
            </div>
        </>
        )}
    </>
}

export default DetailOrder