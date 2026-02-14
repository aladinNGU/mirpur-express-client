import amazon from "../../../assets/brands/amazon.png";
import casio from "../../../assets/brands/casio.png";
import moonstar from "../../../assets/brands/moonstar.png";
import randstad from "../../../assets/brands/randstad.png";
import star from "../../../assets/brands/star.png";
import startPeople from "../../../assets/brands/start_people.png";

const brands = [
  { name: "Amazon", logo: amazon },
  { name: "Daraz", logo: casio },
  { name: "Pathao", logo: moonstar },
  { name: "Evaly", logo: randstad },
  { name: "Foodpanda", logo: star },
  { name: "Chaldal", logo: startPeople },
];

const BrandsMarquee = () => {
  return (
    <section className="bg-base-200 py-14 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-base-content">
            Trusted by Leading Brands
          </h2>
          <p className="text-base-content/70 mt-2">
            Powering deliveries for top companies across Bangladesh
          </p>
        </div>

        {/* Marquee Wrapper */}
        <div className="relative overflow-hidden">
          {/* Fade edges */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-base-200 to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-base-200 to-transparent z-10" />

          {/* Marquee Track */}
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
            {[...brands, ...brands].map((brand, index) => (
              <div
                key={index}
                className="flex items-center justify-center mx-10 min-w-[160px]"
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-32 h-12 object-contain opacity-80 hover:opacity-100 transition"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandsMarquee;
