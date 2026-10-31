function Gallery() {
  const images = [
    {
      src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
      title: "TechFest 2026",
    },
    {
      src: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678",
      title: "Technical Events",
    },
    {
      src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
      title: "Coding Competition",
    },
    {
      src: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
      title: "Robotics Challenge",
    },
    {
      src: "https://images.unsplash.com/photo-1531482615713-2afd69097998",
      title: "TechFest Activities",
    },

    {
  src: "https://images.unsplash.com/photo-1518770660439-4636190af475",
  title: "Innovation & Technology",
},
  ];

  return (
    <main className="page-container">
      <section className="gallery-section">

        <div className="section-label">TECHFEST 2026</div>

        <h1>Gallery</h1>

        <p className="section-description">
          Explore some of the highlights and moments from TechFest 2026.
        </p>

        <div className="gallery-grid">
          {images.map((image, index) => (
            <div className="gallery-item" key={index}>
              <img src={image.src} alt={image.title} />
              <div className="gallery-caption">
                {image.title}
              </div>
            </div>
          ))}
        </div>

      </section>
    </main>
  );
}

export default Gallery;