import ModalTemplate from '@/components/ModalTemplate'
import fetchClient from '@/helper/fetchClient'
import { MessengerList, OrderDataTypes, ProductData } from '@/types'
import { Button, Checkbox, Input, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Textarea, Selection } from '@nextui-org/react'
import { NextPage } from 'next'
import { User } from 'next-auth'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface Props {
    openModal: boolean,
    setopenModal: Dispatch<SetStateAction<boolean>>,
    user?: User,
    messenger: MessengerList
}

const OrderModal: NextPage<Props> = ({ openModal, setopenModal, user, messenger }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [orderText, setOrderText] = useState('')
    const [orderName, setorderName] = useState('')
    const [orderData, setorderData] = useState<OrderDataTypes[]>([])
    const [selectedOrderData, setselectedOrderData] = useState<Selection>()
    const [productList, setproductList] = useState<ProductData[]>([])
    const [selectedProduct, setselectedProduct] = useState<Selection>(new Set([]))
    const [selectedQuantity, setselectedQuantity] = useState<string>('')
    const createOrder = async () => {
        setIsLoading(true)
        if (!orderName) {
            toast.error('Nama tidak bisa kosong')
            setIsLoading(false)
            return
        }
        const result = await fetchClient({
            url: '/orders',
            method: 'POST',
            body: JSON.stringify({
                name: orderName,
                phone: messenger.phone,
                deviceId: user?.deviceId,
                notes: orderText,
                orders: orderData.map(order => ({
                    productId: order.productId,
                    quantity: order.quantity
                }))
            }),
            user: user
        })
        if (result?.ok) {
            toast.success('Order berhasil dibuat')
            setopenModal(false)
        } else {
            toast.error('Gagal buat order')
            console.log(await result?.text())
        }
        setIsLoading(false)

    }
    const fetchProduct = async () => {
        const result = await fetchClient({
            url: '/products',
            method: 'GET',
            user: user
        })
        if (result?.ok) {
            const resultData = await result.json()
            setproductList(resultData)
        } else {
            console.log(await result?.text())
            toast.error('Gagal fetch product')
        }
    }
    const addOrder = () => {
        let newArr
        const arr = Array.from(selectedProduct)[0]
        if (!arr) return
        const selected = arr.toString()
        //    if exist
        console.log('selected', selected)

        const isExist = orderData.findIndex(order => order.productId === selected)
        console.log(isExist)
        if (isExist >= 0) {
            newArr = orderData
            newArr[isExist].quantity += parseInt(selectedQuantity)
            setorderData(newArr)
        } else {
            const findProduct = productList.find(product => product.id === selected)
            newArr = orderData.push({
                productId: selected,
                checked: false,
                productName: findProduct ? findProduct.name : '',
                quantity: parseInt(selectedQuantity)
            })
        }
        setselectedQuantity('')
        setselectedProduct(new Set([]))
    }
    const deleteOrder = () => {
        if (selectedOrderData === 'all') {
            setorderData([])
        } else {
            const arrSelected = Array.from(selectedOrderData as Set<string>)

            const newArr = orderData.filter(order => !arrSelected.find(arr => arr === order.productId))
            setorderData(newArr)
        }
        setselectedOrderData(new Set())
    }
    useEffect(() => {
        if (messenger.contact) {
            setorderName(`${messenger.contact.firstName} ${messenger.contact.lastName || ''}`)
        }
    }, [messenger])
    useEffect(() => {
        fetchProduct()
    }, [])

    return (
        <ModalTemplate
            openModal={openModal}
            setopenModal={setopenModal}
            outsideClose={false}
            title='Buat Order'
        >
            <div className='flex flex-col gap-4 w-full'>
                <div className="">
                    <label className="font-medium text-black dark:text-white">
                        Name <span className='text-danger'>*</span>
                    </label>
                    <Input variant='underlined'
                        type="text"
                        size='lg'
                        value={orderName}
                        onChange={e => setorderName(e.target.value)}
                        isDisabled={!!messenger.contact}
                    />
                </div>
            </div>
            <div className='flex flex-col gap-4 w-full'>
                <div className="">
                    <label className="font-medium text-black dark:text-white">
                        Phone <span className='text-danger'>*</span>
                    </label>
                    <Input variant='underlined'
                        type="text"
                        size='lg'
                        value={messenger.phone}
                        isDisabled
                    />
                </div>
            </div>
            <div className='flex flex-col gap-4 w-full'>
                <div className="">
                    <div className='flex justify-between'>

                        <label className="font-medium text-black dark:text-white">
                            Order <span className='text-danger'>*</span>
                        </label>
                        {(selectedOrderData === 'all' || (selectedOrderData as Set<string>)?.size > 0) ? (
                            <Button
                                variant='light'
                                radius='none'
                                size='sm'
                                color='danger'
                                onClick={deleteOrder}>Hapus Order</Button>
                        ) : (

                            <Button
                                variant='light'
                                radius='none'
                                size='sm'
                                color='primary'
                                isDisabled={(Array.from(selectedProduct).length > 0 && !selectedQuantity)}
                                onClick={addOrder}>Tambah Order</Button>
                        )}
                    </div>
                    {/* {orderData.map(order => (
                    <div className='flex'>
                        <Checkbox isSelected={orderData[order.id].checked} onClick={() => {
                            const newArr = orderData.map(data => {
                                if(data.id)
                            })
                        }}/>

                    </div>
                   ))} */}
                    <div className='flex gap-4'>
                        <Select
                            items={productList}
                            fullWidth
                            variant='underlined'
                            selectionMode='single'
                            selectedKeys={selectedProduct}
                            onSelectionChange={setselectedProduct}
                        >
                            {product => (
                                <SelectItem key={product.id}>{product.name}</SelectItem>
                            )}
                        </Select>
                        <Input
                            variant='underlined'
                            className='w-24'
                            value={selectedQuantity.toString()}
                            onChange={e => setselectedQuantity(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    addOrder()
                                }
                            }}
                            type='number' />
                    </div>
                    <Table
                        // hideHeader
                        aria-label="Order table"
                        removeWrapper
                        className='mt-4'
                        selectionMode='multiple'
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
                            items={orderData}>
                            {item => (
                                <TableRow key={item.productId}>
                                    <TableCell
                                        className='w-full'>
                                        {item.productName}
                                    </TableCell>
                                    <TableCell>
                                        {item.quantity}
                                    </TableCell>
                                </TableRow>
                            )}


                        </TableBody>
                    </Table>
                    <Textarea
                        rows={3}
                        variant='bordered'
                        className='mt-4'
                        value={orderText}
                        placeholder='note tambahan'
                        onChange={e => setOrderText(e.target.value)}
                    />
                </div>
            </div>
            <div className='flex gap-4 w-full'>
                <Button
                    color='default'
                    fullWidth>Tutup</Button>
                <Button
                    color='primary'
                    isLoading={isLoading}
                    onClick={createOrder}
                    fullWidth>Buat</Button>
            </div>
        </ModalTemplate>
    )
}

export default OrderModal