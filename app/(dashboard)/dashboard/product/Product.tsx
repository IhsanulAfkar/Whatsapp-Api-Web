'use client'
import IconSearch from '@/components/assets/icons/search'
import fetchClient from '@/helper/fetchClient'
import { formatDate } from '@/helper/formatDate'
import route from '@/routes'
import { ProductData, SelectedKeyState } from '@/types'
import { Button, Input, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import DeleteProductModal from './DeleteProductModal'

interface Props { }

const Product: NextPage<Props> = ({ }) => {
    const { push } = useRouter()
    const { data: session } = useSession()
    const [searchText, setSearchText] = useState('')
    const [deleteModal, setdeleteModal] = useState(false)
    const [searchedProduct, setsearchedProduct] = useState<ProductData[]>([])
    const [productData, setproductData] = useState<ProductData[]>([])
    const fetchProduct = async () => {
        const result = await fetchClient({
            url: '/products',
            method: 'GET',
            user: session?.user
        })
        if (result?.ok) {
            const resultData = await result.json()
            setproductData(resultData)
        } else {
            console.log(await result?.text())
            toast.error('Gagal fetch product')
        }
    }

    const filterProduct = (text: string) => {
        const regex = new RegExp(text.toLowerCase(), 'i')
        return productData.filter(item => (regex.test(item.name) || regex.test(item.description) || regex.test(item.game.toLowerCase())))
    }
    useEffect(() => {
        if (session?.user) {
            fetchProduct()
        }
    }, [session?.user])
    useEffect(() => {
        if (searchText) {
            const searchResult = filterProduct(searchText)
            setsearchedProduct(searchResult)
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
        </div>
        <Table
            aria-label="Product"
            color='default'
            selectionMode="none"
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
                <TableColumn>Game</TableColumn>
                <TableColumn>Status</TableColumn>
                <TableColumn>Jumlah</TableColumn>
                {/* <TableColumn>Dibuat Pada</TableColumn>
                <TableColumn>Terakhir Update</TableColumn> */}
                <TableColumn>Detail</TableColumn>
            </TableHeader>
            <TableBody emptyContent={<div className='w-full p-12'>
                <div className='w-full max-w-md mx-auto flex flex-col gap-4'>
                    <p className='text-[16px] font-bold'>Product masih kosong</p>
                </div>
            </div>}
                items={searchText ? searchedProduct : productData}>
                {(item: ProductData) => (
                    <TableRow key={item.id}>
                        <TableCell >{item.name}</TableCell>
                        <TableCell >{item.game}</TableCell>
                        <TableCell >{item.amount <= 0 ? (<p className='text-danger'>habis</p>) : (<p className=''>tersedia</p>)}</TableCell>
                        <TableCell>{item.amount}</TableCell>
                        {/* <TableCell>
                            {formatDate(item.createdAt)}
                        </TableCell>
                        <TableCell>
                            {formatDate(item.updatedAt)}
                        </TableCell> */}
                        <TableCell>
                            <Button radius='none' variant='bordered' onClick={() => push('/dashboard/product/' + item.id)}>
                                Detail
                            </Button>
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    </>)
}

export default Product