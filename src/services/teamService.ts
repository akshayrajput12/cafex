import { supabase, supabaseUrl } from '../admin/auth/supabaseClient'

// Team member interface
export interface TeamMember {
  id: string
  name: string
  position: string
  bio?: string
  image_url?: string
  image_file_path?: string
  email?: string
  phone?: string
  social_links?: {
    linkedin?: string
    twitter?: string
    instagram?: string
    facebook?: string
  }
  specialties?: string[]
  years_experience?: number
  join_date?: string
  display_order: number
  featured: boolean
  active: boolean
  created_at: string
  updated_at: string
}

// Database row type
interface TeamMemberRow {
  id: string
  name: string
  position: string
  bio: string | null
  image_url: string | null
  image_file_path: string | null
  email: string | null
  phone: string | null
  social_links: any
  specialties: string[] | null
  years_experience: number | null
  join_date: string | null
  display_order: number
  featured: boolean
  active: boolean
  created_at: string
  updated_at: string
}

export class TeamService {
  
  /**
   * Transform database row to TeamMember interface
   */
  private static transformRow(row: TeamMemberRow): TeamMember {
    let imageUrl = row.image_url || ''
    
    // If we have a file path, construct the full URL
    if (row.image_file_path && !row.image_url?.startsWith('http')) {
      imageUrl = `${supabaseUrl}/storage/v1/object/public/team-images/${row.image_file_path}`
    }

    return {
      id: row.id,
      name: row.name,
      position: row.position,
      bio: row.bio || undefined,
      image_url: imageUrl,
      image_file_path: row.image_file_path || undefined,
      email: row.email || undefined,
      phone: row.phone || undefined,
      social_links: row.social_links || {},
      specialties: row.specialties || [],
      years_experience: row.years_experience || undefined,
      join_date: row.join_date || undefined,
      display_order: row.display_order,
      featured: row.featured,
      active: row.active,
      created_at: row.created_at,
      updated_at: row.updated_at
    }
  }

  /**
   * Get all team members (admin)
   */
  static async getAllTeamMembers(): Promise<TeamMember[]> {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching team members:', error)
      throw error
    }

    return data.map(this.transformRow)
  }

  /**
   * Get active team members (public)
   */
  static async getActiveTeamMembers(): Promise<TeamMember[]> {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('active', true)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching active team members:', error)
      throw error
    }

    return data.map(this.transformRow)
  }

  /**
   * Get featured team members
   */
  static async getFeaturedTeamMembers(): Promise<TeamMember[]> {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('active', true)
      .eq('featured', true)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching featured team members:', error)
      throw error
    }

    return data.map(this.transformRow)
  }

  /**
   * Get team member by ID
   */
  static async getTeamMemberById(id: string): Promise<TeamMember | null> {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Not found
      }
      console.error('Error fetching team member:', error)
      throw error
    }

    return this.transformRow(data)
  }

  /**
   * Create new team member
   */
  static async createTeamMember(teamMember: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>): Promise<TeamMember> {
    const { data, error } = await supabase
      .from('team_members')
      .insert([{
        name: teamMember.name,
        position: teamMember.position,
        bio: teamMember.bio || null,
        image_url: teamMember.image_url || null,
        image_file_path: teamMember.image_file_path || null,
        email: teamMember.email || null,
        phone: teamMember.phone || null,
        social_links: teamMember.social_links || {},
        specialties: teamMember.specialties || [],
        years_experience: teamMember.years_experience || null,
        join_date: teamMember.join_date || null,
        display_order: teamMember.display_order,
        featured: teamMember.featured,
        active: teamMember.active
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating team member:', error)
      throw error
    }

    return this.transformRow(data)
  }

  /**
   * Update team member
   */
  static async updateTeamMember(id: string, updates: Partial<TeamMember>): Promise<TeamMember> {
    const updateData: any = {}
    
    if (updates.name !== undefined) updateData.name = updates.name
    if (updates.position !== undefined) updateData.position = updates.position
    if (updates.bio !== undefined) updateData.bio = updates.bio || null
    if (updates.image_url !== undefined) updateData.image_url = updates.image_url || null
    if (updates.image_file_path !== undefined) updateData.image_file_path = updates.image_file_path || null
    if (updates.email !== undefined) updateData.email = updates.email || null
    if (updates.phone !== undefined) updateData.phone = updates.phone || null
    if (updates.social_links !== undefined) updateData.social_links = updates.social_links || {}
    if (updates.specialties !== undefined) updateData.specialties = updates.specialties || []
    if (updates.years_experience !== undefined) updateData.years_experience = updates.years_experience || null
    if (updates.join_date !== undefined) updateData.join_date = updates.join_date || null
    if (updates.display_order !== undefined) updateData.display_order = updates.display_order
    if (updates.featured !== undefined) updateData.featured = updates.featured
    if (updates.active !== undefined) updateData.active = updates.active

    const { data, error } = await supabase
      .from('team_members')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating team member:', error)
      throw error
    }

    return this.transformRow(data)
  }

  /**
   * Delete team member
   */
  static async deleteTeamMember(id: string): Promise<void> {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting team member:', error)
      throw error
    }
  }

  /**
   * Toggle team member featured status
   */
  static async toggleFeatured(id: string): Promise<TeamMember> {
    // First get current status
    const current = await this.getTeamMemberById(id)
    if (!current) {
      throw new Error('Team member not found')
    }

    return this.updateTeamMember(id, { featured: !current.featured })
  }

  /**
   * Toggle team member active status
   */
  static async toggleActive(id: string): Promise<TeamMember> {
    // First get current status
    const current = await this.getTeamMemberById(id)
    if (!current) {
      throw new Error('Team member not found')
    }

    return this.updateTeamMember(id, { active: !current.active })
  }

  /**
   * Upload team member image
   */
  static async uploadImage(file: File, teamMemberId?: string): Promise<string> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${teamMemberId || Date.now()}.${fileExt}`
    const filePath = fileName

    const { error: uploadError } = await supabase.storage
      .from('team-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (uploadError) {
      console.error('Error uploading image:', uploadError)
      throw uploadError
    }

    return filePath
  }

  /**
   * Delete team member image
   */
  static async deleteImage(filePath: string): Promise<void> {
    const { error } = await supabase.storage
      .from('team-images')
      .remove([filePath])

    if (error) {
      console.error('Error deleting image:', error)
      throw error
    }
  }

  /**
   * Get next display order
   */
  static async getNextDisplayOrder(): Promise<number> {
    const { data, error } = await supabase
      .rpc('get_next_display_order')

    if (error) {
      console.error('Error getting next display order:', error)
      // Fallback: get max + 1
      const { data: maxData } = await supabase
        .from('team_members')
        .select('display_order')
        .order('display_order', { ascending: false })
        .limit(1)
        .single()
      
      return (maxData?.display_order || 0) + 1
    }

    return data || 1
  }

  /**
   * Reorder team members
   */
  static async reorderTeamMembers(memberIds: string[], newOrders: number[]): Promise<void> {
    const { error } = await supabase
      .rpc('reorder_team_members', {
        member_ids: memberIds,
        new_orders: newOrders
      })

    if (error) {
      console.error('Error reordering team members:', error)
      throw error
    }
  }

  /**
   * Get team statistics
   */
  static async getTeamStats(): Promise<{
    totalMembers: number
    activeMembers: number
    featuredMembers: number
  }> {
    const [total, active, featured] = await Promise.all([
      supabase.from('team_members').select('id', { count: 'exact', head: true }),
      supabase.from('team_members').select('id', { count: 'exact', head: true }).eq('active', true),
      supabase.from('team_members').select('id', { count: 'exact', head: true }).eq('featured', true)
    ])

    return {
      totalMembers: total.count || 0,
      activeMembers: active.count || 0,
      featuredMembers: featured.count || 0
    }
  }
}
