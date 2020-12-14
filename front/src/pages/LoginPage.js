import React, {useState} from 'react';
import "./LoginPage.css";
import { Button, Form, Grid, Message, Segment } from 'semantic-ui-react'
import { Link, useHistory } from "react-router-dom";
export default function LoginPage({setUser}) {
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    const data = {username, password};
    console.log('file: LoginPage.js ~ line 13 ~ login ~ data', data);
    const res = await fetch('/api/login', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    const user = await res.json();
    if (user) {
      console.log('user logging in?', user)
      setUser(user);
      history.push('/');
    }

  }
  return (
    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
    <Grid.Column style={{ maxWidth: 450 }}>
   
      <Form onSubmit={login} size='large'>
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

          <Button color='teal' fluid size='large'>
            Login
          </Button>
        </Segment>
      </Form>
      <Message>
        New to us? <Link to='/signup'>Sign Up</Link>
      </Message>
    </Grid.Column>
  </Grid>
  );
}
