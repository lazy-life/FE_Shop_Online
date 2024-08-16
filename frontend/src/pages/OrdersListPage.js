import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { checkTokenValidation, getAllOrders, logout } from '../actions/userActions'
import { useHistory } from 'react-router-dom'
import { Table, Spinner } from 'react-bootstrap'
import { dateCheck } from '../components/GetDate'
import { changeDeliveryStatus } from '../actions/productActions'
import { CHANGE_DELIVERY_STATUS_RESET } from '../constants'
import SearchBarForOrdersPage from '../components/SearchBarForOrdersPage'
import Message from '../components/Message'
import axios from 'axios'
import apiRoot from '../Config/ConfigApi'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'


function OrdersListPage() {

    let history = useHistory()
    const dispatch = useDispatch()
    const placeholderValue = "Search orders by Customer Name, Address or by Ordered Item"

    const todays_date = dateCheck(new Date().toISOString().slice(0, 10))

    const [currentDateInfo] = useState(todays_date)
    const [idOfchangeDeliveryStatus, setIdOfchangeDeliveryStatus] = useState(0)
    const [cloneSearchTerm, setCloneSearchTerm] = useState("")
    const [ordersData, setOrdersData] = useState([]);
    // login reducer
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    // get all orders reducer
    const getAllOrdersReducer = useSelector(state => state.getAllOrdersReducer)
    const { orders, loading: loadingOrders } = getAllOrdersReducer

    // change delivery status reducer
    const changeDeliveryStatusReducer = useSelector(state => state.changeDeliveryStatusReducer)
    const { success: deliveryStatusChangeSuccess, loading: deliveryStatusChangeSpinner } = changeDeliveryStatusReducer

    // check token validation reducer
    const checkTokenValidationReducer = useSelector(state => state.checkTokenValidationReducer)
    const { error: tokenError } = checkTokenValidationReducer

    useEffect(() => {
        if (!userInfo) {
            history.push("/login")
        } else {
            GetAllOrdersUsID()
        }
    }, [userInfo, dispatch, history])

    const GetAllOrdersUsID = () => {
        axios.get(`${apiRoot}GetOrderID/${userInfo.userId}`) // Replace with your actual API endpoint
            .then(response => {
                setOrdersData(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the orders!', error);
            });
    }

    const HandleCancel = (id) => {
        axios.post(`${apiRoot}Status/${id}/5`)
            .then(res => {
                GetAllOrdersUsID()
            }).catch(err => {
                console.log(err);
            })
    }
    
    const HandleDone = (id) => {
        axios.post(`${apiRoot}Status/${id}/7`)
            .then(res => {
                GetAllOrdersUsID()
            }).catch(err => {
                console.log(err);
            })
    }

    if (userInfo && tokenError === "Request failed with status code 401") {
        alert("Session expired, please login again.")
        dispatch(logout())
        history.push("/login")
        window.location.reload()
    }

    const changeDeliveryStatusHandler = (id, status) => {
        setIdOfchangeDeliveryStatus(id)
        const productData = {
            "is_delivered": status,
            "delivered_at": status ? currentDateInfo : "Not Delivered"
        }
        dispatch(changeDeliveryStatus(id, productData))
    }

    if (deliveryStatusChangeSuccess) {
        alert("Delivery status changed successfully")
        dispatch({
            type: CHANGE_DELIVERY_STATUS_RESET
        })
        dispatch(getAllOrders())
    }

    const handleSearchTerm = (term) => {
        setCloneSearchTerm(term)
    };


    return (
        <div>
            {loadingOrders && <span style={{ display: "flex" }}>
                <h5>Getting Orders</h5>
                <span className="ml-2">
                    <Spinner animation="border" />
                </span>
            </span>}
            {ordersData.length > 0 ?
                <div style={{
                    padding: '2rem 0',
                    height: '90vh',
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
                                    backgroundColor: orderObj.orders.orderStatus === 5 ? '#ffa0ac' : '#b1d266'
                                }}>
                                    <b>{new Date(orderObj.orders.orderDate).toLocaleDateString()}</b>
                                    {orderObj.orders.orderStatus === 1 && <b>Đã đặt</b>}
                                    {orderObj.orders.orderStatus === 3 && <b>Đang chuẩn bị hàng</b>}
                                    {orderObj.orders.orderStatus === 6 && <b>Đang giao</b>}
                                    {orderObj.orders.orderStatus === 4 && <b>Đã giao</b>}
                                    {orderObj.orders.orderStatus === 5 && <b>Đã Huỷ</b>}
                                    <b>{orderObj.orders.addressDetail}</b>
                                    {orderObj.orders.orderStatus === 1 && <button style={{
                                        border: 'none',
                                        backgroundColor: '#ff6075',
                                        borderRadius: '.5rem',
                                        padding: '.5rem 2rem'
                                    }} onClick={() => HandleCancel(orderObj.orders.orderId)}><b>Huỷ</b></button>}
                                    {orderObj.orders.orderStatus === 4 && <button style={{
                                        border: 'none',
                                        backgroundColor: '#ff6075',
                                        borderRadius: '.5rem',
                                        padding: '.5rem 2rem'
                                    }} onClick={() => HandleDone(orderObj.orders.orderId)}><b>Đã nhận hàng</b></button>}
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
                </div>
                : <Message variant="info">No orders yet.</Message>}
        </div>
    )
}

export default OrdersListPage