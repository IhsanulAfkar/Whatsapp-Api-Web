import { Metadata, NextPage } from 'next'
import Messenger from './Messenger'
import HeaderText from '@/components/Dashboard/HeaderText'

interface Props { }
export const metadata: Metadata = {
    title: 'Messenger'

}
const Page: NextPage<Props> = ({ }) => {
    return (
        <>
            <HeaderText>Messenger</HeaderText>
            <Messenger />
        </>
    )
}

export default Page