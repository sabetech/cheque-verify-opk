import { useState } from 'react';
import { useSignIn } from 'react-auth-kit';
import { Button, Form, Message, Icon, Grid, Header, Input, Segment } from 'semantic-ui-react'
import axios from 'axios';

const LoginForm = (props: any) => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const signIn = useSignIn();

  const onSubmit = async () => {
    setError("");
    const values = {
      email: email,
      password: password
    }
    
    setLoading(true)
    try {
      const response = await axios(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify(values),
      });
      
      const data = await response.data;
      
      if (response.status !== 201) {
        setError("A login error occured. Please try again");
      } else {
        
        setLoading(false);
        
        const success = signIn({
          token: data.token,
          expiresIn: 3600,
          tokenType: "Bearer",
          authState: {user: 
            {
              email: values.email,
              name: data.user.name,
              role: data.user.role
            }
          }
         }
        )
        
        if (success) {
          window.location.replace('/');
        }
        
      }
    }catch ( err: any ) {
      setError(err.response.data.error)
    }
  }

  return (
    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' color='teal' textAlign='center'>
          Log-in to your account
        </Header>
        <Form size='large'>
          <Segment stacked>
            <Form.Input fluid icon='user' iconPosition='left' placeholder='E-mail address' value={email} onChange={(e) => setEmail(e.target.value)} />
            <Form.Input
              fluid
              icon='lock'
              iconPosition='left'
              placeholder='Password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {!loading &&  <Button color='teal' fluid size='large' onClick={onSubmit}>
              Login
            </Button> || <Button color='teal' fluid size='large' loading />}
            {
              error && <Message attached='bottom' negative>
                        <Icon name='help' />
                      { error }
                      </Message>
                }
          </Segment>
        </Form>
        <Message>
          Welcome to Cheque Management System
        </Message>
      </Grid.Column>
    </Grid>
    )
  }

export default LoginForm;