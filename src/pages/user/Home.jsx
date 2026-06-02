import React, { useEffect } from "react";
import FeaturedProduct from "./FeaturedProduct";
import ProductSlide from "./ProductSlide";

import Navbar from "../../components/user/Navbar";
import About from "./About";

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
