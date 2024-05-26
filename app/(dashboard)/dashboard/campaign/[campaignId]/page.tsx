import { NextPage } from 'next'
import DetailCampaign from './DetailCampaign'

interface Props {
    params: { campaignId: string }
}

const Page: NextPage<Props> = ({ params }) => {
    return <DetailCampaign campaignId={params.campaignId} />
}

export default Page