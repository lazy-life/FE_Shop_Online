import axios from "axios";
import apiRoot from "../Config/ConfigApi";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const ShipperPage = () => {
    const [choose, setChoose] = useState(1)
    const [report1, setReport1] = useState([])
    const [userLst, setUserLst] = useState([])
    const [order, setOrder] = useState([])
    const [show, setShow] = useState(false)
    const [ordersData, setOrdersData] = useState([]);

    const HandleAccept = (id) => {
        axios.post(`${apiRoot}Status/${id}/6`)
            .then(res => {
                GetData()
            }).catch(err => {
                console.log(err);
            })
    }
    const HandleDone = (id) => {
        axios.post(`${apiRoot}Status/${id}/4`)
            .then(res => {
                GetData()
            }).catch(err => {
                console.log(err);
            })
    }
    const HandleCancel = (id) => {
        axios.post(`${apiRoot}Status/${id}/5`)
            .then(res => {
                GetData()
            }).catch(err => {
                console.log(err);
            })
    }

    useEffect(() => {
        axios.get(`${apiRoot}GetAllOrder`)
            .then(res => {
                var data = res.data.filter(item => item.orderStatus !== 1 && item.orderStatus !== 5);
                setOrder(data)
            })
    }, [choose])


    const GetData = () => {
        axios.get(`${apiRoot}GetAllOrder`)
            .then(res => {
                var data = res.data.filter(item => item.orderStatus !== 1 && item.orderStatus !== 5);
                setOrder(data)
            })
    }

    const GetAllOrdersID = (id) => {
        axios.get(`${apiRoot}GetOrderByID/${id}`) // Replace with your actual API endpoint
            .then(response => {
                setOrdersData(response.data);
                setShow(true)
            })
            .catch(error => {
                console.error('There was an error fetching the orders!', error);
            });
    }
    return (
        <div style={{
            marginTop: '6rem'
        }}>
            {show && <div style={{
                position: 'fixed', zIndex: '80',
                backgroundColor: 'rgb(31, 31, 31, .5)',
                bottom: '0',
                width: '100%',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div style={{
                    backgroundColor: 'white',
                    width: '70%',
                    minHeight: '20vh',
                    borderRadius: '.5rem',
                    padding: '1rem'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-around'
                    }}>
                        <h5 style={{ textAlign: 'center', marginBottom: '.5rem' }}>Thông tin chi tiết đơn hàng</h5>
                        <button style={{
                            border: 'none',
                            borderRadius: '.5rem',
                            backgroundColor: '#c53b57',
                            color: 'white',
                            padding: '.5rem 1rem',
                            cursor: 'pointer'
                        }} onClick={() => {
                            setShow(false)
                        }}>Đóng</button>
                    </div>
                    {ordersData.length > 0 &&
                        <div style={{
                            padding: '2rem 0',
                            backgroundColor: 'white'
                        }}>
                            {ordersData.map((orderObj, index) => (
                                <div style={{
                                    margin: '.5rem 0'
                                }}>
                                    <div key={index}>
                                        <div style={{
                                            display: 'flex',
                                            width: '70%',
                                            justifyContent: 'space-between',
                                            border: '1px solid grey',
                                            padding: '.5rem 1rem',
                                            margin: '0 15%',
                                            borderRadius: '.5rem .5rem 0 0 ',
                                            backgroundColor: orderObj.orders.orderStatus === 5 && '#ffa0ac'
                                        }}>
                                            <b>{new Date(orderObj.orders.orderDate).toLocaleDateString()}</b>
                                            {orderObj.orders.orderStatus === 1 && <b>Đã đặt</b>}
                                            {orderObj.orders.orderStatus === 3 && <b>Đang giao</b>}
                                            {orderObj.orders.orderStatus === 4 && <b>Đã giao</b>}
                                            {orderObj.orders.orderStatus === 5 && <b>Đã Huỷ</b>}
                                            <b>{orderObj.orders.addressDetail}</b>
                                        </div>
                                        <div style={{
                                            borderRadius: '0 0 .5rem .5rem',
                                            border: '1px solid grey',
                                            width: '70%',
                                            margin: '0 15%',
                                            padding: '0 0 0 5rem',
                                        }}>
                                            {orderObj.orderDetails.map((detail, idx) => (
                                                <Link to={`/product/${detail.productId}`}>
                                                    <div key={idx} style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        padding: '.5rem 1rem',
                                                        color: 'black'
                                                    }}>
                                                        <p>Product Name: {detail.productName}</p>
                                                        <p>Product Detail Name: {detail.productDetailName}</p>
                                                        <p>Amount: {detail.amount}</p>
                                                        <p>Total Money: {detail.totalMoney}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>}
                </div>
            </div>}
            <div style={{
                width: '100%',
                margin: '2rem 0',
                border: '1px solid grey',
                borderRadius: '.5rem',
                backgroundColor: 'white'
            }}>
                <h4 style={{
                    margin: '.2rem 2rem'
                }}>Các đơn hàng </h4>
                <div style={{
                    width: '90%',
                    margin: '.2rem 4%'
                }}>
                    {order.length > 0 && order.map((or, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '.5rem 1rem',
                            margin: '.5rem',
                            borderRadius: '.5rem',
                            backgroundColor: or.userRole === 1 ? '#FFA460' : '#eab676',
                            width: '100%'
                        }}>
                            <div>
                                <p><b>Ngày đặt:</b> {or.orderDate.split('T')[0]}</p>
                                <p><b>Người đặt:</b> {or.userName}</p>
                                <p><b>Tổng tiền:</b> {or.totalMoney}</p>
                                <p><b>Địa chỉ:</b> {or.addressDetail}</p>
                            </div>
                            <button style={{
                                backgroundColor: 'greenyellow',
                                color: 'black',
                                border: 'none',
                                borderRadius: '.5rem',
                                padding: '.5rem 3rem',
                                height: '3rem',
                                boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px'
                            }} onClick={() => GetAllOrdersID(or.orderId)}>Chi tiết</button>
                            {or.orderStatus === 1 &&
                                <>
                                    <button style={{
                                        backgroundColor: '#60bbff',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '.5rem',
                                        padding: '.5rem 3rem',
                                        boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px',
                                        height: '3rem'
                                    }} onClick={() => HandleAccept(or.orderId)}>Nhận</button>
                                    <button style={{
                                        backgroundColor: '#c53b57',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '.5rem',
                                        padding: '.5rem 3rem',
                                        boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px',
                                        height: '3rem'
                                    }} onClick={() => HandleCancel(or.orderId)}>Huỷ</button>
                                </>
                            }
                            {or.orderStatus === 3 &&
                                <button style={{
                                    backgroundColor: '#60ffa4',
                                    color: 'black',
                                    border: 'none',
                                    borderRadius: '.5rem',
                                    padding: '.5rem 3rem',
                                    boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px',
                                    height: '3rem'
                                }} onClick={() => HandleAccept(or.orderId)}>Giao hàng</button>
                            }
                            {or.orderStatus === 6 &&
                                <button style={{
                                    backgroundColor: '#6460ff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '.5rem',
                                    padding: '.5rem 3rem',
                                    boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px',
                                    height: '3rem'
                                }} onClick={() => HandleDone(or.orderId)}>Đang giao</button>
                            }
                            {or.orderStatus === 4 &&
                                <button style={{
                                    backgroundColor: '#6460ff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '.5rem',
                                    padding: '.5rem 3rem',
                                    boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px',
                                    height: '3rem'
                                }}>Đã giao</button>
                            }
                            {or.orderStatus === 5 &&
                                <button style={{
                                    backgroundColor: '#ff6075',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '.5rem',
                                    padding: '.5rem 3rem',
                                    boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px',
                                    height: '3rem'
                                }}>Đã Huỷ</button>
                            }
                        </div>
                    ))}
                </div>
            </div></div>
    )
}

export default ShipperPage