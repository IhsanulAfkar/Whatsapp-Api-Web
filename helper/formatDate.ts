export const formatDate = (inputDate: string) => {

    const date = new Date(inputDate)
    const formatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    })
    try {
        return formatter.format(date).toString()
    } catch (error) {
        console.log(error)
        return inputDate

    }
}