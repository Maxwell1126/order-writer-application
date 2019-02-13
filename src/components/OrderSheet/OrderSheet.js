import React, { Component } from 'react';
import { connect } from 'react-redux';
import LogOutButton from '../LogOutButton/LogOutButton';
import axios from 'axios';
import OrderSheetItem from './OrderSheetItem';

class OrderSheet extends Component {
    constructor(props) {
        super(props)
        this.state = {
            products: [],
        }
    }

    componentDidMount() {
        this.getProducts();
    }
    
    getProducts = (event) => {
        axios.get(`api/ordersheet/${this.props.match.params.id}`).then(response => {
            
            //console.log('response,'  );
            this.setState({
                
                ...this.state,
                products: response.data,
            })
        })
    }

    submitOrder = (event) =>{
        //console.log('in submit order');
        
        let products={
            products:this.state.products,
            id:this.props.match.params.id,
        }
        axios({
            method:'PUT',
            url: '/api/ordersheet',
            data:products,
        }).then((response) =>{
            this.getProducts();
        }).catch((error)=>{
            console.log('error on client putting orders', error);
            
        })
    }
    // this could also be written with destructuring parameters as:
    // const UserPage = ({ user }) => (
    // and then instead of `props.user.username` you could use `user.username`
    // this.render
    // 
    upQuantity = i => {
        //Credit for this function belongs to Dereje1 from this link:
        //https://www.freecodecamp.org/forum/t/reactjs-using-setstate-to-update-a-single-property-on-an-object/146772
        let productsCopy = JSON.parse(JSON.stringify(this.state.products))
        productsCopy[i].quantity ++;
            this.setState({
                products: productsCopy
            })
        }
    downQuantity = (i) => {
        //Credit for this function belongs to Dereje1 from this link:
        //https://www.freecodecamp.org/forum/t/reactjs-using-setstate-to-update-a-single-property-on-an-object/146772
        if(this.state.products[i].quantity!==0){
        let productsCopy = JSON.parse(JSON.stringify(this.state.products))
        productsCopy[i].quantity--;
        this.setState({
            products: productsCopy
        })
    }
    }
    render() {
        return (
            <div>
                {/* <p>{JSON.stringify(this.props)}</p> */}
                {/* {/* <p>{JSON.stringify(this.state.products[1])}</p> */}
                <p>{JSON.stringify(this.state.products)}</p>
                {/* <h1>{this.props.order.order_name}</h1> */}
                <h1>Order Sheet</h1>
                {/* <p>{JSON.stringify(this.props)}</p> */}
                <div>{this.state.products.map((product, i) => {
                    //console.log('product',product);
                    return (<OrderSheetItem
                        history={this.props.history}
                        product={product}
                        i={i}
                        upQuantity={this.upQuantity}
                        downQuantity={this.downQuantity}
                        getProducts={this.getProducts}/>)
                })}</div>
                <button onClick={this.submitOrder}>Submit</button>
                <br></br>
                <br></br>
                <LogOutButton className="log-in" />
            </div>
        )
    }
}
// Instead of taking everything from state, we just want the user info.
// if you wanted you could write this code like this:
// const mapStateToProps = ({user}) => ({ user });
const mapStateToProps = state => ({
    user: state.user,
});

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(OrderSheet);