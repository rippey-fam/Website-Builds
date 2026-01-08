import { useState } from "react";
import "./App.css";

const myAPIkey = "086b818add652059dd9241a94029b051";
const myLat = 43.612892903576466;
const myLon = -116.4530197170302;

const getWeather = async (lat, lon, APIkey) => {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}`,
    );
    const parsedResponse = await response.json();
    console.log(parsedResponse);
};
await getWeather(myLat, myLon, myAPIkey);

export default function App() {}
