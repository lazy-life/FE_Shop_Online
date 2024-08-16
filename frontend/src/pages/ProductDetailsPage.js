import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteProduct, getProductDetails } from '../actions/productActions'
import Message from '../components/Message'
import { Spinner, Row, Col, Container, Card, Button, Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { CREATE_PRODUCT_RESET, DELETE_PRODUCT_RESET, UPDATE_PRODUCT_RESET, CARD_CREATE_RESET } from '../constants'
import axios from 'axios'
import { notification, Space } from 'antd';
import apiRoot from '../Config/ConfigApi'
import Product from '../components/Product'

function ProductDetailsPage({ history, match }) {
    const productsListReducer = useSelector(state => state.productsListReducer)
    const { loadingg, errorr, products } = productsListReducer

    // login reducer
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    // product details reducer
    const deleteProductReducer = useSelector(state => state.deleteProductReducer)
    const { success: productDeletionSuccess } = deleteProductReducer
    const dispatch = useDispatch()

    const [amount, setAmount] = useState(1)
    const [imgLink, setImgLink] = useState('')
    const [pricePro, setIPricePro] = useState('')
    const [stockPro, setStockPro] = useState('')
    const [productCheck, setProductCheck] = useState('')
    const [productOriginPrice, setProductOriginPrice] = useState('')
    const [productArray, setProductArray] = useState([])

    // modal state and functions
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    // product details reducer
    const productDetailsReducer = useSelector(state => state.productDetailsReducer)
    const { loading, error, product } = productDetailsReducer
    const [product1, setProduct1] = useState({});
    const [productDetail, setProductDetail] = useState([]);
    let productObArray = {}

    useEffect(() => {
        if (product.product !== undefined) {
            setProduct1(product.product)
            setProductDetail(product.productDetails)
            setIPricePro(product.product.sale === 1 ? (product.productDetails[0].productDetailPrice - (product.productDetails[0].productDetailPrice / 100 * product.product.salePercent))
                : product.productDetails[0].productDetailPrice)
            setProductOriginPrice(product.productDetails[0].productDetailPrice)
            setStockPro(product.productDetails[0].detailStock)
            setImgLink(product.product.img1)
            setProductCheck(product.productDetails[0].productDetailId)
        }
    }, [product, amount])

    useEffect(() => {
        if (product1 != null && productDetail.length > 0) {
            productObArray.imgUrl = product1.img1
            productObArray.productDetailName = productDetail[0].productDetailName
            productObArray.productDetailPrice = product1.sale === 1 ? (productDetail[0].productDetailPrice - (productDetail[0].productDetailPrice / 100 * product1.salePercent))
                : productDetail[0].productDetailPrice
            productObArray.productPrice = (product1.sale === 1 ? (productDetail[0].productDetailPrice - (productDetail[0].productDetailPrice / 100 * product1.salePercent))
                : productDetail[0].productDetailPrice) * amount
        }
    }, [productDetail, product1])



    useEffect(() => {
        setProductArray(productObArray)
    }, [productObArray])
    useEffect(() => {
        dispatch(getProductDetails(match.params.id))
        dispatch({
            type: UPDATE_PRODUCT_RESET
        })
        dispatch({
            type: CREATE_PRODUCT_RESET
        })
        dispatch({
            type: CARD_CREATE_RESET
        })
    }, [dispatch, match])

    // product delete confirmation
    const confirmDelete = () => {
        // dispatch(deleteProduct(match.params.id))
        axios.delete(`${apiRoot}Product/removeProduct/${match.params.id}`)
            .then(response => {
                history.push('/')
            })
            .catch(error => {
                console.error("loi");
            })
        handleClose()
    }

    // after product deletion
    if (productDeletionSuccess) {
        alert("Product successfully deleted.")
        history.push("/")
        dispatch({
            type: DELETE_PRODUCT_RESET
        })
    }

    const [api, contextHolder] = notification.useNotification();

    const AddCart = async (id) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                }
            }

            const cardData = {
                id: userInfo.userId,
                productId: id,
                detailProductId: productCheck,
                amount: amount
            }
            // api call
            const { data } = await axios.post(
                `${apiRoot}Cart/AddCart`,
                cardData,
                config
            )
            api['success']({
                message: 'Thêm thành công',
                description:
                    'Sản phẩm đã được thêm thành công vào giỏ hàng',
            });
        } catch (error) {
            console.error("Error fetching cart data:", error);
        }
    }

    const AddCart1 = async (id) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                }
            }

            const cardData = {
                id: userInfo.userId,
                productId: id,
                detailProductId: productCheck,
                amount: amount
            }
            // api call
            const { data } = await axios.post(
                `${apiRoot}Cart/AddCart`,
                cardData,
                config
            )
            history.push('/stripe-card-details')
        } catch (error) {
            console.error("Error fetching cart data:", error);
        }
    }

    const handleButtonAdd = (max) => {
        var value = (amount + 1) > max ? max : (amount + 1)
        setAmount(value);
    };

    const handleButtonSub = () => {
        var value = (amount - 1) < 1 ? 1 : (amount - 1)
        setAmount(value);
    };

    const handleInputChange = (event) => {
        setAmount(event.target.value);
    };

    const handleShowImage = (linkUrl) => {
        setImgLink(linkUrl)
    }

    const handlePriceSet = (price, idDetail) => {
        var data = product1.sale === 1 ? (price - (price / 100 * product1.salePercent))
        : price
        setIPricePro(data)
        productDetail.forEach(e => {
            if (e.productDetailId === idDetail) {
                setProductCheck(idDetail)
            }
        });
    }

    const HandleEdit = (id) => {
        history.push(`/edit-product/${id}/`)
    }
    return (
        <div style={{
            marginTop: '6rem'
        }}>
            {contextHolder}
            {/* Modal Start*/}
            <div>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <i style={{ color: "#e6e600" }} className="fas fa-exclamation-triangle"></i>
                            {" "}
                            Xác nhận xoá sản phẩm
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Bạn có chắc chắn muốn xoá sản phẩm <em>{product1.productName}</em>?</Modal.Body>
                    <Modal.Body>Các đơn hàng vẫn sẽ được giao.</Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => confirmDelete()}>
                            Xác nhận Xoá
                        </Button>
                        <Button variant="primary" onClick={handleClose}>
                            Huỷ
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>

            {/* Modal End */}

            {loading && <span style={{ display: "flex" }}>
                <h5>Getting Product Details</h5>
                <span className="ml-2">
                    <Spinner animation="border" />
                </span>
            </span>}
            {error ? <Message variant='danger'>{error}</Message>
                :
                <div style={{
                    margin: '0 -1rem 1rem -1rem',
                    backgroundColor: 'white',
                    borderRadius: '.5rem',
                    padding: '1rem 0',
                    margin: '0 13%'
                }}>
                    <Container>
                        <Row>
                            <Col md={6}>
                                <Card.Img variant="top" src={product1.img1
                                    ? imgLink
                                    : 'https://img.freepik.com/free-psd/3d-realistic-background-podium-product-display_125755-833.jpg?t=st=1719133017~exp=1719136617~hmac=bb11c1b837eb9a791dddd696abe46b63c6e6200ec09cd4ceb3abc09d5d0ce510&w=826'} height="450" style={{
                                        border: '1px solid grey',
                                        marginBottom: '.5rem',
                                        borderRadius: '.5rem',
                                        padding: '.5rem'
                                    }} />

                                {/* Product edit and delete conditions */}
                                <div style={{
                                    display: 'flex'
                                }}>
                                    {product1.img1 && <img src={product1.img1} width={'70px'} className='imgProductList' onClick={() => handleShowImage(product1.img1)} />}
                                    {product1.img2 && <img src={product1.img2} width={'70px'} className='imgProductList' onClick={() => handleShowImage(product1.img2)} />}
                                    {product1.img3 && <img src={product1.img3} width={'70px'} className='imgProductList' onClick={() => handleShowImage(product1.img3)} />}
                                    {product1.img4 && <img src={product.img4} width={'70px'} className='imgProductList' onClick={() => handleShowImage(product1.img4)} />}
                                    {product1.img5 && <img src={product1.img5} width={'70px'} className='imgProductList' onClick={() => handleShowImage(product1.img5)} />}
                                </div>
                                {userInfo && userInfo.userRole === 1 ?
                                    <span style={{ display: "flex" }}>
                                        <button
                                            className="mt-2 btn btn-primary button-focus-css"
                                            onClick={() => HandleEdit(product1.productId)}
                                            style={{ width: "100%" }}
                                        >Chỉnh sửa sản phẩm
                                        </button>

                                        <button
                                            className="ml-2 btn mt-2 btn-danger button-focus-css"
                                            style={{ width: "100%" }}
                                            onClick={() => handleShow()}
                                        >Xoá sản phẩm
                                        </button>
                                    </span>
                                    : ""}
                            </Col>

                            <Col sm>
                                <b>{product1.productName}</b>
                                <hr />
                                {product1.sale === 1 && <span style={{
                                    display: "flex",
                                    justifyContent: "left",
                                    padding: "2px",
                                }}>
                                    <p className="ml-2"
                                        style={{
                                            fontSize: '16px',
                                            color: 'black',
                                            width: '100%',
                                            backgroundColor: '#fafafa',
                                            height: 'fit-content',
                                            padding: '.3rem 1rem',
                                            borderRadius: '.2rem',
                                        }}
                                    ><del>{productOriginPrice.toLocaleString('en-US')} VND </del></p>
                                </span>}
                                <span style={{
                                    display: "flex",
                                    justifyContent: "left",
                                    padding: "2px",
                                    height: '40%',
                                    marginBottom: '2rem'
                                }}>
                                    <p className="ml-2"
                                        style={{
                                            fontSize: '24px',
                                            color: 'red',
                                            fontWeight: 'bold',
                                            width: '100%',
                                            backgroundColor: '#fafafa',
                                            height: 'fit-content',
                                            padding: '.3rem 1rem',
                                            borderRadius: '.2rem',
                                        }}
                                    >{pricePro.toLocaleString('en-US')} VND </p>
                                </span>

                                <div style={{ display: 'flex', margin: '1rem 1rem' }}>
                                    {productDetail.length > 0 && productDetail.map(x => (
                                        productCheck === x.productDetailId ? (<div style={{ backgroundColor: '#1a71ff', color: 'white', borderRadius: '.5rem', cursor: 'pointer', border: '1px solid grey', marginRight: '.5rem', textAlign: 'center', padding: '.2rem 1rem' }}
                                            onClick={() => handlePriceSet(x.productDetailPrice, x.productDetailId)}>
                                            <p style={{
                                                width: 'fit-content'
                                            }}>{x.productDetailName}</p>
                                        </div>)
                                            : (<div style={{ borderRadius: '.5rem', cursor: 'pointer', border: '1px solid grey', marginRight: '.5rem', textAlign: 'center', padding: '.2rem 1rem' }}
                                                onClick={() => handlePriceSet(x.productDetailPrice, x.productDetailId)}>
                                                <p style={{
                                                    width: 'fit-content'
                                                }}>{x.productDetailName}</p>
                                            </div>)
                                    ))}
                                </div>
                                <span style={{
                                    display: "flex",
                                    justifyContent: "left",
                                    padding: "2px",
                                    alignItems: 'center'
                                }}>
                                    {userInfo && userInfo.userRole === 1 ?
                                        <div style={{
                                            width: '100%',
                                            display: 'flex',
                                            backgroundColor: '#fafafa',
                                            borderRadius: '.2rem',
                                            padding: '1rem'
                                        }}>
                                            <p style={{
                                                padding: 0,
                                                margin: '0 1rem'
                                            }}>Số lượng còn lại</p>
                                            <p style={{
                                                padding: 0,
                                                margin: '0 1rem',
                                                fontWeight: 'bold'
                                            }}>{stockPro}</p>
                                        </div>
                                        :
                                        <>
                                            <p style={{
                                                padding: 0,
                                                margin: '0 1rem'
                                            }}>Số lượng</p>
                                            <button style={{
                                                width: '30px',
                                                border: '1px solid lightgrey',
                                                borderRadius: '2px 0 0 2px',
                                                fontSize: '20px',
                                                justifyContent: 'center',
                                                backgroundColor: 'white'
                                            }} onClick={handleButtonSub}>-</button>
                                            <input disabled value={amount} onChange={handleInputChange}
                                                style={{
                                                    width: '50px',
                                                    outline: 'none',
                                                    border: '1px solid lightgrey',
                                                    backgroundColor: 'white',
                                                    textAlign: 'center',
                                                    fontSize: '20px'
                                                }}
                                            />
                                            <button style={{
                                                width: '30px',
                                                border: '1px solid lightgrey',
                                                borderRadius: '0 2px 2px 0',
                                                fontSize: '20px',
                                                justifyContent: 'center',
                                                backgroundColor: 'white'
                                            }} onClick={() => handleButtonAdd(product.productStock)}>+</button>
                                            <p style={{
                                                padding: 0,
                                                margin: '0 1rem'
                                            }}>{stockPro}</p>
                                        </>
                                    }
                                </span>

                                <span style={{
                                    display: "flex",
                                    justifyContent: "left",
                                    padding: "2px",
                                    marginTop: '2rem'
                                }}>
                                    {!userInfo ?
                                        (
                                            stockPro > 0 ?
                                                <div style={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    justifyContent: 'space-between'
                                                }}>
                                                    <Link to={{
                                                        pathname: `${product1.productId}/checkout`,
                                                        state: { productArray }
                                                    }}
                                                        style={{
                                                            width: '40%'
                                                        }}>
                                                        <button className="btn btn-warning ml-3"
                                                            style={{
                                                                backgroundColor: '#f05d40',
                                                                color: 'white',
                                                                border: '1px solid #f05d40',
                                                                width: '100%'
                                                            }}
                                                        >
                                                            Mua ngay
                                                        </button>
                                                    </Link>

                                                    <Link
                                                        style={{
                                                            width: '50%'
                                                        }}>
                                                        <button className="btn btn-primary"
                                                            style={{
                                                                backgroundColor: 'RGBA(240, 93, 64, 0.2)',
                                                                border: '1px solid #f05d40',
                                                                width: '100%',
                                                                color: '#ee4d2d'
                                                            }}
                                                        >
                                                            Thêm vào giỏ hàng
                                                        </button>
                                                    </Link>
                                                </div>
                                                :
                                                <div className='alert alert-danger' role="alert"
                                                    style={{
                                                        width: '100%',
                                                        height: 'fit-content',
                                                        margin: 0,
                                                        padding: '.4rem',
                                                    }}
                                                >
                                                    Hết hàng!
                                                </div>
                                        )
                                        :
                                        (
                                            userInfo.userRole !== 1 &&
                                            (stockPro > 0 ?
                                                <div style={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    justifyContent: 'space-between'
                                                }}>
                                                    <div
                                                        style={{
                                                            width: '40%'
                                                        }}>
                                                        <button className="btn btn-warning ml-3" onClick={() => {
                                                            AddCart1(product1.productId)
                                                        }}
                                                            style={{
                                                                backgroundColor: '#f05d40',
                                                                color: 'white',
                                                                border: '1px solid #f05d40',
                                                                width: '100%'
                                                            }}
                                                        >
                                                            Mua ngay
                                                        </button>
                                                    </div>


                                                    <button className="btn btn-primary"
                                                        style={{
                                                            backgroundColor: 'RGBA(240, 93, 64, 0.2)',
                                                            border: '1px solid #f05d40',
                                                            width: '50%',
                                                            color: '#ee4d2d'
                                                        }}
                                                        onClick={() => {
                                                            AddCart(product1.productId)
                                                        }}
                                                    >
                                                        Thêm vào giỏ hàng
                                                    </button>
                                                </div>
                                                :
                                                <div className='alert alert-danger' role="alert"
                                                    style={{
                                                        width: '100%',
                                                        height: 'fit-content',
                                                        margin: 0,
                                                        padding: '.4rem',
                                                    }}
                                                >
                                                    Hết hàng!
                                                </div>)
                                        )
                                    }
                                </span>
                            </Col>
                        </Row>
                    </Container>
                </div>
            }

            <div style={{
                backgroundColor: 'white',
                borderRadius: '.5rem',
                padding: '1rem',
                margin: '1rem 13%'
            }}>
                <h5>Mô tả về sản phẩm</h5>
                <p>{product1.productDescription}</p>
            </div>

            {
                userInfo && userInfo.userRole === 1 ?
                    <></>
                    :
                    <>
                        <div style={{
                            margin: '0 13%'
                        }}>
                            <h5 style={{
                                backgroundColor: 'white',
                                marginBottom: '.5rem',
                                padding: '.4rem .5rem',
                                border: '1px solid orange',
                                borderBottom: '3px solid orange',
                                borderRadius: '.4rem'
                            }}>Các sản phẩm dành cho bạn</h5>
                        </div>
                        <div>
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                borderRadius: '.5rem',
                                margin: '0 13%'
                            }}>
                                {products.slice(0, 10).map((product, idx) => (
                                    <div style={{
                                        width: '15.1%',
                                        margin: '0 .7%',
                                    }}>
                                        <Product product={product} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
            }
        </div>

    )
}

export default ProductDetailsPage
