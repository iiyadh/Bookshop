import "./Dashboard.css"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useContext, useState , useEffect } from "react";
import { UserC } from '../Context/UserContext';
import Product from "./Product/Product";
import CartComponent from "./Cart/Cart";  // Rename import to avoid conflict
import { CartC } from '../Context/CartContext';

function Dashboard() {
    const navigate = useNavigate();
    const { user } = useContext(UserC);
    const [filter, setFilter] = useState(null);
    const cartContext = useContext(CartC);  // Rename variable to avoid conflict
    const { cartInfo, stock, totalPrice, handleAddtoCart, handleChange, handleDelete } = cartContext;

    const handleLogout = async () => {
        try {
            const resp = await axios.post('http://localhost:5000/logout', { withCredentials: true });
            console.log(resp.data);
        } catch (err) {
            console.log(err);
        } finally {
            navigate('/');
        }
    }
    const [search,setSearch] = useState("");
    const [books, setBooks] = useState([]);
    const [bookInfo, setBookInfo] = useState(null);
    const [fBooks,setFBook] = useState([]);

    useEffect(() => {
        const GetBooks = async () => {
            try {
                const resp = await axios.get('http://localhost:5000/getbooks');
                if (resp.status === 200) {
                    setBooks(resp.data);
                    setFBook(resp.data);
                } else {
                    alert("something went wrong");
                }
            } catch (err) {
                console.log(err);
            }
        }
        GetBooks();
    }, [])

    const formatPrice = (price) => {
        return price.toFixed(2);
    }

    const [isOpen, setIsOpen] = useState(false);

    const handleSearch = ()=>{
        if(search === ""){
            setFBook(books);
            return false;
        }
        const filteredBooks = books.filter(book => book.title.toLowerCase().includes(search.toLowerCase()));
        setFBook(filteredBooks);
    }
    const handlePricefilter = ()=>{
        const filteredBooks = books.filter(book => book.price <= filter);
        setFBook(filteredBooks);
    }

    return (
        <div className="dashboard">
            <div className="header">
                <div className="logo">
                    <img src="../../public/images/TitleLogo.jpeg" alt="Baghdad Libary" />
                    <span>Baghdad Libary</span>
                </div>
                <div className="search-bar">
                    <input type="text" placeholder="Rechercher" value={search} onChange={(e)=>setSearch(e.target.value)}/>
                    <button onClick={handleSearch}>Search</button>
                </div>
                <div className="Meta">
                    <div className="cart" onClick={() => { setIsOpen(true) }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cart-fill" viewBox="0 0 16 16">
                            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                        </svg>
                        <span>My Cart</span>
                    </div>
                    <div className="Price">
                        <span>{totalPrice.toFixed(2)} TND</span>
                    </div>
                    <div className="Loggout" onClick={handleLogout}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z" />
                            <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
                        </svg>
                        <span>Logout</span>
                    </div>
                </div>
            </div>

            <div className="navbar">
                <a href="#">News</a>
                <a href="#">Best Sellers</a>
            </div>
            <div className="breadcrumb">
                <span>Home / News</span>
            </div>
            <div className="main-content">
                <div className="sidebar">
                    <h3>Prix</h3>
                    <input type="range" min="0" max="500" onChange={(e) => setFilter(e.target.value)} step="10" />
                    <span>{filter} TND</span>
                    <button className="btn-price" onClick={handlePricefilter} >Set Min Price</button>
                </div>
                <div className="products">
                    <h2>News</h2>
                    <div className="product-list">
                        {fBooks.map((book) => {
                            return (
                                <div key={book.ID} className="product">
                                    <img src={book.bookImg || "https://via.placeholder.com/150"} alt={book.title} onClick={() => setBookInfo(book)} />
                                    <h3>{book.title}</h3>
                                    <span className="price">{formatPrice(book.price)} TND</span>
                                    <span className="stock" style={book.quantity > 0 ? { color: "green" } : { color: "red" }}>{book.quantity > 0 ? 'In Stock' : 'Out Of Stock'}</span>
                                    <button disabled={book.quantity <= 0} onClick={() => { handleAddtoCart(book) }}>Add to cart</button>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            {bookInfo && <Product
                setBookInfo={setBookInfo}
                bookInfo={bookInfo} />}

            {isOpen && <CartComponent setIsOpen={setIsOpen}
                                        user = {user} />}
        </div>
    )
}
export default Dashboard;