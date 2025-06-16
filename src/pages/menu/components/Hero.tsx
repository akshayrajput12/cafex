import { motion } from 'framer-motion';

export const Hero: React.FC = () => {
  return (
    <section className="relative px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-40">
      <div className="mt-6 mb-8">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6"
          style={{ fontFamily: 'Raleway, sans-serif' }}
        >
          Premium Menu - Jaipur's Finest Cafe
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-6 max-w-4xl"
          style={{ fontFamily: 'Lato, sans-serif' }}
        >
          Discover our carefully curated selection of artisanal coffees, gourmet cuisine, and signature beverages.
          Each dish is crafted with premium ingredients to deliver an exceptional dining experience in the heart of Jaipur.
        </motion.p>
      </div>
    </section>
  );
};
