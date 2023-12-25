import { createContext, useReducer } from "react"

export const UrlsContext = createContext()

export const urlsReducer = (state, action) => {
    switch (action.type) {
        case 'REFRESH_URLS':
            return {
                urls: state.urls
            }

        case 'SET_URLS':
            // console.log(action.payload)

            return {
                urls: action.payload
            }

        case 'CREATE_URLS':
            return {
                urls: [action.payload, ...state.urls]
            }

        case 'DELETE_URL':
            return {
                urls: state.urls.filter((w) => w.id !== action.payload.id)
            }

        case 'UPDATE_URL':
            var i = state.urls.findIndex((obj => obj.id == action.payload.id))
            state.urls[i] = action.payload

            return {
                urls: state.urls
            }

        case 'CHECK_URL':
            console.log(action.payload)
            var i = parseInt(action.payload.index)
            var check = parseInt(action.payload.checked)

            // console.log('i=' + i + ', check=' + check)
            // // let i = state.urls.findIndex((obj => obj.id == action.payload.id))

            // action.payload.checked = (check === 1) ? 0 : 1
            state.urls[i].checked = (check === 1) ? 0 : 1

            return {
                urls: state.urls
            }

        case 'GET_URL':
            return {
                urls: state.urls
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