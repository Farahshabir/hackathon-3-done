"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

// Define the Product type
interface Product {
  _id: string;
  title: string;
  category: string;
  price: number;
  productImage: string; // Sanity image URL
}

interface CartItem {
  product: Product;
}

export default function BestSeller() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]); // Cart state

  // Fetch data from Sanity
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await client.fetch(
          `*[_type == "product"]{
            _id,
            title,
            category,
            price,
           "productImage": productImage.asset->url
          }`
        );
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Function to add product to cart
  const handleAddToCart = (product: Product) => {
    setCart([...cart, { product }]);
  };

  return (
    <>
      <header className="shadow-lg font-[sans-serif] tracking-wide relative z-50">
        <div id="collapseMenu" className="max-lg:hidden lg:!block">
          <ul className="lg:flex lg:items-center px-10 py-3 bg-[#333] min-h-[46px] gap-4">
            <li>
              <Link
                href="/"
                className="hover:text-yellow-300 text-yellow-300 text-[15px] font-medium"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/shops"
                className="hover:text-yellow-300 text-white text-[15px] font-medium"
              >
                Shop
              </Link>
            </li>
          </ul>
        </div>
      </header>
      <div className="font-sans p-4 mx-auto lg:max-w-5xl md:max-w-3xl sm:max-w-full">
        <p className="text-center">Featured Products</p>
        <h2 className="text-4xl font-extrabold text-gray-800 mb-12 text-center">
          BESTSELLER PRODUCTS
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded overflow-hidden cursor-pointer hover:scale-[1.02] transition-all"
            >
              <div className="w-[300px] h-[300px]">
                <Image
                  src={product.productImage}
                  alt={product.title}
                  className="h-full w-full object-cover object-top"
                  width={300}
                  height={300}
                />
              </div>

              <div className="p-4 w-[300px] h-[300px]">
                <h3 className="text-sm font-bold text-gray-800 text-center">
                  {product.title}
                </h3>
                <h3 className="text-lg font-bold text-[#737373] text-center">
                  {product.category}
                </h3>
                <div className="mt-4 flex items-center flex-wrap gap-2 text-center">
                  <h4 className="text-lg font-bold text-gray-800 ml-10 text-center">
                    <span className="text-[#BDBDBD] text-center">
                      ${product.price}
                    </span>
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
      </div>
    </>
  );
}
