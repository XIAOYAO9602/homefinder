import React from 'react';
import './style/apt.css';
import { Card, Image } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
export default function ApartmentList({ apts }) {

  return (
    <div className="apt-container">
      {apts.length > 0 && apts.map(apt => (
        <Card key={apt._id}>
          <Image className="apt-image" style={{ width: '290px', height: '200px', objectFit: 'cover' }} src={apt.images[0]} ui={false} />
          <Card.Content>
            <Card.Header>{apt.title}</Card.Header>
            <Card.Meta>
              <span className='price'>{apt.price}</span>
            </Card.Meta>
          </Card.Content>
          <Card.Content extra>
            <Link to={`/apt/${apt._id}`}>
              View Details
            </Link>
          </Card.Content>
        </Card>
      ))}
    </div>
  )
}