import React, {useState} from 'react';
import "./LoginPage.css";
import { Button, Form, Grid, Message, Segment } from 'semantic-ui-react'
import { Link, useHistory } from "react-router-dom";
export default function LoginPage({setUser}) {
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const register = async () => {
    const data = {username, password, first_name: firstName, last_name: lastName};
    console.log(password, confirmPassword)
    if (password !== confirmPassword) {
      return;
    }

    console.log('file: LoginPage.js ~ line 13 ~ login ~ data', data);
    const res = await fetch('/api/register', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    const user = await res.json();
    console.log('user?', user)
    if (user) {
      setUser(user);
      history.push('/');
    }

  }
  return (
    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
    <Grid.Column style={{ maxWidth: 450 }}>
   
      <Form onSubmit={register} size='large'>
        <Segment stacked>
          <Form.Input fluid icon='user' iconPosition='left' placeholder='Username' onChange={e => setUsername(e.target.value)} />
          <Form.Input
            fluid
            icon='lock'
            iconPosition='left'
            placeholder='Password'
            type='password'
            onChange={e => setPassword(e.target.value)}
          />
          <Form.Input
            fluid
            icon='lock'
            iconPosition='left'
            placeholder='Confirm Password'
            type='password'
            onChange={ e => setConfirmPassword(e.target.value)}
          />
          <Form.Input
            fluid
            
            placeholder='First Name'
            type='text'
            onChange={ e => setFirstName(e.target.value)}
          />
          <Form.Input
            fluid
         
            placeholder='Last Name'
            type='text'
            onChange={ e => setLastName(e.target.value)}
          />

          <Button color='teal' fluid size='large' type="submit">
            Register
          </Button>
        </Segment>
      </Form>
      <Message>
       Already have a login? <Link to='/login'>Login</Link>
      </Message>
    </Grid.Column>
  </Grid>
  );
}
