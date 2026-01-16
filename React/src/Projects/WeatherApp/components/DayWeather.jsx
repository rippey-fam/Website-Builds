import { format } from "date-fns";
export default function DayWeather({ weather }) {
    const date = new Date(weather?.dt * 1000);
    const day = format(date, "EEEE");
    const time = format(date, "h a");
    return (
        <div>
            {day} <br />
            {time} <br />
            {weather ? <img src={"./images/" + weather?.weather[0].icon + ".png"} /> : ""} <br />
            {weather?.weather[0].description}
        </div>
    );
}
