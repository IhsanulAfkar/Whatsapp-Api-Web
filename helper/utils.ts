

export const getInitials = (name: string) => {
    const words = name.split(' ')
    const initials = words.map((word) => word[0])
    const result = initials.join('').slice(0, 2)

    return result.toUpperCase()
}
export const formatDate = (inputDate: string) => {

    const date = new Date(inputDate)
    const formatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    })
    try {

        return formatter.format(date).toString()
    } catch (error) {
        console.log(error)
        return inputDate

    }
}
export const formatBirthDate = (inputDate: string) => {
    const originalDate = new Date(inputDate)
    const year = originalDate.getFullYear()
    const month = String(originalDate.getMonth() + 1).padStart(2, '0')
    const day = String(originalDate.getDate()).padStart(2, '0')
    return `${month}/${day}/${year}`
}
export const formatBackendBirthDate = (inputDate: any) => {
    const date = new Date(inputDate)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}
export const formatDateBahasa = (inputDate: string) => {
    const days = [
        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu"
    ]

    const months = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember"
    ]
    const today = new Date(inputDate)

    const hari = days[today.getDay()]
    const tanggal = today.getDate()
    const bulan = months[today.getMonth()]
    const tahun = today.getFullYear()

    const result = hari + ", " + tanggal + " " + bulan + " " + tahun

    return result
}
export const getTodayDateBahasa = () => {
    const days = [
        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu"
    ]

    const months = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember"
    ]

    const today = new Date()

    const hari = days[today.getDay()]
    const tanggal = today.getDate()
    const bulan = months[today.getMonth()]
    const tahun = today.getFullYear()

    const result = hari + ", " + tanggal + " " + bulan + " " + tahun

    return result
}
export const formatCurrencyIDR = (number: number) => {
    if (number) {
        const formattedIDR = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(number)
        return formattedIDR
    }
    return '-'
}
export const getFirst2Digits = (text: string) => {
    return text.slice(0, 2)
}
export const getNumberFromString = (text: string | undefined) => {
    if (text) {
        const parts = text.split('@')
        return parts[0]
    }
    return ''
}
export const formatDatetoISO8601 = (date: string) => {
    const dateTime = new Date(date)
    return dateTime.toISOString()
}
export const getYearMonthDate = (date: string) => {
    const dateTime = new Date(date)
    const year = dateTime.getFullYear()
    const month = String(dateTime.getMonth() + 1).padStart(2, '0')
    const day = String(dateTime.getDate()).padStart(2, '0')
    const formattedDate = `${year}.${month}.${day}`

    return formattedDate
}

export const formatHoursMinutes = (minutes: number) => {
    if (isNaN(minutes) || minutes < 0 || minutes > 1440) {
        return "Invalid input"
    }

    var hours = Math.floor(minutes / 60)
    var remainingMinutes = minutes % 60

    // Add leading zero if needed
    var hoursStr = (hours < 10) ? "0" + hours : hours.toString()
    var minutesStr = (remainingMinutes < 10) ? "0" + remainingMinutes : remainingMinutes.toString()

    return hoursStr + ":" + minutesStr
}

export const getArrayFromSet = (currentSet: Set<string> | 'all', itemList: any) => {
    let deletedList = null
    if (currentSet === 'all') {
        deletedList = itemList.map((item: any) => item.id)
    }
    else if ((currentSet as Set<string>).size > 0) {
        deletedList = Array.from(currentSet)
    }
    return deletedList
}


