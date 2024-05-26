import ModalTemplate from '@/components/ModalTemplate'
import fetchClient from '@/helper/fetchClient'
import { Button, Input } from '@nextui-org/react'
import { NextPage } from 'next'
import { User } from 'next-auth'
import { Dispatch, SetStateAction, useState } from 'react'
import toast from 'react-hot-toast'

interface Props {
    openModal: boolean,
    setopenModal: Dispatch<SetStateAction<boolean>>,
    user?: User,
    refresh: () => void,
}

const AddGroupModal: NextPage<Props> = ({ openModal, refresh, setopenModal, user }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [groupName, setGroupName] = useState('')
    const createGroup = async () => {
        const result = await fetchClient({
            url: '/groups',
            method: 'POST',
            body: JSON.stringify({
                name: groupName
            }),
            user: user
        })
        if (result?.ok) {
            toast.success('Group berhasil dibuat')
            refresh()
            setopenModal(false)
        } else {
            const err = await result?.json()
            toast.error(err.message)
        }
    }
    return <ModalTemplate
        openModal={openModal}
        setopenModal={setopenModal}
        outsideClose={false}
        title='Buat Group'
    >
        <div className="">
            <label className="font-medium text-black dark:text-white">
                Nama Group
            </label>
            <Input variant='underlined'
                type="text"
                size='lg'
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
            />
        </div>
        <Button
            size='lg'
            isLoading={isLoading}
            color='primary'
            fullWidth
            isDisabled={groupName.length < 3}
            onClick={createGroup}
        >
            Buat Group
        </Button>
    </ModalTemplate>
}

export default AddGroupModal