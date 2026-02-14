import { useState } from "react";
import quotationMark from "../../../assets/features/quote.png";

const testimonials = [
  {
    id: 1,
    note: "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day.",
    name: "Rasel Ahamed",
    role: "CTO",
  },
  {
    id: 2,
    note: "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day.",
    name: "Awlad Hossin",
    role: "Senior Product Designer",
  },
  {
    id: 3,
    note: "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day.",
    name: "Nasir Uddin",
    role: "CEO",
  },
];

const Testimonials = () => {
  const [active, setActive] = useState(1);

  const prev = () =>
    setActive((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  const next = () =>
    setActive((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));

  return (
    <section className="bg-base-200 py-20 mb-10">
      <div className="max-w-6xl mx-auto px-4 text-center">
        {/* Heading */}
        <h2 className="text-4xl font-bold text-primary mb-4">
          What our customers are sayings
        </h2>
        <p className="max-w-2xl mx-auto text-gray-500 mb-14">
          Enhance posture, mobility, and well-being effortlessly with Posture
          Pro. Achieve proper alignment, reduce pain, and strengthen your body
          with ease!
        </p>

        {/* Slider */}
        <div className="relative flex items-center justify-center gap-6">
          {testimonials.map((item, index) => {
            const isActive = index === active;
            return (
              <div
                key={item.id}
                className={`transition-all duration-300 rounded-2xl p-8 w-[360px]
                  ${
                    isActive
                      ? "bg-white shadow-xl opacity-100 scale-100 z-10"
                      : "bg-white opacity-30 scale-95 hidden md:block"
                  }`}
              >
                {/* Quote */}
                <div className="text-6xl text-primary/20 mb-4">
                  <img src={quotationMark} alt="" />
                </div>

                {/* Text */}
                <p className="text-gray-600 mb-6 text-left">{item.note}</p>

                <div className="border-t border-dashed my-6"></div>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                    {item.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-sm text-gray-500">{item.role}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mt-10">
          <button onClick={prev} className="btn btn-circle btn-outline">
            ❮
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActive(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  active === index ? "bg-primary" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="btn btn-circle bg-lime-400 text-black hover:bg-lime-500 border-none"
          >
            ❯
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
