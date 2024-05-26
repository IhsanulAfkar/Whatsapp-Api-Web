import { Metadata, NextPage } from 'next'
import HeaderText from '@/components/Dashboard/HeaderText'
import Broadcast from './Broadcast'

interface Props { }
export const metadata: Metadata = {
    title: 'Broadcast'
}
const Page: NextPage<Props> = ({ }) => {
    return (
        <>
            <HeaderText>Broadcast</HeaderText>
            <Broadcast />
        </>
    )
}

export default Page