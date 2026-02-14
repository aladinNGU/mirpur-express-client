const ServiceCard = ({ service }) => {
  const { icon: Icon, title, description } = service;
  return (
    <div className="card bg-base-200 shadow-md hover:shadow-xl transition duration-300">
      <div className="card-body">
        {/* Icon */}
        <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-5">
          <Icon className="w-8 h-8 text-primary" />
        </div>

        {/* Title */}
        <h3 className="card-title text-lg font-semibold mb-2">{title}</h3>

        {/* Description */}
        <p className="text-base-content/70 text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default ServiceCard;
