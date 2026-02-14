import featureImg1 from "../../assets/features/feature1.png";
import featureImg2 from "../../assets/features/feature2.png";
import featureImg3 from "../../assets/features/feature3.png";

const featureData = [
  {
    id: 1,
    title: "Live Parcel Tracking",
    description:
      "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment's journey and get instant status updates for complete peace of mind.",
    image: featureImg1,
  },
  {
    id: 2,
    title: "100% Safe Delivery",
    description:
      "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.",
    image: featureImg2,
  },
  {
    id: 3,
    title: "24/7 Call Center Support",
    description:
      "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.",
    image: featureImg3,
  },
];

const Features = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-col gap-8">
        {featureData.map(({ id, title, description, image }) => {
          return (
            <div
              key={id}
              className="flex gap-4 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition items-center"
            >
              {/* Icon & dotted line */}
              <div className="flex items-center">
                <div className="w-50 h-50 flex items-center justify-center mr-8">
                  <img
                    src={image}
                    alt={title}
                    className="w-50 h-50 object-contain"
                  />
                </div>

                <div className="h-32 border-l-3 border-dotted mt-3"></div>
              </div>

              {/* Text */}
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
                <p className="mt-2 text-lg text-gray-600 leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Features;
