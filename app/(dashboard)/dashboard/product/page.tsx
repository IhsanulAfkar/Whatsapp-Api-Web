import HeaderText from '@/components/Dashboard/HeaderText'
import { Metadata, NextPage } from 'next'
import Product from './Product'

interface Props { }
export const metadata: Metadata = {
    title: 'Product'

}
const Page: NextPage<Props> = ({ }) => {
    return (<>
        <HeaderText>Product</HeaderText>
        <Product />
    </>)
}

export default Page