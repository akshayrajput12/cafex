import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAdminTeam } from '../../hooks/useTeam'
import { TeamMemberCard } from '../components/cards'
import type { TeamMember } from '../../services/teamService'

export const TeamManagement: React.FC = () => {
  // Use the database hook
  const {
    teamMembers,
    loading,
    error,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
    toggleFeatured,
    toggleActive,
    getNextDisplayOrder,
    getActiveMembers,
    getFeaturedMembers
  } = useAdminTeam()

  const [showModal, setShowModal] = useState(false)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [filter, setFilter] = useState<'all' | 'active' | 'featured'>('all')

  const filteredMembers = (() => {
    switch (filter) {
      case 'active':
        return getActiveMembers()
      case 'featured':
        return getFeaturedMembers()
      default:
        return teamMembers
    }
  })()

  const handleAddMember = async () => {
    const nextOrder = await getNextDisplayOrder()
    setSelectedMember({
      id: '',
      name: '',
      position: '',
      display_order: nextOrder,
      featured: false,
      active: true,
      created_at: '',
      updated_at: ''
    })
    setShowModal(true)
  }

  const handleEditMember = (member: TeamMember) => {
    setSelectedMember(member)
    setShowModal(true)
  }

  const handleSaveMember = async (memberData: TeamMember) => {
    try {
      if (selectedMember?.id) {
        // Update existing member
        await updateTeamMember(selectedMember.id, memberData)
      } else {
        // Create new member
        await createTeamMember(memberData)
      }
      setShowModal(false)
      setSelectedMember(null)
    } catch (error) {
      console.error('Error saving team member:', error)
      alert('Failed to save team member. Please try again.')
    }
  }

  const handleDeleteMember = async (member: TeamMember) => {
    if (window.confirm(`Are you sure you want to delete ${member.name}?`)) {
      try {
        await deleteTeamMember(member.id)
      } catch (error) {
        console.error('Error deleting team member:', error)
        alert('Failed to delete team member. Please try again.')
      }
    }
  }

  const handleToggleStatus = async (memberId: string, field: 'active' | 'featured') => {
    try {
      if (field === 'featured') {
        await toggleFeatured(memberId)
      } else {
        await toggleActive(memberId)
      }
    } catch (error) {
      console.error(`Error toggling ${field} status:`, error)
      alert(`Failed to update ${field} status. Please try again.`)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Error: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 
            className="text-2xl font-bold"
            style={{ color: '#96664F', fontFamily: 'Raleway, sans-serif' }}
          >
            Team Management
          </h2>
          <p className="text-gray-600 mt-1" style={{ fontFamily: 'Lato, sans-serif' }}>
            Manage your cafe team members and their profiles
          </p>
        </div>
        
        <motion.button
          onClick={handleAddMember}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          style={{ fontFamily: 'Lato, sans-serif' }}
        >
          + Add New Team Member
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Raleway, sans-serif' }}>
            Total Members
          </h3>
          <p className="text-2xl font-bold text-orange-600">{teamMembers.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Raleway, sans-serif' }}>
            Active Members
          </h3>
          <p className="text-2xl font-bold text-green-600">{getActiveMembers().length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Raleway, sans-serif' }}>
            Featured Members
          </h3>
          <p className="text-2xl font-bold text-yellow-600">{getFeaturedMembers().length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Raleway, sans-serif' }}>
            Avg Experience
          </h3>
          <p className="text-2xl font-bold text-blue-600">
            {teamMembers.length > 0 
              ? Math.round(teamMembers.reduce((sum, m) => sum + (m.years_experience || 0), 0) / teamMembers.length)
              : 0
            } years
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'active', 'featured'] as const).map((filterOption) => (
          <button
            key={filterOption}
            onClick={() => setFilter(filterOption)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              filter === filterOption
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            style={{ fontFamily: 'Lato, sans-serif' }}
          >
            {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)} 
            ({filterOption === 'all' ? teamMembers.length : 
              filterOption === 'active' ? getActiveMembers().length : 
              getFeaturedMembers().length})
          </button>
        ))}
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMembers.map((member, index) => (
          <TeamMemberCard
            key={member.id}
            member={member}
            isEditing={false}
            index={index}
            onToggleStatus={handleToggleStatus}
            onEdit={handleEditMember}
            onDelete={handleDeleteMember}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">👥</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No team members found</h3>
          <p className="text-gray-500 mb-4">
            {filter === 'all' 
              ? "Get started by adding your first team member."
              : `No ${filter} team members found. Try adjusting your filter.`
            }
          </p>
          {filter === 'all' && (
            <button
              onClick={handleAddMember}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              Add First Team Member
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <TeamMemberCard
              member={selectedMember || undefined}
              isEditing={true}
              onSave={handleSaveMember}
              onCancel={() => {
                setShowModal(false)
                setSelectedMember(null)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
