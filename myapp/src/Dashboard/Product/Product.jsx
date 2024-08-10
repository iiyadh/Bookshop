import './Product.css'
function Product({bookInfo, setBookInfo}){
    return(
    <div id="popup" className="popup">
        <div className="popup-content">
            <span className="close" onClick={()=>setBookInfo(null)}>&times;</span>
            <div className="popup-header">
                <img src={bookInfo.bookImg || "https://via.placeholder.com/150"} alt={bookInfo.title}/>
            </div>
            <div className="popup-body">
                <h2>{bookInfo.title}</h2>
                <p>ISBN: 97820813{bookInfo.ID}</p>
                <span className="price">{bookInfo.price.toFixed(2)} TND</span>
                <p>
                    {bookInfo.description}
                </p>
            </div>
        </div>
    </div>
)
}

export default Product;