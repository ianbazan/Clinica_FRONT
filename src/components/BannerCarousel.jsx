import { useState, useEffect } from "react";

const images = [
  {
    url: "https://i.pinimg.com/1200x/ed/30/be/ed30beca6a78f8ffbb751b6f368c5c62.jpg",
    alt: "Niños felices",

  },
  {
    url: "https://i.pinimg.com/736x/3b/97/37/3b97378d9a9de9e052a74adefe4bf3ae.jpg",
    alt: "Salud mental",
  },
  {
    url: "https://i.pinimg.com/736x/59/6d/19/596d190958618a9ece71c26cc7f880d1.jpg",
    alt: "Autocuidado",
  }
];

export default function BannerCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const current = images[index];

  return (
    <div className="banner-container">
      <img className="banner-image" src={current.url} alt={current.alt} />
      <div className="banner-text">
        <h2>{current.text}</h2>
      </div>
    </div>
  );
}
