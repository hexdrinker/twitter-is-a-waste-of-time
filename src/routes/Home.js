import React, { useState } from 'react'

export default function Home() {
    const [twit, setTwit] = useState("");
    const onSubmit = e => {
        e.preventDefault();

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
        </div>
    )
}
