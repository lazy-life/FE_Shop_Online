import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { logout } from '../actions/userActions'
import { useHistory } from "react-router-dom";
import SearchBarForProducts from './SearchBarForProducts'
import axios from 'axios'
import apiRoot from '../Config/ConfigApi'


function NavBar() {

    let history = useHistory()
    const dispatch = useDispatch()

    const customTitleImage = './path/to/your/image.jpg';
    // login reducer
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer
    const [cradNumber, setCradNumber] = useState(0)

    // logout
    const logoutHandler = () => {
        dispatch(logout()) // action
        history.push("/login")
        window.location.reload()
    }

    useEffect(() => {
        if (userInfo) {
          const fetchCardData = () => {
            axios.get(`${apiRoot}User/GetAllCard/${userInfo.userId}`)
              .then(res => {
                setCradNumber(res.data);
              })
              .catch(err => {
                console.log(err);
              });
          };
    
          fetchCardData(); // Gọi hàm ngay khi component mount
    
          const intervalId = setInterval(fetchCardData, 2000); // Gọi lại sau mỗi 2 giây
    
          return () => clearInterval(intervalId); // Xóa interval khi component unmount
        }
      }, []);

    const CustomTitle = ({ userName }) => {
        return (
            <span style={{ color: '#040484', fontWeight: '500' }}>
                <svg width={'50px'} viewBox="-70 -50 200 200">
                    <path fill='#040484' d="M 45 0 C 20.147 0 0 20.147 0 45 c 0 24.853 20.147 45 45 45 s 45 -20.147 45 -45 C 90 20.147 69.853 0 45 0 z M 45 22.007 c 8.899 0 16.14 7.241 16.14 16.14 c 0 8.9 -7.241 16.14 -16.14 16.14 c -8.9 0 -16.14 -7.24 -16.14 -16.14 C 28.86 29.248 36.1 22.007 45 22.007 z M 45 83.843 c -11.135 0 -21.123 -4.885 -27.957 -12.623 c 3.177 -5.75 8.144 -10.476 14.05 -13.341 c 2.009 -0.974 4.354 -0.958 6.435 0.041 c 2.343 1.126 4.857 1.696 7.473 1.696 c 2.615 0 5.13 -0.571 7.473 -1.696 c 2.083 -1 4.428 -1.015 6.435 -0.041 c 5.906 2.864 10.872 7.591 14.049 13.341 C 66.123 78.957 56.135 83.843 45 83.843 z" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                </svg>
                {userName}
            </span>
        );
    };

    return (
        <header style={{
            position: 'fixed',
            zIndex: 20,
            width: '100%',
            height: 'fit-content',
            marginTop: 0,
            paddingTop: 0,
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: '#fb6445',
        }}>
            <Navbar bg="Light" variant="dark" collapseOnSelect style={{
                backgroundColor: '#ffffff', display: 'flex', justifyContent: 'space-between',
                boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px', width: '100%'
            }}>
                <Container>
                    <LinkContainer to="/" style={{}}>
                        <Navbar.Brand> <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Logo" height={'40px'} /></Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto" style={{ width: '70%' }}>
                            <span className="" style={{ width: '100%' }}>
                                {userInfo && userInfo.userRole !== 1 && <SearchBarForProducts />}
                                {!userInfo && <SearchBarForProducts />}
                            </span>
                        </Nav>

                        {/* login-logout condition here */}

                        {userInfo ?
                            <div style={{ width: '30%', display: 'flex', justifyContent: 'space-around' }}>
                                {userInfo && userInfo.userRole === 1 ?
                                    <></>
                                    :
                                    <div style={{ position: 'relative', display: 'inline-block' }}>
                                        <LinkContainer to="/stripe-card-details/">
                                            <svg width={'50px'} stroke={'1'} viewBox="0 0 500 500" style={{
                                                color: 'white'
                                            }}>
                                                <path fill="#040484" d="M351.9 329.506H206.81l-3.072-12.56H368.16l26.63-116.019-217.23-26.04-9.952-58.09h-50.4v21.946h31.894l35.233 191.246a32.927 32.927 0 1 0 36.363 21.462h100.244a32.825 32.825 0 1 0 30.957-21.945zM181.427 197.45l186.51 22.358-17.258 75.195H198.917z" />
                                            </svg>
                                        </LinkContainer>
                                        <div style={{
                                            position: 'absolute',
                                            top: '0px',
                                            right: '0px',
                                            backgroundColor: 'red',
                                            color: 'white',
                                            padding: '3px 9px',
                                            borderRadius: '50%',
                                            fontSize: '14px',
                                            fontWeight: 'bold',
                                        }}>
                                            {cradNumber}
                                        </div>
                                    </div>
                                }
                                <NavDropdown className="navbar-nav text-capitalize" id='username'
                                    title={<CustomTitle userName={userInfo.userName} />}>
                                    <LinkContainer to="/account">
                                        <NavDropdown.Item>Cài đặt tài khoản</NavDropdown.Item>
                                    </LinkContainer>
                                    {(userInfo && userInfo.userRole !== 1) ? <LinkContainer to="/all-orders/">
                                        <NavDropdown.Item>Đơn hàng</NavDropdown.Item>
                                    </LinkContainer> : ''}
                                    <NavDropdown.Item onClick={logoutHandler}>
                                        Đăng xuất
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </div>
                            :

                            <div style={{
                                width: '20%',
                                display: 'flex',
                                justifyContent: 'space-evenly'
                            }}>
                                <LinkContainer to="/login" style={{
                                    cursor: 'pointer',
                                    color: '#040484',
                                    fontSize: '16px',
                                    margin: 0,
                                    padding: 0,
                                }}>
                                    <p style={{
                                        cursor: 'pointer',
                                        margin: 0,
                                        padding: 0
                                    }}>Đăng nhập</p>
                                </LinkContainer>
                                <LinkContainer to='/login' style={{
                                    cursor: 'pointer',
                                    color: '#040484',
                                    fontSize: '16px',
                                    margin: 0,
                                    padding: '0 3px',
                                }}>
                                    <p>|</p>
                                </LinkContainer>
                                <LinkContainer to="/register" style={{
                                    cursor: 'pointer',
                                    color: '#040484',
                                    fontSize: '16px',
                                    margin: 0,
                                    padding: 0,
                                }}>
                                    <p style={{
                                        cursor: 'pointer',
                                        margin: 0,
                                        padding: 0
                                    }}>Đăng ký</p>
                                </LinkContainer>
                            </div>
                        }
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default NavBar
