import { useState } from "react";
import "./App.css";

const quoteOfTheDay = "there are 10 types of people in this world, those who understand binary and those who don't";

function App() {
    const words = quoteOfTheDay.split(" ");
    const [userWord, setUserWord] = useState("");
    return (
        <div>
            <span>{userWord}</span>
            <hr />
            <ul>
                {words.map((val, i) => (
                    <li
                        onClick={(e) => {
                            console.log(e.currentTarget.innerText, val, i);
                            setUserWord(userWord + " " + e.currentTarget.innerText);
                        }}
                        key={i}
                    >
                        {val[0].toUpperCase() + val.slice(1).toLowerCase()}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;

function Avatar(props) {
    return <div className="avatar">Avatar {props.size}</div>;
}
