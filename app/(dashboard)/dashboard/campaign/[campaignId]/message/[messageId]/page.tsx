import { NextPage } from 'next'
import DetailCampaignMessage from './DetailCampaignMessage'

interface Props {
    params: {
        campaignId: string,
        messageId: string
    }
}

const Page: NextPage<Props> = ({ params }) => {
    return <DetailCampaignMessage {...params} />
}

export default Page