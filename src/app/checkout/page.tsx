"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { client } from "@/sanity/lib/client"; // Sanity client setup

// Define types for form data and cart items
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

interface CartItem {
  _id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export default function Checkout() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });
  
  const router = useRouter();

  // Fetch cart data from Sanity
  useEffect(() => {
    async function fetchCart() {
      try {
        const cartData: CartItem[] = await client.fetch(`*[_type == "cart"]`);
        setCartItems(cartData);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    }
    fetchCart();
  }, []);

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Handle payment method change
  const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(event.target.value);
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const newOrder = {
        _type: "order",
        customer: formData,
        items: cartItems,
        paymentMethod,
        status: "pending",
      };

      await client.create(newOrder);
      alert("Order placed successfully!");
      router.push("/order-success");
    } catch (error) {
      console.error("Order submission error:", error);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg max-w-2xl">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Checkout</h2>

      {/* Order Summary */}
      <div className="bg-gray-100 p-4 rounded-md mb-4">
        <h3 className="text-lg font-semibold">Order Summary</h3>
        {cartItems.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          cartItems.map((item) => (
            <div key={item._id} className="flex justify-between p-2 border-b">
              <span>{item.title} x {item.quantity}</span>
              <span>${item.price * item.quantity}</span>
            </div>
          ))
        )}
      </div>

      {/* Checkout Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} required className="w-full p-2 border rounded-md" />
          <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} required className="w-full p-2 border rounded-md" />
        </div>
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required className="w-full p-2 border rounded-md" />
        <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleInputChange} required className="w-full p-2 border rounded-md" />
        <input type="text" name="address" placeholder="Street Address" value={formData.address} onChange={handleInputChange} required className="w-full p-2 border rounded-md" />
        <div className="grid grid-cols-3 gap-4">
          <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleInputChange} required className="w-full p-2 border rounded-md" />
          <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleInputChange} required className="w-full p-2 border rounded-md" />
          <input type="text" name="zip" placeholder="Zip Code" value={formData.zip} onChange={handleInputChange} required className="w-full p-2 border rounded-md" />
        </div>

        {/* Payment Method */}
        <div>
          <h3 className="text-xl font-semibold">Payment Method</h3>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input type="radio" name="paymentMethod" value="card" checked={paymentMethod === "card"} onChange={handlePaymentMethodChange} className="mr-2" />
              Credit/Debit Card
            </label>
            <label className="flex items-center">
              <input type="radio" name="paymentMethod" value="paypal" checked={paymentMethod === "paypal"} onChange={handlePaymentMethodChange} className="mr-2" />
              PayPal
            </label>
          </div>
        </div>

        {/* Place Order Button */}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
          Place Order
        </button>
      </form>
    </div>
  );
}
