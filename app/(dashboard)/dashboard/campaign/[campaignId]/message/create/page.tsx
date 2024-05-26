import { NextPage } from 'next'
import CreateCampaignMessage from './CreateCampaignMessage'

interface Props {
    params: { campaignId: string }
}

const Page: NextPage<Props> = ({ params }) => {
    return <CreateCampaignMessage campaignId={params.campaignId} />
}

export default Page