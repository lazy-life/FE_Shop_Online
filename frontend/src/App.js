import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import ProductListPage from './pages/ProductsListPage'
import ProductDetailsPage from './pages/ProductDetailsPage'
import CheckoutPage from './pages/CheckoutPage'
import NavBar from './components/Navbar'
import PaymentStatus from './components/PaymentStatus'
import Login from './pages/LoginPage'
import Register from './pages/RegisterPage'
import CardUpdatePage from './pages/CardUpdatePage'
import CardDetailsPage from './pages/CardDetailsPage'
import AccountPage from './pages/AccountPage'
import AccountUpdatePage from './pages/AccountUpdatePage'
import DeleteUserAccountPage from './pages/DeleteUserAccountPage'
import AllAddressesOfUserPage from './pages/AllAddressesOfUserPage'
import AddressUpdatePage from './pages/AddressUpdatePage'
import OrdersListPage from './pages/OrdersListPage'
import ProductCreatePage from './pages/ProductCreatePage'
import ProductUpdatePage from './pages/ProductUpdatePage'
import NotFound from './pages/NotFoundPage'
import ProductsSearchPage from './pages/ProductSearchpage'
import CategoryPage from './pages/categorypage'
import Success from './pages/Success'
import EditProductPage from './pages/EditProductPage'
import ManageMoneyPage from './pages/ManageMoneyPage'
import ProductCategoryPage from './pages/ProductCategoryPage'
import SaleProductPage from './pages/SaleProductPage'
import ShipperPage from './pages/ShipperPage'


const App = () => {

  return (
    <div>
      <Router>
        <NavBar />
        <div style={{
          marginTop: '5rem',
          padding: '0',
          width: '100%',
        }}>
          <Switch>
            <Route path="/" component={ProductListPage} exact />
            <Route path="/new-product/" component={ProductCreatePage} exact />
            <Route path="/product/:id/" component={ProductDetailsPage} exact />
            <Route path="/product-update/:id/" component={ProductUpdatePage} exact />
            <Route path="/product/:id/checkout/" component={CheckoutPage} exact />
            <Route path="/payment-status" component={PaymentStatus} exact />
            <Route path="/login" component={Login} exact />
            <Route path="/register" component={Register} exact />
            <Route path="/account" component={AccountPage} exact />
            <Route path="/account/update/" component={AccountUpdatePage} exact />
            <Route path="/account/delete/" component={DeleteUserAccountPage} exact />
            <Route path="/stripe-card-details" component={CardDetailsPage} exact />
            <Route path="/stripe-card-details/checkout" component={CheckoutPage} exact />
            <Route path="/stripe-card-update" component={CardUpdatePage} exact />
            <Route path="/all-addresses/" component={AllAddressesOfUserPage} exact />
            <Route path="/all-addresses/:id/" component={AddressUpdatePage} exact />
            <Route path="/all-orders/" component={OrdersListPage} exact />
            <Route path="/search/:key/" component={ProductsSearchPage} exact />
            <Route path="/category/" component={CategoryPage} exact />
            <Route path="/success/" component={Success} exact />
            <Route path="/edit-product/:id/" component={EditProductPage} exact />
            <Route path="/manage/" component={ManageMoneyPage} exact />
            <Route path="/categoryProduct/:id/" component={ProductCategoryPage} exact />
            <Route path="/sale/" component={SaleProductPage} exact />
            <Route path="/ship/" component={ShipperPage} exact />
            <Route path="" component={NotFound} exact />
          </Switch>
        </div>
      </Router>
    </div>
  )
}

export default App
