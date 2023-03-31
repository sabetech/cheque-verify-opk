import { useState, useRef } from 'react';
import { useSignIn } from 'react-auth-kit';
import { Button, Form, FormComponent, FormInputProps, Grid, Header, Input, Message, Segment } from 'semantic-ui-react'
import { useNavigate } from 'react-router-dom';

const LoginForm = (props: any) => {

  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const signIn = useSignIn();

  const onSubmit = async () => {
    const values = {
      email: email,
      password: password
    }
    
    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      console.log(data);

      if (data.error) {
        setError(data.error);
      } else {
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
        console.log("Success:::", success);
        if (success) {
         
          navigate('/');
          // navigate to home page
          // props.history.push('/');

        }
        
      }
    }catch ( err ) {
      console.log("Error:::", err);
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

            <Button color='teal' fluid size='large' onClick={onSubmit}>
              Login
            </Button>
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