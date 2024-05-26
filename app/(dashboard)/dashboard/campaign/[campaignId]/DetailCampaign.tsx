'use client'
import Card from '@/components/Card'
import HeaderText from '@/components/Dashboard/HeaderText'
import fetchClient from '@/helper/fetchClient'
import route from '@/routes'
import { CampaignTypes } from '@/types'
import { Accordion, AccordionItem, Button } from '@nextui-org/react'
import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import DetailCampaignTable from './DetailCampaignTable'
import { formatDate } from '@/helper/utils'
import { isFileImage } from '@/helper/fileHelper'
import DisplayImage from '@/components/file/DisplayImage'
import DisplayFile from '../../messenger/DisplayFile'

interface Props {
    campaignId: string
}

const DetailCampaign: NextPage<Props> = ({ campaignId }) => {
    const { push } = useRouter()
    const { data: session } = useSession()
    const [campaignData, setcampaignData] = useState<CampaignTypes>()
    const [campaignDetail, setcampaignDetail] = useState({
        Terkirim: [],
        Diterima: [],
        Terbaca: [],
        Balasan: []
    })
    const fetchCampaign = async () => {
        const result = await fetchClient({
            url: "/campaigns/" + campaignId,
            method: 'GET',
            user: session?.user
        })
        if (result?.ok) {
            setcampaignData(await result.json())
            return
        }
        if (result?.status === 404) {
            toast.error('Campaign tidak ditemukan')
            push(route('campaign'))
            return
        }
        toast.error('Gagal fetch campaign')
    }
    useEffect(() => {
        if (session?.user) {
            fetchCampaign()
        }
    }, [session?.user])
    if (!campaignData) <></>
    return (<>
        <Button className='mb-4' radius='none' variant={'faded'} as={Link} href={route('campaign')}>Kembali</Button>
        <div className='flex gap-4 justify-between'>
            <HeaderText>{`Campaign: ${campaignData?.name}`}</HeaderText>
            <Button as={Link} href={route('campaign') + `/${campaignData?.id}/message`} color='primary' radius='none'>Pesan Campaign</Button>
        </div>
        <Card className='w-full flex gap-4 flex-col md:flex-row'>
            <div className='w-full max-w-sm'>
                <p className='font-medium text-black dark:text-white'>Detail Campaign</p>
                <table className='w-full border-spacing-y-2 border-spacing-x-2 -mx-2 border-separate '>
                    <tbody >
                        <tr>
                            <th className='font-medium text-start'>Nama Campaign</th>
                            <td>{campaignData?.name}</td>
                        </tr>
                        <tr>
                            <th className='font-medium text-start '>Device</th>
                            <td>{campaignData?.device.name}</td>
                        </tr>
                        <tr>
                            <th className='font-medium text-start'>Penerima</th>
                            <td>{campaignData?.recipients.length}</td>
                        </tr>
                        <tr>
                            <th className='font-medium text-start'>Jadwal</th>
                            <td>{formatDate(campaignData?.schedule!)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className='w-full'>
                <Accordion
                    isCompact
                    selectionMode='multiple'
                    itemClasses={{
                        title: 'text-md font-medium',
                        indicator: 'text-md',
                    }}
                // variant='bordered'
                >
                    <AccordionItem
                        key="1" aria-label="register" title="Tampilan Pesan register">
                        {campaignData?.registrationMessage}
                    </AccordionItem>
                    <AccordionItem key="2" aria-label="success" title="Tampilan Pesan Sukses">
                        {campaignData?.successMessage}
                    </AccordionItem>
                    <AccordionItem key="3" aria-label="failed" title="Tampilan Pesan Gagal">
                        {campaignData?.failedMessage}
                    </AccordionItem>
                    <AccordionItem key="4" aria-label="unreg" title="Tampilan Pesan Unregister">
                        {campaignData?.unregisteredMessage}
                    </AccordionItem>

                </Accordion>
                {campaignData?.mediaPath && (
                    <>
                        <p className="my-2">Media</p>
                        {isFileImage(campaignData?.mediaPath) ? (
                            <DisplayImage imageUrl={campaignData?.mediaPath} />
                        ) : (
                            <DisplayFile fileUrl={campaignData?.mediaPath} />
                        )}
                    </>
                )}
            </div>
        </Card>
        {campaignData && (
            <DetailCampaignTable campaign={campaignData} user={session?.user} />
        )}
    </>)
}

export default DetailCampaign