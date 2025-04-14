import "./styles.css";
import initialDesserts from "./data.json";
import { useState } from "react";

export default function App() {
  // we're setting quantity for Waffle with Berries to 1 for dev / CSS purposes only
  // remove ternary for prod, setting all desserts to quantity of 0
  // or not
  const [desserts, setDesserts] = useState(
    initialDesserts.map((dessert) =>
      dessert.name === "Waffle with Berries"
        ? { ...dessert, quantity: 1 }
        : { ...dessert, quantity: 0 }
    )
  );
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);

  const cartTotal = desserts.reduce((accumulator, current) => {
    return accumulator + current.quantity * current.price;
  }, 0);

  const cartItems = desserts.filter((dessert) => dessert.quantity > 0);
  const totalNumCartItems = desserts.reduce(
    (acc, cur) => acc + cur.quantity,
    0
  );

  function onConfirm() {
    setIsOrderConfirmed(true);
  }

  function onStartNewOrder() {
    setDesserts(desserts.map((dessert) => ({ ...dessert, quantity: 0 })));
    setIsOrderConfirmed(false);
  }

  function onDecrease(name) {
    setDesserts(
      desserts.map((dessert) =>
        dessert.name === name
          ? { ...dessert, quantity: dessert.quantity - 1 }
          : dessert
      )
    );
  }

  function onIncrease(name) {
    setDesserts(
      desserts.map((dessert) =>
        dessert.name === name
          ? { ...dessert, quantity: dessert.quantity + 1 }
          : dessert
      )
    );
  }

  function onDeleteCartItem(name) {
    setDesserts(
      desserts.map((dessert) =>
        dessert.name === name ? { ...dessert, quantity: 0 } : dessert
      )
    );
  }

  return (
    <div id="container-app">
      <DessertList
        desserts={desserts}
        onDecrease={onDecrease}
        onIncrease={onIncrease}
      />
      <Cart
        cart_id={"cart-main"}
        cartTotal={cartTotal}
        cartItems={cartItems}
        onDeleteCartItem={onDeleteCartItem}
        onclick={onConfirm}
      >
        <h2>Your Cart ({Number(totalNumCartItems)})</h2>
      </Cart>
      <Cart
        cart_id={"cart-confirm"}
        cartTotal={cartTotal}
        cartItems={cartItems}
        onDeleteCartItem={onDeleteCartItem}
        confirmed={isOrderConfirmed}
        onclick={onStartNewOrder}
      >
        <h2>Order Confirmed</h2>
        <p>We hope you enjoy your food!</p>
      </Cart>
    </div>
  );
}

function Cart({
  cart_id,
  cartTotal,
  totalNumCartItems,
  cartItems,
  onDeleteCartItem,
  confirmed,
  onclick,
  children,
}) {
  return (
    <>
      <div
        id={cart_id}
        className={
          "container" +
          (!confirmed && cart_id === "cart-confirm" ? " hidden" : "")
        }
      >
        {children}
        {cartTotal === 0 ? (
          <>
            <p>
              is super duper empty.<p>Your added items will appear here.</p>
            </p>
          </>
        ) : (
          <>
            <CartList
              cartItems={cartItems}
              onDeleteCartItem={onDeleteCartItem}
              cart_id={cart_id}
            />
            <div className="flex-container">
              <p className="order-total-label">Order Total</p>
              <p className="order-total">${cartTotal.toFixed(2)}</p>
            </div>

            {!confirmed ? (
              <button className="confirm-button" onClick={onclick}>
                Confirm Order
              </button>
            ) : (
              <button className="confirm-button" onClick={onclick}>
                Start New Order
              </button>
            )}
          </>
        )}
      </div>
      {confirmed && <div id="confirm-overlay"></div>}
    </>
  );
}

function CartList({ cart_id, cartItems, onDeleteCartItem }) {
  return (
    <div id="container-cart-list" className="container">
      <ul>
        {cartItems.map((dessert) => (
          <CartItem
            cart_id={cart_id}
            image={dessert.image}
            name={dessert.name}
            key={dessert.name}
            price={dessert.price}
            quantity={Number(dessert.quantity)}
            onDeleteCartItem={onDeleteCartItem}
          />
        ))}
      </ul>
    </div>
  );
}

function CartItem({ cart_id, image, name, price, quantity, onDeleteCartItem }) {
  return (
    <li className="cart-item">
      <div className="flex-container item-name-thumb-details-container">
        {cart_id === "cart-confirm" && (
          <img className="thumbnail" src={image.thumbnail} alt={name} />
        )}
        <div className="flex-container">
          <div className="name-in-cart-item">
            <p className="name">{name}</p>
          </div>
          <div className="flex-container quant-price-subtotal-container">
            <p className="quantity">{quantity} x</p>
            <p className="price">@ ${price.toFixed(2)}</p>
            <p className="subtotal">${(quantity * price).toFixed(2)}</p>
            {cart_id === "cart-main" && (
              <button onClick={() => onDeleteCartItem(name)}>X</button>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

function DessertList({ desserts, onDecrease, onIncrease }) {
  return (
    <div id="container-desserts-list" className="container">
      <h1>Desserts</h1>
      <ul id="desserts-container">
        {desserts.map((dessert) => (
          <Dessert
            image={dessert.image}
            category={dessert.category}
            name={dessert.name}
            key={dessert.name}
            price={dessert.price}
            quantity={Number(dessert.quantity)}
            onDecrease={onDecrease}
            onIncrease={onIncrease}
          />
        ))}
      </ul>
    </div>
  );
}

function Dessert({
  image,
  category,
  name,
  price,
  quantity,
  onIncrease,
  onDecrease,
}) {
  // console.log(initialDesserts[0].image.desktop);

  return (
    <li className="card">
      <img src={image.desktop} alt={name} />

      <p className="name">{name}</p>
      <p className="price">${price.toFixed(2)}</p>
      <CartControls
        quantity={quantity}
        name={name}
        onDecrease={onDecrease}
        onIncrease={onIncrease}
      />
    </li>
  );
}

function CartControls({ quantity, name, onIncrease, onDecrease }) {
  return (
    <>
      {quantity === 0 ? (
        <button onClick={() => onIncrease(name)} className="add-to-cart">
          Add to Cart
        </button>
      ) : (
        <div className="quantity-control">
          <button onClick={() => onDecrease(name)}>–</button>
          <p>{quantity}</p>
          <button onClick={() => onIncrease(name)}>+</button>
        </div>
      )}
    </>
  );
}
