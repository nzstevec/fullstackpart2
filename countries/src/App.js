import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({ search, handleSearchChange }) => {
  return (
    <div>
      Find countries <input value={search} onChange={handleSearchChange} />
    </div>
  )
}

const GetWeather = (country, setWeather) => {
  console.log(`getweather for ${country.name.official}`)
  const apikey = process.env.REACT_APP_APIKEY
  const lat = country.capitalInfo.latlng[0]
  const lon = country.capitalInfo.latlng[1]
  axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric`)
    .then(response => {
      // console.log("getweather response ", response.data)
      setWeather(response.data)
    })
}

const degToCompass = (num) => {
  var val = Math.floor((num / 22.5) + 0.5);
  var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return arr[(val % 16)];
}

const Weather = ({ country, weather }) => {
  if (weather !== null) {
    console.log("weather ", weather)
    return (
      <>
        <h2>Weather in {country.capital} </h2>
        <p>temperature {weather.main.temp} Celcius</p>
        <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          alt="{weather.weather[0].description}" />
        <p>wind {weather.wind.speed} m/s {degToCompass(weather.wind.deg)}</p>
      </>
    )
  }
}

const Country = ({ country }) => {
  return (
    <>
      <h2>{country.name.official}</h2>
      <p>Capital {country.capital}</p>
      <h3>Languages:</h3>
      <ul>
        {Object.values(country.languages).map(l => <li key={l}>{l}</li>)}
      </ul>
      <img src={country.flags.png} alt="{country.flag}" />
    </>
  )
}

const Countries = (props) => {
  console.log("Countries props ", props)
  const matchedCountries = props.countries
    .filter(country => country.name.official.search(new RegExp(props.search, "i")) >= 0)

  if (props.country !== null) {
    return (
      <>
        <Country country={props.country} />
      </>
    )
  }

  if (matchedCountries.length > 10) {
    return (
      <p>Too many matches, specify another filter</p>
    )
  }

  if (matchedCountries.length > 1) {
    return (
      <ul>
        {matchedCountries.map(country => {
          return (
            <li key={country.name.official}>
              {country.name.official}
              <button onClick={() => props.handleShow(country)}>show</button>
            </li>
          )
        })}
      </ul>
    )
  }

  if (matchedCountries.length === 1) {
    return (
      <Country country={matchedCountries[0]} />
    )
  }
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [country, setCountry] = useState(null)
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    console.log("effect")
    axios.get('https://restcountries.com/v3.1/all')
      .then(response => {
        console.log(response)
        setCountries(response.data)
      })
  }, [])

  const handleShow = (country) => {
    console.log("show country", country.name.official)
    setCountry(country)
    GetWeather(country, setWeather)
  }

  const handleSearchChange = (event) => {
    console.log(event.target.value)
    setSearch(event.target.value)
    setCountry(null)
    setWeather(null)
  }

  return (
    <>
      <h2>Countries</h2>
      <Filter search={search} handleSearchChange={handleSearchChange} />
      <Countries
        countries={countries}
        country={country}
        search={search}
        handleShow={handleShow}
        setWeather={setWeather} />
      <Weather country={country} weather={weather} />
    </>
  )
}

export default App