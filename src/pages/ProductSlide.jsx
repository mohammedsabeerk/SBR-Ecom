import { useNavigate } from "react-router-dom";

function ProductSlide() {
  const navigate = useNavigate();

  return (
    <section className="relative w-full h-screen bg-cover bg-center flex items-center justify-center">
      <div
        className="
          relative w-[95%] md:w-[85%]
          h-[60vh] md:h-[70vh]
          rounded-3xl
          shadow-xl
          overflow-hidden
         
        "
      >
        <video
          src="/videos/slide07.mp4"
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          controlsList="nodownload noplaybackrate noremoteplayback"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
      </div>

      <button
        onClick={() => navigate("/products")}
        className="
          absolute bottom-10 md:bottom-20 right-[8%]
          bg-black text-white
          px-10 py-4
          rounded-lg
          text-sm font-semibold
          tracking-wide
          hover:bg-gray-900
          transition
          shadow-lg
        "
      >
        SHOP NOW
      </button>
    </section>
  );
}

export default ProductSlide;
