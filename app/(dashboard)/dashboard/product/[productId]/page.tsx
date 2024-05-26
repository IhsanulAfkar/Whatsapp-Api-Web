import { Metadata, NextPage } from 'next'
import DetailProduct from './DetailProduct'

interface Props {
    params: { productId: string }
}
export const metadata: Metadata = {
    title: 'Detail Product',
}
const Page: NextPage<Props> = ({ params }) => {
    return <DetailProduct productId={params.productId} />
}

export default Page