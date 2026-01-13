import DayWeather from "./DayWeather";
export default function WeeklyWeather({ weather }) {
    return (
        <div>
            {weather?.list?.map((dayWeather, index) => (
                <DayWeather key={index} weather={dayWeather} />
            ))}
        </div>
    );
}
