import { motion } from 'framer-motion';
import { goToOurStory } from '../../../utils/navigation';

export const Hero = () => {
  return (
    <section className="relative px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-40">
      <div className="mt-6 mb-8">
        <div 
          className="relative h-64 sm:h-80 md:h-96 lg:h-[28rem] rounded-2xl overflow-hidden bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(139, 69, 19, 0.3), rgba(101, 67, 33, 0.4)), url('https://images.unsplash.com/photo-1447933601403-0c6688de566e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2061&q=80')`
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4 sm:px-6 md:px-8 max-w-4xl">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6"
                style={{ fontFamily: 'Raleway, sans-serif' }}
              >
                CNC Coffee N Cravings - Jaipur's Premium Cafe Experience
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 text-white/90 max-w-2xl mx-auto"
                style={{ fontFamily: 'Lato, sans-serif' }}
              >
                Discover Jaipur's finest premium cafe at CNC Coffee N Cravings, located on Sirsi Road opposite Capital Gallery Mall. Indulge in artisanal coffee, gourmet cuisine, and an ambiance that defines luxury dining in Rajasthan's Pink City.
              </motion.p>
              
              <motion.button
                onClick={goToOurStory}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 sm:py-3 sm:px-8 rounded-full transition-all duration-200 shadow-lg text-sm sm:text-base"
              >
                Discover Our Story
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Our Journey Section - Merged into Hero */}
      <div className="mt-6 mb-8">
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6"
            style={{ fontFamily: 'Raleway, sans-serif' }}
          >
            Our Journey
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg lg:text-xl"
            style={{ fontFamily: 'Lato, sans-serif' }}
          >
            From a small dream to India's top cafe, CNC Coffee N Cravings has been serving Jaipur with passion and dedication. Located on Sirsi Road opposite Capital Gallery Mall, our journey is filled with stories of friendship, creativity, and the love for exceptional coffee. Discover how we've grown and what makes us unique in the heart of Rajasthan.
          </motion.p>
        </div>
      </div>
    </section>
  );
};
