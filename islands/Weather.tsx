import { FunctionComponent } from "preact";
import { useEffect, useState } from "preact/hooks";

type WeatherData = {
  temperature: number;
  precipitation: number;
  rain: number;
  weatherCode: number;
  cloudCover: number;
};

type Location = {
  name: string;
  latitude: number;
  longitude: number;
};

type Props = {
  page?: string;
};

const predefinedLocations: { [name: string]: Location } = {
  "Madrid, Spain": {
    name: "Madrid, Spain",
    latitude: 40.4165,
    longitude: -3.7026,
  },
  "Lisbon, Portugal": {
    name: "Lisbon, Portugal",
    latitude: 38.7167,
    longitude: -9.1333,
  },
  "Paris, France": {
    name: "Paris, France",
    latitude: 48.8534,
    longitude: 2.3488,
  },
  "Amsterdam, North Holand": {
    name: "Amsterdam, North Holand",
    latitude: 52.374,
    longitude: 4.8897,
  },
};

const Weather: FunctionComponent<Props> = ({ page }) => {
  const [location, setLocation] = useState<Location>(predefinedLocations["Madrid, Spain"]);
  const [weatherInfo, setWeatherInfo] = useState<WeatherData>({
    temperature: 0,
    precipitation: 0,
    rain: 0,
    weatherCode: 0,
    cloudCover: 0,
  });
  const [showData, setShowData] = useState({
    temperature: true,
    precipitation: true,
    rain: false, 
    weatherCode: false, 
    cloudCover: false,
  });

  useEffect(() => {
    fetchWeatherData(location.latitude, location.longitude);
  }, [location]);

  const fetchWeatherData = (latitude: number, longitude: number) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,rain,weather_code,cloud_cover&hourly=temperature_2m`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setWeatherInfo({
          temperature: data.current.temperature_2m,
          precipitation: data.current.precipitation,
          rain: data.current.rain,
          weatherCode: data.current.weather_code,
          cloudCover: data.current.cloud_cover,
        });
      })
      .catch((error) => {
        console.error("ERROR", error);
      });
  };

  const ChangeLocation = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const newLocation = target.value;
    setLocation(predefinedLocations[newLocation] || predefinedLocations["Madrid, Spain"]);
  };

  const ChangeData = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const dataKey = target.id as keyof WeatherData; 
    setShowData({ ...showData, [dataKey]: target.checked });
  };

  return (
    <div class="weather">
      <h1>Tiempo</h1>
      <div>
        <label for="location">Que ciudad quieres ver?:</label>
        <select id="location" onChange={ChangeLocation}>
          {Object.keys(predefinedLocations).map((locationName) => (
            <option key={locationName} value={locationName}>
              {locationName}
            </option>
          ))}
        </select>
      </div>
      <div>
        <h2>Que quieres ver?:</h2>
        <label for="temperature">
          <input type="checkbox" id="temperature" checked={showData.temperature} onChange={ChangeData} />
          Temperatura
        </label>
        <label for="precipitation">
          <input type="checkbox" id="precipitation" checked={showData.precipitation} onChange={ChangeData} />
          Precipitacion
        </label>
        <label for="rain">
          <input type="checkbox" id="rain" checked={showData.rain} onChange={ChangeData} />
          Lluvia
        </label>
        <label for="weatherCode">
          <input type="checkbox" id="weatherCode" checked={showData.weatherCode} onChange={ChangeData} />
          Weather Code
        </label>
        <label for="cloudCover">
          <input type="checkbox" id="cloudCover" checked={showData.cloudCover} onChange={ChangeData} />
          Nuves
        </label>
      </div>
      <div>
        <h2>Tiempo actual:</h2>
        {showData.temperature && (
          <div>
            <label for="temperature">Temperatura:</label>
            <span id="temperature">{weatherInfo.temperature}°C</span>
          </div>
        )}
        {showData.precipitation && ( 
          <div>
            <label for="precipitation">Precipitacion:</label>
            <span id="precipitation">{weatherInfo.precipitation}mm</span>
          </div>
        )}
        {showData.rain && (
          <div>
            <label for="rain">Lluvia:</label>
            <span id="rain">{weatherInfo.rain}mm</span>
          </div>
        )}
        {showData.weatherCode && (
          <div>
            <label for="weatherCode">Weather Code:</label>
            <span id="weatherCode">{weatherInfo.weatherCode}</span>
          </div>
        )}
        {showData.cloudCover && (
          <div>
            <label for="cloudCover">Nuves:</label>
            <span id="cloudCover">{weatherInfo.cloudCover}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;

