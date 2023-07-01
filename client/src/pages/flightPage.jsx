import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";


import AddressLink from "../AddressLink";

export default function FlightPage() {
  const {id} = useParams();
  const [flight,setflight] = useState(null);
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`/flights/${id}`).then(response => {
      setflight(response.data);
    });
  }, [id]);

  if (!flight) return '';



  return (
    <div className="mt-4 bg-gray-100 -mx-8 px-8 pt-8">
      <h1 className="text-3xl">{flight.title}</h1>
      <AddressLink>{flight.address}</AddressLink>

      <div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
        <div>
          <div className="my-4">
            <h2 className="font-semibold text-2xl">Description</h2>
            {flight.description}
          </div>
          Departure: {flight.checkIn}<br />
          Arrival: {flight.checkOut}<br />
          Max number of passengers: {flight.maxGuests}
        </div>
        <div>

        </div>
      </div>
      <div className="bg-white -mx-8 px-8 py-8 border-t">
        <div>
          <h2 className="font-semibold text-2xl">Extra info</h2>
        </div>
        <div className="mb-4 mt-2 text-sm text-gray-700 leading-5">{flight.extraInfo}</div>
      </div>
    </div>
  );
}
