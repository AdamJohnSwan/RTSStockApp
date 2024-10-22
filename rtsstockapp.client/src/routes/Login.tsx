import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { getApiError } from '../helpers/getApiError';
import './Register.css';
import { setLocalStorage } from '../helpers/authFetch';
import { LoginResponse } from '../api/LoginResponse';

async function loginAccount(email: string, password: string) {
    const response = await fetch(`api/v1/login`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });
    if (!response.ok) {
        const err = await getApiError(response);
        throw err;
    }

    const result = await response.json() as LoginResponse;
    return result;
}

export function Login() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<Error | undefined>(undefined);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            return;
        }
        setIsFetching(true);
        try {
            const response = await loginAccount(email, password);
            setLocalStorage(response);
            navigate('/');
        }
        catch (err) {
            setError(err as Error);
        }
        finally {
            setIsFetching(false);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <div>
                {searchParams.has('created') && <div className="success">Registration successful.</div>}
            </div>
            <form onSubmit={handleLogin}>
                <div className="inputs">
                    <div>
                        <label htmlFor="email">Email</label>
                        <input
                            type="text"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>
                {isFetching ?
                    <div className="spinner"></div>
                    :
                    <button disabled={isFetching || !email || !password} type="submit">
                        Login
                    </button>
                }
            </form>
            <div className="error">
                {error?.message}
            </div>
            <Link to="/register">Sign Up</Link>
        </div>
    );
};