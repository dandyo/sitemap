import { UrlsContext } from "../context/UrlContext"
import { useContext } from "react"

export const useUrlsContext = () => {
    const context = useContext(UrlsContext)

    if (!context) {
        throw Error('useUrlsContext mus be used inside a UrlsContextProvider')
    }

    return context
}