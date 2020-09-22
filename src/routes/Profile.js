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
        <div className="container">
            <form onSubmit={onSubmit} className="profileForm">
                <input
                    type="text"
                    placeholder="Display name"
                    onChange={onChange}
                    value={newDisplayName}
                    autoFocus
                    className="formInput"
                />
                <input
                    type="submit"
                    value="Update Profile"
                    className="formBtn"
                    style={{
                        marginTop: 10,
                    }}
                />
            </form>
            <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
                Log Out
            </span>
        </div>
    )
}
