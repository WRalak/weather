import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  Keyboard,
  Alert,
} from 'react-native';
import axios from 'axios';

const API_KEY = '27d54004c3e44ef0a8fe3ba8f79bada7';

export default function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    if (!city.trim()) {
      Alert.alert('Error', 'Please enter a city name');
      return;
    }

    const formattedCity = city.trim().charAt(0).toUpperCase() + city.trim().slice(1).toLowerCase();

    setLoading(true);
    setError('');
    setWeather(null);
    Keyboard.dismiss();

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${formattedCity}&appid=${API_KEY}&units=metric`
      );
      setWeather(response.data);
    } catch (err) {
      if (err.response) {
        // API responded with an error status
        if (err.response.status === 404) {
          setError('City not found. Please check spelling.');
        } else {
          setError('Server error. Try again later.');
        }
      } else if (err.request) {
        // Request was made but no response received
        setError('Network error. Check your internet connection.');
      } else {
        setError('Unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Weather App</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter city"
          value={city}
          onChangeText={setCity}
        />
        <TouchableOpacity style={styles.button} onPress={fetchWeather}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {weather?.weather ? (
        <View style={styles.weatherContainer}>
          <Text style={styles.city}>{weather?.name}</Text>
          <Text style={styles.description}>{weather?.weather?.[0]?.description}</Text>
          <Text style={styles.temp}>{weather?.main?.temp}°C</Text>
          <Image
            style={styles.icon}
            source={{
              uri: `https://openweathermap.org/img/wn/${weather?.weather?.[0]?.icon}@2x.png`,
            }}
          />
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    width: '90%',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    backgroundColor: '#fff',
  },
  button: {
    marginLeft: 10,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  weatherContainer: {
    alignItems: 'center',
  },
  city: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 18,
    textTransform: 'capitalize',
  },
  temp: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  icon: {
    width: 100,
    height: 100,
  },
  error: {
    color: 'red',
    fontSize: 16,
    marginVertical: 10,
  },
});
