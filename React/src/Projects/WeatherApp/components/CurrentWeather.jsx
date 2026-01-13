import styles from "./css/styles.module.css";
export default function CurrentWeather({ weather }) {
    return (
        <div className={styles.currentWeather}>
            <div>
                {weather?.name}
                <br />
                {new Date(weather?.dt + weather?.timezone).toDateString()}
            </div>
            <div>
                {weather ? <img src={"./images/" + weather?.weather[0].icon + ".png"} /> : ""} <br />{" "}
                {weather?.weather[0].description}
            </div>
            <div style={{ font: "bold 48px Arial" }}>{parseInt(weather?.main.temp)}°</div>
        </div>
    );
}
