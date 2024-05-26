import { NextPage } from 'next'
import EditBroadcast from './EditBroadcast'

interface Props {
    params: { broadcastId: string }
}

const Page: NextPage<Props> = ({ params }) => {
    return <EditBroadcast {...params} />
}

export default Page