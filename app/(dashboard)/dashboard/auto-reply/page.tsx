import HeaderText from '@/components/Dashboard/HeaderText'
import { NextPage } from 'next'
import AutoReply from './AutoReply'

interface Props { }

const Page: NextPage<Props> = ({ }) => {
    return <>
        <HeaderText>Auto Reply</HeaderText>
        <AutoReply />
    </>
}

export default Page