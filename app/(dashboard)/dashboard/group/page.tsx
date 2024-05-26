import HeaderText from '@/components/Dashboard/HeaderText'
import { NextPage } from 'next'
import GroupTable from './GroupTable'

interface Props { }

const Page: NextPage<Props> = ({ }) => {
    return (<>
        <HeaderText>Group</HeaderText>
        <GroupTable />
    </>)
}

export default Page