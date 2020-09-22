import { dbService, storageService } from 'fbase';
import React, { useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

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
        <div className="twit">
            {
                editing ? (
                    <>
                        {isOwner && 
                            <>
                                <form onSubmit={onSubmit} className="container twitEdit">
                                    <input
                                        type="text"
                                        value={newTwit}
                                        placeholder="Edit twit"
                                        onChange={onChange}
                                        autoFocus
                                        required
                                        className="formInput"
                                    />
                                    <input
                                        type="submit"
                                        value="Update twit"
                                        className="formBtn"
                                    />
                                </form>
                                <span onClick={toggleEditing} className="formBtn cancelBtn">
                                    Cancel
                                </span>
                            </>
                        }
                    </>
                ) : (
                    <>
                        <h4>{twitObj.text}</h4>
                        {twitObj.attachmentUrl && <img src={twitObj.attachmentUrl} alt="" />}
                        {isOwner && (
                            <div className="twit__actions">
                                <span onClick={onDeleteClick}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </span>
                                <span onClick={toggleEditing}>
                                    <FontAwesomeIcon icon={faPencilAlt} />
                                </span>
                            </div>
                        )}
                    </>
                )
            }
        </div>
    )
}
