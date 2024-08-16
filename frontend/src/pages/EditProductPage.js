import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button, Alert, Modal } from 'react-bootstrap'
import { createProduct } from '../actions/productActions'
import { useHistory } from 'react-router'
import { checkTokenValidation, logout } from '../actions/userActions'
import { CREATE_PRODUCT_RESET } from '../constants'
import Message from '../components/Message';
import { notification, Space } from 'antd';
import axios from 'axios'
import api from '../Config/ConfigApi'
import apiRoot from '../Config/ConfigApi'


const EditProductPage = ({ match }) => {

    let history = useHistory()
    const dispatch = useDispatch()

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [priceDiscount, setPriceDiscount] = useState("")
    const [stock, setStock] = useState("")
    const [image, setImage] = useState(null)
    const [category, setcategory] = useState(null)
    const [categoryList, setcategoryList] = useState('')
    const [itemdelete, setItemdelete] = useState('')

    // login reducer
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    // create product reducer
    const createProductReducer = useSelector(state => state.createProductReducer)
    const { product, success: productCreationSuccess, error: productCreationError } = createProductReducer

    // check token validation reducer
    const checkTokenValidationReducer = useSelector(state => state.checkTokenValidationReducer)
    const { error: tokenError } = checkTokenValidationReducer
    const [file1, setFile1] = useState(null);
    const [file2, setFile2] = useState(null);
    const [file3, setFile3] = useState(null);
    const [file4, setFile4] = useState(null);
    const [file5, setFile5] = useState(null);

    const [url1, setUrl1] = useState(null);
    const [url2, setUrl2] = useState(null);
    const [url3, setUrl3] = useState(null);
    const [url4, setUrl4] = useState(null);
    const [url5, setUrl5] = useState(null);

    const [detailName, setDetailName] = useState('');
    const [detailPrice, setDetailPrice] = useState('');
    const [detailPriceDiscount, setDetailPriceDiscount] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [items, setItems] = useState([]);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        if (!userInfo || !userInfo.userRole === 1) {
            history.push("/login")
        }
        // dispatch(getProductDetails(match.params.id))
    }, [dispatch, userInfo, history, match])

    useEffect(() => {
        LoadProductDetail()
        LoadCategory()
    }, [])

    const LoadProductDetail = async () => {
        await axios.get(apiRoot + `Product/${match.params.id}/`)
            .then(response => {
                var d = response.data
                var p = d.product
                setItems(d.productDetails)
                setName(p.productName)
                setDescription(p.productDescription)
                setcategory(p.categoryId)
                setUrl1(p.img1)
                setUrl2(p.img2)
                setUrl3(p.img3)
                setUrl4(p.img4)
                setUrl5(p.img5)
            })
            .catch(err => {
                console.log("loi");
            })
    }

    const handleDelete = (index, item) => {
        if (item.productDetailId === null) {
            const newItems = items.filter((_, i) => i !== index);
            setItems(newItems);
        } else {
            setItemdelete(item)
            handleShow()
        }
    };

    const handleEdit = (item) => {
        setDetailName(item.productDetailName)
        setDetailPrice(item.productDetailPrice)
        setDetailPriceDiscount(item.detailPriceDiscount)
        setStock(item.detailStock)
        setStartDate(item.StartDate)
        setEndDate(item.EndDate)
    }

    const handleAddDetail = () => {
        if (parseInt(detailPriceDiscount, 10) > 100 && parseInt(detailPriceDiscount, 10) < 0) {
            alert("Giảm giá là phần trăm < 100% và > 0%");
        }
        if (parseInt(detailPriceDiscount, 10) !== null) {
            const newItem = {
                'productDetailName': detailName,
                'productDetailPrice': detailPrice,
            
                'detailStock': stock,
            };
            setItems([...items, newItem]);
            setDetailName('');
            setDetailPrice('');
            setDetailPriceDiscount('');
            setStartDate('');
            setEndDate('');
            setStock('')
        }
    };

    const LoadCategory = async () => {
        try {
            const { data } = await axios.get(
                `${apiRoot}Category`
            )
            console.log(data)
            setcategoryList(data)
        } catch {
            setcategoryList([])
        }
    }

    const onSubmit = async () => {
        const data1 = await postFile(file1);
        const data2 = await postFile(file2);
        const data3 = await postFile(file3);
        const data4 = await postFile(file4);
        const data5 = await postFile(file5);
        let form_data = {
            product: {
                "productId": match.params.id,
                "productName": name,
                "productDescription": description,
                "productDate": "2024-06-23T08:39:10.722Z",
                "updateAt": "2024-06-23T08:39:10.722Z",
                "deleteAt": "2024-06-23T08:39:10.722Z",
                "createAt": "2024-06-23T08:39:10.722Z",
                "userId": userInfo.userId,
                "categoryId": category,
                "img1": data1,
                "img2": data2,
                "img3": data3,
                "img4": data4,
                "img5": data5
            },
            productDetails: items
        }

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        // api call
        await axios.put(
            `${apiRoot}Product`,
            form_data,
            config
        ).then(res => {
            history.push('/')
        }).catch(err => {
            history.push('/')
        })
    }

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setUrl1(URL.createObjectURL(selectedFile))
            const reader = new FileReader();
            reader.readAsDataURL(selectedFile);
            reader.addEventListener("load", () => {
                const data = reader.result.split(",")[1];
                const postData = {
                    name: selectedFile.name,
                    type: selectedFile.type,
                    data: data
                }
                setFile1(postData);
            })
        }
    };

    const handleFileChange2 = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setUrl2(URL.createObjectURL(selectedFile))
            const reader = new FileReader();
            reader.readAsDataURL(selectedFile);
            reader.addEventListener("load", () => {
                const data = reader.result.split(",")[1];
                const postData = {
                    name: selectedFile.name,
                    type: selectedFile.type,
                    data: data
                }
                setFile2(postData);
            })
        }
    };

    const handleFileChange3 = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setUrl3(URL.createObjectURL(selectedFile))
            const reader = new FileReader();
            reader.readAsDataURL(selectedFile);
            reader.addEventListener("load", () => {
                const data = reader.result.split(",")[1];
                const postData = {
                    name: selectedFile.name,
                    type: selectedFile.type,
                    data: data
                }
                setFile3(postData);
            })
        }
    };

    const handleFileChange4 = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setUrl4(URL.createObjectURL(selectedFile))
            const reader = new FileReader();
            reader.readAsDataURL(selectedFile);
            reader.addEventListener("load", () => {
                const data = reader.result.split(",")[1];
                const postData = {
                    name: selectedFile.name,
                    type: selectedFile.type,
                    data: data
                }
                setFile4(postData);
            })
        }
    };

    const handleFileChange5 = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setUrl5(URL.createObjectURL(selectedFile))
            const reader = new FileReader();
            reader.readAsDataURL(selectedFile);
            reader.addEventListener("load", () => {
                const data = reader.result.split(",")[1];
                const postData = {
                    name: selectedFile.name,
                    type: selectedFile.type,
                    data: data
                }
                setFile5(postData);
            })
        }
    };

    async function postFile(postData) {
        try {
            if (postData !== null) {
                const response = await fetch("https://script.google.com/macros/s/AKfycbzXqSkxwM-WpNHetg2hkbIyTwiKXVVu0D4QUdrW4QSQjWF0SDTwT1sKrpMCNmAyGIDE/exec", {
                    method: 'POST',
                    body: JSON.stringify(postData),
                })
                const data = await response.json();
                return data.link
            }
            return ""
        } catch {
            return ""
        }
    }

    if (productCreationSuccess) {
        alert("Product successfully created.")
        history.push(`/product/${product}/`)
        dispatch({
            type: CREATE_PRODUCT_RESET
        })
    }

    if (userInfo && tokenError === "Request failed with status code 401") {
        alert("Session expired, please login again.")
        dispatch(logout())
        history.push("/login")
        window.location.reload()
    }

    const [images, setImages] = useState([]);

    const handleRemoveImage = (index) => {
        setImages(prevImages => prevImages.filter((_, i) => i !== index));
    };

    const confirmDelete = () => {
        axios.delete(`${apiRoot}Product/removeDetailProduct/${itemdelete.productDetailId}`)
            .then(response => {
                window.location.reload()
            })
            .catch(error => {
                console.error("loi");
            })
        handleClose()
    }

    return (
        <div style={{
            width: '100%',
            backgroundColor: 'white',
            borderRadius: '20px',
            height: '90vh',
            justifyContent: 'center',
            padding: '2rem',
            overflowY: 'auto',
            boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px'
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
                    <Modal.Body>Bạn có chắc chắn muốn xoá sản phẩm ?</Modal.Body>
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
            {/* {productCreationError && <Message variant='danger'>{productCreationError.image[0]}</Message>} */}
            <h3 style={{
                textAlign: 'center'
            }}>Chỉnh sửa sản phẩm</h3>
            <div>

                <Form.Group controlId='name'>
                    <Form.Label>
                        <b>
                            Tên sản phẩm
                        </b>
                    </Form.Label>
                    <Form.Control
                        required
                        autoFocus={true}
                        type="text"
                        value={name}
                        placeholder="Nhập tên sản phẩm"
                        className='inputAddNewProduct'
                        onChange={(e) => setName(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='description'>
                    <Form.Label>
                        <b>
                            Mô tả sản phẩm
                        </b>
                    </Form.Label>
                    <Form.Control
                        required
                        as="textarea"
                        rows={3}
                        value={description}
                        className='inputAddNewProduct'
                        placeholder="Nhập mô tả sản phẩm"
                        onChange={(e) => setDescription(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>
                <div>
                    <div style={{
                        border: '1px solid grey',
                        width: '50%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        borderRadius: '.5rem .5rem 0 0',
                        padding: '.5rem',
                        textAlign: 'center',
                        backgroundColor: '#d0f1f6'
                    }}>
                        <p style={{
                            width: '20%',
                            borderRight: '1px solid grey'
                        }}>Tên</p>
                        <p style={{
                            width: '20%',
                            borderRight: '1px solid grey'
                        }}>Giá</p>
                        <p style={{
                            width: '20%',
                            borderRight: '1px solid grey'
                        }}>Số lượng</p>
                        <p style={{
                            width: '20%',
                        }}></p>
                    </div>
                    {items.map((item, index) => (
                        <div key={index} style={{
                            border: '1px solid grey',
                            width: '50%',
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '.5rem'
                        }}>
                            <p style={{
                                width: '20%',
                                borderRight: '1px solid grey'
                            }}>{item.productDetailName}</p>
                            <p style={{
                                width: '20%',
                                borderRight: '1px solid grey'
                            }}>{item.productDetailPrice}</p>
                            <p style={{
                                width: '20%',
                                borderRight: '1px solid grey'
                            }}>{item.detailStock}</p>
                            <button style={{
                                width: '19%',
                                border: 'none',
                                backgroundColor: '#e05966',
                                color: 'white',
                                borderRadius: '.5rem',
                                margin: '0 .5%'
                            }} onClick={() => handleDelete(index, item)}>Delete</button>
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '70%' }}>
                    <Form.Group controlId='nameDetail'>
                        <Form.Label>
                            <b>
                                Loại sản phẩm
                            </b>
                        </Form.Label>
                        <Form.Control
                            autoFocus={true}
                            type="text"
                            value={detailName}
                            placeholder="Nhập Loại sản phẩm"
                            className='inputAddNewProduct'
                            onChange={(e) => setDetailName(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='price'>
                        <Form.Label>
                            <b>
                                Giá
                            </b>
                        </Form.Label>
                        <Form.Control
                            type="number"
                            value={detailPrice}
                            placeholder="Nhập giá VND"
                            className='detailPrice'
                            onChange={(e) => setDetailPrice(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='priceDiscount'>
                        <Form.Label>
                            <b>
                                Số lượng hàng
                            </b>
                        </Form.Label>
                        <Form.Control
                            type="number"
                            pattern="[0-9]+(\.[0-9]{1,2})?%?"
                            value={stock}
                            placeholder="Nhập số luợng hàng"
                            className='inputAddNewProduct'
                            step="1"
                            onChange={(e) => setStock(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>

                    <button style={{
                        height: '50px',
                        padding: '.5rem 3rem',
                        border: 'none',
                        borderRadius: '.5rem',
                        backgroundColor: '#1a71ff',
                        color: 'white'
                    }} onClick={() => handleAddDetail()}>Thêm</button>
                </div>
                <Form.Group controlId="category">
                    <Form.Label>
                        <b>Loại mặt hàng</b>
                    </Form.Label>
                    <Form.Control
                        as="select"
                        required
                        className='inputAddNewProduct'
                        value={category}
                        onChange={(e) => setcategory(e.target.value)}
                    >
                        <option value="">Select a category</option>
                        {categoryList.length > 0 ? (
                            categoryList.map((cat) => (
                                <option key={cat.categoryId} value={cat.categoryId}>
                                    {cat.categoryName}
                                </option>
                            ))
                        ) : (
                            <option value="" disabled>
                                <option value="">Chọn loại mặt hàng</option>
                            </option>
                        )}
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="imageUpload">
                    <Form.Label>
                        <b>Tải ảnh</b>
                    </Form.Label>
                </Form.Group>
                <div style={{
                    display: 'flex',
                }}>
                    {images.map((image, index) => (
                        <div key={index} xs={6} md={4} lg={3} className="mb-3"
                            style={{
                                width: '18%',
                                marginRight: '.1rem',
                            }}>
                            <div className="image-preview">
                                <img
                                    src={image.preview}
                                    alt={`Preview ${index + 1}`}
                                    style={{ width: '100%', height: '100px', border: '1px solid black' }}
                                />
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleRemoveImage(index)}
                                    className="mt-2"
                                >
                                    Remove
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{
                    display: 'flex',
                    width: '50%',
                    justifyContent: 'space-evenly'
                }}>
                    <Form.Group controlId="imageUpload">
                        <div className="file-upload-container">
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                disabled={images.length >= 1}
                            />
                            {url1 ? (
                                <img src={url1} alt="Uploaded" width={'100px'} className="uploaded-image" />
                            ) : (
                                <div className="file-upload-text">
                                    {image ? 'Tải ảnh' : 'Tải ảnh'}
                                </div>
                            )}
                        </div>
                    </Form.Group>

                    <Form.Group controlId="imageUpload">
                        <div className="file-upload-container">
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange2}
                                disabled={images.length >= 1}
                            />
                            {url2 ? (
                                <img src={url2} alt="Uploaded" width={'100px'} className="uploaded-image" />
                            ) : (
                                <div className="file-upload-text">
                                    {image ? 'Tải ảnh' : 'Tải ảnh'}
                                </div>
                            )}
                        </div>
                    </Form.Group>

                    <Form.Group controlId="imageUpload">
                        <div className="file-upload-container">
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange3}
                                disabled={images.length >= 1}
                            />
                            {url3 ? (
                                <img src={url3} alt="Uploaded" width={'100px'} className="uploaded-image" />
                            ) : (
                                <div className="file-upload-text">
                                    {image ? 'Tải ảnh' : 'Tải ảnh'}
                                </div>
                            )}
                        </div>
                    </Form.Group>

                    <Form.Group controlId="imageUpload">
                        <div className="file-upload-container">
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange4}
                                disabled={images.length >= 1}
                            />
                            {url4 ? (
                                <img src={url4} alt="Uploaded" width={'100px'} className="uploaded-image" />
                            ) : (
                                <div className="file-upload-text">
                                    {image ? 'Tải ảnh' : 'Tải ảnh'}
                                </div>
                            )}
                        </div>
                    </Form.Group>

                    <Form.Group controlId="imageUpload">
                        <div className="file-upload-container">
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange5}
                                disabled={images.length >= 1}
                            />
                            {url5 ? (
                                <img src={url5} alt="Uploaded" width={'100px'} className="uploaded-image" />
                            ) : (
                                <div className="file-upload-text">
                                    {image ? 'Tải ảnh' : 'Tải ảnh'}
                                </div>
                            )}
                        </div>
                    </Form.Group>
                </div>


                <button type="submit" class="btn btn-success mr-4"
                    style={{
                        borderRadius: '.5rem',
                        padding: '.5rem 2rem'
                    }} onClick={() => onSubmit()}>
                    Lưu thay đổi
                </button>
                <button type="submit" class="btn btn-danger"
                    style={{
                        borderRadius: '.5rem',
                        padding: '.5rem 2rem'
                    }}
                    onClick={() => history.push("/")}
                >
                    Huỷ
                </button>
            </div>
        </div>
    )
}

export default EditProductPage
