import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Form, Input } from 'antd';
import { LOGIN_URL } from '../api/endpoints';
import { setAccessToken } from './auth';

const Login = () => {
    const [errMsg, setErrMsg] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (formData) => {
        try {
            const response = await fetch(LOGIN_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password,
                }),
                credentials: 'include',
            });
            console.log('response', response);
            const data = await response.json();
            console.log('data', data);

            if (response.ok) {
                setAccessToken(data.accessToken);
                navigate('/translations');
            } else {
                const message = `Login Error: ${response.status} ${data.message}`;
                setErrMsg(message);
            }
        } catch (err) {
            setErrMsg(err.message);
        }
    };

    const content = (
        <>
            {errMsg && (
                <div className='auth-error'>
                    <Alert message={errMsg} type='error' showIcon />
                </div>
            )}

            <Form
                className='login-form'
                autoComplete='off'
                onFinish={handleSubmit}
            >
                <Form.Item
                    label='Username'
                    name='username'
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username.',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label='Password'
                    name='password'
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password.',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Button type='primary' htmlType='submit'>
                    Login
                </Button>
            </Form>
        </>
    );

    return <div className='center-content'>{content}</div>;
};

export default Login;
