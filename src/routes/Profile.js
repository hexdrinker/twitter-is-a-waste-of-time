import { authService, dbService } from 'fbase'
import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';

export default function Profile({ refreshUser, userObj }) {
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const history = useHistory();
    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    }

    const getMyTwits = async () => {
        const twits = dbService
            .collection("twits")
            .where("creatorId", "==", userObj.uid)
            .orderBy("createdAt")
            .get();
    }

    const onChange = e => {
        const { target: { value }} = e;
        setNewDisplayName(value);
    }

    const onSubmit = async e => {
        e.preventDefault();
        if (userObj.displayName !== newDisplayName) {
            await userObj.updateProfile({
                displayName: newDisplayName
            });
            refreshUser();
        }
    }

    useEffect(() => {
        getMyTwits();
    }, []);
    return (
        <>
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    placeholder="Display name"
                    onChange={onChange}
                    value={newDisplayName} 
                />
                <input
                    type="submit"
                    value="Update Profile"
                />
            </form>
            <button onClick={onLogOutClick}>Log Out</button> 
        </>
    )
}
