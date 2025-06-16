import { useState, useEffect, useCallback } from 'react'
import { TeamService, type TeamMember } from '../services/teamService'

/**
 * Hook for public team members (story page)
 */
export const usePublicTeam = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTeamMembers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await TeamService.getActiveTeamMembers()
      setTeamMembers(data)
    } catch (err) {
      console.error('Error fetching team members:', err)
      setError('Failed to load team members')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTeamMembers()
  }, [fetchTeamMembers])

  return {
    teamMembers,
    loading,
    error,
    refetch: fetchTeamMembers
  }
}

/**
 * Hook for featured team members
 */
export const useFeaturedTeam = () => {
  const [featuredMembers, setFeaturedMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFeaturedMembers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await TeamService.getFeaturedTeamMembers()
      setFeaturedMembers(data)
    } catch (err) {
      console.error('Error fetching featured team members:', err)
      setError('Failed to load featured team members')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFeaturedMembers()
  }, [fetchFeaturedMembers])

  return {
    featuredMembers,
    loading,
    error,
    refetch: fetchFeaturedMembers
  }
}

/**
 * Hook for admin team management
 */
export const useAdminTeam = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTeamMembers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await TeamService.getAllTeamMembers()
      setTeamMembers(data)
    } catch (err) {
      console.error('Error fetching team members:', err)
      setError('Failed to load team members')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTeamMembers()
  }, [fetchTeamMembers])

  // Create team member
  const createTeamMember = useCallback(async (teamMember: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setError(null)
      const newMember = await TeamService.createTeamMember(teamMember)
      setTeamMembers(prev => [...prev, newMember].sort((a, b) => a.display_order - b.display_order))
      return newMember
    } catch (err) {
      console.error('Error creating team member:', err)
      setError('Failed to create team member')
      throw err
    }
  }, [])

  // Update team member
  const updateTeamMember = useCallback(async (id: string, updates: Partial<TeamMember>) => {
    try {
      setError(null)
      const updatedMember = await TeamService.updateTeamMember(id, updates)
      setTeamMembers(prev => 
        prev.map(member => 
          member.id === id ? updatedMember : member
        ).sort((a, b) => a.display_order - b.display_order)
      )
      return updatedMember
    } catch (err) {
      console.error('Error updating team member:', err)
      setError('Failed to update team member')
      throw err
    }
  }, [])

  // Delete team member
  const deleteTeamMember = useCallback(async (id: string) => {
    try {
      setError(null)
      await TeamService.deleteTeamMember(id)
      setTeamMembers(prev => prev.filter(member => member.id !== id))
    } catch (err) {
      console.error('Error deleting team member:', err)
      setError('Failed to delete team member')
      throw err
    }
  }, [])

  // Toggle featured status
  const toggleFeatured = useCallback(async (id: string) => {
    try {
      setError(null)
      const updatedMember = await TeamService.toggleFeatured(id)
      setTeamMembers(prev => 
        prev.map(member => 
          member.id === id ? updatedMember : member
        )
      )
      return updatedMember
    } catch (err) {
      console.error('Error toggling featured status:', err)
      setError('Failed to update featured status')
      throw err
    }
  }, [])

  // Toggle active status
  const toggleActive = useCallback(async (id: string) => {
    try {
      setError(null)
      const updatedMember = await TeamService.toggleActive(id)
      setTeamMembers(prev => 
        prev.map(member => 
          member.id === id ? updatedMember : member
        )
      )
      return updatedMember
    } catch (err) {
      console.error('Error toggling active status:', err)
      setError('Failed to update active status')
      throw err
    }
  }, [])

  // Upload image
  const uploadImage = useCallback(async (file: File, teamMemberId?: string) => {
    try {
      setError(null)
      return await TeamService.uploadImage(file, teamMemberId)
    } catch (err) {
      console.error('Error uploading image:', err)
      setError('Failed to upload image')
      throw err
    }
  }, [])

  // Delete image
  const deleteImage = useCallback(async (filePath: string) => {
    try {
      setError(null)
      await TeamService.deleteImage(filePath)
    } catch (err) {
      console.error('Error deleting image:', err)
      setError('Failed to delete image')
      throw err
    }
  }, [])

  // Reorder team members
  const reorderTeamMembers = useCallback(async (memberIds: string[], newOrders: number[]) => {
    try {
      setError(null)
      await TeamService.reorderTeamMembers(memberIds, newOrders)
      await fetchTeamMembers() // Refresh the list
    } catch (err) {
      console.error('Error reordering team members:', err)
      setError('Failed to reorder team members')
      throw err
    }
  }, [fetchTeamMembers])

  // Get next display order
  const getNextDisplayOrder = useCallback(async () => {
    try {
      return await TeamService.getNextDisplayOrder()
    } catch (err) {
      console.error('Error getting next display order:', err)
      return (teamMembers.length > 0 ? Math.max(...teamMembers.map(m => m.display_order)) : 0) + 1
    }
  }, [teamMembers])

  // Filter functions
  const getActiveMembers = useCallback(() => {
    return teamMembers.filter(member => member.active)
  }, [teamMembers])

  const getFeaturedMembers = useCallback(() => {
    return teamMembers.filter(member => member.featured && member.active)
  }, [teamMembers])

  const getMembersByPosition = useCallback((position: string) => {
    return teamMembers.filter(member => 
      member.position.toLowerCase().includes(position.toLowerCase()) && member.active
    )
  }, [teamMembers])

  return {
    teamMembers,
    loading,
    error,
    refetch: fetchTeamMembers,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
    toggleFeatured,
    toggleActive,
    uploadImage,
    deleteImage,
    reorderTeamMembers,
    getNextDisplayOrder,
    getActiveMembers,
    getFeaturedMembers,
    getMembersByPosition
  }
}

/**
 * Hook for team statistics
 */
export const useTeamStats = () => {
  const [stats, setStats] = useState<{
    totalMembers: number
    activeMembers: number
    featuredMembers: number
  }>({
    totalMembers: 0,
    activeMembers: 0,
    featuredMembers: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await TeamService.getTeamStats()
      setStats(data)
    } catch (err) {
      console.error('Error fetching team stats:', err)
      setError('Failed to load team statistics')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  }
}

/**
 * Hook for single team member
 */
export const useTeamMember = (id: string | null) => {
  const [teamMember, setTeamMember] = useState<TeamMember | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTeamMember = useCallback(async (memberId: string) => {
    try {
      setLoading(true)
      setError(null)
      const data = await TeamService.getTeamMemberById(memberId)
      setTeamMember(data)
    } catch (err) {
      console.error('Error fetching team member:', err)
      setError('Failed to load team member')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (id) {
      fetchTeamMember(id)
    } else {
      setTeamMember(null)
      setLoading(false)
      setError(null)
    }
  }, [id, fetchTeamMember])

  return {
    teamMember,
    loading,
    error,
    refetch: id ? () => fetchTeamMember(id) : () => {}
  }
}
