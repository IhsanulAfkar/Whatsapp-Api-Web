"use client";
import React, { useEffect, useState } from "react";

import dynamic from "next/dynamic";
import { Button, Input, Switch, Tab, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tabs, Textarea } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import QRModal from "./QRModal";
import { useSocket } from "../Providers/SocketProvider";
import Card from "../Card";
import fetchClient from "@/helper/fetchClient";
import toast from "react-hot-toast";
import { ContactBroadcast, DeviceTypes, MessageTableStatus, OrderTypes } from "@/types";
const MapOne = dynamic(() => import("../Maps/MapOne"), {
  ssr: false,
});

const Dashboard: React.FC = () => {
  const [openQRModal, setOpenQRModal] = useState(false)
  const { data: session } = useSession()
  const { isConnected, socket } = useSocket()
  const [isActive, setisActive] = useState(false)
  const [paymentReply, setPaymentReply] = useState("")
  const [storeName, setStoreName] = useState("")
  const [currentPage, setcurrentPage] = useState<'Created' | 'Processing'>('Created')
  const [orderDetail, setorderDetail] = useState({
    Created: [],
    Processing: [],
  })
  const fetchDevice = async () => {
    const result = await fetchClient({
      url: "/devices",
      method: "GET",
      user: session?.user
    })
    if (result?.ok) {
      const devices: DeviceTypes[] = await result.json()
      setisActive(devices[0].isAutoReply)
      return
    }
    toast.error("gagal fetch device")
  }
  const fetchAutoReply = async () => {
    const result = await fetchClient({
      url: '/autoreply',
      method: 'GET',
      user: session?.user
    })
    if (result?.ok) {
      const resultData = await result.json()
      setPaymentReply(resultData?.paymentReply || "")
      setStoreName(resultData?.storeName || "")
    }

  }
  const toggleAutoReply = async () => {
    const result = await fetchClient({
      url: "/autoreply/status",
      method: "PATCH",
      user: session?.user,
      body: JSON.stringify({ status: !isActive })
    })
    if (result?.ok) {
      setisActive(!isActive)
    }
  }
  const fetchOrder = async () => {
    const result1 = await fetchClient({
      method: "GET",
      url: "/orders?status=CREATED",
      user: session?.user
    })
    const result2 = await fetchClient({
      method: "GET",
      url: "/orders?status=PROCESSING",
      user: session?.user
    })
    if (result1?.ok && result2?.ok) {
      const resultData1 = await result1.json()
      const resultData2 = await result2.json()
      const newOrder = {
        Created: resultData1,
        Processing: resultData2,
      }
      setorderDetail(newOrder)
    }
  }
  useEffect(() => {
    if (session?.user) {
      fetchDevice()
      fetchAutoReply()
      fetchOrder()
      console.log(session.user)
    }
  }, [session?.user])
  return (
    <>
      {openQRModal && (
        <QRModal
          openModal={openQRModal}
          setopenModal={setOpenQRModal}
          refresh={() => { }}
          socket={socket}
          user={session?.user}
        />
      )}
      <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark flex justify-between items-center">
        <p className="text-2xl font-bold text-black dark:text-white">Welcome, {session?.user?.firstName} {session?.user?.lastName}</p>
        {session?.user?.sessionId ? (<>
          <p className="text-primary">WhatsApp sudah terkoneksi</p>
        </>) : (<>
          <Button variant="light" radius="none" color="primary" onClick={() => setOpenQRModal(true)}>Connect WhatsApp</Button>
        </>)}
      </div>
      <div className='w-full items-start flex gap-4 mt-4'>
        <Card className='w-full max-w-md flex justify-between gap-4'>
          <p className='text-xl font-bold text-black dark:text-white w-full'>Aktifkan Auto Reply</p>
          <Switch size='sm' isSelected={isActive}
            onClick={() => toggleAutoReply()}
          />

        </Card>
        <Card className='w-full'>
          <p className='text-xl font-bold text-black dark:text-white w-full'>Daftar Order Terakhir</p>
          <Tabs aria-label="Options" variant="light" color="primary" radius="md" className="mt-4" size="md"
            selectedKey={currentPage}
            onSelectionChange={setcurrentPage as any}
          >
            <Tab key="Created" title="Created" />
            <Tab key="Processing" title="Processing" />
          </Tabs>
          <Table
            aria-label="Incoming Chat"
            color='default'
            selectionMode="none"
            isHeaderSticky
            removeWrapper
            radius='md'
            className="mt-2"
          >
            <TableHeader>
              <TableColumn>Nama Penerima</TableColumn>
              <TableColumn>Status</TableColumn>

            </TableHeader>
            <TableBody emptyContent={`Belum ada order ${currentPage}`} items={orderDetail[currentPage]}>
              {(item: OrderTypes) => (
                <TableRow key={item.id}>
                  <TableCell className='flex gap-2 items-center'>
                    <p>{item.name}</p>
                  </TableCell>
                  <TableCell>{item.status}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

      </div>
    </>
  );
};

export default Dashboard;
