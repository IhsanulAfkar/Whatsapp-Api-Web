import ModalTemplate from '@/components/ModalTemplate'
import { Button } from '@nextui-org/react'
import { NextPage } from 'next'
import { User } from 'next-auth'
import { Dispatch, SetStateAction, useState } from 'react'

interface Props {
    openModal: boolean,
    setopenModal: Dispatch<SetStateAction<boolean>>,
    deleteFunc: () => void,
    count: 'all' | number
}

const DeleteMemberModal: NextPage<Props> = ({ count, deleteFunc, openModal, setopenModal }) => {
    const [isLoading, setisLoading] = useState(false)
    return <ModalTemplate
        openModal={openModal}
        setopenModal={setopenModal}
        outsideClose={false}
        title='Hapus Member'
    >
        <p className='text-center text-lg'>Hapus {count === 'all' ? 'semua' : count} member?</p>
        <div className='flex w-full gap-4'>
            <Button
                fullWidth
                size='lg'>
                Tidak
            </Button>
            <Button
                color='danger'
                isLoading={isLoading}
                size='lg'
                fullWidth
                onClick={async () => {
                    setisLoading(true)
                    await deleteFunc()
                    setisLoading(false)
                }}>
                Ya
            </Button>
        </div>
    </ModalTemplate>
}

export default DeleteMemberModal