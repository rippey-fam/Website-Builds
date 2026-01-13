import styles from "./css/styles.module.css";
export default function CurrentWeather({ weather }) {
    return (
        <div className={styles.currentWeather}>
            <div>
                <span style={{ font: "bold 48px Arial" }}>{weather?.name}</span>
                <br />
                {new Date(weather?.dt * 1000 + weather?.timezone).toDateString()}
            </div>
            <div>
                {weather ? <img src={"./images/" + weather?.weather[0].icon + ".png"} /> : ""} <br />{" "}
                {weather?.weather[0].description}
            </div>
            <div style={{ font: "bold 48px Arial" }}>{parseInt(weather?.main.temp)}°</div>
        </div>
    );
}
