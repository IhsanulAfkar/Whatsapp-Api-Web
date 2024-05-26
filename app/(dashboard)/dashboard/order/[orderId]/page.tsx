import { NextPage } from 'next'
import DetailOrder from './DetailOrder'

interface Props {
    params: { orderId: string }
}

const Page: NextPage<Props> = ({ params }) => {
    return (<>
        <DetailOrder orderId={params.orderId} />
    </>)
}

export default Page