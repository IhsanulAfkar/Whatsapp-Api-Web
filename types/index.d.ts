export type UserProfile = {
    firstName: string,
    lastName: string,
    username: string,
    phone: string,
    email: string,
    googleId: string,
    emailVerifiedAt: string
}

export type ContactForm = {
    firstName: string,
    lastName?: string,
    email?: string,
    phone: string,
    gender?: string
}
export type ContactTypes = {
    pkId: number,
    id: string,
    firstName: string,
    lastName: string,
    phone: string,
    email: string,
    gender: string,
    dob: string,
    contactGroups?: {
        group: {
            id: string,
            name: string
        }
    }[],
    contactDevices: {
        device: {
            name: string,
            id: string
        }
    }[],
    colorCode: string,
    createdAt: string,
    updatedAt: string,
}
export type DeviceTypes = {
    pkId: number,
    id: string,
    name: string,
    phone?: string,
    apiKey: string,
    serverId: 1,
    status: 'NOT_CONNECTED' | 'CONNECTED',
    isAutoReply: boolean,
    createdAt: string,
    updatedAt: string,
    businessHourId: null,
    userId: 1
}
export type SelectedKeyState = Set<string> | 'all'

export type GetSessionType = {
    sessionId: string,
    device: {
        id: string
    }
}
export type UserRegisterTypes = {
    firstName: string,
    lastName: string,
    username: string,
    phone: string,
    email: string,
    accessToken?: string,
}

export type ContactTypes = {
    pkId: number,
    id: string,
    firstName: string,
    lastName: string,
    phone: string,
    email: string,
    gender: string,
    colorCode: string,
    createdAt: string,
    updatedAt: string
}

export type MessengerList = {
    phone: string,
    createdAt: string,
    contact?: ContactTypes
}
export type IncomingMessage = {
    pkId: number,
    id: string,
    from: string,
    message: string,
    mediaPath?: string,
    receivedAt: string,
    createdAt: string,
    updatedAt: string,
    sessionId: string,
    contact?: {
        firstName: string,
        lastName: string,
        colorCode: string,
        initial: string
    },
}
export type ConversationMessage = {
    pkId: number,
    id: string,
    message: string,
    mediaPath?: string,
    createdAt: string,
    updatedAt: string,
    sessionId: string,
    status?: string,
    schedule?: string,
    from?: string,
    to?: string,
    contactId?: number,
    contact?: {
        firstName: string,
        lastName: string,
        colorCode: string,
        initial?: string
    },
    checked?: boolean
}
export type ContactLatestMessage = {
    messenger: MessengerList,
    latestMessage: ConversationMessage | null,
    unreadMessages: number
}
export type MessageMetadata = {
    totalMessages: number,
    currentPage: number,
    totalPages: number,
    hasMore: boolean
}
export type GetMessage<T> = {
    data: T[],
    metadata: {
        totalMessages: number,
        currentPage: number,
        totalPages: number,
        hasMore: boolean
    }
}

export type BroadcastData = {
    pkId: number,
    id: string,
    name: string,
    recipients: string[]
    message: string,
    mediaPath?: string,
    schedule: string,
    delay: number,
    isSent: boolean,
    createdAt: string,
    updatedAt: string,
}
export type DeviceData = {
    pkId: number
    id: string,
    name: string,
    phone?: string,
    apiKey: string,
    serverId: number,
    status: string,
    createdAt: string,
    updatedAt: string,
    businessHourId?: number,
    userId: number,
}
export interface GetBroadcast {
    id: string,
    name: string,
    status: boolean,
    device: {
        name: string
    },
    recipients?: string[],
    mediaPath?: string,
    schedule?: string,
    message?: string,
    createdAt: string,
    updatedAt: string
}

export interface OutgoingBroadcast {
    outgoingBroadcast: ContactBroadcast[]
}
export interface ContactBroadcast {
    pkId: number,
    id: string,
    message: string,
    mediaPath?: string,
    receivedAt: string,
    createdAt: string,
    updatedAt: string,
    sessionId: string,
    status: string,
    from?: string,
    to?: string,
    contactId: number,
    contact: ContactTypes
}
export type EnumGame = 'Genshin' | 'Honkai Star Rail' | 'Mobile Legend'
export type ProductData = {
    pkId: 1,
    id: string,
    name: string,
    description: string,
    game: EnumGame,
    media: string | null,
    amount: number,
    price: number,
    userId: number,
    createdAt: string,
    updatedAt: string
}
export type ProductForm = {
    name: string,
    description: string,
    price: number,
    amount: number
}
export type OrderDataTypes = {
    // id: number,
    productId: string,
    productName: string,
    quantity: number,
    checked: boolean
}
export type OrderTypes = {
    pkId: number,
    id: string,
    name: string,
    phoneNumber: string,
    notes?: string,
    contactId?: number,
    status: OrderStatus,
    deviceId: number,
    createdAt: string,
    updatedAt: string,
    OrderProduct: OrderProductTypes[],
    total: number
}
export type OrderProductTypes = {
    orderId: number,
    productId: number,
    quantity: number,
    product: ProductData

}
export type OrderStatus = 'CREATED' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED'

export type CampaignTypes = {
    id: string,
    name: string,
    mediaPath?: string,
    schedule: string,
    recipients: string[],
    registrationMessage: string,
    registrationSyntax: string,
    unregistrationSyntax: string,
    successMessage: string,
    failedMessage: string,
    unregisteredMessage: string,
    device: {
        name: string
    }
}
export type GetCampaign = {
    id: string,
    name: string,
    status: boolean,
    recipients: string[],
    registrationSyntax: string,
    device: {
        name: string
    },
    createdAt: string,
    updatedAt: string
}
export type CampaignMessageStatus = 'registrationMessage' | 'successMessage' | 'failedMessage' | 'unregisteredMessage'
export type CampaignMessageTypes = {
    pkId: number,
    id: string,
    name: string,
    campaignId: number,
    message: string,
    mediaPath?: string,
    delay: number,
    isSent: boolean,
    schedule: string,
    createdAt: string,
    updatedAt: string
}
export interface CampaignMessageForm {
    name: string,
    campaignId: string,
    message: string,
    schedule: string,
    delay: number
}
export type CampaignMessageDetail = {
    pkId: number,
    id: string,
    to: string,
    message: string,
    mediaPath?: string,
    schedule: string,
    status: string,
    createdAt: string,
    updatedAt: string,
    sessionId: string,
    contactId: number,
    contact: Contact
}
export type GroupDataTypes = {
    pkId: number,
    id: string,
    name: string,
    type: string,
    membersCount: number,
    createdAt: string,
    updatedAt: string,
    contactGroups?: ContactGroup[],
    userId: string,
}
export interface ContactGroup {
    pkId: number,
    id: string,
    contactId: number,
    groupId: number,
    contact: ContactData
}
export type MessageTableStatus = 'Terkirim' | 'Diterima' | 'Terbaca' | 'Balasan'