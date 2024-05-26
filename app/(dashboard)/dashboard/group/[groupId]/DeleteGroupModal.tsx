import ModalTemplate from '@/components/ModalTemplate'
import { Button } from '@nextui-org/react'
import { NextPage } from 'next'
import { Dispatch, SetStateAction, useState } from 'react'

interface Props {
    openModal: boolean,
    setopenModal: Dispatch<SetStateAction<boolean>>,
    deleteFunc: () => void,
    groupName: string
}

const DeleteGroupModal: NextPage<Props> = ({ deleteFunc, openModal, setopenModal, groupName }) => {
    const [isLoading, setisLoading] = useState(false)
    return <ModalTemplate
        openModal={openModal}
        setopenModal={setopenModal}
        outsideClose={false}
        title='Hapus Group'
    >
        <p className='text-center text-lg'>Hapus Group {groupName}?</p>
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

export default DeleteGroupModal