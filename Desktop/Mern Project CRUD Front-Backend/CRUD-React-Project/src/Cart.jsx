import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Cart() {
    //  STATE VARIABLES
    const [cart, setCart] = useState([]); 
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); 

    //  DATA FETCHING 
    useEffect(() => {
        axios.get('http://localhost:3001/api/cart', {
            withCredentials: true  //Token 
        })
        .then(res => {
            if (Array.isArray(res.data)) {
                setCart(res.data); 
            } else {
                navigate('/login');
            }
            setLoading(false); 
        })
        .catch(err => {
            console.log("Error fetching cart:", err);
            setLoading(false); // Error aaya tab bhi loading band karo
        });
    }, [navigate]);

    //  REMOVE ITEM LOGIC 
    const removeFromCart = async (productId) => {
        if(!window.confirm("Are you sure you want to remove this item?")) return;
        try {
            
            const res = await axios.delete(`http://localhost:3001/api/cart/${productId}`, {
                withCredentials: true
            });

            if(res.status === 200) {
                alert("Item Removed! 🗑️");
                setCart(cart.filter(item => item.productsId._id !== productId));
            }
        } catch (err) {
            console.error("Error removing item:", err);
            alert("Error deleting item");
        }
    };

    //  CALCULATION LOGIC 
    
    const totalPrice = cart.reduce((acc, item) => {
        const price = item.productsId?.price || 0;
        
        return acc + (price * item.quantity);
    }, 0); // 0 se ginti shuru hogi

    // LOADING UI
    if(loading) return <h2 className="text-center mt-5">Loading...</h2>;

    //  MAIN UI RENDER 
    return (
        <div className="container mt-5 mb-5">
            <h2 className="mb-4">My Shopping Cart</h2>
            
            {/*  Agar Cart khali hai to message , nahi to List show hoga*/}
            {cart.length === 0 ? (
                <div className="alert alert-warning">Cart is Empty 🛒</div>
            ) : (
                <>
                    {/* CART ITEMS LIST  */}
                    <div className="row">
                        {/* Map Loop: Har item ke liye ek Card banega */}
                        {cart.map((item, index) => (
                            <div key={index} className="col-12 mb-3">
                                <div className="card shadow-sm p-3">
                                    <div className="row align-items-center">
                                        
                                        {/* Product Image */}
                                        <div className="col-md-2">
                                            <img 
                                                // Optional Chaining (?.) taaki agar image na ho to crash na ho
                                                src={`http://localhost:3001/images/${item.productsId?.image}`} 
                                                alt={item.productsId?.name} 
                                                className="img-fluid rounded"
                                                style={{height: "80px", objectFit: "cover"}}
                                            />
                                        </div>
                                        
                                        {/* Product Name & Description */}
                                        <div className="col-md-4">
                                            <h5>{item.productsId?.name}</h5>
                                            <p className="text-muted small">{item.productsId?.desc}</p>
                                        </div>

                                        {/* Price & Quantity Info */}
                                        <div className="col-md-3">
                                            <h6>Price: ₹{item.productsId?.price}</h6>
                                            <p>Qty: {item.quantity}</p>
                                        </div>

                                        {/* Single Item Total (Price * Qty) */}
                                        <div className="col-md-3 text-end">
                                            <h5>₹{item.productsId?.price * item.quantity}</h5>

                                            {/*  Remove button */}
                                            <button 
                                                className="btn btn-danger btn-sm mt-2"
                                                onClick={() => removeFromCart(item.productsId._id)}
                                            >
                                                Remove 🗑️
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Grand total  */}
                    <div className="row mt-4">
                        <div className="col-md-6 offset-md-6"> {/* Right side shift karne ke liye */}
                            <div className="card p-4 border-0 shadow bg-light">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h4>Grand Total:</h4>
                                    <h2 className="text-success fw-bold">
                                        {/* toLocaleString():  (e.g. 1,200) */}
                                        ₹{totalPrice.toLocaleString('en-IN')}
                                    </h2>
                                </div>
                                <button className="btn btn-dark btn-lg w-100">
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Cart;