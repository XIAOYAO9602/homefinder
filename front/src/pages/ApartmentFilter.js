import React from 'react';
import URLSearchParams from 'url-search-params';
import { withRouter } from 'react-router-dom';
import {
  Collapse, Select, Row, Col, Button,
} from 'antd';

import { CaretRightOutlined } from '@ant-design/icons';
import './styles/antStyle.less';

const { Panel } = Collapse;

function TagSelector({ name, addTag, init }) {
  let tags;
  switch (name) {
    case 'housing':
      tags = ['1br', '2br', '3br', '4br', '5br', '6br'];
      break;
    case 'model':
      tags = ['studio', 'apartment', 'house', 'condo', 'dessert'];
      break;
    case 'facility':
      tags = ['kitchen', 'bathroom', 'living room', 'laundry room', 'car park','attached garage'];
      break;
    default:
      tags = [];
  }

  const options = tags.map(item => ({ value: item }));

  function handleChange(value) {
    addTag(name, value);
  }

  return (
    <Select
      mode="multiple"
      style={{ width: '100%' }}
      placeholder="select tags"
      onChange={handleChange}
      options={options}
      defaultValue={init}
    />
  );
}

class ApartmentFilter extends React.Component {
  constructor({ location: { search } }) {
    super();
    const params = new URLSearchParams(search);
    this.state = {
      housing: params.get('housing') ? params.get('housing').split(',') : [],
      model: params.get('model') ? params.get('model').split(',') : [],
      facility: params.get('facility') ? params.get('facility').split(',') : [],
    };
    // this.showOriginalFilter = this.showOriginalFilter.bind(this);
    this.addTag = this.addTag.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
  }


  addTag(name, values) {
    this.setState({ [name]: values });
  }

  applyFilter() {
    const { housing, model, facility } = this.state;
    const { history } = this.props;

    const params = new URLSearchParams();
    if (housing.length !== 0) params.set('housing', housing);
    if (model.length !== 0) params.set('model', model);
    if (facility.length !== 0) params.set('facility', facility);

    const search = params.toString() ? `?${params.toString()}` : '';
    history.push({ pathname: '/apartment', search });
  }

  render() {
    const { housing, model, facility } = this.state;
    return (
      <Collapse
        bordered={false}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        className="site-collapse-custom-collapse"
        style={{ marginLeft: 50, marginRight: 50, marginBottom: 20 }}
      >
        <Panel header="Filter Apartment by Tag" key="1" className="site-collapse-custom-panel">
          <Row gutter={[48, 8]}>
            <Col span={6}>
              housing:
              {' '}
              <TagSelector name="housing" addTag={this.addTag} init={housing} />
            </Col>
            <Col span={6}>
              model:
              {' '}
              <TagSelector name="model" addTag={this.addTag} init={model} />
            </Col>
            <Col span={6}>
              facility:
              {' '}
              <TagSelector name="facility" addTag={this.addTag} init={facility} />
            </Col>
            <Col span={6}>
              <Button onClick={this.applyFilter}>Apply</Button>
            </Col>
          </Row>
        </Panel>
      </Collapse>
    );
  }
}
export default withRouter(RecipeFilter);