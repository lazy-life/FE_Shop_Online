import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { login } from '../actions/userActions'
import Message from '../components/Message';


function LoginPage({ history }) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const dispatch = useDispatch()

    // reducer
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { error, userInfo } = userLoginReducer

    useEffect(() => {
        if (userInfo) {
            if(userInfo.userRole === 4){
                history.push('/ship')
            }else{
                history.push('/') // homepage
            }
        }
    }, [history, userInfo])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(login(username, password))
    }

    return (
        <div>
            <Row className='justify-content-md-center' style={{
                backgroundColor: 'white',
                borderRadius: '2rem',
                height: '85vh',
                boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px'
            }}>
                <Col xs={12} md={6}>
                    <h2 style={{ textAlign: 'center', margin: '1rem 0' }}>Đăng nhập để tiếp tục</h2>
                    {error && <Message variant='danger'>Email hoặc mật khẩu chưa chính xác!</Message>}
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId='username'>
                            <Form.Label style={{ fontSize: '1.2rem' }}>
                                Email
                            </Form.Label>
                            <Form.Control
                                style={{ borderRadius: '1rem', height: '3rem' }}
                                type="text"
                                placeholder="Nhập Email"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='password'>
                            <Form.Label style={{ fontSize: '1.2rem' }}>
                                Mật khẩu
                            </Form.Label>
                            <Form.Control
                                style={{ borderRadius: '1rem', height: '3rem' }}
                                type="password"
                                placeholder="Nhập mật khẩu của bạn"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>

                        <Button style={{ width: '100%', borderRadius: '1rem', height: '3rem' }} type="submit" variant='primary'>Sign In</Button>
                    </Form>

                    <Row className="py-3">
                        <Col>
                            Bạn chưa có tài khoản?
                            <Link
                                to={`/register`}
                            > Đăng ký</Link>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>

    )
}

export default LoginPage