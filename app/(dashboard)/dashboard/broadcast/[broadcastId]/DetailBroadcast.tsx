import Card from '@/components/Card'
import HeaderText from '@/components/Dashboard/HeaderText'
import DisplayImage from '@/components/file/DisplayImage'
import { isFileImage } from '@/helper/fileHelper'
import { formatDate } from '@/helper/formatDate'
import { BroadcastData } from '@/types'
import { Button } from '@nextui-org/react'
import { NextPage } from 'next'
import Link from 'next/link'
import DisplayFile from '../../messenger/DisplayFile'
import fetchClient from '@/helper/fetchClient'
import { User } from 'next-auth'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface Props {
    broadcast: BroadcastData
    user: User
}

const DetailBroadcast: NextPage<Props> = ({ broadcast, user }) => {
    const { push } = useRouter()
    const handleDeleteBroadcast = async () => {
        const isConfirm = window.confirm('Anda yakin ingin menghapus broadcast ' + broadcast.name + '?')
        if (isConfirm) {
            const result = await fetchClient({
                url: '/broadcasts/',
                body: JSON.stringify({ broadcastIds: [broadcast.id] }),
                method: 'DELETE',
                user: user
            })
            if (result?.ok) {
                toast.success('Berhasil hapus broadcast')
                push('/dashboard/broadcast')
            } else {
                toast.error('Gagal hapus broadcast')
            }
        }
    }
    return (<>

        <Card className='flex gap-12'>
            <div className="w-full max-w-xs">
                <p className="font-lexend text-xl font-bold">Broadcast Detail</p>
                <table className='w-full border-separate border-spacing-y-1 mt-4'>
                    <tbody >
                        <tr>
                            <th className='text-start font-bold whitespace-pre '>Broadcast Name</th>
                            <td className="break-all">{broadcast.name}</td>
                        </tr>
                        <tr>
                            <th className='text-start font-bold whitespace-pre '>Recipients</th>
                            <td className="break-all">{broadcast.recipients.length}</td>
                        </tr>
                        <tr>
                            <th className='text-start font-bold whitespace-pre '>Schedule</th>
                            <td className="break-all">{formatDate(broadcast.schedule!)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="w-full">
                <p className="font-medium text-black dark:text-white">Tampilan Pesan</p>
                <div className="relative">
                    <div className="border border-customGray px-4 py-3 mt-8">
                        {broadcast.message}
                    </div>
                    <div className="absolute bottom-1 right-2 text-customGray text-sm">
                        <p>now &#10003;</p>
                    </div>
                </div>
                {broadcast.mediaPath && (
                    <>
                        <p className="my-2">Media</p>
                        {isFileImage(broadcast.mediaPath) ? (
                            <DisplayImage imageUrl={broadcast.mediaPath} />
                        ) : (
                            <DisplayFile fileUrl={broadcast.mediaPath} />
                        )}
                    </>
                )}
                <div className="flex justify-end gap-2 mt-4">
                    <Button radius='none' as={Link} href={'/dashboard/broadcast/' + broadcast.id + '/edit'} variant="bordered" >
                        Edit
                    </Button>
                    <Button onClick={handleDeleteBroadcast} color="danger" radius='none' >
                        Hapus Broadcast
                    </Button>
                </div>
            </div>
        </Card>
    </>)
}

export default DetailBroadcast