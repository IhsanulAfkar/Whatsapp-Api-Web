import ProfileAvatar from "@/components/ProfileAvatar"
import { formatDate } from "@/helper/formatDate"
import { ConversationMessage } from "@/types"
import { Avatar } from "@nextui-org/react"
import { IncomingMessage } from "http"

export const ChatDetails = ({ message }: { message: ConversationMessage }) => {
    if (message.to)
        return (
            <>
                <div className="flex justify-end gap-2 items-center w-full">
                    <div className="text-sm">
                        <p>Anda</p>
                    </div>
                    <Avatar color='primary' />
                    {/* <div className={`flex-none rounded-full text-white w-8 h-8 flex items-center justify-center bg-primary`}>
                        <img src="/assets/icons/user.svg" alt="" />
                    </div> */}
                </div>
            </>
        )

    return (
        <>
            <div className="flex gap-2 items-center w-full">
                <ProfileAvatar profile={message.contact} />
                {/* <div style={{
                    backgroundColor: '#' + message.contact?.colorCode
                }} className={`flex-none rounded-full text-white w-8 h-8 flex items-center justify-center`}>{getInitials(message.contact?.firstName + ' ' + message.contact?.lastName)}</div> */}
                <div className="">
                    <p>{message.contact?.firstName} {message.contact?.lastName}</p>
                    <p className="text-[#777C88]">{formatDate(message.createdAt)}</p>
                </div>
            </div>
        </>
    )
}