import Twit from 'components/Twit';
import TwitFactory from 'components/TwitFactory';
import { dbService } from 'fbase';
import React, { useState, useEffect } from 'react'

export default function Home({ userObj }) {
    const [twits, setTwits] = useState([]);
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

    return (
        <div className="container">
            <TwitFactory userObj={userObj} />
            <div style={{ marginTop: 30 }}>
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
