import { dbService, storageService } from 'fbase';
import React, { useState } from 'react'

export default function Twit({ twitObj, isOwner }) {
    const [editing, setEditing] = useState(false);
    const [newTwit, setNewTwit] = useState(twitObj.text);

    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this twit?");
        if (ok) {
            await dbService.doc(`twits/${twitObj.id}`).delete();
            await storageService.refFromURL(twitObj.attachmentUrl).delete();
        }
    }

    const toggleEditing = () => {
        setEditing(prev => !prev);
    }

    const onSubmit = async e => {
        e.preventDefault();
        await dbService.doc(`twits/${twitObj.id}`).update({
            text: newTwit
        });
        setEditing(false);
    }

    const onChange = e => {
        const { target: { value }} = e;
        setNewTwit(value);
    }

    return (
        <div key={twitObj.id}>
            {
                editing ? (
                    <>
                        {isOwner && 
                            <>
                                <form onSubmit={onSubmit}>
                                    <input
                                        type="text"
                                        value={newTwit}
                                        placeholder="Edit twit"
                                        onChange={onChange}
                                        required
                                    />
                                    <input
                                        type="submit"
                                        value="Update twit"
                                    />
                                </form>
                                <button onClick={toggleEditing}>Cancel</button>
                            </>
                        }
                    </>
                ) : (
                    <>
                        <h4>{twitObj.text}</h4>
                        {twitObj.attachmentUrl && <img src={twitObj.attachmentUrl} width="50px" height="50px" alt="" />}
                        {isOwner && (
                            <>
                                <button onClick={onDeleteClick}>Delete Twit</button>
                                <button onClick={toggleEditing}>Edit Twit</button>
                            </>
                        )}
                    </>
                )
            }
        </div>
    )
}
