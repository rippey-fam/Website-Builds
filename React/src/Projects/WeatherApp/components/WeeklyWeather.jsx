import DayWeather from "./DayWeather";
import styles from "./css/styles.module.css";
export default function WeeklyWeather({ weather }) {
    return (
        <div className={styles.weeklyWeather}>
            {weather?.list?.map((dayWeather, index) => (
                <DayWeather key={index} weather={dayWeather} />
            ))}
        </div>
    );
}
