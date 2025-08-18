import { useEffect, useRef } from 'react';
import useWebSocket from 'react-use-websocket';

import throttle from 'lodash.throttle';
import { Cursor } from './components/Cursor';

const renderCursors = (users, myUsername) => { // Take two parameters, users and myUsername - remove to just users if u want to undo
    //Remove .filter if you want to render all cursors, including your own
    return Object.keys(users).filter(username => username !== myUsername).map(uuid => {
        const user = users[uuid];
        return (
            <Cursor key={uuid} point={[user.state.x, user.state.y]} />
        );
    })

}


//Used to create avatar stack.
const renderUserList = user => {
    return (
        <ul>
            {Object.keys(user).map(uuid => {
                return (
                    <li key={uuid}>{JSON.stringify(user[uuid])}</li>
                )
            })}
        </ul>
    )
}

export function Home({ username }) {

    const WS_URL = `ws://localhost:8000`; // WebSocket URL with username as query parameter
    const { sendJsonMessage, lastJsonMessage } = useWebSocket(WS_URL, {
        queryParams: { username }, // Pass username as a query parameter

    });




    const THROTTLE = 50;  //Throttle time in milliseconds

    //Dont call this function any more than every 50 milliseconds
    const sendJsonMessageThrottled = useRef(throttle(sendJsonMessage, THROTTLE));
    useEffect(() => {
        //Ask server to send everyones state the second the component is loaded.
        sendJsonMessage({
            x: 0,
            y: 0
        });// Send initial position

        //Every time the mouse moves, send the current position
        //This will be throttled to avoid sending too many messages
        window.addEventListener('mousemove', e => {
            // Throttle the sendJsonMessage function to avoid sending too many messages
            sendJsonMessageThrottled.current({
                x: e.clientX,
                y: e.clientY,
            })
        })
    }, []);


    if (lastJsonMessage) {
        return (
            <>
                {renderCursors(lastJsonMessage,username)}
                {renderUserList(lastJsonMessage)}
            </>
        )
    }
    return (
        <h1>Hello , {username} </h1>
    )
}