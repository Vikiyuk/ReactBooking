
import Perks from "../Perks.jsx";
import {useEffect, useState} from "react";
import axios from "axios";
import AccountNav from "../AccountNav";
import {Navigate, useParams} from "react-router-dom";

export default function FlightsFormPage() {
  const {id} = useParams();
  const [title,setTitle] = useState('');
  const [address,setAddress] = useState('');

  const [description,setDescription] = useState('');
  const [perks,setPerks] = useState([]);
  const [extraInfo,setExtraInfo] = useState('');
  const [checkIn,setCheckIn] = useState('');
  const [checkOut,setCheckOut] = useState('');
  const [maxGuests,setMaxGuests] = useState(1);
  const [price,setPrice] = useState(100);
  const [redirect,setRedirect] = useState(false);
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get('/flights/'+id).then(response => {
       const {data} = response;
       setTitle(data.title);
       setAddress(data.address);
       setDescription(data.description);
       setPerks(data.perks);
       setExtraInfo(data.extraInfo);
       setCheckIn(data.checkIn);
       setCheckOut(data.checkOut);
       setMaxGuests(data.maxGuests);
       setPrice(data.price);
    });
  }, [id]);
  function inputHeader(text) {
    return (
      <h2 className="text-2xl mt-4">{text}</h2>
    );
  }
  function inputDescription(text) {
    return (
      <p className="text-gray-500 text-sm">{text}</p>
    );
  }
  function preInput(header,description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  async function saveflight(ev) {
    ev.preventDefault();
    const flightData = {
      title, address,
      description, perks, extraInfo,
      checkIn, checkOut, maxGuests, price,
    };
    if (id) {
      // update
      await axios.put('/flights', {
        id, ...flightData
      });
      setRedirect(true);
    } else {
      // new flight
      await axios.post('/flights', flightData);
      setRedirect(true);
    }

  }

  if (redirect) {
    return <Navigate to={'/account/flights'} />
  }

  return (
    <div>
      <AccountNav />
      <form onSubmit={saveflight}>
        {preInput('Departing airport', 'Airport where your flight departs')}
        <input type="text" value={title} onChange={ev => setTitle(ev.target.value)} placeholder="For example: Borispol airport"/>
        {preInput('Arrival airport', 'Airport where your flight arrives')}
        <input type="text" value={address} onChange={ev => setAddress(ev.target.value)}placeholder="Arrival airport"/>

        {preInput('Description','Description of the flight')}
        <textarea value={description} onChange={ev => setDescription(ev.target.value)} />
        {preInput('Perks','select all the perks of your flight')}
        <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          <Perks selected={perks} onChange={setPerks} />
        </div>
        {preInput('Extra info','house rules, etc')}
        <textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)} />
        {preInput('Departure and arrival times.','Enter departure/arrival time, price of the ticket and maximum number on the flight')}
        <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="mt-2 -mb-1">Departure time</h3>
            <input type="text"
                   value={checkIn == null ? '' : checkIn}
                   onChange={ev => setCheckIn(ev.target.value)}
                   placeholder="14"/>
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Arrival time</h3>
            <input type="text"
                   value={checkOut == null ? '' : checkOut}
                   onChange={ev => setCheckOut(ev.target.value)}
                   placeholder="11" />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Max number of passengers</h3>
            <input type="number" value={maxGuests == null ? '' : maxGuests}
                   onChange={ev => setMaxGuests(ev.target.value)}/>
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Price of the ticket</h3>
            <input type="number" value={price == null ? '' : price}
                   onChange={ev => setPrice(ev.target.value)}/>
          </div>
        </div>
        <button className="primary my-4">Save</button>
      </form>
    </div>
  );
}