type Routes = { [key: string]: { path: string } }
const routes: Routes = {
    'signin': {
        path: '/auth/signin'
    },
    'signup': {
        path: '/auth/signup'
    },
    'dashboard': {
        path: '/dashboard'
    },
    'messenger': {
        path: '/dashboard/messenger'
    },
    'contact': {
        path: '/dashboard/contact'
    },
    'group': {
        path: '/dashboard/group'
    },
    'create.group': {
        path: '/dashboard/group/create'
    },
    'broadcast': {
        path: '/dashboard/broadcast'
    },
    'create.broadcast': {
        path: '/dashboard/broadcast/create'
    },
    'autoReply': {
        path: '/dashboard/auto-reply'
    },
    'campaign': {
        path: '/dashboard/campaign'
    },
    'create.campaign': {
        path: '/dashboard/campaign/create'
    },
    'product': {
        path: '/dashboard/product'
    },
    'create.product': {
        path: '/dashboard/product/create'
    },
    'order': {
        path: '/dashboard/order'
    },
    'setting': {
        path: '/dashboard/setting'
    }
}
export default routes