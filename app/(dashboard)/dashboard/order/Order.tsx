'use client'
import IconSearch from '@/components/assets/icons/search'
import fetchClient from '@/helper/fetchClient'
import { formatDate } from '@/helper/formatDate'
import { formatCurrencyIDR } from '@/helper/utils'
import route from '@/routes'
import { OrderDataTypes, OrderStatus, OrderTypes } from '@/types'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Selection, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface Props { }

const Order: NextPage<Props> = ({ }) => {
    const { push } = useRouter()
    const { data: session } = useSession()
    const [selectedOrder, setselectedOrder] = useState<Selection>(new Set([]))
    const [searchText, setSearchText] = useState('')
    const [searchedOrder, setsearchedOrder] = useState<OrderTypes[]>([])
    const [orderData, setorderData] = useState<OrderTypes[]>([])
    const fetchOrder = async () => {
        const result = await fetchClient({
            url: '/orders/',
            method: 'GET',
            user: session?.user
        })
        if (result?.ok) {
            setorderData(await result.json())
        } else {
            toast.error('Gagal fetch order')
            console.log(await result?.text())
        }
    }
    const printStatus = (status: OrderStatus) => {
        switch (status) {
            case 'COMPLETED':
                return (<p className='font-medium text-success'>{status}</p>)
            case 'PROCESSING':
                return (<p className='font-medium text-warning'>{status}</p>)
            case 'CANCELLED':
                return (<p className='font-medium text-danger'>{status}</p>)
            default:
                return (<p className='font-medium'>{status}</p>)
        }
    }
    const changeOrderStatus = async (order: OrderTypes, status: OrderStatus) => {
        if (!session?.user?.deviceId) {
            toast.error('Device belum terhubung')
            return
        }
        if (confirm(`Apa anda yakin ingin mengubah order ${order.name} menjadi ${status}?`)) {
            const result = await fetchClient({
                url: `/orders/${order.id}`,
                method: 'PATCH',
                body: JSON.stringify({ status }),
                user: session?.user
            })
            if (result?.ok) {
                toast.success('Berhasil ubah status order ' + order.name)
                fetchOrder()
            } else {
                toast.error('Gagal ubah status order ' + order.name)
                console.log(await result?.text())
            }
        }
    }
    const filterOrder = (text: string) => {
        const regex = new RegExp(text.toLowerCase(), 'i')
        return orderData.filter(item => (regex.test(item.name) || regex.test(item.status.toLowerCase()) || regex.test(item.phoneNumber)))
    }
    useEffect(() => {
        if (session?.user) {
            fetchOrder()
        }
    }, [session?.user])
    useEffect(() => {
        if (searchText) {
            const searchResult = filterOrder(searchText)
            setsearchedOrder(searchResult)
        }
    }, [searchText])
    return (<>
        <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark flex justify-between w-full py-3 px-7.5 items-center'>
            <div className='relative max-w-sm w-full'>
                <Input
                    type='text'
                    className='w-full'
                    variant='underlined'
                    placeholder='cari product'
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)} />
                <div className='absolute top-1/2 -translate-y-1/2 right-4'>
                    <IconSearch />
                </div>
            </div>
            {((selectedOrder as Set<string>).size > 0 || selectedOrder === 'all') ? (<>
                {/* <Button variant="light" radius="none" color="danger" onClick={() => setdeleteModal(!deleteModal)}>Hapus Produk</Button> */}
            </>) : (<>
                {/* <Button as={Link} href={route('create.product')} variant='light' color='primary' radius='none'>Buat Product</Button> */}
            </>)}

        </div>
        <Table
            aria-label="Product"
            color='default'
            // selectionMode="multiple"
            aria-labelledby='product table'
            isHeaderSticky
            className='mt-4'
            classNames={{
                wrapper: 'max-w-full overflow-x-scroll dark:bg-boxdark allowed-scroll',
            }}
            radius='none'
        >
            <TableHeader>
                <TableColumn>Nama</TableColumn>
                <TableColumn>Status</TableColumn>
                <TableColumn>Nomor</TableColumn>
                <TableColumn>Order</TableColumn>
                <TableColumn>Total Harga</TableColumn>
                <TableColumn>Notes</TableColumn>
                <TableColumn>Aksi</TableColumn>
                <TableColumn>Detail</TableColumn>
            </TableHeader>
            <TableBody emptyContent={<div className='w-full p-12'>
                <div className='w-full max-w-md mx-auto flex flex-col gap-4'>
                    <p className='text-[16px] font-bold'>Order masih kosong</p>
                </div>
            </div>}
                items={searchText ? searchedOrder : orderData}>
                {(item) => (
                    <TableRow key={item.id}>
                        <TableCell >{item.name}</TableCell>
                        <TableCell >{printStatus(item.status)}</TableCell>
                        <TableCell>{item.phoneNumber}</TableCell>
                        <TableCell>
                            <table className='border-separate border-spacing-1'>
                                <tbody>
                                    {item.OrderProduct.map(prod => (<>
                                        <tr>
                                            <th className='font-medium'>{prod.product.name}</th>
                                            <td>{prod.quantity}x</td>
                                        </tr>
                                    </>))}
                                </tbody>
                            </table>
                        </TableCell>
                        <TableCell>
                            {formatCurrencyIDR(item.total)}
                        </TableCell>
                        <TableCell>
                            {item.notes || '-'}
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <Button as={Link} href={'/dashboard/messenger?phone=' + item.phoneNumber} radius='none' size='sm'>
                                    Chat
                                </Button>
                                <Dropdown >
                                    <DropdownTrigger>
                                        <Button
                                            size='sm'
                                            radius='none'
                                            color='primary'
                                            isDisabled={item.status === 'CANCELLED' || item.status === 'COMPLETED'}
                                        >
                                            Ubah Status
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu aria-label="Static Actions" className='font-medium'
                                        onAction={key => changeOrderStatus(item, (key as OrderStatus))}>
                                        <DropdownItem key="PROCESSING" color='warning'>PROCESSING</DropdownItem>
                                        <DropdownItem key="DELIVERED"
                                            color='success'>DELIVERED</DropdownItem>
                                        <DropdownItem key="COMPLETED" color='primary'>COMPLETED</DropdownItem>

                                        <DropdownItem key="CANCELLED" color='danger'>CANCELLED</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                                {/* <Button
                                    radius='none'
                                    color='danger'
                                    size='sm'
                                    onClick={() => handleCancelOrder(item)}>
                                    Batal
                                </Button> */}
                            </div>
                        </TableCell>
                        <TableCell>
                            <Button radius='none' variant='bordered' onClick={() => push('/dashboard/order/' + item.id)}>
                                Detail
                            </Button>
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    </>)
}

export default Order