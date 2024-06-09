import { NextPage } from 'next'
import EditCampaign from './EditCampaign'

interface Props {
    params: { campaignId: string }
}

const Page: NextPage<Props> = ({ params }) => {
    return <EditCampaign {...params} />
}

export default Page