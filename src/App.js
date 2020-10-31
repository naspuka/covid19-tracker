import React, { useState, useEffect } from 'react';
import './App.css';
import InfoBox from './InfoBox';
import Map from './Map'
import Table from './Table';
import LineGraph from './LineGraph'
import {MenuItem, FormControl, Select, CardContent, Card } from '@material-ui/core';
import { sortData } from './util';


function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('Worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);




  useEffect(() => {
    const getData = async ()=> {
     await fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => setCountryInfo(data))
    }
    getData();
  }, )

  useEffect(() => {
    // async function
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const all_countries = data.map((country)=> (
          {
            name: country.country,
            value: country.countryInfo.iso2
          }
        ));

        const sortedData = sortData(data);

        setTableData(sortedData);
        setCountries(all_countries);
      }); 

    };
    getCountriesData();
  }, []);

  const onCountryChange =async (event) => {
    const countryCode = event.target.value;

    

    const url = 
                countryCode ==='Worldide' ? 
                "https://disease.sh/v3/covid-19/all" : 
                `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then(response => response.json())
    .then((data) => {
      setCountry(countryCode);
      setCountryInfo(data)
      console.log(data);
    });


  }
  console.log(countryInfo);

  return (
    <div className="app">
         {/* Header */}
      <div className="app__left">
        <div className="app__header">
        <h1>COVID-19 TRACKER</h1>

        {/* Title + select input dropdown */}
        <FormControl className="app__dropdown">
          <Select 
            onChange={onCountryChange}
            variant="outlined"
            value={country}>
              {/* Loop through countries dropdown */}
              <MenuItem value="Worldwide">Worldwide</MenuItem>
              {countries.map((countryi) => {return <MenuItem value={countryi.value} >{countryi.name}</MenuItem>})}
          </Select>
        </FormControl>
        </div>
        <div className="app__stats">
            <InfoBox 
              title="Coronavirus Cases" 
              total={countryInfo.cases} 
              cases={countryInfo.todayCases}/>
            <InfoBox 
              title="Recovered" 
              total={countryInfo.recovered} 
              cases={countryInfo.todayRecovered}/>
            <InfoBox 
              title="Deaths" 
              total={countryInfo.deaths} 
              cases={countryInfo.todayDeaths}/>
        </div>

            

            {/* Map */}
            <Map/>
            </div>  
            
      <Card className="app__right">
            <CardContent>
              <h3>Live cases by country</h3>
              <Table countries={tableData}/>
              <h3>Worldwide new cases</h3>

            {/* Graph */}
            <LineGraph/>
            </CardContent>
      </Card>
    </div>
  );
}

export default App;
