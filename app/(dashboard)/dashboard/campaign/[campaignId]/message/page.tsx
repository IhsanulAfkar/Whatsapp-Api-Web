import { NextPage } from 'next'
import CampaignMessage from './CampaignMessage'

interface Props {
    params: { campaignId: string }
}

const Page: NextPage<Props> = ({ params }) => {
    return <CampaignMessage campaignId={params.campaignId} />
}

export default Page