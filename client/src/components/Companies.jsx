// src/components/Clients.jsx
const logos = [
  "illustrator.png", "social.png", "x-letter.png", "wordpress.png", "html-5.png", "pinterest.png"
];

export default function Clients() {
  return (
    <section className="text-center py-16 bg-white">
      <h2 className="text-2xl font-bold text-blue-900 mb-8">Trusted by our Clients</h2>
      <div className="flex flex-wrap justify-center gap-10 px-8">
        {logos.map((logo, index) => (
          <img
            key={index}
            src={`/logos/${logo}`}
            alt={`Client ${index}`}
            className="w-24 h-24 rounded-full border p-2 shadow-md hover:scale-105 transition duration-300 cursor-pointer"
          />
        ))}
      </div>
    </section>
  );
}
