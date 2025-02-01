"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { client } from "@/sanity/lib/client";

// Define the Product type
interface Product {
  _id: string;
  title: string;
  category: string;
  description: string;
  price: number;
  productImage: string; // Sanity image URL
}

interface CartItem {
  product: Product;
}

export default function BestSeller() {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]); // State for all products
  const [cart, setCart] = useState<CartItem[]>([]); // Cart state
  const [isAllProductsLoaded, setIsAllProductsLoaded] = useState(false);

  // Fetch limited products (8 initially)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await client.fetch(
          `*[_type == "product"][0..7]{
            _id,
            title,
            category,
            description,
            price,
            "productImage": productImage.asset->url,
          }`
        );
        setProducts(data);

        // Fetch all products to load after clicking "Shop More"
        const allData = await client.fetch(
          `*[_type == "product"]{
            _id,
            title,
            category,
            description,
            price,
            "productImage": productImage.asset->url,
          }`
        );
        setAllProducts(allData);
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

  // Show all products when "Shop More" is clicked
  const handleShopMore = () => {
    setProducts(allProducts);
    setIsAllProductsLoaded(true);
  };

  // Function to truncate description to a maximum length
  const truncateDescription = (description: string, maxLength: number = 50) => {
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + "...";
    }
    return description;
  };

  return (
    <>
      <div className="font-sans p-8 mx-auto lg:max-w-7xl md:max-w-5xl sm:max-w-full">
        <p className="text-center text-lg font-semibold text-gray-600 mb-4">
          Featured Products
        </p>
        <h2 className="text-4xl font-extrabold text-gray-800 mb-12 text-center">
          BESTSELLER PRODUCTS
        </h2>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300 ease-in-out"
            >
              <div className="w-full h-64 relative">
                <Image
                  src={product.productImage}
                  alt={product.title}
                  className="object-cover object-center w-full h-full transition-transform duration-300 ease-in-out"
                  width={300}
                  height={300}
                />
              </div>

              <div className="p-6 flex flex-col justify-between">
                <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
                  {product.title}
                </h3>
                <h4 className="text-md text-gray-600 text-center mb-4">
                  {product.category}
                </h4>
                <p className="text-sm text-gray-500 text-center mb-4 line-clamp-3">
                  {truncateDescription(product.description)}
                </p>
                <p className="text-xl font-semibold text-center text-gray-800 mb-4">
                  ${product.price}
                </p>

                {/* Add to Cart Button */}
                <Link href={`/shops/${product._id}`} passHref>
                <div className="mt-4 text-center">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                  >
                    Add to Cart
                  </button>
                </div>
              </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Show "Shop More" button only if there are more products */}
        {!isAllProductsLoaded && (
          <div className="text-center mt-12">
            <button
              onClick={handleShopMore}
              className="bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 px-8 rounded-lg text-lg font-semibold shadow-lg hover:scale-105 transition-all duration-300 transform ease-in-out"
            >
              Shop More
            </button>
          </div>
        )}
      </div>
    </>
  );
}
