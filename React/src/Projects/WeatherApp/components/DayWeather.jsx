export default function DayWeather({ weather }) {
    return (
        <div>
            {weather ? <img src={"./images/" + weather?.weather[0].icon + ".png"} /> : ""} <br />
            {weather?.weather[0].description}
        </div>
    );
}
