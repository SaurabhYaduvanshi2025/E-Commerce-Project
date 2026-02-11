import { Link } from 'react-router-dom'; 
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
        const token = localStorage.getItem("token");
        
        if (!token) {
            navigate('/login');
        } else {
            //  Products Mangwao
            axios.get('http://localhost:3001/products')
            .then(result => {
                setProducts(result.data); 
            })
            .catch(err => console.log(err));

            axios.get('http://localhost:3001/api/cart', { withCredentials: true })
            .then(res => {
                if(Array.isArray(res.data)) {
                    setCartCount(res.data.length); 
                }
            })
            .catch(err => console.log("Cart Count Error:", err));
        }
    }, [navigate]);
    //   Logout Function
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail"); 
        
        navigate('/login'); 
    }

    // Add to Cart Logic
    const addToCart = async (product) => {
        const token = localStorage.getItem("token");
        if(!token) {
            alert("Please Login first to add items!");
            navigate('/login');
            return;
        }

        try {
            //  Server "Ye product database me save kar lo"
            const res = await axios.post('http://localhost:3001/api/cart/add', 
                { productId: product._id }, 
                { withCredentials: true } 
            );

            if(res.status === 200) {
                alert("Product Added to Cart! ✅");
                // Cart ka number badha do taaki user ko dikhe
                setCartCount(prev => prev + 1); 
            }

        } catch (err) {
            console.error("Error adding to cart:", err);
            alert("Error: Shayad Token expire ho gaya hai, Login again.");
        }
    };
    return (
        <div className="bg-light min-vh-100">
            
            {/* navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
                <a className="navbar-brand" href="#">My Shop</a>
                <div className="ms-auto d-flex align-items-center">
                    <span className="text-white me-3">Welcome, {userEmail.split('@')[0]}</span>
                    
                
                    <Link to="/cart" className="btn btn-primary position-relative">
                        Cart 🛒
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {cartCount}  
                        </span>
                    </Link>
                    {/*  */}
                    
                    {/* Logout Button */}
                    <button onClick={handleLogout} className="btn btn-outline-light ms-3">
                        Logout
                    </button>
                </div>
            </nav>

            {/* main content */}
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