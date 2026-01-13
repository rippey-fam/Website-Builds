import { useState, useEffect } from "react";
// import { JsonView, allExpanded, defaultStyles } from "react-json-view-lite";
import "./App.css";
import CurrentTime from "./components/CurrentTime";
import CurrentWeather from "./components/CurrentWeather";
import HourlyWeather from "./components/HourlyWeather";
import WeeklyWeather from "./components/WeeklyWeather";

const myAPIkey = "086b818add652059dd9241a94029b051";
const myLat = 43.612892903576466;
const myLon = -116.4530197170302;

const delay = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));

function useAsync(callback) {
    const [state, setState] = useState({
        state: "loading",
        data: null,
        error: null,
    });

    useEffect(() => {
        let unmounted = false;
        async function run() {
            try {
                await delay(1);
                if (unmounted) return;
                const data = await callback();
                if (unmounted) return;
                setState({
                    state: "ready",
                    data,
                    error: null,
                });
            } catch (error) {
                if (unmounted) return;
                setState({
                    state: "error",
                    data: null,
                    error,
                });
            }
        }
        run();

        return () => {
            unmounted = true;
        };
    }, []);

    return state;
}

const getWeather = async (lat, lon, APIkey, type) => {
    // if (!localStorage.getItem("weather-APIcount-day")) {
    //     localStorage.setItem("weather-APIcount-day", Date.now());

    //     localStorage.setItem("weather-APIcount", callsCount);
    // } else {
    //     if (localStorage.getItem("weather-APIcount-day") + 24 * 60 * 60 * 1000 < Date.now()) {
    //         console.log("NEW DAY!");
    //         localStorage.setItem("weather-APIcount", 0);
    //         setCallsCount(0);
    //     } else {
    //         const newCallsCount = callsCount + 1;
    //         setCallsCount(newCallsCount);
    //         localStorage.setItem("weather-APIcount", newCallsCount);
    //     }
    // }

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/${type}?lat=${lat}&lon=${lon}&appid=${APIkey}&units=imperial`,
        );
        const parsedResponse = await response.json();
        console.log(parsedResponse);
        return parsedResponse;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export default function App() {
    const weatherData = useAsync(async function () {
        const data = await getWeather(myLat, myLon, myAPIkey, "weather");
        return data;
    });
    const forecastData = useAsync(async function () {
        const data = await getWeather(myLat, myLon, myAPIkey, "forecast");
        return data;
    });
    const hourly = forecastData.data ? forecastData.data : "Loading";
    const daily = forecastData.data ? forecastData.data : "Loading";

    return (
        <>
            <CurrentTime />
            <CurrentWeather weather={weatherData.data} />
            <HourlyWeather weather={hourly} />
            <WeeklyWeather weather={daily} />
        </>
    );

    // const [weather, setWeather] = useState(null);
    // const [callsCount, setCallsCount] = useState(parseInt(localStorage.getItem("weather-APIcount") || 0));
    // return (
    //     <div>
    //         {weather ? (
    //             <JsonView data={weather} shouldExpandNode={allExpanded} style={defaultStyles} />
    //         ) : (
    //             <>
    //                 Loading... <br /> <br />
    //             </>
    //         )}
    //         <button
    //             onClick={() => {
    //                 getWeather(myLat, myLon, myAPIkey);
    //             }}
    //         >
    //             Get Weather
    //         </button>
    //         <p>API Calls count this day: {callsCount}</p>
    //         <p>Last "Day": {new Date(parseFloat(localStorage.getItem("weather-APIcount-day")) || 0).toString()}</p>
    //     </div>
    // );
}
