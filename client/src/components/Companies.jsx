// src/components/Clients.jsx
const logos = [
  "illustrator.png", "social.png", "x-letter.png", "wordpress.png", "html-5.png", "pinterest.png",
  "illustrator.png", "social.png", "x-letter.png", "wordpress.png", "html-5.png", "pinterest.png" // repeat for seamless loop
];

export default function Companies() {
  return (
    <section className="text-center py-10 bg-[#f3f9fc] overflow-hidden relative z-10">
      <h2 className="text-2xl font-bold text-blue-900 mb-8">Trusted by our Clients</h2>
      <div className="relative w-full overflow-hidden">
        <div className="flex gap-10 animate-scroll whitespace-nowrap px-8">
          {logos.map((logo, index) => (
            <img
              key={index}
              src={`/logos/${logo}`}
              alt={`Client ${index}`}
              className="w-32 h-32 rounded-full border p-2 shadow-md inline-block hover:scale-105 transition duration-300 cursor-pointer"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
