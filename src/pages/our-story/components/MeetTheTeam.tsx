import React from 'react';
import { motion } from 'framer-motion';
import { usePublicTeam } from '../../../hooks/useTeam';

const MeetTheTeam: React.FC = () => {
  const { teamMembers, loading, error } = usePublicTeam();

  if (loading) {
    return (
      <section className="px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-40 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 md:mb-10">
            Meet the Team
          </h2>
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-40 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 md:mb-10">
            Meet the Team
          </h2>
          <div className="text-center text-gray-500">
            <p>Unable to load team members at this time.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-40 py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto">
        {/* Meet the Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 md:mb-10"
          >
            Meet the Team
          </motion.h2>
          
          {/* Team Members Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + (index * 0.1) }}
                whileHover={{ y: -10 }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="relative mb-4"
                >
                  <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 mx-auto rounded-full overflow-hidden shadow-lg">
                    <img
                      src={member.image_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
                      alt={`${member.name} - ${member.position}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
                      }}
                    />
                  </div>
                  {member.featured && (
                    <div className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 rounded-full p-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  )}
                </motion.div>
                <motion.h3
                  whileHover={{ color: "#d97706" }}
                  className="text-lg sm:text-xl font-semibold text-gray-900 mb-1"
                  style={{ fontFamily: 'Raleway, sans-serif' }}
                >
                  {member.name}
                </motion.h3>
                <p
                  className="text-sm sm:text-base text-gray-600"
                  style={{ fontFamily: 'Lato, sans-serif' }}
                >
                  {member.position}
                </p>
                {member.specialties && member.specialties.length > 0 && (
                  <div className="mt-2 flex flex-wrap justify-center gap-1">
                    {member.specialties.slice(0, 2).map((specialty, idx) => (
                      <span
                        key={idx}
                        className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full"
                        style={{ fontFamily: 'Lato, sans-serif' }}
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                )}
                {member.years_experience && (
                  <p
                    className="text-xs text-gray-500 mt-1"
                    style={{ fontFamily: 'Lato, sans-serif' }}
                  >
                    {member.years_experience} years experience
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {teamMembers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">👥</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No team members found</h3>
              <p className="text-gray-500">
                Our team information will be available soon.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default MeetTheTeam;
