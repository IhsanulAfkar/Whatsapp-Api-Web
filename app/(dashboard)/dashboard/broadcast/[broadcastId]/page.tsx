import { Metadata, NextPage } from 'next'
import ClientPage from './ClientPage'

interface Props {
    params: { broadcastId: string }
}
export const metadata: Metadata = {
    title: 'Detail Broadcast',
}
const Page: NextPage<Props> = ({ params }) => {
    return <ClientPage broadcastId={params.broadcastId} />
}

export default Page