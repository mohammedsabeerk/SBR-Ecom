import React, { useEffect } from "react";
import FeaturedProduct from "../pages/FeaturedProduct";
import ProductSlide from "../pages/ProductSlide";

import Navbar from "../Components/Navbar";
import About from "../pages/About";

function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <Navbar />
      <ProductSlide />
      <FeaturedProduct />
      
    </div>
  );
}

export default Home;
