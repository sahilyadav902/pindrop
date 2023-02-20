import React, { useState, useEffect } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import Register from './components/Register';
import Login from './components/Login';
import axios from "axios";
import TimeAgo from 'react-timeago';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import "./App.css";
import { useDoubleTap } from 'use-double-tap';

function App() {
  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(myStorage.getItem('user'));
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const viewport = {
    longitude: 77.2090,
    latitude: 28.6139,
    zoom: 5
  };

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get('/api/pins');
        setPins(res.data);
      }
      catch (err) {
        console.log(err);
      }
    }

    getPins();
  }, []);

  const handleMarkerClick = (id) => {
    setCurrentPlaceId(id);
  };
  
  const handleAddClick = (e) => {
    const {lng, lat} = e.lngLat;

    setNewPlace({
      lat: lat,
      long: lng,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long,
    }

    try {
      const res = await axios.post('/api/pins', newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    }
    catch (err) {
      console.log(err);
    }
  }

  const handleLogout = () => {
    setCurrentUser(null);
    myStorage.removeItem('user');
  };

  const onDblTap = useDoubleTap((e) => {
    handleAddClick(e);
  }, 500);

  return (
    <div className="App">
      <Map
        initialViewState={viewport}
        style={{width: '100vw', height: '100vh'}}
        mapStyle="mapbox://styles/safak/cknndpyfq268f17p53nmpwira"
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        onDblClick={handleAddClick}
        {...onDblTap}
      >
        {pins.map(p => (
          <>
            <Marker longitude={p.long} latitude={p.lat} anchor="bottom">
              <LocationOnIcon
                className='marker'
                style={{color: p.username === currentUser ? "#BE3144" : "#03002C", fontSize: viewport.zoom*7}}
                onClick={() => handleMarkerClick(p._id)}
              />
            </Marker>
            {p._id === currentPlaceId && (
              <Popup
                longitude={p.long}
                latitude={p.lat}
                anchor="left"
                closeButton={true}
                closeOnClick={false}
                onClose={() => setCurrentPlaceId(null)}
              >
                <div className='card'>
                  <label>Place</label>
                  <h4 className='place'>{p.title}</h4>
                  <label>Review</label>
                  <p className='desc'>{p.desc}</p>
                  <label>Rating</label>
                  <div className='stars'>
                    {Array(p.rating).fill(<StarIcon className='star' />)}
                  </div>
                  <label>Information</label>
                  <span className='username'>Created by <b>{p.username}</b></span>
                  <span className='date'><TimeAgo date={p.createdAt} /></span>
                </div>
              </Popup>
            )}
          </>
        ))}
        {newPlace && (
          <Popup
            longitude={newPlace.long}
            latitude={newPlace.lat}
            anchor="left"
            closeButton={true}
            closeOnClick={false}
            onClose={() => setNewPlace(null)}
          >
            <div>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input
                  placeholder='Enter a title'
                  onChange={(e) => setTitle(e.target.value)}
                />
                <label>Review</label>
                <textarea
                  placeholder='Tell us something about this place!'
                  onChange={(e) => setDesc(e.target.value)}
                />
                <label>Rating</label>
                <select onChange={(e) => setRating(e.target.value)}>
                  <option value='1'>1</option>
                  <option value='2'>2</option>
                  <option value='3'>3</option>
                  <option value='4'>4</option>
                  <option value='5'>5</option>
                </select>
                <button type='submit' className='submitButton'>
                  Add Pin
                </button>
              </form>
            </div>
          </Popup>
        )}
        {currentUser ? (
          <button className='button-class logout' onClick={handleLogout}>Log Out</button>
        ) : (
          <div className='buttons'>
            <button className='button-class login' onClick={() => setShowLogin(true)}>Log In</button>
            <button className='button-class register' onClick={() => setShowRegister(true)}>Register</button>
          </div>
        )}
        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            myStorage={myStorage}
            setCurrentUser={setCurrentUser}
          />
        )}
      </Map>
    </div>
  );
}

export default App;
