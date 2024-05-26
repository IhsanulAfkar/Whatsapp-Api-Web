import { NextPage } from 'next'
import DetailGroup from './DetailGroup'

interface Props {
    params: { groupId: string }
}

const Page: NextPage<Props> = ({ params }) => {
    return (<DetailGroup groupId={params.groupId} />)
}

export default Page