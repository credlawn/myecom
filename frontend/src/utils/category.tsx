"use client";

export default function CategoryDemo() {
  const categories = [
    { name: "Shampoo", slug: "shampoo", image: "/images/sample1.jpg" },
    { name: "Conditioner", slug: "conditioner", image: "/images/sample2.jpg" },
    { name: "Hair Oil", slug: "hair-oil", image: "/images/sample3.jpg" },
    { name: "Skincare", slug: "skincare", image: "/images/sample4.jpg" },
  ];

  return (
    <section className="w-full bg-transparent py-12">
      {/* Category Row with Scroll on Mobile */}
      <ul className="flex gap-6 overflow-x-auto no-scrollbar px-4 md:justify-center">
        {categories.map((cat) => (
          <li
            key={cat.slug}
            className="flex-shrink-0 flex flex-col items-center cursor-pointer p-3 rounded-xl border bg-white shadow-sm hover:shadow-md hover:border-red-500 transition"
          >
            {/* Image Box */}
            <div className="w-24 h-24 flex items-center justify-center bg-transparent rounded-lg overflow-visible">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-20 h-20 object-contain transition-transform duration-500 ease-out group-hover:scale-125 group-hover:-translate-y-2"
              />
            </div>

            {/* Name */}
            <span className="mt-2 text-sm font-medium text-gray-800">
              {cat.name}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
