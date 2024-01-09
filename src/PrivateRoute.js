import { Navigate } from 'react-router-dom'
import { UserContext } from './AuthContext'

export default function PrivateRoute({ children }) {
    const { user } = UserContext();

    if (!user) {
        return <Navigate to='/login' replace />
    }

    return children
}