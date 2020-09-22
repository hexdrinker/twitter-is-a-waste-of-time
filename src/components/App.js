import React, { useState, useEffect } from 'react';
import AppRouter from 'components/Router';
import { authService } from 'fbase';

function App() {
    const [init, setInit] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userObj, setUserObj] = useState(null);

    useEffect(() => {
        authService.onAuthStateChanged(user => {
            if (user) {
                setIsLoggedIn(true);
                // 1번
                setUserObj(user);
                // 2번
                // setUserObj({
                //     displayName: user.displayName,
                //     uid: user.uid,
                //     updateProfile: (args) => user.updateProfile(args)
                // });
            } else {
                setIsLoggedIn(false);
            }
            setInit(true);
        });
    }, []);

    const refreshUser = () => {
        const user = authService.currentUser;
        // 1번
        setUserObj(Object.assign({}, user));
        // 2번
        // setUserObj({
        //     displayName: user.displayName,
        //     uid: user.uid,
        //     updateProfile: (args) => user.updateProfile(args)
        // });
    }
    
    return (
        <>
            {init
                ? (
                    <AppRouter
                        refreshUser={refreshUser}
                        isLoggedIn={isLoggedIn}
                        userObj={userObj}
                    />
                ) : "Initializing..."
            }
            {/* <footer>&copy; {new Date().getFullYear()} twitter is a waste of time</footer> */}
        </>
    );
}

export default App;
