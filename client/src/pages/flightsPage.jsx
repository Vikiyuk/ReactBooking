import {Link, Navigate, useParams} from "react-router-dom";
import AccountNav from "../AccountNav";
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {UserContext} from "../UserContext.jsx";

export default function FlightsPage() {



  const [flights,setflights] = useState([]);
  useEffect(() => {
    axios.get('/user-flights').then(({data}) => {
      setflights(data);
    });




  }, []);

  const {user} = useContext(UserContext);
  if (!user) {
    return <Navigate to={'/account'} />
  }
  function deleteFlight(id) {
    const confirmDelete = window.confirm("Are you sure you want to delete your flight?");
    if (confirmDelete)
    {
      axios.delete(`/user-flights/${id}`)
    }


  }
  return (
    <div>
      <AccountNav key={1}/>
        <div className="text-center">
          <Link className="inline-flex gap-1 bg-primary2 text-white py-2 px-6 rounded-full" to={'/account/flights/new'}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
            </svg>
            Add new flight
          </Link>
        </div>
        <div className="mt-4" >
          {flights.length > 0 && flights.map(flight => (
              <div key={flight._id}>
            <Link to={'/account/flights/'+flight._id} key={flight._id} className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl center">

              <div className="grow-0 shrink">
                <h2 className="text-xl">{flight.title}</h2>
                <p className="text-sm mt-2">{flight.description}</p>
              </div>

            </Link>
                <form className="max-w-md mx-auto" onSubmit={()=>deleteFlight(flight._id)} >
                  <button className="primary">Delete {flight.title}</button>

                </form>
              </div>


          ))}
        </div>
    </div>
  );
}