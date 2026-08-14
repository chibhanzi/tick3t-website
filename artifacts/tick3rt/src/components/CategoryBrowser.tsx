
import { Link } from "react-router-dom";

const categories = [
  {
    label: "Music",
    slug: "music",
    tagline: "Concerts, festivals, and live sets.",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
  },
  {
    label: "Art & Culture",
    slug: "arts",
    tagline: "Galleries, theater, and creative showcases.",
    image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop",
  },
  {
    label: "Business",
    slug: "business",
    tagline: "Networking, conferences, and summits.",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop",
  },
  {
    label: "Food & Drink",
    slug: "food",
    tagline: "Pop-ups, tastings, and culinary events.",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop",
  },
];

const CategoryBrowser = () => {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-foreground mb-6">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/events?category=${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] block"
            >
              <img
                src={cat.image}
                alt={cat.label}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-semibold text-sm md:text-base">{cat.label}</h3>
                <p className="text-white/60 text-xs mt-0.5 hidden md:block">{cat.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryBrowser;
