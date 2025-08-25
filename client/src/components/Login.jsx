import { useState } from 'react';

export function Login({ onSubmit }) {

    const [username, setUsername] = useState('');

    return (
        <>
            <h1>Welcome</h1>
            <p>What should people call you?</p>
            <form onSubmit={(e) => {
                e.preventDefault(); // Prevent the default form submission behavior // Dont want to reload the page
                onSubmit(username); // Call the onSubmit function passed as a prop with the username
            }}
            >
                <input
                    type="text"
                    value={username}
                    placeholder="Enter your username"
                    onChange={(e) => setUsername(e.target.value)} // Update the username state when input changes
                />
                <input type="submit" /> {/* Submit button to submit the form */}
            </form>
        </>
    )
}