import axios from "axios"
import { useEffect, useState } from "react"
import apiRoot from "../Config/ConfigApi"
import { Link } from "react-router-dom/cjs/react-router-dom.min"

const ManageMoneyPage = () => {
    const [choose, setChoose] = useState(1)
    const [report1, setReport1] = useState([])
    const [userLst, setUserLst] = useState([])
    const [order, setOrder] = useState([])
    const [show, setShow] = useState(false)
    const [ordersData, setOrdersData] = useState([]);

    const handleChoose = (id) => {
        setChoose(id)
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

    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    useEffect(() => {
        axios.get(`${apiRoot}User/report/${choose}`)
            .then(res => {
                setReport1(res.data)
            })

        axios.get(`${apiRoot}User`)
            .then(res => {
                setUserLst(res.data)
            })
        axios.get(`${apiRoot}GetAllOrder`)
            .then(res => {
                setOrder(res.data)
            })
    }, [choose])

    const HandleAccept = (id) => {
        axios.post(`${apiRoot}Status/${id}/3`)
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

    const GetData = () => {
        axios.get(`${apiRoot}GetAllOrder`)
            .then(res => {
                setOrder(res.data)
            })
    }

    return (
        <>
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
                                            {orderObj.orders.orderStatus === 7 && <b>Đã nhận hàng</b>}
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
            <h4 style={{
                textAlign: 'center',
                marginTop: '6rem'
            }}>Quản lý Doanh thu cửa hàng</h4>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
            }}>
                <div style={{
                    width: '70%',
                    margin: '1rem 2rem 2rem 2rem',
                }}>
                    <div style={{
                        display: 'flex',
                        width: '100%',
                        border: '1px solid grey',
                        borderRadius: '.5rem',
                        backgroundColor: 'white'
                    }}>
                        <div className="manageleft">
                            <h4>Doanh thu</h4>
                            {choose === 1 ? <p style={{
                                backgroundColor: '#ff911a'
                            }} onClick={() => handleChoose(1)}>Tháng này</p> : <p onClick={() => handleChoose(1)}>Tháng này</p>}
                            {choose === 3 ? <p style={{
                                backgroundColor: '#ff911a'
                            }} onClick={() => handleChoose(3)}>3 tháng</p> : <p onClick={() => handleChoose(3)}>3 tháng</p>}
                            {choose === 6 ? <p style={{
                                backgroundColor: '#ff911a'
                            }} onClick={() => handleChoose(6)}>6 tháng</p> : <p onClick={() => handleChoose(6)}>6 tháng</p>}
                            {choose === 12 ? <p style={{
                                backgroundColor: '#ff911a'
                            }} onClick={() => handleChoose(12)}>1 năm</p> : <p onClick={() => handleChoose(12)}>1 năm</p>}
                        </div>
                        <div className="manageright">
                            <h4>Kết quả</h4>
                            <div className="manageData" style={{
                                backgroundColor: '#8be98c'
                            }}>
                                <h5>Số sản phẩm bán được</h5>
                                <p>{report1[0]} sản phẩm</p>
                            </div>

                            <div className="manageData" style={{
                                backgroundColor: '#efa16d'
                            }}>
                                <h5>Số tiền bán được</h5>
                                <p>{report1[1]} vnd</p>
                            </div>

                            <div className="manageData" style={{
                                backgroundColor: '#a3c6ff'
                            }}>
                                <h5>Sản phẩm được mua nhiều nhất</h5>
                                <p>{report1[2]}</p>
                            </div>
                        </div>
                    </div>
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
                                        }}>Đã nhận</button>
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
                                    {or.orderStatus === 7 &&
                                        <button style={{
                                            backgroundColor: '#6460ff',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '.5rem',
                                            padding: '.5rem 3rem',
                                            boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px',
                                            height: '3rem'
                                        }}>Đã nhận hàng</button>
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
                    </div>
                </div>
                <div style={{
                    width: '28%',
                    height: '80vh',
                    margin: '1rem 2rem 2rem 2rem',
                    backgroundColor: 'white',
                    borderRadius: '.5rem',
                    border: '1px solid grey'
                }}>
                    <h6 style={{
                        textAlign: 'center'
                    }}>Người dùng</h6>
                    {userLst.length > 0 && userLst.map((us, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '.5rem 1rem',
                            margin: '.5rem',
                            borderRadius: '.5rem',
                            backgroundColor: us.userRole === 1 ? '#FFA460' : '#eab676'
                        }}>
                            <p>
                                {us.userName}
                            </p>
                            <p>
                                {us.userPhone}
                            </p>
                            <p>
                                {us.userRole === 1 ? 'Admin' : 'Thành viên'}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default ManageMoneyPage