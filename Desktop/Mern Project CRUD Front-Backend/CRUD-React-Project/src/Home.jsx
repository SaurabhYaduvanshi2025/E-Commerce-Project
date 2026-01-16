import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import "bootstrap/dist/css/bootstrap.min.css"; 
import axios from 'axios'; 

function Home() {
    
    const navigate = useNavigate(); 

    //    User Logic 
    const userEmail = localStorage.getItem("userEmail") || "User";

    //   State Variables 
    const [cartCount, setCartCount] = useState(0); 
    const [products, setProducts] = useState([]); 

    //   Security Check & Data Fetching 
    useEffect(() => {
        //   Token Check Logic
        const token = localStorage.getItem("token");
        
        if (!token) {
            // if token not have so pls send on login page
            navigate('/login');
        } else {
            // Agar token hai, tabhi data mangwao
            axios.get('http://localhost:3001/products')
            .then(result => {
                console.log("Data aa gaya:", result.data); 
                setProducts(result.data); 
            })
            .catch(err => console.log(err));
        }
    }, [navigate]); 

    //   Logout Function
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail"); 
        // localStorage.removeItem("cart"); 
        
        navigate('/login'); 
    }

    // Add to Cart Logic
    const addToCart = (product) => {
        if (product.qty > 0) {
            const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
            const existingItem = existingCart.find(item => item._id === product._id);

            if (existingItem) {
                existingItem.userQty += 1;
            } else {
                existingCart.push({ ...product, userQty: 1 });
            }

            localStorage.setItem("cart", JSON.stringify(existingCart));
            setCartCount(cartCount + 1);
            alert(`${product.name} added to cart!`);

            const updatedProducts = products.map(p => 
                p._id === product._id ? { ...p, qty: p.qty - 1 } : p
            );
            setProducts(updatedProducts);

        } else {
            alert("Sorry! Product is Out of Stock");
        }
    };

    return (
        <div className="bg-light min-vh-100">
            
            {/*  navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
                <a className="navbar-brand" href="#">My Shop</a>
                <div className="ms-auto d-flex align-items-center">
                    <span className="text-white me-3">Welcome, {userEmail.split('@')[0]}</span>
                    
                    {/* Cart Button */}
                    <button className="btn btn-primary position-relative">
                        Cart 🛒
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {cartCount}  
                        </span>
                    </button>
                    
                    {/* Logout Button */}
                    <button onClick={handleLogout} className="btn btn-outline-light ms-3">
                        Logout
                    </button>
                </div>
            </nav>

            {/*  main content */}
            <div className="container-fluid mt-4">
                <div className="row">
                    
                    {/* Left Side: User Profile Card */}
                    <div className="col-md-3">
                        <div className="card shadow-sm">
                            <div className="card-header bg-success text-white">
                                <h5>User Profile</h5>
                            </div>
                            <div className="card-body text-center">
                                <img 
                                    src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
                                    alt="User" 
                                    className="img-fluid rounded-circle mb-3" 
                                    style={{width: "100px"}} 
                                />
                                <h4>{userEmail.split('@')[0]}</h4>
                                <p className="text-muted">{userEmail}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Products List */}
                    <div className="col-md-9">
                        <h3 className="mb-3">Latest Products</h3>
                        <div className="row">
                            
                            {/* loop start */}
                            {products.map((product) => (
                                <div className="col-md-4 mb-4" key={product._id}>
                                    <div className="card h-100 shadow-sm">
                                        
                                        <img 
                                            src={`http://localhost:3001/images/${product.image}`} 
                                            className="card-img-top" 
                                            alt={product.name} 
                                            style={{height: "200px", objectFit: "contain"}} 
                                        />
                                        
                                        <div className="card-body">
                                            <h5 className="card-title">{product.name}</h5>
                                            <p className="card-text text-muted">{product.desc}</p>
                                            <p className="mb-2"><strong>Spec:</strong> {product.specification}</p>
                                            <h4 className="text-success">₹{product.price.toLocaleString('en-IN')}</h4>
                                            
                                            {product.qty > 0 ? (
                                                <p className="text-primary">In Stock: <strong>{product.qty}</strong></p>
                                            ) : (
                                                <p className="text-danger"><strong>Out of Stock</strong></p>
                                            )}
                                        </div>

                                        <div className="card-footer bg-white border-0">
                                            <button 
                                                className={`btn w-100 ${product.qty > 0 ? 'btn-warning' : 'btn-secondary disabled'}`}
                                                onClick={() => addToCart(product)}
                                            >
                                                {product.qty > 0 ? 'Add to Cart 🛒' : 'Sold Out ❌'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {/*loop end here */}

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Home;