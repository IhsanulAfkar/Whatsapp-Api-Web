import { Metadata, NextPage } from 'next'
import Order from './Order'
import HeaderText from '@/components/Dashboard/HeaderText'

interface Props { }
export const metadata: Metadata = {
    title: 'Order'
}

const Page: NextPage<Props> = ({ }) => {
    return (<>
        <HeaderText>Order</HeaderText>
        <Order />
    </>)
}

export default Page