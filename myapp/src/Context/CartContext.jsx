import { createContext , useState } from "react"

export const CartC = createContext();
function CartContext({children}) {

    const [cartInfo,setCartInfo] = useState([]);
    const [stock,setStock] = useState([]);
    const [totalPrice,setTotalPrice] = useState(0);

    const handleAddtoCart = (book)=>{
        let newCartInfo = [...cartInfo];
        let index = newCartInfo.findIndex(item=>item.ID===book.ID);
        if(index===-1)
            {
                newCartInfo.push(book);
                setCartInfo(newCartInfo);
                setTotalPrice(totalPrice + book.price);
                const newStock = [...stock];
                newStock.push('1');
                setStock(newStock);
            }
    }

    const handleChange = (e,ind)=>{
        const newStock = [...stock];
        setTotalPrice((e.target.value - stock[ind])*cartInfo[ind].price + totalPrice);
        newStock[ind] = e.target.value;
        setStock(newStock);
    }

    const handleDelete = (ind) => {
        setTotalPrice(totalPrice - (cartInfo[ind].price * stock[ind]));
        const newStock = [...stock];
        newStock.splice(ind, 1);
        setStock(newStock);
        const newCartInfo = [...cartInfo];
        newCartInfo.splice(ind, 1);
        setCartInfo(newCartInfo);
    };

    const handleEmpty = ()=>{
        setTotalPrice(0);
        setStock([]);
        setCartInfo([]);
    }

    const ContextValues = {cartInfo,stock,totalPrice,handleAddtoCart,handleChange,handleDelete,handleEmpty};

  return (
    <CartC.Provider value={ContextValues}>
        {children}
    </CartC.Provider>
  )
}

export default CartContext;