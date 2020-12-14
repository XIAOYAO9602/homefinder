import React, { useEffect, useState } from 'react';
import './style/apt.css';
import { Card, Image, Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
export default function Favorites({ user, setUser }) {
  const [favorites, setFavorites] = useState([]);
  const unfavorite = async (aptId) => {
    const res = await fetch(`/api/removeFav/${aptId}`, {
      method: 'PUT'
    });
    const message = await res.json();
    console.log('message', message);
    if (message === 'successful') {
      const newFavorites = user.favorites.filter(favorite => favorite !== aptId);
      setUser({ ...user, favorites: newFavorites });
    }
  }
  useEffect(() => {

    const getFavorites = async () => {
      const data = { favorites: user.favorites ?? [] };
      const res = await fetch('/api/favorites', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
      })
      const favorites = await res.json();
      console.log('file: Favorites.js ~ line 18 ~ getFavorites ~ favorites', favorites);
      setFavorites(favorites);
    }
    if (user) {
      getFavorites()
    }

  }, [user])

  return (
    <div>
      <h1 className="favorites-header">Your Favorites</h1>
      <div className="apt-container">
        {favorites.length > 0 && favorites.map(apt => (
          <Card key={apt._id}>
            <Image src={apt.images[0]} wrapped ui={false} />
            <Card.Content>
              <Card.Header>{apt.title}</Card.Header>
              <Card.Meta>
                <span className='price'>{apt.price}</span>
              </Card.Meta>
            </Card.Content>
            <Card.Content extra>
              <div className="extra-content-container">
                <Link to={`/apt/${apt._id}`}>
                  View Details
            </Link>
                <Button onClick={() => unfavorite(apt._id)} color="red" >
                  Remove
            </Button>
              </div>
            </Card.Content>
          </Card>
        ))}

        {favorites.length === 0 && (
          <div>
            <h1>No favorites yet</h1>
            <p>Go back to the <Link to="/">homepage</Link> and click on a listing to view its details and favorite it</p>
          </div>
        )}

      </div>
    </div>
  )

}