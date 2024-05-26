import Link from "next/link";
import Image from "next/image";
import { Chat } from "@/types/chat";
import { Avatar, input, Input } from "@nextui-org/react";
import { ContactLatestMessage, MessengerList, ConversationMessage } from "@/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { NextPage } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import IconSearch from "../assets/icons/search";


interface Props {
  listMessenger: ContactLatestMessage[],
  currentMessenger: MessengerList | undefined,
  setcurrentMessenger: Dispatch<SetStateAction<MessengerList | undefined>>,
  setlistMessage: Dispatch<SetStateAction<ConversationMessage[]>>,
}
const ChatCard: NextPage<Props> = ({ currentMessenger, listMessenger, setcurrentMessenger, setlistMessage }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()!
  const [inputText, setinputText] = useState('')
  const [searchedMessenger, setsearchedMessenger] = useState<ContactLatestMessage[]>([])
  const handleClickMessenger = (messenger: MessengerList) => {
    if (currentMessenger?.phone === messenger.phone) return
    setlistMessage([])
    setcurrentMessenger(messenger)
    const params = new URLSearchParams(searchParams)
    params.set('phone', messenger.phone)
    router.push(pathname + '?' + params.toString())
  }
  const filterMessenger = (text: string) => {
    const regex = new RegExp(text, 'i')
    return listMessenger.filter(item => {
      const contact = item.messenger.contact
      if (regex.test(item.messenger.phone)) return item
      if (contact) {
        if (regex.test(contact.firstName) || regex.test(contact.lastName) || regex.test(contact.phone) || regex.test(contact.email))
          return item
      }
    })
  }
  useEffect(() => {
    const searchResult = filterMessenger(inputText)
    setsearchedMessenger(searchResult)

  }, [inputText])
  return (
    <div className=" rounded-sm border border-stroke bg-white py-6 shadow-default dark:border-strokedark dark:bg-boxdark ">
      <div className="flex items-center justify-between mb-6 px-7.5">

        <h4 className="text-xl font-semibold text-black dark:text-white">
          Chats
        </h4>
        <div className="relative">
          <Input
            variant="underlined"
            size="sm"
            value={inputText}
            onChange={e => setinputText(e.target.value)}
            placeholder="cari kontak" />
          <div className='absolute top-1/2 -translate-y-1/2 right-2'>
            <IconSearch />
          </div>
        </div>
      </div>

      <div>
        {inputText ? (<>

        </>) : (<>
        </>)}
        {listMessenger.map((chat, key) => (
          <MessengerCard currentMessenger={currentMessenger} item={chat} handleClick={handleClickMessenger} key={key} />
        ))}
      </div>
    </div>
  );
};

export default ChatCard;

const MessengerCard = ({ currentMessenger, handleClick, item }: {
  item: ContactLatestMessage,
  currentMessenger: MessengerList | undefined,
  handleClick: (item: MessengerList) => void
}) => {
  const getTimeDifference = () => {
    if (!item.latestMessage) return ""
    const now = new Date();
    const messageTime = new Date(item.latestMessage?.createdAt!);
    const difference = now.getTime() - messageTime.getTime();
    const minute = 60 * 1000;
    const hour = minute * 60;
    const day = hour * 24;

    if (difference < minute) {
      return 'Just now';
    } else if (difference < hour) {
      const minutes = Math.floor(difference / minute);
      return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    } else if (difference < day) {
      const hours = Math.floor(difference / hour);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      // If over 1 day, return the timestamp
      return messageTime.toLocaleString();
    }
  }
  return (
    <div
      className={"flex items-center gap-5 py-3 px-7.5 hover:bg-gray-3 dark:hover:bg-meta-4 hover:cursor-pointer " + (currentMessenger?.phone === item.messenger.phone ? 'bg-gray-3 dark:bg-meta-4' : 'bg-white dark:bg-boxdark')}
      key={item.messenger.phone}
      onClick={() => handleClick(item.messenger)}
    >
      <Avatar isBordered />
      <div className="flex flex-1 items-center justify-between">
        <div>
          <p className="font-medium text-black dark:text-white">
            {item.messenger.contact ? `${item.messenger.contact.firstName} ${item.messenger.contact.lastName}` : item.messenger.phone}
            {/* {chat.name} */}
          </p>
          <p>
            <span className="text-sm text-black dark:text-white text-ellipsis overflow-hidden ">
              {(item.latestMessage && item.latestMessage?.message.length <= 60) ? item.latestMessage?.message : item.latestMessage?.message.slice(0, 60) + "..."}
              {/* {chat.text} */}
            </span>
            <span className="text-xs"> . {getTimeDifference()}</span>
          </p>
        </div>

        {item.unreadMessages > 0 && (
          <div className="flex flex-none h-6 w-6 items-center justify-center rounded-full bg-primary">
            <span className="text-sm font-medium text-white ">
              {" "}
              {item.unreadMessages}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
