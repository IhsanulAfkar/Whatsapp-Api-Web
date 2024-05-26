'use client'
import { Modal, ModalContent, ModalBody, ModalHeader } from '@nextui-org/react'
import { NextPage } from 'next'
import { Dispatch, SetStateAction, useEffect } from 'react'

interface Props {
    children: React.ReactNode,
    openModal: boolean,
    setopenModal: Dispatch<SetStateAction<boolean>>,
    outsideClose: boolean
    hideCloseButton?: boolean,
    title?: string
}

const ModalTemplate: NextPage<Props> = ({ children, openModal, outsideClose, setopenModal, hideCloseButton = false, title }) => {
    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Escape') {
            setopenModal(false)
        }
    }
    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress as any);
        return () => {
            window.removeEventListener('keydown', handleKeyPress as any);
        };
    }, [])
    return (<>
        <Modal isOpen={openModal}
            onOpenChange={setopenModal}
            isDismissable={outsideClose}
            scrollBehavior="inside"
            hideCloseButton={hideCloseButton}
            placement='center'
        >
            <ModalContent>
                {title && (
                    <ModalHeader >{title}</ModalHeader>
                )}
                <ModalBody className="rounded-md max-h-[90vh] overflow-y-auto">
                    <>
                        {children}
                        <div className="pb-[1px]" />
                    </>
                </ModalBody>
            </ModalContent>
        </Modal></>)
}

export default ModalTemplate