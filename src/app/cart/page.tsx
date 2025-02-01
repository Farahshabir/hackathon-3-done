"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: number;
  title: string;
  price: number;
  productImage: string;
  quantity: number;
}

export default function Cart() {
  const router = useRouter();
  const [cart, setCart] = useState<Product[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    }
  }, []);

  const updateLocalStorage = (updatedCart: Product[]) => {
    setCart(updatedCart);
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  const handleRemoveProduct = (id: number) => {
    const updatedCart = cart.filter((product) => product.id !== id);
    updateLocalStorage(updatedCart);
  };

  const handleQuantityChange = (id: number, action: "increase" | "decrease") => {
    const updatedCart = cart.map((product) =>
      product.id === id
        ? {
            ...product,
            quantity:
              action === "increase"
                ? product.quantity + 1
                : Math.max(1, product.quantity - 1),
          }
        : product
    );
    updateLocalStorage(updatedCart);
  };

  const total = cart.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  );

  const totalCartItems = cart.reduce((sum, product) => sum + product.quantity, 0);

  const handleCheckout = () => {
    router.push("/checkout");
  };

  if (cart.length === 0) {
    return (
      <>
        <header className="bg-gray-800 text-white p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Your Shop</h1>
            <nav className="space-x-4">
              <Link href="/" className="hover:underline">
                Home
              </Link>
              <Link href="/shops" className="hover:underline">
                Shop
              </Link>
              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
            </nav>
          </div>
        </header>
        <div className="container mx-auto py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <Link
            href="/shops"
            className="inline-block bg-yellow-500 text-white px-6 py-2 rounded-md hover:bg-yellow-600"
          >
            Continue Shopping
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <header className="bg-gray-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Your Shop</h1>
          <nav className="space-x-4">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <Link href="/shops" className="hover:underline">
              Shop
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto py-16 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
          <table className="w-full bg-white shadow rounded-lg overflow-hidden">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="text-left p-4">Product</th>
                <th className="text-left p-4">Quantity</th>
                <th className="text-left p-4">Price</th>
                <th className="text-left p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 flex items-center space-x-4">
                    <Image
                      src={product.productImage}
                      alt={product.title}
                      width={64}
                      height={64}
                      className="rounded-lg"
                    />
                    <span className="font-medium">{product.title}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(product.id, "decrease")}
                        className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded-md"
                      >
                        -
                      </button>
                      <span>{product.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(product.id, "increase")}
                        className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded-md"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="p-4">${product.price}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleRemoveProduct(product.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Summary</h3>
          <div className="flex justify-between items-center mb-2">
            <span>Total Items:</span>
            <span>{totalCartItems}</span>
          </div>
          <div className="flex justify-between items-center font-bold text-lg mb-4">
            <span>Total Price:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </>
  );
}
