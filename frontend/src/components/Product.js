import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import React, { useState } from 'react'
import { useSelector } from 'react-redux'

function Product({ product }) {
    const [imageProduct, setImageProduct] = useState("https://product.hstatic.net/1000362139/product/blog_large_75e6f17c0d894a3191a1bc05ca645705.jpg")
    // login reducer
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer


    return (
        <div>
            <div className="mb-3 rounded detailPro"
                style={{
                    backgroundColor: 'white',
                    width: '100%',
                    border: '2px solid lightgrey',
                    borderRadius: '2rem',
                    padding: '.2rem .2rem .5rem .2rem'
                }}
            >
                <div style={{

                }}>
                    <Link to={`/product/${product.productId}`} >
                        <Card.Img variant="top" src={product.img1 ? product.img1 : imageProduct} height="170" />
                    </Link>
                    <Link to={`/product/${product.productId}`}>
                        <p style={{ borderTop: '1px solid grey', width: '100' }}>
                            <p style={{
                                overflow: 'hidden',
                                color: 'black',
                                margin: '.5rem 0 1rem 0',
                                textWrap: 'nowrap',
                                padding: '0 .5rem 0 0'
                            }}>{product.productName}</p>
                        </p>
                    </Link>

                    <Link to={`/product/${product.productId}`}>
                        {userInfo && userInfo.userRole === 1 ?
                            <p style={{
                                margin: 0,
                                backgroundColor: 'orange',
                                width: '100%',
                                color: 'white',
                                borderRadius: '.2rem',
                                padding: '.3rem .2rem'
                            }}>Chỉnh sửa</p>
                            :
                            <p style={{ margin: 0, color: 'red' }}>
                                {product.productPrice.toLocaleString('en-US')} vnd
                            </p>
                        }
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Product
