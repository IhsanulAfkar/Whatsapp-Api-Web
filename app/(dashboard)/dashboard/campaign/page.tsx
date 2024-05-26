import HeaderText from '@/components/Dashboard/HeaderText'
import { Metadata, NextPage } from 'next'
import Campaign from './Campaign'

interface Props { }
export const metadata: Metadata = {
    title: 'Campaign'
}
const Page: NextPage<Props> = ({ }) => {
    return (<>
        <HeaderText>Campaign</HeaderText>
        <Campaign />
    </>)
}

export default Page