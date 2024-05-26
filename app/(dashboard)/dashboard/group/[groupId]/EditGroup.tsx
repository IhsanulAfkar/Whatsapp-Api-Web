import ModalTemplate from '@/components/ModalTemplate'
import fetchClient from '@/helper/fetchClient'
import { GroupDataTypes } from '@/types'
import { Button, Input } from '@nextui-org/react'
import { NextPage } from 'next'
import { User } from 'next-auth'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface Props {
    openModal: boolean,
    setopenModal: Dispatch<SetStateAction<boolean>>,
    user?: User,
    refresh: () => void,
    groupData: GroupDataTypes
}

const EditGroup: NextPage<Props> = ({ openModal, refresh, setopenModal, user, groupData }) => {
    const [groupName, setgroupName] = useState(groupData.name)
    const [isLoading, setIsLoading] = useState(false)
    const editGroup = async () => {
        setIsLoading(true)
        const result = await fetchClient({
            url: `/groups/${groupData.id}`,
            method: 'PATCH',
            body: JSON.stringify({
                name: groupName
            }),
            user: user
        })
        if (result?.ok) {
            toast.success('Nama group berhasil diubah')
            refresh()
            setopenModal(false)
        } else {
            const err = await result?.json()
            toast.error(err.message)
        }
        setIsLoading(false)
    }
    return <ModalTemplate
        openModal={openModal}
        setopenModal={setopenModal}
        outsideClose={false}
        title='Ubah Nama Group'
    >
        <div className="">
            <label className="font-medium text-black dark:text-white">
                Nama Group
            </label>
            <Input variant='underlined'
                type="text"
                size='lg'
                value={groupName}
                onChange={e => setgroupName(e.target.value)}
            />
        </div>
        <Button
            size='lg'
            isLoading={isLoading}
            color='primary'
            fullWidth
            isDisabled={groupName.length < 3}
            onClick={editGroup}
        >
            Ubah
        </Button>
    </ModalTemplate>
}

export default EditGroup