import React, { useState, useEffect } from 'react';
import './App.css';
import { useWeather } from './weather/use-weather';
import { getWeatherBackgroundImage } from './weather/weather-background';
import WeatherInput from './components/weather-input';
import WeatherDisplay from './components/weather-display';

const App: React.FC = () => {
  const {
    city,
    setCity,
    weatherData,
    error,
    loading,
    fetchWeatherByCity,
    fetchWeatherByLocation,
    getClothingSuggestion,
  } = useWeather();

  const [backgroundImage, setBackgroundImage] = useState<string>('default_background.png');

  useEffect(() => {
    if (weatherData) {
      const weatherCondition = weatherData.weather.toLowerCase();
      getWeatherBackgroundImage(weatherCondition).then((imageUrl) => {
        if (imageUrl) {
          setBackgroundImage(imageUrl);
        }
      });
    }
  }, [weatherData]);

  return (
    <div
      className="min-h-screen bg-cover bg-center p-8"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <h1 className="text-4xl font-bold text-white text-center mb-8">What Should You Wear?</h1>

      <WeatherInput
        city={city}
        onCityChange={setCity}
        onSubmit={() => fetchWeatherByCity(city)} // Pass city to fetchWeatherByCity
        onUseLocation={() => {
          navigator.geolocation.getCurrentPosition(
            (pos) => fetchWeatherByLocation(pos.coords.latitude, pos.coords.longitude),
            (err) => console.error(err)
          );
        }}
      />

      {loading && <p className="text-white mt-4">Loading...</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {weatherData && (
        <WeatherDisplay
          temp={weatherData.temp}
          weather={weatherData.weather}
          suggestion={getClothingSuggestion(weatherData.temp, weatherData.weather)}
        />
      )}
    </div>
  );
};

export default App;