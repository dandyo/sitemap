import { createContext, useReducer } from "react"

export const UrlsContext = createContext()

export const urlsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_URLS':
            return {
                urls: action.payload
            }
        case 'CREATE_URLS':
            return {
                urls: [action.payload, ...state.urls]
            }
        case 'DELETE_URLS':
            return {
                urls: state.urls.filter((w) => w._id !== action.payload._id)
            }
        default:
            return state
    }
}

export const UrlsContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(urlsReducer, {
        urls: null
    })

    // dispatch({type: 'SET_URLS', payload: [{}, {}]})

    return (
        <UrlsContext.Provider value={{ ...state, dispatch }}>
            {children}
        </UrlsContext.Provider>
    )
}