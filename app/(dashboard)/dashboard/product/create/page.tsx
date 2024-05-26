import HeaderText from '@/components/Dashboard/HeaderText'
import { NextPage } from 'next'
import CreateProduct from './CreateProduct'

interface Props { }

const Page: NextPage<Props> = ({ }) => {
    return (<>
        <HeaderText>Buat Produk</HeaderText>
        <CreateProduct />
    </>)
}

export default Page