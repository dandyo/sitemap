import { Navigate } from 'react-router-dom'
import { UserAuth } from './AuthContext'

export default function PrivateRoute({ children }) {
    const { user } = UserAuth();

    if (!user) {
        return <Navigate to='/login' replace />
    }

    return children
}