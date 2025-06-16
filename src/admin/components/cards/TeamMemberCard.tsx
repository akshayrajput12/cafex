import React, { useState } from 'react'
import { motion } from 'framer-motion'
import type { TeamMember } from '../../../services/teamService'

interface TeamMemberCardProps {
  member?: TeamMember
  isEditing?: boolean
  onSave?: (member: TeamMember) => void
  onCancel?: () => void
  index?: number
  onToggleStatus?: (memberId: string, field: 'active' | 'featured') => void
  onEdit?: (member: TeamMember) => void
  onDelete?: (member: TeamMember) => void
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  member,
  isEditing = false,
  onSave,
  onCancel,
  index = 0,
  onToggleStatus,
  onEdit,
  onDelete
}) => {
  const [formData, setFormData] = useState({
    name: member?.name || '',
    position: member?.position || '',
    bio: member?.bio || '',
    image_url: member?.image_url || '',
    email: member?.email || '',
    phone: member?.phone || '',
    social_links: member?.social_links || {},
    specialties: member?.specialties || [],
    years_experience: member?.years_experience || 0,
    join_date: member?.join_date || '',
    display_order: member?.display_order || 0,
    featured: member?.featured || false,
    active: member?.active ?? true
  })

  const [imagePreview, setImagePreview] = useState<string>('')
  const [newSpecialty, setNewSpecialty] = useState('')

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddSpecialty = () => {
    if (newSpecialty.trim() && !formData.specialties.includes(newSpecialty.trim())) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()]
      }))
      setNewSpecialty('')
    }
  }

  const handleRemoveSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty)
    }))
  }

  const handleSave = () => {
    if (!formData.name.trim() || !formData.position.trim()) {
      alert('Please fill in required fields (Name and Position)')
      return
    }

    const memberData: TeamMember = {
      id: member?.id || '',
      name: formData.name.trim(),
      position: formData.position.trim(),
      bio: formData.bio.trim() || undefined,
      image_url: formData.image_url || undefined,
      email: formData.email.trim() || undefined,
      phone: formData.phone.trim() || undefined,
      social_links: formData.social_links,
      specialties: formData.specialties,
      years_experience: formData.years_experience || undefined,
      join_date: formData.join_date || undefined,
      display_order: formData.display_order,
      featured: formData.featured,
      active: formData.active,
      created_at: member?.created_at || '',
      updated_at: member?.updated_at || ''
    }

    onSave?.(memberData)
  }

  if (!isEditing && member) {
    // Display mode - admin version with always visible buttons
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
        style={{ minHeight: '320px' }}
      >
        <div className="p-6 text-center">
          {/* Profile Image */}
          <div className="relative mb-4">
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto rounded-full overflow-hidden shadow-lg">
              <img
                src={member.image_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
                alt={member.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
                }}
              />
            </div>
            
            {/* Status badges */}
            <div className="absolute -top-2 -right-2 flex flex-col gap-1">
              {member.featured && (
                <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-medium">
                  ⭐ Featured
                </span>
              )}
              {!member.active && (
                <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full font-medium">
                  Inactive
                </span>
              )}
            </div>
          </div>

          {/* Name and Position */}
          <h3
            className="text-lg sm:text-xl font-semibold text-gray-900 mb-1"
            style={{ fontFamily: 'Raleway, sans-serif' }}
          >
            {member.name}
          </h3>
          <p 
            className="text-sm sm:text-base text-gray-600 mb-3"
            style={{ fontFamily: 'Lato, sans-serif' }}
          >
            {member.position}
          </p>

          {/* Bio */}
          {member.bio && (
            <p 
              className="text-xs text-gray-500 mb-3 line-clamp-2"
              style={{ fontFamily: 'Lato, sans-serif' }}
            >
              {member.bio}
            </p>
          )}

          {/* Specialties */}
          {member.specialties && member.specialties.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-center mb-3">
              {member.specialties.slice(0, 3).map((specialty, idx) => (
                <span 
                  key={idx}
                  className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full"
                  style={{ fontFamily: 'Lato, sans-serif' }}
                >
                  {specialty}
                </span>
              ))}
              {member.specialties.length > 3 && (
                <span className="text-xs text-gray-500">+{member.specialties.length - 3} more</span>
              )}
            </div>
          )}

          {/* Experience */}
          {member.years_experience && (
            <p className="text-xs text-gray-500" style={{ fontFamily: 'Lato, sans-serif' }}>
              {member.years_experience} years experience
            </p>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 mt-4 pt-3 border-t border-gray-100">
            {/* Status Toggle Buttons */}
            <div className="flex justify-center gap-2">
              <button
                onClick={() => onToggleStatus?.(member.id, 'featured')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                  member.featured
                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={member.featured ? 'Remove from featured' : 'Add to featured'}
              >
                {member.featured ? '⭐ Featured' : '☆ Feature'}
              </button>
              <button
                onClick={() => onToggleStatus?.(member.id, 'active')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                  member.active
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-red-100 text-red-600 hover:bg-red-200'
                }`}
                title={member.active ? 'Deactivate member' : 'Activate member'}
              >
                {member.active ? '✓ Active' : '✗ Inactive'}
              </button>
            </div>

            {/* Edit and Delete Buttons */}
            <div className="flex justify-center gap-2">
              <button
                onClick={() => onEdit?.(member)}
                className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg text-xs font-medium transition-colors duration-200"
                title="Edit team member"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button
                onClick={() => onDelete?.(member)}
                className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-xs font-medium transition-colors duration-200"
                title="Delete team member"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>

      </motion.div>
    )
  }

  // Edit mode
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl p-6 shadow-lg max-w-2xl mx-auto max-h-[80vh] overflow-y-auto"
    >
      <h3 
        className="text-xl font-bold mb-6"
        style={{ color: '#96664F', fontFamily: 'Raleway, sans-serif' }}
      >
        {member ? 'Edit Team Member' : 'Add New Team Member'}
      </h3>

      <div className="space-y-4">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter team member name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Position *
            </label>
            <input
              type="text"
              value={formData.position}
              onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="e.g., Head Barista, Sous Chef"
              required
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Brief description about the team member..."
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Profile Image
          </label>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
              <img
                src={imagePreview || formData.image_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload a new image or use URL below
              </p>
            </div>
          </div>
          <input
            type="url"
            value={formData.image_url}
            onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent mt-2"
            placeholder="Or enter image URL"
          />
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="email@cafex.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>

        {/* Specialties */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Specialties
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newSpecialty}
              onChange={(e) => setNewSpecialty(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddSpecialty()}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Add a specialty..."
            />
            <button
              type="button"
              onClick={handleAddSpecialty}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.specialties.map((specialty, idx) => (
              <span 
                key={idx}
                className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {specialty}
                <button
                  type="button"
                  onClick={() => handleRemoveSpecialty(specialty)}
                  className="text-orange-500 hover:text-orange-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Experience and Join Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Years of Experience
            </label>
            <input
              type="number"
              min="0"
              value={formData.years_experience}
              onChange={(e) => setFormData(prev => ({ ...prev, years_experience: parseInt(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Join Date
            </label>
            <input
              type="date"
              value={formData.join_date}
              onChange={(e) => setFormData(prev => ({ ...prev, join_date: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Settings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Display Order
            </label>
            <input
              type="number"
              min="0"
              value={formData.display_order}
              onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                className="mr-2"
              />
              Featured Member
            </label>
          </div>
          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                className="mr-2"
              />
              Active
            </label>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
        >
          {member ? 'Update' : 'Create'} Team Member
        </button>
      </div>
    </motion.div>
  )
}
