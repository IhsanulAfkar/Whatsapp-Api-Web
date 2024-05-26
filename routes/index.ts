import routes from "./routes"
type Route = (name: string, params?: { [key: string]: any }) => string
const route: Route = (name, params = {}) => {

    if (!routes[name]) {
        throw new Error(
            `Route ${name} not found. Make sure you have added it to the routes.js file.`
        )
    }

    const url = routes[name]

    if (!params) {
        return url.path
    }

    return Object.keys(params).reduce((path, key) => {
        return path.replace(`{${key}}`, params[key])
    }, url.path)
}

export default route