import {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";


export default function IndexPage() {
  const [flights,setflights] = useState([]);
  useEffect(() => {
    axios.get('/flights').then(response => {
      setflights(response.data);
    });
  }, []);

  return (
    <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
      {flights.length > 0 && flights.map(flight => (
        <Link to={'/flight/'+flight._id} key={flight._id} className={"records"}>
          <div className="bg-gray-500 mb-2 rounded-2xl flex">
          </div>
          <h2 className="font-bold">{flight.address}</h2>
          <h3 className="text-sm text-gray-500">{flight.title}</h3>
          <div className="mt-1">
            <span className="font-bold">${flight.price}</span>
          </div>
        </Link>
      ))}
    </div>

  );
}
