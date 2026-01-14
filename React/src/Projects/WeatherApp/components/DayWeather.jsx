export default function DayWeather({ weather }) {
    const date = new Date(weather?.dt * 1000);
    function day(dayOfTheWeek) {
        switch (dayOfTheWeek) {
            case 0:
                return "Sunday";
            case 1:
                return "Monday";
            case 2:
                return "Tuesday";
            case 3:
                return "Wednesday";
            case 4:
                return "Thursday";
            case 5:
                return "Friday";
            case 6:
                return "Saturday";
        }
    }
    return (
        <div>
            {day(date.getDay())} {date.toTimeString()}
            <br />
            {weather ? <img src={"./images/" + weather?.weather[0].icon + ".png"} /> : ""} <br />
            {weather?.weather[0].description}
        </div>
    );
}
