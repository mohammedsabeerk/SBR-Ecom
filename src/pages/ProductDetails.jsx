
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, addToCart, cart } = useAppContext();

  const product = getProductById(id);

  const [selectedSize, setSelectedSize] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [quantity, setQuantity] = useState(1);


  const sizes = product?.sizes || ["S", "M", "L", "XL"];


  // eslint-disable-next-line react-hooks/exhaustive-deps
  const allImages = product
    ? [
        product.img, 
        ...(product.images?.filter((img) => img && img !== product.img) || []), 
      ]
    : [];

  useEffect(() => {
    if (!product || allImages.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) =>
        prev === allImages.length - 1 ? 0 : prev + 1
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [product, allImages, isHovered]);

  if (!product) {
    return (
      <div className="text-center py-20 text-xl font-semibold">
        Product not found
      </div>
    );
  }

  const isInCart = cart.some(
    (item) => item.id === product.id && item.size === selectedSize
  );

  const increaseQty = () => setQuantity((prev) => prev + 1);
  const decreaseQty = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    const success = await addToCart({
      ...product,
      size: selectedSize,
      quantity,
    });

    if (!success) {
      toast.info("Please login or register first");
      navigate("/login");
      return;
    }

    toast.success("Added to cart!");
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (!localStorage.getItem("currentUser")) {
      toast.info("Please login to continue");
      navigate("/login");
      return;
    }

    navigate("/payment", {
      state: {
        buyNowItem: {
          ...product,
          size: selectedSize,
          quantity,
        },
      },
    });
  };

  return (
    <div className="px-6 md:px-16 pt-28 pb-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-2 rounded-lg border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-600 hover:text-white"
      >
        ← Back
      </button>

      <div className="grid md:grid-cols-2 gap-10 items-start">
        
        <div className="bg-white/40 backdrop-blur-md border rounded-xl shadow-inner p-4">
          <div className="h-[420px] flex items-center justify-center">
            <img
              src={allImages[currentImageIndex]}
              alt={product.name}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="max-h-full max-w-full object-contain rounded-lg transition-all duration-500"
            />
          </div>

          {allImages.length > 1 && (
            <div className="flex gap-3 mt-4 justify-center">
              {allImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-16 h-16 object-cover rounded cursor-pointer border ${
                    currentImageIndex === index
                      ? "border-black"
                      : "border-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

      
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-600 mt-3">{product.des}</p>
          <p className="text-2xl font-bold mt-6">₹{product.price}</p>

        
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Select Size</h3>
            <div className="flex gap-3 flex-wrap">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded ${
                    selectedSize === size
                      ? "bg-black text-white"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

       
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Quantity</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={decreaseQty}
                className="px-2 py-1 border rounded text-sm hover:bg-gray-100"
              >
                −
              </button>

              <span className="text-sm font-semibold w-6 text-center">
                {quantity}
              </span>

              <button
                onClick={increaseQty}
                className="px-2 py-1 border rounded text-sm hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

       
          <div className="flex gap-4 mt-8">
            <button
              onClick={handleAddToCart}
              disabled={isInCart}
              className={`px-6 py-2 rounded text-white ${
                isInCart
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-800"
              }`}
            >
              {isInCart ? "Added" : "Add to Cart"}
            </button>

            <button
              onClick={handleBuyNow}
              className="px-6 py-2 rounded bg-orange-500 text-white hover:bg-orange-600"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
