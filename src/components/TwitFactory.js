import React, { useState } from 'react'
import { dbService, storageService } from 'fbase';
import { v4 as uuidv4 } from 'uuid';

export default function TwitFactory({ userObj }) {
    const [twit, setTwit] = useState("");
    const [attachment, setAttachment] = useState("");

    const onSubmit = async e => {
        e.preventDefault();
        let attachmentUrl = "";
        if (attachment !== "") {
            const fileRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
            const response = await fileRef.putString(attachment, "data_url");
            attachmentUrl = await response.ref.getDownloadURL();
        }
        const twitObj = {
            text: twit,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl
        }
        await dbService.collection("twits").add(twitObj);
        setTwit("");
        setAttachment("");
    }
    
    const onChange = e => {
        const { target: { value }} = e;
        setTwit(value);
    }

    const onFileChange = e => {
        const { target: { files }} = e;
        const theFile = files[0];
        const reader = new FileReader(); // file api
        reader.onloadend = (finishedEvent) => {
            const { currentTarget: { result }} = finishedEvent;
            setAttachment(result);
        }
        reader.readAsDataURL(theFile);
    }

    const onClearAttachment = () => setAttachment();

    return (
        <form onSubmit={onSubmit}>
            <input
                value={twit}
                onChange={onChange}
                type="text"
                placeholder="What's on your mind?"
                maxLength={120}
            />
            <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
            />
            <input type="submit" value="twit" />
            {attachment && (
                <div>
                    <img src={attachment} width="50px" height="50px" alt="" />
                    <button onClick={onClearAttachment}>Clear</button>
                </div>
            )}
        </form>
    )
}
