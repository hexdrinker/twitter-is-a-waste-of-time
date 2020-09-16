import { authService, firebaseInstance } from 'fbase';
import React, { useState } from 'react'

export default function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");

    const onChange = e => {
        const { target: { name, value }} = e;
        if (name === 'email') {
            setEmail(value);
        } else if (name === 'password') {
            setPassword(value);
        }
    }
    const onSubmit = async e => {
        e.preventDefault();

        try {
            let data;
            if (newAccount) {
                // create account
                data = await authService.createUserWithEmailAndPassword(email, password);
            } else {
                // login
                data = await authService.signInWithEmailAndPassword(email, password);
            }
        } catch (e) {
            setError(e.message);
        }
    }

    const toggleAccount = () => setNewAccount(prev => !prev);
    
    const onSocialClick = async e => {
        const { target: { name }} = e;
        let provider;
        if (name === 'google') {
            provider = new firebaseInstance.auth.GoogleAuthProvider();
        } else if (name === 'github') {
            provider = new firebaseInstance.auth.GithubAuthProvider();
        }
        const data = await authService.signInWithPopup(provider);
    }
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input
                    name="email"
                    type="text"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={onChange}
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={onChange}
                />
                <input type="submit" value={newAccount ? "Create Account" : "Sign In"} />
                {error}
            </form>
            <span onClick={toggleAccount}>{newAccount ? "Sign in" : "Create Account" }</span>
            <div>
                <button name="google" onClick={onSocialClick}>Continue with google</button>
                <button name="github" onClick={onSocialClick}>Continue with github</button>
            </div>
        </div>
    )
}
