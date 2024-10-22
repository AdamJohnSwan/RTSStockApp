import { createElement, PropsWithChildren, useEffect } from "react";
import {
    createBrowserRouter,
    RouterProvider,
    useNavigate,
} from "react-router-dom";
import { StockCheck } from "./StockCheck";
import { Login } from "./Login";
import { Layout } from "../Layout";
import { Register } from "./Register";

function AuthRoute({ children }: PropsWithChildren) {
    const accessToken = localStorage.getItem('accessToken');
    const navigate = useNavigate();
    useEffect(() => {
        if (!accessToken) {
            navigate('/login');
        }
    }, [accessToken]);

    return children;
}

/**
 * Application routes
 * https://reactrouter.com/en/main/routers/create-browser-router
 */
export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            { path: "login", element: <Login /> },
            { path: "register", element: <Register /> },
        ],
    },
    {
        path: "/",
        element: <AuthRoute><Layout /></AuthRoute>,
        children: [
            { index: true, element: <StockCheck /> },
        ],
    },
]);

export function Router(): JSX.Element {
    return createElement(RouterProvider, { router });
}

// Clean up on module reload (HMR)
// https://vitejs.dev/guide/api-hmr
if (import.meta.hot) {
    import.meta.hot.dispose(() => router.dispose());
}