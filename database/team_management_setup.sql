-- =====================================================
-- TEAM MANAGEMENT SYSTEM - COMPLETE DATABASE SETUP
-- =====================================================
-- This SQL script creates a comprehensive team management system
-- with image upload buckets, RLS policies, and existing team data

-- =====================================================
-- 1. CREATE TEAM MEMBERS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(150) NOT NULL,
    bio TEXT,
    image_url TEXT,
    image_file_path TEXT,
    email VARCHAR(255),
    phone VARCHAR(20),
    social_links JSONB DEFAULT '{}',
    specialties TEXT[],
    years_experience INTEGER,
    join_date DATE,
    display_order INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT false,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =====================================================
-- 2. CREATE STORAGE BUCKET FOR TEAM IMAGES
-- =====================================================

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'team-images',
    'team-images',
    true,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 3. CREATE RLS POLICIES FOR TEAM MEMBERS TABLE
-- =====================================================

-- Enable RLS on team_members table
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to active team members
CREATE POLICY "Public can view active team members" ON public.team_members
    FOR SELECT USING (active = true);

-- Policy: Allow authenticated users to view all team members
CREATE POLICY "Authenticated users can view all team members" ON public.team_members
    FOR SELECT USING (auth.role() = 'authenticated');

-- Policy: Allow authenticated users to insert team members
CREATE POLICY "Authenticated users can insert team members" ON public.team_members
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy: Allow authenticated users to update team members
CREATE POLICY "Authenticated users can update team members" ON public.team_members
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy: Allow authenticated users to delete team members
CREATE POLICY "Authenticated users can delete team members" ON public.team_members
    FOR DELETE USING (auth.role() = 'authenticated');

-- =====================================================
-- 4. CREATE RLS POLICIES FOR TEAM IMAGES STORAGE
-- =====================================================

-- Policy: Allow public read access to team images
CREATE POLICY "Public can view team images" ON storage.objects
    FOR SELECT USING (bucket_id = 'team-images');

-- Policy: Allow authenticated users to upload team images
CREATE POLICY "Authenticated users can upload team images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'team-images' AND 
        auth.role() = 'authenticated'
    );

-- Policy: Allow authenticated users to update team images
CREATE POLICY "Authenticated users can update team images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'team-images' AND 
        auth.role() = 'authenticated'
    );

-- Policy: Allow authenticated users to delete team images
CREATE POLICY "Authenticated users can delete team images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'team-images' AND 
        auth.role() = 'authenticated'
    );

-- =====================================================
-- 5. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Index for active team members (public queries)
CREATE INDEX IF NOT EXISTS idx_team_members_active ON public.team_members(active) WHERE active = true;

-- Index for featured team members
CREATE INDEX IF NOT EXISTS idx_team_members_featured ON public.team_members(featured) WHERE featured = true;

-- Index for display order (for sorting)
CREATE INDEX IF NOT EXISTS idx_team_members_display_order ON public.team_members(display_order);

-- Index for name search
CREATE INDEX IF NOT EXISTS idx_team_members_name ON public.team_members USING gin(to_tsvector('english', name));

-- Index for position search
CREATE INDEX IF NOT EXISTS idx_team_members_position ON public.team_members USING gin(to_tsvector('english', position));

-- =====================================================
-- 6. CREATE TRIGGER FOR UPDATED_AT
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_team_members_updated_at
    BEFORE UPDATE ON public.team_members
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 7. INSERT EXISTING TEAM DATA
-- =====================================================

-- Insert the current team members with proper data
INSERT INTO public.team_members (
    name, 
    position, 
    bio, 
    image_url, 
    email,
    specialties,
    years_experience,
    join_date,
    display_order,
    featured,
    active
) VALUES 
(
    'Sarah',
    'Co-founder & Barista',
    'Sarah is one of the passionate co-founders of CNC Coffee N Cravings, bringing her expertise in coffee brewing and customer service. With a deep love for specialty coffee, she ensures every cup meets the highest standards at our Jaipur location.',
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    'sarah@cnccoffee.com',
    ARRAY['Specialty Coffee', 'Latte Art', 'Customer Service', 'Team Leadership'],
    8,
    '2016-01-15',
    1,
    true,
    true
),
(
    'David',
    'Co-founder & Chef',
    'David co-founded CNC Coffee N Cravings with a vision to create exceptional culinary experiences in Jaipur. As head chef, he crafts innovative dishes using locally sourced Rajasthani ingredients and brings creativity to every plate.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    'david@cnccoffee.com',
    ARRAY['Culinary Arts', 'Menu Development', 'Local Sourcing', 'Kitchen Management'],
    12,
    '2016-01-15',
    2,
    true,
    true
),
(
    'Emily',
    'Head Barista',
    'Emily leads our barista team with exceptional skill and passion for coffee. Her expertise in brewing techniques and dedication to quality ensures every customer receives the perfect cup.',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    'emily@cnccoffee.com',
    ARRAY['Coffee Brewing', 'Latte Art', 'Team Training', 'Quality Control'],
    5,
    '2018-03-20',
    3,
    true,
    true
),
(
    'Mark',
    'Sous Chef',
    'Mark supports our kitchen operations with his culinary expertise and attention to detail. He works closely with David to maintain our high food quality standards and develop new menu items.',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    'mark@cnccoffee.com',
    ARRAY['Food Preparation', 'Recipe Development', 'Kitchen Operations', 'Food Safety'],
    6,
    '2019-06-10',
    4,
    true,
    true
);

-- =====================================================
-- 8. CREATE HELPFUL VIEWS
-- =====================================================

-- View for active team members (public use)
CREATE OR REPLACE VIEW public.active_team_members AS
SELECT 
    id,
    name,
    position,
    bio,
    image_url,
    specialties,
    years_experience,
    display_order,
    featured
FROM public.team_members 
WHERE active = true 
ORDER BY display_order ASC, name ASC;

-- View for featured team members
CREATE OR REPLACE VIEW public.featured_team_members AS
SELECT 
    id,
    name,
    position,
    bio,
    image_url,
    specialties,
    years_experience,
    display_order
FROM public.team_members 
WHERE active = true AND featured = true 
ORDER BY display_order ASC, name ASC;

-- =====================================================
-- 9. CREATE FUNCTIONS FOR COMMON OPERATIONS
-- =====================================================

-- Function to get team member count
CREATE OR REPLACE FUNCTION get_team_member_count()
RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM public.team_members WHERE active = true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get next display order
CREATE OR REPLACE FUNCTION get_next_display_order()
RETURNS INTEGER AS $$
BEGIN
    RETURN COALESCE((SELECT MAX(display_order) + 1 FROM public.team_members), 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reorder team members
CREATE OR REPLACE FUNCTION reorder_team_members(member_ids UUID[], new_orders INTEGER[])
RETURNS BOOLEAN AS $$
DECLARE
    i INTEGER;
BEGIN
    -- Validate input arrays have same length
    IF array_length(member_ids, 1) != array_length(new_orders, 1) THEN
        RETURN FALSE;
    END IF;
    
    -- Update display orders
    FOR i IN 1..array_length(member_ids, 1) LOOP
        UPDATE public.team_members 
        SET display_order = new_orders[i]
        WHERE id = member_ids[i];
    END LOOP;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 10. GRANT PERMISSIONS
-- =====================================================

-- Grant permissions to authenticated users
GRANT ALL ON public.team_members TO authenticated;
GRANT ALL ON public.active_team_members TO authenticated;
GRANT ALL ON public.featured_team_members TO authenticated;

-- Grant read permissions to anonymous users for public views
GRANT SELECT ON public.active_team_members TO anon;
GRANT SELECT ON public.featured_team_members TO anon;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION get_team_member_count() TO authenticated;
GRANT EXECUTE ON FUNCTION get_next_display_order() TO authenticated;
GRANT EXECUTE ON FUNCTION reorder_team_members(UUID[], INTEGER[]) TO authenticated;

-- =====================================================
-- SETUP COMPLETE
-- =====================================================

-- Verify the setup
SELECT 'Team Management Setup Complete!' as status;
SELECT COUNT(*) as team_members_count FROM public.team_members;
SELECT name, position, featured FROM public.team_members ORDER BY display_order;
