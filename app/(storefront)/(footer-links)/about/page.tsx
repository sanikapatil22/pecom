import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">About Us</h1>
      <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
        <p>
          At <strong className="font-semibold text-gray-900">PAMARA</strong>, we believe clothing is more than just apparel—it’s a reflection of your strength and
          journey. Inspired by the vibrant village of Pamara and the vision of our co-founders,{' '}
          <strong className="font-semibold text-gray-900">Saurav Kumar</strong> and <strong className="font-semibold text-gray-900">Gautam Kumar</strong>, we’re proud to craft premium lifestyle and
          activewear that blends style, comfort, and performance.
        </p>
        <p>
          Rooted in India and aligned with the <strong className="font-semibold text-gray-900">Make in India</strong> initiative, we design apparel that empowers
          you, whether you're at the gym, on the move, or embracing everyday life. Every piece is thoughtfully created with
          high-quality fabrics to ensure durability, breathability, and unmatched versatility.
        </p>
        <p>
          More than a brand, <strong className="font-semibold text-gray-900">PAMARA</strong> is a community that celebrates resilience, individuality, and
          perseverance. We’re here to support your journey and inspire you to elevate every move.
        </p>
        <p>
          Join us as we redefine lifestyle wear—built for you, stitched for life.
        </p>
      </div>
    </section>
  );
};

export default AboutUs;
