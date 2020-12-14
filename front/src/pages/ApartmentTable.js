import React from 'react';
import { Card, Col, Row } from 'antd';
import { withRouter, Link } from 'react-router-dom';
import './styles/antStyle.less';

const { Meta } = Card;

// eslint-disable-next-line react/prefer-stateless-function
class ApartmentCard extends React.Component {
  render() {
    const { apartment } = this.props;

    return (
      <Col className="card-list" sm={12} md={8} lg={6}>
        <Link to={{ pathname: `/view/${apartment.id}` }}>
          <Card
            hoverable
            size="small"
            cover={<img alt={apartment.title} src={apartment.img} />}
          >
            {/* author传过来是一个object, 只用里面的name */}
            <Meta
              title={apartment.title})}
            />
          </Card>
        </Link>
      </Col>
    );
  }
}

const CardRouter = withRouter(ApartmentCard);

export default function ApartmentTable({ apartments }) {
  const apartmentCards = recipes.map((apartment, index) => (
    <CardRouter key={apartments.id} apartment={apartment} index={index} />
  ));

  return (
    <div className="site-card-wrapper">
      <Row>
        {ApartmentCards}
      </Row>
    </div>
  );
}