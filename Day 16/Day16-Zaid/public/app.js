const { useState, useEffect } = React;
const API_BASE_URL = "http://localhost:3000";

function App() {
  const [view, setView] = useState("store"); // 'store', 'payment', 'confirmation'
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data));
    fetch(`${API_BASE_URL}/api/cart`)
      .then((res) => res.json())
      .then((data) => setCart(data));
  }, []);

  const addToCart = (productId) => {
    fetch(`${API_BASE_URL}/api/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: 1 }),
    })
      .then((res) => res.json())
      .then((newItem) => {
        const existingItem = cart.find(
          (item) => item.product._id === newItem.product
        );
        if (existingItem) {
          setCart(
            cart.map((item) =>
              item.product._id === newItem.product
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          );
        } else {
          fetch(`${API_BASE_URL}/api/cart`)
            .then((res) => res.json())
            .then((data) => setCart(data));
        }
      });
  };

  const placeOrder = () => {
    return new Promise((resolve, reject) => {
      fetch(`${API_BASE_URL}/api/orders`, { method: "POST" })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Order placement failed");
          }
          return res.json();
        })
        .then((data) => {
          setOrder(data);
          setCart([]);
          setView("confirmation");
          resolve(data);
        })
        .catch((err) => reject(err));
    });
  };

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white mb-2">Tech Trove</h1>
        <p className="text-lg text-gray-400">Your Modern Tech Destination</p>
      </div>

      {view === "store" && (
        <div>
          <ProductList products={products} addToCart={addToCart} />
          <Cart cart={cart} setView={setView} total={total} />
        </div>
      )}
      {view === "payment" && (
        <PaymentPage total={total} placeOrder={placeOrder} />
      )}
      {view === "confirmation" && <OrderConfirmation order={order} />}
    </div>
  );
}

function ProductList({ products, addToCart }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {products.map((product) => (
        <div
          key={product._id}
          className="group relative bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center overflow-hidden transition-all duration-300 hover:border-electric-blue hover:shadow-2xl hover:shadow-electric-blue/20"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 opacity-50 group-hover:opacity-80 transition-opacity duration-300"></div>
          <div className="relative">
            <i
              className={`${product.imageUrl} text-6xl text-electric-blue mb-6 transition-transform duration-300 group-hover:scale-110`}
            ></i>
            <h3 className="text-2xl font-bold text-white mb-2">
              {product.name}
            </h3>
            <p className="text-xl font-semibold text-gray-300 mb-4">
              ₹{product.price.toLocaleString("en-IN")}
            </p>
            <button
              onClick={() => addToCart(product._id)}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 w-4/5 bg-electric-blue text-white font-bold py-2 px-4 rounded-lg opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
            >
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function Cart({ cart, setView, total }) {
  if (cart.length === 0) return null;

  return (
    <div className="mt-16 max-w-2xl mx-auto bg-gray-800/70 border border-gray-700 rounded-xl p-8">
      <h2 className="text-3xl font-bold text-white text-center mb-6">
        Shopping Cart
      </h2>
      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={item._id}
            className="flex justify-between items-center text-lg"
          >
            <span className="text-gray-300">
              {item.product.name} (x{item.quantity})
            </span>
            <span className="font-semibold text-white">
              ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
            </span>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-700 my-6"></div>
      <div className="flex justify-between items-center text-2xl font-bold">
        <span className="text-white">Total</span>
        <span className="text-electric-blue">
          ₹{total.toLocaleString("en-IN")}
        </span>
      </div>
      <button
        className="w-full mt-8 bg-electric-blue text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-blue-600 transition-colors duration-300"
        onClick={() => setView("payment")}
      >
        Proceed to Checkout
      </button>
    </div>
  );
}

function PaymentPage({ total, placeOrder }) {
  const [processing, setProcessing] = useState(false);

  const handlePayment = () => {
    setProcessing(true);
    setTimeout(() => {
      placeOrder().catch((err) => {
        console.error(err);
        alert("Payment failed. Please try again.");
        setProcessing(false);
      });
    }, 2000);
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800/70 border border-gray-700 rounded-xl p-8">
      <h2 className="text-3xl font-bold text-white text-center mb-6">
        Complete Your Payment
      </h2>
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-gray-400 text-lg">Total Amount</p>
          <p className="text-4xl font-bold text-electric-blue">
            ₹{total.toLocaleString("en-IN")}
          </p>
        </div>
        <div>
          <input
            type="text"
            placeholder="Card Number"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-electric-blue"
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Cardholder Name"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-electric-blue"
          />
        </div>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="MM/YY"
            className="w-1/2 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-electric-blue"
          />
          <input
            type="text"
            placeholder="CVV"
            className="w-1/2 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-electric-blue"
          />
        </div>
        <button
          className="w-full bg-electric-blue text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-blue-600 transition-colors duration-300 disabled:bg-gray-600"
          onClick={handlePayment}
          disabled={processing}
        >
          {processing
            ? "Processing..."
            : `Pay ₹${total.toLocaleString("en-IN")}`}
        </button>
      </div>
    </div>
  );
}

function OrderConfirmation({ order }) {
  return (
    <div className="max-w-md mx-auto text-center bg-gray-800/70 border border-gray-700 rounded-xl p-8">
      <i className="fas fa-check-circle text-6xl text-green-500 mb-6"></i>
      <h2 className="text-3xl font-bold text-white mb-2">
        Payment Successful!
      </h2>
      <p className="text-gray-400 mb-6">Thank you for your purchase.</p>
      <div className="text-left space-y-3">
        <p className="text-lg">
          <span className="text-gray-400">Order ID:</span>
          <strong className="ml-2 text-white">{order._id}</strong>
        </p>
        <p className="text-lg">
          <span className="text-gray-400">Total Amount:</span>
          <strong className="ml-2 text-electric-blue">
            ₹{order.total.toLocaleString("en-IN")}
          </strong>
        </p>
      </div>
      <a
        href="/"
        className="inline-block mt-8 bg-electric-blue text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-blue-600 transition-colors duration-300"
      >
        Continue Shopping
      </a>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
