import ModalTemplate from '@/components/ModalTemplate'
import { Button } from '@nextui-org/react'
import { NextPage } from 'next'
import { User } from 'next-auth'
import { Dispatch, SetStateAction, useState } from 'react'

interface Props {
    openModal: boolean,
    setopenModal: Dispatch<SetStateAction<boolean>>,
    user?: User,
    deleteFunc: () => void,
    count: 'all' | number
}

const DeleteProductModal: NextPage<Props> = ({ openModal, count, deleteFunc, setopenModal, user }) => {
    const [isLoading, setisLoading] = useState(false)
    return <ModalTemplate
        openModal={openModal}
        setopenModal={setopenModal}
        outsideClose={false}
        title='Hapus Kontak'
    >
        <p className='text-center text-lg'>Hapus {count === 'all' ? 'semua' : count} produk?</p>
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

export default DeleteProductModal