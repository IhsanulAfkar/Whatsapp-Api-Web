import HeaderText from '@/components/Dashboard/HeaderText'
import { NextPage } from 'next'
import DetailContact from './DetailContact'

interface Props {
    params: { contactId: string }
}

const Page: NextPage<Props> = ({ params }) => {
    return (<>
        <HeaderText>Detail Kontak</HeaderText>
        <DetailContact contactId={params.contactId} />
    </>)
}

export default Page