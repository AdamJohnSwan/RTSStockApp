import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getApiError } from '../helpers/getApiError';
import './Register.css';

async function createAccount(email: string, password: string) {
    const response = await fetch(`api/v1/register`, {
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
}

export function Register() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<Error | undefined>(undefined);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            return;
        }
        setIsFetching(true);
        try {
            await createAccount(email, password);
            navigate('/login?created=true');
        }
        catch (err) {
            setError(err as Error);
        }
        finally
        {
            setIsFetching(false);
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
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
                        Register
                    </button>
                }
            </form>
            <div className="error">
                {error?.message}
            </div>
            <Link to="/login">Have an account? Sign In</Link>
        </div>
    );
};