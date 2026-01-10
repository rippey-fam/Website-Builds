import { useState } from "react";
import { JsonView, allExpanded, defaultStyles } from "react-json-view-lite";
import "./App.css";

const myAPIkey = "086b818add652059dd9241a94029b051";
const myLat = 43.612892903576466;
const myLon = -116.4530197170302;

export default function App() {
    const [weather, setWeather] = useState(null);
    const [callsCount, setCallsCount] = useState(parseInt(localStorage.getItem("weather-APIcount") || 0));
    const getWeather = async (lat, lon, APIkey) => {
        if (!localStorage.getItem("weather-APIcount-day")) {
            localStorage.setItem("weather-APIcount-day", Date.now());
            setCallsCount(callsCount + 1);
            localStorage.setItem("weather-APIcount", callsCount);
        } else {
            if (localStorage.getItem("weather-APIcount-day") + 24 * 60 * 60 * 1000 < Date.now()) {
                console.log("NEW DAY!");
                localStorage.setItem("weather-APIcount", 0);
                setCallsCount(0);
            } else {
                const newCallsCount = callsCount + 1;
                setCallsCount(newCallsCount);
                localStorage.setItem("weather-APIcount", newCallsCount);
            }
        }

        try {
            /**
             * @type { 'weather' | 'forecast' }
             */
            const type = "weather";
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/${type}?lat=${lat}&lon=${lon}&appid=${APIkey}`,
            );
            const parsedResponse = await response.json();
            console.log(parsedResponse);
            setWeather(parsedResponse);
        } catch (error) {
            console.log(error);
            setWeather(error);
        }
    };
    return (
        <div>
            {weather ? (
                <JsonView data={weather} shouldExpandNode={allExpanded} style={defaultStyles} />
            ) : (
                <>
                    Loading... <br /> <br />
                </>
            )}
            <button
                onClick={() => {
                    getWeather(myLat, myLon, myAPIkey);
                }}
            >
                Get Weather
            </button>
            <p>API Calls count this day: {callsCount}</p>
            <p>Last "Day": {new Date(parseFloat(localStorage.getItem("weather-APIcount-day")) || 0).toString()}</p>
        </div>
    );
}
