import HeaderText from '@/components/Dashboard/HeaderText'
import { NextPage } from 'next'
import CreateCampaign from './CreateCampaign'

interface Props { }

const Page: NextPage<Props> = ({ }) => {
    return (
        <>
            <HeaderText>Buat Campaign</HeaderText>
            <CreateCampaign />
        </>)
}

export default Page
