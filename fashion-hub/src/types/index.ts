// User Types and Roles
export type UserRole = 'brand' | 'supplier' | 'expert' | 'admin';
export type UserStatus = 'pending' | 'approved' | 'banned' | 'suspended';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  created_date: string;
  approved_date?: string;
  last_login?: string;
}

// Profile Types
export type ProfileCategory = 
  | 'streetwear' | 'rtw' | 'luxury' | 'uniforms' | 'activewear' | 'swim' 
  | 'accessories' | 'footwear' | 'wovens' | 'knits' | 'denim';

export type SupplierCapability = 
  | 'fabric_supplier' | 'cut_sew' | 'pattern_maker' | 'full_production' 
  | 'sampling_only' | 'logistics' | 'design_support' | 'technical_consulting';

export type Tag = 
  | 'low_moq' | 'sustainable' | 'ethical_certified' | 'sampling_only' 
  | 'full_package' | 'fast_turnaround' | 'custom_design' | 'bulk_production';

export interface BrandProfile {
  id: string;
  user_id: string;
  company_name: string;
  logo_url?: string;
  bio?: string;
  website?: string;
  abn?: string;
  locations: string[]; // ['AU', 'International']
  categories: ProfileCategory[];
  company_size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  social_links?: {
    instagram?: string;
    linkedin?: string;
    facebook?: string;
  };
  created_date: string;
  updated_date: string;
}

export interface SupplierProfile {
  id: string;
  user_id: string;
  company_name: string;
  logo_url?: string;
  bio?: string;
  website?: string;
  abn?: string;
  capabilities: SupplierCapability[];
  fabric_types?: string[];
  moq_min?: number;
  moq_max?: number;
  pricing_range?: 'budget' | 'mid' | 'premium' | 'luxury';
  regions_served: string[];
  tags: Tag[];
  certifications?: string[]; // ['OEKO-TEX', 'GOTS', etc.]
  created_date: string;
  updated_date: string;
}

export interface ExpertProfile {
  id: string;
  user_id: string;
  name: string;
  photo_url?: string;
  bio?: string;
  website?: string;
  skills: string[];
  day_rate_min?: number;
  day_rate_max?: number;
  hourly_rate_min?: number;
  hourly_rate_max?: number;
  regions_served: string[];
  tags: Tag[];
  certifications?: string[];
  created_date: string;
  updated_date: string;
}

export type Profile = BrandProfile | SupplierProfile | ExpertProfile;

// Brief Types
export type BriefCategory = 
  | 'materials' | 'manufacturing' | 'technical_pattern' | 'design_support' 
  | 'collaboration_partnership' | 'logistics';

export type ProductCategory = 
  | 'wovens' | 'knits' | 'denim' | 'activewear' | 'swim' | 'accessories' | 'footwear';

export type BriefStatus = 'open' | 'under_review' | 'closed' | 'filled';
export type BriefVisibility = 'public' | 'client_team_only';

export interface Brief {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: BriefCategory;
  product_category: ProductCategory[];
  quantity_moq?: number;
  timeline?: string;
  location_preference: 'australia_only' | 'international_ok';
  budget_range?: 'under_10k' | '10k_50k' | '50k_100k' | '100k_plus' | 'negotiable';
  nda_required: boolean;
  visibility: BriefVisibility;
  status: BriefStatus;
  client_team_contact?: {
    phone?: string;
    email?: string;
    instructions?: string;
  };
  tags: Tag[];
  created_date: string;
  updated_date: string;
  expires_date?: string;
  featured: boolean;
}

// Response Types
export type ResponseStatus = 'pending' | 'shortlisted' | 'declined' | 'accepted';

export interface BriefResponse {
  id: string;
  brief_id: string;
  user_id: string;
  message: string;
  why_fit: string;
  profile_link?: string;
  attachment_url?: string;
  status: ResponseStatus;
  is_public: boolean; // For public comments-style replies
  created_date: string;
  updated_date: string;
}

// Admin Types
export interface AdminAction {
  id: string;
  admin_id: string;
  action_type: 'approve_user' | 'ban_user' | 'unlist_profile' | 'hide_brief' | 'feature_brief' | 'feature_profile';
  target_type: 'user' | 'profile' | 'brief';
  target_id: string;
  reason?: string;
  created_date: string;
}

// Search and Filter Types
export interface BriefFilters {
  category?: BriefCategory[];
  product_category?: ProductCategory[];
  location?: string[];
  moq_min?: number;
  moq_max?: number;
  sustainability?: boolean;
  tags?: Tag[];
  status?: BriefStatus[];
  timeline?: string;
}

export interface ProfileFilters {
  role?: UserRole[];
  category?: ProfileCategory[];
  capability?: SupplierCapability[];
  region?: string[];
  moq_min?: number;
  moq_max?: number;
  tags?: Tag[];
  pricing_range?: string[];
}

