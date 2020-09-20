import Twit from 'components/Twit';
import { dbService } from 'fbase';
import React, { useState, useEffect } from 'react'

export default function Home({ userObj }) {
    const [twit, setTwit] = useState("");
    const [twits, setTwits] = useState([]);
    const [attachment, setAttachment] = useState();
    /*
    실시간 아님, 좀 오래된 방식
    
    const getTwits = async () => {
        const dbTwits = await dbService.collection("twits").get();
        dbTwits.forEach(document => {
            const twitObj = {
                ...document.data(),
                id: document.id
            }
            setTwits(prev => [twitObj, ...prev]);
        });
    }
    */
    
    useEffect(() => {
        // getTwits();
        dbService.collection("twits").onSnapshot(snapshot => {
            const twitArray = snapshot.docs.map(doc => ({ 
                id: doc.id,
                ...doc.data()
            }));
            setTwits(twitArray);
        })
    }, []);

    const onSubmit = async e => {
        e.preventDefault();
        await dbService.collection("twits").add({
            text: twit,
            createdAt: Date.now(),
            creatorId: userObj.uid
        });
        setTwit("");
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
        <div>
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
                        <img src={attachment} width="50px" height="50px" />
                        <button onClick={onClearAttachment}>Clear</button>
                    </div>
                )}
            </form>
            <div>
                {twits.map(twit => (
                    <Twit
                        key={twit.id}
                        twitObj={twit}
                        isOwner={twit.creatorId === userObj.uid}
                    />
                ))}
            </div>
        </div>
    )
}
