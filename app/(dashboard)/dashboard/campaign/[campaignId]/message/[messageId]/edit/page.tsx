import { NextPage } from 'next'
import EditCampaignMessage from './EditCampaignMessage'

interface Props {
    params: { campaignId: string, messageId: string }
}

const Page: NextPage<Props> = ({ params }) => {
    return <EditCampaignMessage {...params} />
}

export default Page