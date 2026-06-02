import React from "react";
import SBRLogo from "../../assets/E-logo6.png";

function About() {
  return (
    <div className="px-6 md:px-10 py-10 mt-24 ">
      <div className="flex justify-center mb-12">
        <img
          src={SBRLogo}
          alt="SBR Sovereign Bold Rare"
          className="w-40 md:w-48 object-contain"
        />
      </div>

      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-black mb-6">
          About Us
        </h2>

        <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
          <span className="font-semibold">Sovereign Bold Rare (SBR)</span> is a
          modern fashion brand built for individuals who own their identity. We
          deliver premium streetwear and essentials including
          <span className="font-medium">
            {" "}
            shirts, shorts, formal shirts & pants, hoodies, caps, and cargo
            pants
          </span>
          , crafted with purpose and precision.
        </p>

        <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-12">
          At SBR, fashion is not about trends — it’s about confidence, quality,
          and standing apart.
        </p>

        <div className="mt-12">
          <h3 className="text-3xl font-extrabold text-black mb-10">
            What SBR Stands For
          </h3>

          <div className="grid md:grid-cols-3 gap-10 text-left">
            <div>
              <h4 className="text-xl font-extrabold text-black mb-3">
                Sovereign
              </h4>
              <p className="text-gray-700 leading-relaxed">
                Sovereign represents independence and self-rule. In fashion, it
                means wearing what defines you — not what follows the crowd.
                Every SBR piece empowers you to own your style with authority.
              </p>
            </div>

            <div>
              <h4 className="text-xl font-extrabold text-black mb-3">Bold</h4>
              <p className="text-gray-700 leading-relaxed">
                Bold is confidence without apology. Our designs, fits, and
                details are created to make a statement — strong, fearless, and
                unapologetically expressive.
              </p>
            </div>

            <div>
              <h4 className="text-xl font-extrabold text-black mb-3">Rare</h4>
              <p className="text-gray-700 leading-relaxed">
                Rare stands for exclusivity and originality. We focus on
                limited, distinctive designs that separate you from the ordinary
                — because true style is never common.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h3 className="text-2xl font-extrabold text-black mb-4">
            Contact Us
          </h3>
          <p className="text-lg text-gray-700">
            Phone: <span className="font-medium">9745155577</span>
          </p>
          <p className="text-lg text-gray-700">
            Email: <span className="font-medium">contact@sbrfashion.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
