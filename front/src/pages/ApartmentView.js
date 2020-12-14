import React, { useState, useEffect } from 'react';
import { useParams, Link } from "react-router-dom";
import { Button, Image, Card, Icon } from 'semantic-ui-react'
import parse from 'html-react-parser';
import './style/apt.css';

export default function ApartmentView({ user, setUser }) {
  let { aptId } = useParams();

  const [apt, setApt] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const favorite = async () => {
    const res = await fetch(`/api/favorite/${aptId}`, {
      method: 'POST'
    });
    const message = await res.json();
    if (message === 'successful') {
      setIsFavorited(true)
      setUser({ ...user, favorites: [...user.favorites, apt._id] });
    }

  }
  
  const unfavorite = async () => {
    const res = await fetch(`/api/removeFav/${aptId}`, {
      method: 'PUT'
    });
    const message = await res.json();
    console.log('message', message);
    if (message === 'successful') {
      setIsFavorited(false)
      const newFavorites = user.favorites.filter(favorite => favorite !== apt._id);
      setUser({ ...user, favorites: newFavorites });
    }
  }

  useEffect(() => {
    const getAptbyId = async () => {
      const res = await fetch(`/api/apt/${aptId}`);
      const apt = await res.json();
      console.log('apt', apt);
      setApt(apt);
      if (user && user.favorites.includes(apt._id)) {
        setIsFavorited(true);
      }
    }
    getAptbyId();
  }, [user, aptId])

  if (!apt) {
    return <div>Loading...</div>
  }

  return (
    <div className="single-apartment">
      <div className="apartment-container">
        <Card key={apt._id} fluid>
          <Image className="apt-image" style={{ width: '600px', height: '400px', objectFit: 'cover' }} src={apt.images[0]} ui={false} />
          <Card.Content>
            <Card.Header>{apt.title}</Card.Header>
            <Card.Description>
              <p>{apt.price}</p>
              <p>{apt.housing}</p>
              <p>Neighborhood: {apt.neighborhood}</p>
              <p>Location: {apt.address}</p>
              <p>Description: {parse(apt.description)}</p>
              <p>{parse(apt.body)}</p>
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            {user ?
              (
                <div>
                  {isFavorited ? (
                    <Button onClick={unfavorite} icon>
                      <Icon name='heart' color="red" />
                    </Button>
                  ) :
                    (
                      <Button onClick={favorite} icon>
                        <Icon name='heart outline' color="red" />
                      </Button>
                    )}
                </div>

              ) :
              <Link to="/login">Login to favorite this apartment!</Link>
            }
          </Card.Content>
        </Card>
      </div>
      <div className="image-grid">
        {apt.images.map(img => (
          <Image key={img} style={{ width: '300px', height: '200px', objectFit: 'cover', margin: '10px 10px' }} src={img} />
        ))}
      </div>
    </div>
  );

}