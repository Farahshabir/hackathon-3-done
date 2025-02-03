"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  productImage: string;
  rating?: {
    rate: number;
    count: number;
  };
  quantity?: number;
}

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<Product[]>([]);

  const id = params?.id as string | undefined;

  // Fetch product from Sanity
  useEffect(() => {
    if (!id) {
      setError("Product ID is missing");
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const data = await client.fetch(
          `*[_type == "product" && _id == $id][0]{
            _id,
            title,
            description,
            price,
            "productImage": productImage.asset->url,
            rating
          }`,
          { id }
        );
        if (!data) {
          setError("Product not found");
        } else {
          setProduct({ ...data, quantity: 1 });
        }
      } catch (err) {
        console.error("Error fetching product from Sanity:", err);
        setError("Error fetching product from Sanity");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Handle cart functionality with LocalStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  const handleAddToCart = () => {
    if (!product) return;
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item._id === product._id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity! + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const totalCartItems = cart.reduce((total, item) => total + (item.quantity || 0), 0);

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!product) return <p className="text-center text-lg">Product not found</p>;

  return (
    <>
      <header className="bg-gray-800 text-white py-4 shadow-md">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="text-yellow-300 text-lg font-semibold">
            Home
          </Link>
          <Link href="/cart" className="text-yellow-300 text-lg font-semibold">
            Cart ({totalCartItems})
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="flex justify-center items-center">
            {product.productImage ? (
              <Image
                src={product.productImage}
                alt={product.title}
                width={600}
                height={600}
                className="object-cover rounded-xl shadow-lg border-2 border-gray-200"
              />
            ) : (
              <p className="text-gray-500">No image available</p>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <h2 className="text-4xl font-semibold text-gray-900">{product.title}</h2>
            <p className="text-lg text-gray-600">{product.description}</p>
            <div className="text-2xl font-bold text-gray-800">${product.price}</div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex text-yellow-500">
                {product.rating?.rate ? (
                  <>
                    {Array(Math.floor(product.rating.rate))
                      .fill(0)
                      .map((_, index) => (
                        <span key={index}>⭐</span>
                      ))}
                    {product.rating.rate % 1 >= 0.5 && <span>⭐½</span>}
                    {Array(5 - Math.ceil(product.rating.rate))
                      .fill(0)
                      .map((_, index) => (
                        <span key={index} className="text-gray-400">
                          ☆
                        </span>
                      ))}
                  </>
                ) : (
                  <span className="text-gray-500">No ratings available</span>
                )}
              </div>
              {product.rating?.count ? (
                <span className="text-gray-500">({product.rating.count} reviews)</span>
              ) : (
                <span className="text-gray-500">No reviews yet</span>
              )}
            </div>

            {/* Add to Cart and Go to Cart Buttons */}
            <div className="flex space-x-4 mt-8">
              <button
                onClick={handleAddToCart}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-blue-700 transition-all"
              >
                Add to Cart
              </button>
              <button
                onClick={() => router.push("/cart")}
                className="bg-green-600 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-green-700 transition-all"
              >
                Go to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
