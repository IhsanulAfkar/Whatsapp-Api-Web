import HeaderText from '@/components/Dashboard/HeaderText'
import { NextPage } from 'next'
import CreateBroadcast from './CreateBroadcast'

interface Props { }

const Page: NextPage<Props> = ({ }) => {
    return (<>
        <HeaderText>Buat Broadcast</HeaderText>
        <CreateBroadcast />
    </>)
}

export default Page