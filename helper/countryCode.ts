import CountryList from 'country-list-with-dial-code-and-flag'
import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber'
import { CountryCode } from '../types/country'

CountryList.setPhoneNumberUtil(PhoneNumberUtil.getInstance())

const getCountryList = (code?: string): CountryCode[] | CountryCode | undefined => {
    if (code)
        return CountryList.findOneByDialCode(code)
    return CountryList.getAll()
}
const formatPhoneCode = (phone: string, dial_code: string): string => {
    const country = CountryList.findOneByDialCode(dial_code)
    if (country) {
        return country.formatPhoneNumber(phone)
    }
    throw new Error('failed to find country')
}
export { getCountryList, formatPhoneCode }