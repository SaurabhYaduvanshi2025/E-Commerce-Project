import  { useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";

function Cart() {
    const navigate = useNavigate();

    // 1. Default value empty array
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        try {
            const storedData = localStorage.getItem("cart");
            if (storedData) {
                const parsedData = JSON.parse(storedData);

                // Check kiya ki kya ye sach me Array hai?
                if (Array.isArray(parsedData)) {
                    setCartItems(parsedData);
                } else {
                    console.log("Data kharab tha, empty list set ki");
                    setCartItems([]); 
                }
            }
        } catch (error) {
            // 2. Catch block ab sahi chalega
            console.log("Cart Error:", error);
            setCartItems([]);
        }
    }, []); 

    // --- BAKI CODE WAISA HI RAHEGA ---
    // (Lekin main pura de raha hun taaki copy-paste me galti na ho)

    const handleRemove = (id) => {
        const updatedCart = cartItems.filter(item => item._id !== id);
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart)); 
    };

    const totalPrice = cartItems.reduce((acc, item) => {
        return acc + (Number(item.price) * Number(item.userQty) || 0);
    }, 0);

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Your Shopping Cart 🛒</h2>
            
            {cartItems.length === 0 ? (
                <div className="text-center p-5 border bg-light">
                    <h4>Your Cart is Empty!</h4>
                    <button className="btn btn-primary mt-3" onClick={() => navigate('/home')}>
                        Go to Shop
                    </button>
                </div>
            ) : (
                <div className="row">
                    <div className="col-md-8">
                        {cartItems.map(item => (
                            <div className="card mb-3 shadow-sm" key={item._id}>
                                <div className="row g-0 align-items-center">
                                    <div className="col-md-2 p-2">
                                        <img 
                                            src={item.image || "https://via.placeholder.com/150"} 
                                            className="img-fluid rounded-start" 
                                            alt={item.name} 
                                            style={{maxHeight: "100px", objectFit: "contain"}}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <div className="card-body">
                                            <h5 className="card-title">{item.name}</h5>
                                            <p className="card-text">Price: <strong>₹{item.price}</strong></p>
                                        </div>
                                    </div>
                                    <div className="col-md-2 text-center">
                                        <span className="badge bg-secondary p-2">Qty: {item.userQty}</span>
                                    </div>
                                    <div className="col-md-2 text-center">
                                        <button className="btn btn-danger btn-sm" onClick={() => handleRemove(item._id)}>Remove</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="col-md-4">
                        <div className="card shadow-sm">
                            <div className="card-header bg-dark text-white">
                                <h5>Summary</h5>
                            </div>
                            <div className="card-body">
                                <h4>Total: <span className="text-success">₹{totalPrice}</span></h4>
                                <button className="btn btn-success w-100 mt-3">Checkout</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;