import "./Cart.css";
import { useContext } from "react";
import {CartC} from '../../Context/CartContext';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Cart({setIsOpen,user}) {
    const Cart = useContext(CartC);
    const {cartInfo,stock,totalPrice,handleAddtoCart,handleChange,handleDelete,handleEmpty} = Cart;

    const handlePlaceOrder = async(e)=>{
        e.preventDefault();
        const order = {
            user : user,
            items: JSON.stringify(cartInfo.map((item,ind) => {return(
                {
                    pid : item.ID,
                    quantity : stock[ind],
                }
            )})),
            totalPrice : totalPrice,
        }
        try{
            const resp = await axios.post("http://localhost:5000/placeorder",order);
            if(resp.status === 200){
                toast.success(resp.data.msg);
                handleEmpty();
            }else{
                toast.error(resp.data.msg);
            }
        }catch(err){
            console.log(err);
        }
    }

    return (
        <div id="popup" className="popup">
            <div className="popup-content">
                <span className="close" onClick={() => { setIsOpen(false) }}>&times;</span>
                <div className="cart-container">
                    <h1>My Cart</h1>
                    <table className="cart-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartInfo.map((item,ind)=>{
                                return(
                                <tr key={ind} className="cart-item">
                                    <td className="item-details">
                                        <img src={item.bookImg || "https://via.placeholder.com/150"} alt="Product Image" />
                                        <span className="item-name">{item.title}</span>
                                    </td>
                                    <td className="item-price">{item.price} TND</td>
                                    <td>
                                        <input type="number" className="item-quantity" value={stock[ind]} onChange={(e)=>{handleChange(e,ind)}} min="1" />
                                    </td>
                                    <td className="item-total">{item.price * stock[ind]} TND</td>
                                    <td>
                                        <button className="remove-item" onClick={()=>handleDelete(ind)}>X</button>
                                    </td>
                                </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    <div className="cart-summary">
                        <span>Total: {totalPrice.toFixed(2)} TND</span>
                        <button className="checkout-btn" onClick={handlePlaceOrder}>Place Order</button>
                    </div>
                </div>
            </div>
            <ToastContainer className="noti"/>
        </div>
    )
}
export default Cart;