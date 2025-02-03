"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { client } from "@/sanity/lib/client";

// Define Sanity's raw product type
interface SanityProduct {
  _id: string;
  title: string;
  category: string;
  price: number;
  image: string;
}

// Define the cleaned-up Product type
interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  image: string;
}

interface CartItem {
  product: Product;
}

export default function BestSeller() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Fetch products from Sanity
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data: SanityProduct[] = await client.fetch(`
          *[_type == "product" && category == "Women Clothing"]{
            _id,
            title,
            category,
            price,
            "image": image.asset->url
          }
        `);

        const formattedData: Product[] = data.map(({ _id, ...rest }) => ({
          id: _id, // Convert _id to id
          ...rest,  // Keep other properties unchanged
        }));

        setProducts(formattedData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Function to add product to cart
  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => [...prevCart, { product }]);
  };

  return (
    <div className="font-sans p-4 mx-auto lg:max-w-5xl md:max-w-3xl sm:max-w-full">
      <p className="text-center">Women&apos;s Clothing</p>
      <h2 className="text-4xl font-extrabold text-gray-800 mb-12 text-center">
        BESTSELLER PRODUCTS
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded overflow-hidden cursor-pointer hover:scale-[1.02] transition-all"
          >
            <div className="w-full aspect-[16/9]">
              <Image
                src={product.image}
                alt={product.title}
                className="h-full w-full object-cover object-top"
                width={500}
                height={500}
              />
            </div>

            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-800 text-center">
                {product.title}
              </h3>
              <h3 className="text-lg font-bold text-[#737373] text-center">
                {product.category}
              </h3>
              <div className="mt-4 flex items-center flex-wrap gap-2">
                <h4 className="text-lg font-bold text-gray-800 ml-10">
                  <span className="text-[#BDBDBD]">${product.price}</span>
                </h4>
              </div>

              {/* Add to Cart Button */}
              <div className="mt-4 text-center">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-blue-500 text-white py-2 px-4 rounded"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Display */}
      <div className="mt-10">
        <h3 className="text-2xl font-bold text-center">Your Cart</h3>
        {cart.length > 0 ? (
          <ul className="mt-4">
            {cart.map((item, index) => (
              <li key={index} className="flex justify-between p-2 border-b">
                <span>{item.product.title}</span>
                <span>${item.product.price}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">Your cart is empty</p>
        )}
      </div>
    </div>
  );
}
