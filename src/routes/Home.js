import { dbService } from 'fbase';
import React, { useState, useEffect } from 'react'

export default function Home() {
    const [twit, setTwit] = useState("");
    const [twits, setTwits] = useState([]);

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
    
    useEffect(() => {
        getTwits();
    }, []);

    const onSubmit = async e => {
        e.preventDefault();
        await dbService.collection("twits").add({
            twit,
            createdAt: Date.now()
        });
        setTwit("");
    }
    const onChange = e => {
        const { target: { value }} = e;
        setTwit(value);
    }
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={twit} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} />
                <input type="submit" value="twit" />
            </form>
            <div>
                {twits.map(twit => (
                    <div key={twit.id}>
                        <h4>{twit.twit}</h4>
                    </div>
                ))}
            </div>
        </div>
    )
}
