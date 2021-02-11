import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { Table, Flag } from 'semantic-ui-react'


const countries = [

  { name: 'Australia', countryCode: 'au', currency: 'AUD' },
  { name: 'Brazil', countryCode: 'br', currency: 'BRL' },
  { name: 'Bulgaria', countryCode: 'bg', currency: 'BGN' },
  { name: 'Canada', countryCode: 'ca', currency: 'CAD' },
  { name: 'China', countryCode: 'cn', currency: 'CNY' },
  { name: 'Croatia', countryCode: 'hr', currency: 'HRK' },
  { name: 'Czech Republic', countryCode: 'cz', currency: 'CZK' },
  { name: 'Denmark', countryCode: 'dk', currency: 'DKK' },
  { name: 'Hong Kong', countryCode: 'hk', currency: 'HKD' },
  { name: 'Hungary', countryCode: 'hu', currency: 'HUF' },
  { name: 'Iceland', countryCode: 'is', currency: 'ISK' },
  { name: 'India', countryCode: 'in', currency: 'INR' },
  { name: 'Indonesia', countryCode: 'id', currency: 'IDR' },
  { name: 'Israel', countryCode: 'il', currency: 'ILS' },
  { name: 'Japan', countryCode: 'jp', currency: 'JPY' },
  { name: 'Malaysia', countryCode: 'my', currency: 'MYR' },
  { name: 'Mexico', countryCode: 'mx', currency: 'MXN' },
  { name: 'New Zealand', countryCode: 'nz', currency: 'NZD' },
  { name: 'Norway', countryCode: 'no', currency: 'NOK' },
  { name: 'Philippines', countryCode: 'ph', currency: 'PHP' },
  { name: 'Poland', countryCode: 'pl', currency: 'PLN' },
  { name: 'Romania', countryCode: 'ro', currency: 'RON' },
  { name: 'Russia', countryCode: 'ru', currency: 'RUB' },
  { name: 'Singapore', countryCode: 'sg', currency: 'SGD' },
  { name: 'South Africa', countryCode: 'za', currency: 'ZAR' },
  { name: 'South Korea', countryCode: 'kr', currency: 'KRW' },
  { name: 'Sweden', countryCode: 'se', currency: 'SEK' },
  { name: 'Switzerland', countryCode: 'ch', currency: 'CHF' },
  { name: 'Thailand', countryCode: 'th', currency: 'THB' },
  { name: 'Turkey', countryCode: 'tr', currency: 'TRY' },
  { name: 'United Kingdom', countryCode: 'gb', alias: 'uk', currency: 'GBP' },
  { name: 'United States', countryCode: 'us', alias: 'America', currency: 'USD' }
]

const flagRenderer = (item) => <Flag name={item.countryCode} />

const ExchangeRate = () => {

    const [rates, setRates] = useState([]);

    useEffect(()=>{
        axios.get("https://api.exchangeratesapi.io/latest")
            .then(res => setRates(res.data.rates))
    }, []);

    //console.log(rates);

    for (const [key, value] of Object.entries(rates)) {
        countries.find(c=>c.currency===key).rate = value;
    }

    return(
        <Table celled>
            <Table.Header>
            <Table.Row>
                <Table.HeaderCell>Country</Table.HeaderCell>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Currency</Table.HeaderCell>
                <Table.HeaderCell>Rate</Table.HeaderCell>
            </Table.Row>
            </Table.Header>
            <Table.Body>
            {countries.map((country) => (
                <Table.Row key={country.countryCode}>
                <Table.Cell>{flagRenderer(country)}</Table.Cell>
                <Table.Cell>{country.name}</Table.Cell>
                <Table.Cell>{country.currency}</Table.Cell>
                <Table.Cell>{country.rate}</Table.Cell>
                </Table.Row>
            ))}
            </Table.Body>
        </Table>
)}

export default ExchangeRate