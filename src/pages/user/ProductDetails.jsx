import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getImageUrl } from "../../utils/imageUtils";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getProductById,
    addToCart,
    addToWishlist,
    cart,
    currentUser,
    authLoading,
  } = useAppContext();

  const product = getProductById(id || "");

  const [selectedSize, setSelectedSize] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const allImages = product
    ? [product.img, ...(product.images || [])].map(getImageUrl)
    : [];

  const imageLength = allImages.length;

  useEffect(() => {
    if (!product || imageLength <= 1 || isHovered) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) =>
        prev === imageLength - 1 ? 0 : prev + 1
      );
    }, 2000);
    return () => clearInterval(interval);
  }, [product, imageLength, isHovered]);

  if (!product) {
    return (
      <div className="text-center py-20 text-xl font-semibold">
        Product not found
      </div>
    );
  }

  const isInCart = cart.some(
    (item) =>
      (item.productId?._id === product._id ||
        item.productId === product._id ||
        item._id === product._id ||
        item.id === product.id) &&
      item.size === selectedSize
  );

  const currentStock = product.stock || 0;
  const isFullyOutOfStock = currentStock <= 0;
  const isFewLeft = currentStock > 0 && currentStock <= 5;

  const increaseQty = () => {
    if (!selectedSize) { toast.info("Please select a size first"); return; }
    if (quantity < currentStock) {
      setQuantity((prev) => prev + 1);
    } else {
      toast.warning(`Only ${currentStock} items available in stock`);
    }
  };

  const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // ✅ FIXED: passes selectedSize and quantity — guest is handled inside CartContext
  const handleAddToCart = async () => {
    if (isFullyOutOfStock) { toast.error("This product is out of stock"); return; }
    if (!selectedSize) { toast.error("Please select a size"); return; }

    const success = await addToCart({
      ...product,
      _id: product._id,
      size: selectedSize,   // ✅ was missing — cart would have no size
      quantity,             // ✅ was missing — cart would always use qty 1
    });

    // addToCart already shows toast + navigates to /login for guests
    // only show success if it actually worked
    if (success) {
      toast.success("Added to cart!");
    }
  };

  // ✅ FIXED: passes selectedSize and quantity to wishlist too
  const handleAddToWishlist = async () => {
    // addToWishlist already handles guest redirect internally
    const success = await addToWishlist({
      ...product,
      size: selectedSize,
    });
    if (success) {
      toast.success("Added to wishlist!");
    }
  };

  const handleBuyNow = () => {
    if (authLoading) return;
    if (isFullyOutOfStock) { toast.error("This product is out of stock"); return; }
    if (!selectedSize) { toast.error("Please select a size"); return; }

    // ✅ Guest guard — redirect to login
    if (!currentUser) {
      toast.info("Please login to continue");
      navigate("/login");
      return;
    }

    navigate("/checkout", {
      state: {
        buyNowItem: {
          ...product,
          product: product._id,
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
        className="mb-6 inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-xs font-bold uppercase tracking-widest text-black hover:border-black transition-all"
      >
        ← Back
      </button>

      <div className="grid md:grid-cols-2 gap-16 items-start">
        <div className="bg-gray-50 border border-gray-100 p-4">
          <div className="h-[420px] flex items-center justify-center bg-white overflow-hidden">
            <img
              src={allImages[currentImageIndex]}
              alt={product.name}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="max-h-full max-w-full object-contain transition-all duration-700 hover:scale-110"
            />
          </div>
          {allImages.length > 1 && (
            <div className="flex gap-3 mt-4 justify-center">
              {allImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-12 h-16 object-cover cursor-pointer border ${
                    currentImageIndex === index ? "border-black" : "border-transparent"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-black uppercase tracking-tighter text-gray-900">
              {product.name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-1.5 h-1.5 rounded-full ${
                isFullyOutOfStock ? "bg-red-500" : isFewLeft ? "bg-amber-500" : "bg-emerald-500"
              }`} />
              <span className={`text-[10px] font-bold tracking-wider uppercase ${
                isFullyOutOfStock ? "text-red-500" : isFewLeft ? "text-amber-600" : "text-emerald-600"
              }`}>
                {isFullyOutOfStock
                  ? "Out Of Stock"
                  : isFewLeft
                  ? `Only ${currentStock} left`
                  : `In Stock • ${currentStock} available`}
              </span>
            </div>
          </div>

          <p className="text-gray-500 mt-4 text-sm leading-relaxed">{product.des}</p>
          <p className="text-3xl font-black mt-8 text-gray-900">₹{product.price}</p>

          {product?.sizes && product.sizes.length > 0 && (
            <div className="mt-10">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Select Size
                </h3>
                {selectedSize && (
                  <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                    Selected: {selectedSize}
                  </span>
                )}
              </div>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => { setSelectedSize(size); setQuantity(1); }}
                    disabled={isFullyOutOfStock}
                    className={`w-10 h-10 flex items-center justify-center rounded-md border text-xs font-semibold tracking-wider transition-all duration-200 ${
                      selectedSize === size
                        ? "bg-black text-white border-black shadow-sm"
                        : "bg-white text-gray-800 border-gray-200 hover:border-gray-400 hover:text-black"
                    } ${isFullyOutOfStock ? "opacity-30 cursor-not-allowed" : ""}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">
              Quantity
            </h3>
            <div className="flex items-center border border-gray-200 w-fit">
              <button
                onClick={decreaseQty}
                className="w-10 h-10 flex items-center justify-center font-bold hover:bg-gray-50 transition-all border-r border-gray-200"
              >−</button>
              <span className="w-12 text-center text-xs font-black">{quantity}</span>
              <button
                onClick={increaseQty}
                className="w-10 h-10 flex items-center justify-center font-bold hover:bg-gray-50 transition-all border-l border-gray-200"
              >+</button>
            </div>
            {selectedSize && (
              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-300 mt-2">
                Maximum available: {currentStock}
              </p>
            )}
          </div>

          <div className="flex gap-4 mt-12">
            <button
              onClick={handleAddToCart}
              disabled={isInCart || isFullyOutOfStock}
              className={`flex-1 py-4 font-bold text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl ${
                isInCart || isFullyOutOfStock
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                  : "bg-black text-white hover:bg-gray-900"
              }`}
            >
              {isFullyOutOfStock ? "Sold Out" : isInCart ? "Added to Bag" : "Add to Bag"}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={isFullyOutOfStock}
              className={`flex-1 py-4 font-bold text-[10px] uppercase tracking-[0.2em] border transition-all ${
                isFullyOutOfStock
                  ? "border-gray-100 text-gray-300 cursor-not-allowed"
                  : "border-black text-black hover:bg-gray-50"
              }`}
            >
              Buy Now
            </button>
          </div>

          {/* ✅ Wishlist button */}
          <button
            onClick={handleAddToWishlist}
            className="mt-4 w-full py-3 font-bold text-[10px] uppercase tracking-[0.2em] border border-gray-200 text-gray-600 hover:border-black hover:text-black transition-all"
          >
            ♡ Save to Wishlist
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
