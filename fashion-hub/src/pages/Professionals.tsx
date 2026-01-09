import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MapPin, Building2, Factory, User, Globe, Tag as TagIcon, Star, CheckCircle2, Award, TrendingUp } from 'lucide-react';
import type { Profile, ProfileFilters, UserRole } from '@/types';

// Expanded placeholder data with more variety
const placeholderProfiles: Profile[] = [
  // Suppliers
  {
    id: '1',
    user_id: '1',
    company_name: 'Melbourne Textile Co.',
    logo_url: undefined,
    bio: 'Leading supplier of sustainable fabrics with over 20 years of experience. Specializing in organic cotton and recycled materials. OEKO-TEX certified.',
    website: 'https://melbournetextile.com',
    abn: '12 345 678 901',
    capabilities: ['fabric_supplier', 'full_production'],
    fabric_types: ['Organic Cotton', 'Recycled Polyester', 'Bamboo', 'Hemp'],
    moq_min: 100,
    moq_max: 10000,
    pricing_range: 'mid',
    regions_served: ['AU', 'International'],
    tags: ['sustainable', 'ethical_certified', 'low_moq'],
    certifications: ['OEKO-TEX', 'GOTS'],
    created_date: new Date().toISOString(),
    updated_date: new Date().toISOString()
  } as Profile,
  {
    id: '4',
    user_id: '4',
    company_name: 'Brisbane Cut & Sew',
    logo_url: undefined,
    bio: 'Full-service manufacturing facility specializing in activewear and swimwear. Low MOQ available. Fast turnaround times guaranteed.',
    website: 'https://brisbanecutsew.com',
    abn: '11 222 333 444',
    capabilities: ['cut_sew', 'full_production', 'sampling_only'],
    moq_min: 50,
    moq_max: 5000,
    pricing_range: 'budget',
    regions_served: ['AU'],
    tags: ['low_moq', 'fast_turnaround', 'full_package'],
    created_date: new Date().toISOString(),
    updated_date: new Date().toISOString()
  } as Profile,
  {
    id: '7',
    user_id: '7',
    company_name: 'Adelaide Pattern House',
    logo_url: undefined,
    bio: 'Specialized pattern making and grading services. Working with Australian designers for over 15 years.',
    website: 'https://adelaidepattern.com',
    abn: '22 333 444 555',
    capabilities: ['pattern_maker', 'technical_consulting'],
    moq_min: 1,
    moq_max: 1000,
    pricing_range: 'mid',
    regions_served: ['AU'],
    tags: ['custom_design', 'fast_turnaround'],
    created_date: new Date().toISOString(),
    updated_date: new Date().toISOString()
  } as Profile,
  {
    id: '8',
    user_id: '8',
    company_name: 'Gold Coast Activewear Manufacturing',
    logo_url: undefined,
    bio: 'Premium activewear manufacturer with state-of-the-art facilities. Specializing in technical fabrics and performance wear.',
    website: 'https://gcactivewear.com',
    abn: '33 444 555 666',
    capabilities: ['full_production', 'cut_sew'],
    fabric_types: ['Technical Fabrics', 'Performance Materials'],
    moq_min: 200,
    moq_max: 20000,
    pricing_range: 'premium',
    regions_served: ['AU', 'International'],
    tags: ['sustainable', 'full_package'],
    created_date: new Date().toISOString(),
    updated_date: new Date().toISOString()
  } as Profile,
  {
    id: '9',
    user_id: '9',
    company_name: 'Canberra Sustainable Fabrics',
    logo_url: undefined,
    bio: 'Eco-friendly fabric supplier focusing on Australian-made sustainable materials. GOTS and OEKO-TEX certified.',
    website: 'https://canberrafabrics.com',
    abn: '44 555 666 777',
    capabilities: ['fabric_supplier'],
    fabric_types: ['Organic Cotton', 'Linen', 'Wool'],
    moq_min: 50,
    moq_max: 5000,
    pricing_range: 'mid',
    regions_served: ['AU'],
    tags: ['sustainable', 'ethical_certified', 'low_moq'],
    certifications: ['GOTS', 'OEKO-TEX'],
    created_date: new Date().toISOString(),
    updated_date: new Date().toISOString()
  } as Profile,
  // Brands
  {
    id: '2',
    user_id: '2',
    company_name: 'Sydney Fashion Brands',
    logo_url: undefined,
    bio: 'Contemporary streetwear brand based in Sydney. Looking for sustainable manufacturing partners for our upcoming collections.',
    website: 'https://sydneyfashion.com',
    abn: '98 765 432 109',
    locations: ['AU'],
    categories: ['streetwear', 'rtw'],
    company_size: 'medium',
    created_date: new Date().toISOString(),
    updated_date: new Date().toISOString()
  } as Profile,
  {
    id: '5',
    user_id: '5',
    company_name: 'Perth Luxury Labels',
    logo_url: undefined,
    bio: 'High-end fashion brand creating luxury ready-to-wear collections. Seeking premium fabric suppliers and ethical manufacturing partners.',
    website: 'https://perthluxury.com',
    abn: '55 666 777 888',
    locations: ['AU', 'International'],
    categories: ['luxury', 'rtw'],
    company_size: 'small',
    created_date: new Date().toISOString(),
    updated_date: new Date().toISOString()
  } as Profile,
  {
    id: '10',
    user_id: '10',
    company_name: 'Melbourne Uniform Solutions',
    logo_url: undefined,
    bio: 'Corporate and hospitality uniform supplier. Seeking reliable manufacturing partners for bulk orders.',
    website: 'https://melbourneuniforms.com',
    abn: '66 777 888 999',
    locations: ['AU'],
    categories: ['uniforms'],
    company_size: 'large',
    created_date: new Date().toISOString(),
    updated_date: new Date().toISOString()
  } as Profile,
  {
    id: '11',
    user_id: '11',
    company_name: 'Brisbane Swimwear Collective',
    logo_url: undefined,
    bio: 'Emerging swimwear brand focused on sustainable materials and ethical production. Looking for low MOQ manufacturers.',
    website: 'https://brisbaneswim.com',
    abn: '77 888 999 000',
    locations: ['AU'],
    categories: ['swim', 'activewear'],
    company_size: 'startup',
    created_date: new Date().toISOString(),
    updated_date: new Date().toISOString()
  } as Profile,
  {
    id: '12',
    user_id: '12',
    company_name: 'Adelaide Accessories Co.',
    logo_url: undefined,
    bio: 'Handcrafted accessories brand specializing in leather goods and sustainable materials. Seeking pattern makers and small batch manufacturers.',
    website: 'https://adelaideaccessories.com',
    abn: '88 999 000 111',
    locations: ['AU'],
    categories: ['accessories'],
    company_size: 'small',
    created_date: new Date().toISOString(),
    updated_date: new Date().toISOString()
  } as Profile,
  // Experts
  {
    id: '3',
    user_id: '3',
    name: 'Sarah Chen',
    photo_url: undefined,
    bio: 'Expert pattern maker with 15 years in luxury fashion. Specialized in womenswear and technical pattern development. Available for consulting and project work.',
    website: 'https://sarahchenpatterns.com',
    skills: ['Pattern Making', 'Technical Development', 'Grading', 'Sample Development'],
    day_rate_min: 500,
    day_rate_max: 800,
    hourly_rate_min: 80,
    hourly_rate_max: 120,
    regions_served: ['AU'],
    tags: ['fast_turnaround', 'custom_design'],
    created_date: new Date().toISOString(),
    updated_date: new Date().toISOString()
  } as Profile,
  {
    id: '6',
    user_id: '6',
    name: 'Michael Torres',
    photo_url: undefined,
    bio: 'Product development consultant specializing in sustainable fashion. Expert in material sourcing and supply chain optimization. 10+ years experience.',
    website: 'https://michaeltorres.com',
    skills: ['Product Development', 'Supply Chain', 'Sustainability Consulting', 'Material Sourcing'],
    day_rate_min: 600,
    day_rate_max: 1000,
    regions_served: ['AU', 'International'],
    tags: ['sustainable', 'ethical_certified'],
    created_date: new Date().toISOString(),
    updated_date: new Date().toISOString()
  } as Profile,
  {
    id: '13',
    user_id: '13',
    name: 'Emma Wilson',
    photo_url: undefined,
    bio: 'Fashion design consultant and trend forecaster. Helping brands develop cohesive collections and stay ahead of trends.',
    website: 'https://emmawilson.com',
    skills: ['Design Consulting', 'Trend Forecasting', 'Collection Development'],
    day_rate_min: 400,
    day_rate_max: 700,
    hourly_rate_min: 70,
    hourly_rate_max: 100,
    regions_served: ['AU'],
    tags: ['custom_design'],
    created_date: new Date().toISOString(),
    updated_date: new Date().toISOString()
  } as Profile,
  {
    id: '14',
    user_id: '14',
    name: 'James Mitchell',
    photo_url: undefined,
    bio: 'Technical consultant specializing in activewear and performance wear. Expert in fit, construction, and material selection.',
    website: 'https://jamesmitchell.com',
    skills: ['Technical Consulting', 'Fit Analysis', 'Construction Methods'],
    day_rate_min: 550,
    day_rate_max: 850,
    regions_served: ['AU', 'International'],
    tags: ['fast_turnaround', 'custom_design'],
    created_date: new Date().toISOString(),
    updated_date: new Date().toISOString()
  } as Profile,
  {
    id: '15',
    user_id: '15',
    name: 'Lisa Park',
    photo_url: undefined,
    bio: 'Sustainable fashion consultant and certification specialist. Helping brands achieve ethical and sustainable certifications.',
    website: 'https://lisapark.com',
    skills: ['Sustainability Consulting', 'Certification Support', 'Ethical Auditing'],
    day_rate_min: 500,
    day_rate_max: 800,
    regions_served: ['AU'],
    tags: ['sustainable', 'ethical_certified'],
    created_date: new Date().toISOString(),
    updated_date: new Date().toISOString()
  } as Profile
];

export default function ProfessionalsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');

  // Use placeholder data for now
  const { data: profiles = placeholderProfiles, isLoading } = useQuery<Profile[]>({
    queryKey: ['profiles', roleFilter, regionFilter, tagFilter, searchQuery],
    queryFn: () => base44.profiles.search({
      role: roleFilter !== 'all' ? [roleFilter] : undefined,
      region: regionFilter !== 'all' ? [regionFilter] : undefined
    }, searchQuery)
  });

  const filteredProfiles = profiles.filter((profile) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const searchableText = 
        ('company_name' in profile ? profile.company_name : profile.name) +
        (profile.bio || '') +
        ('skills' in profile ? profile.skills.join(' ') : '') +
        ('capabilities' in profile ? profile.capabilities.join(' ') : '');
      if (!searchableText.toLowerCase().includes(query)) return false;
    }

    if (tagFilter !== 'all') {
      const tags = 'tags' in profile ? profile.tags : [];
      if (!tags.includes(tagFilter as any)) return false;
    }

    return true;
  });

  const getProfileIcon = (profile: Profile) => {
    if ('name' in profile) return <User className="w-5 h-5" />;
    if ('capabilities' in profile) return <Factory className="w-5 h-5" />;
    return <Building2 className="w-5 h-5" />;
  };

  const getProfileTypeColor = (profile: Profile) => {
    if ('name' in profile) return 'bg-purple-100 text-purple-700 border-purple-200';
    if ('capabilities' in profile) return 'bg-blue-100 text-blue-700 border-blue-200';
    return 'bg-green-100 text-green-700 border-green-200';
  };

  const getProfileTypeLabel = (profile: Profile) => {
    if ('name' in profile) return 'Expert';
    if ('capabilities' in profile) return 'Supplier';
    return 'Brand';
  };

  const getProfileTitle = (profile: Profile) => {
    if ('name' in profile) return profile.name;
    if ('company_name' in profile) return profile.company_name;
    return 'Unknown';
  };

  const getProfileSubtitle = (profile: Profile) => {
    if ('name' in profile) {
      return profile.skills?.slice(0, 2).join(', ') || 'Expert';
    }
    if ('capabilities' in profile) {
      return profile.capabilities?.slice(0, 2).map(c => c.replace(/_/g, ' ')).join(', ') || 'Supplier';
    }
    if ('categories' in profile) {
      return profile.categories?.slice(0, 2).map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ') || 'Brand';
    }
    return '';
  };

  const featuredProfiles = filteredProfiles.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#FAF8F3]">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-b from-[#e8e4d8] to-[#FAF8F3] border-b border-[#3D3935]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3D3935] mb-3 sm:mb-4">
              Fashion Professionals Directory
            </h1>
            <p className="text-gray-700 text-base sm:text-lg max-w-2xl mx-auto px-4">
              Discover brands, suppliers, manufacturers, and experts in the Australian fashion industry
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12">
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 sm:p-6 text-center border border-white/20">
              <div className="text-2xl sm:text-3xl font-bold text-[#3D3935] mb-2">{placeholderProfiles.length}</div>
              <div className="text-xs sm:text-sm text-gray-600">Total Professionals</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 sm:p-6 text-center border border-white/20">
              <div className="text-2xl sm:text-3xl font-bold text-[#3D3935] mb-2">
                {placeholderProfiles.filter(p => 'capabilities' in p).length}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Suppliers & Manufacturers</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 sm:p-6 text-center border border-white/20">
              <div className="text-2xl sm:text-3xl font-bold text-[#3D3935] mb-2">
                {placeholderProfiles.filter(p => 'name' in p).length}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Independent Experts</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Enhanced Search and Filters */}
        <Card className="mb-6 sm:mb-8 shadow-lg border-gray-200">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <Input
                  placeholder="Search by name, skills, capabilities, company, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 sm:pl-12 h-12 sm:h-14 text-sm sm:text-base border-2 focus:border-blue-500"
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold flex items-center gap-2 text-gray-700">
                    <Filter className="w-4 h-4" />
                    Role Type
                  </Label>
                  <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as any)}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="brand">Brands / Retailers</SelectItem>
                      <SelectItem value="supplier">Suppliers / Manufacturers</SelectItem>
                      <SelectItem value="expert">Independent Experts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold flex items-center gap-2 text-gray-700">
                    <MapPin className="w-4 h-4" />
                    Region
                  </Label>
                  <Select value={regionFilter} onValueChange={setRegionFilter}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Regions</SelectItem>
                      <SelectItem value="AU">Australia Only</SelectItem>
                      <SelectItem value="International">International</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold flex items-center gap-2 text-gray-700">
                    <TagIcon className="w-4 h-4" />
                    Specializations
                  </Label>
                  <Select value={tagFilter} onValueChange={setTagFilter}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tags</SelectItem>
                      <SelectItem value="low_moq">Low MOQ</SelectItem>
                      <SelectItem value="sustainable">Sustainable</SelectItem>
                      <SelectItem value="ethical_certified">Ethical Certified</SelectItem>
                      <SelectItem value="fast_turnaround">Fast Turnaround</SelectItem>
                      <SelectItem value="full_package">Full Package</SelectItem>
                      <SelectItem value="custom_design">Custom Design</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-sm sm:text-base text-gray-700 font-medium">
            Showing <strong className="text-[#3D3935]">{filteredProfiles.length}</strong> {filteredProfiles.length === 1 ? 'professional' : 'professionals'}
            {searchQuery && (
              <span className="text-gray-500"> matching "<strong>{searchQuery}</strong>"</span>
            )}
          </p>
          {(roleFilter !== 'all' || regionFilter !== 'all' || tagFilter !== 'all') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setRoleFilter('all');
                setRegionFilter('all');
                setTagFilter('all');
                setSearchQuery('');
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Profiles Grid */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-[#3D3935] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 mt-4">Loading professionals...</p>
          </div>
        ) : filteredProfiles.length === 0 ? (
          <Card className="border-2 border-dashed">
            <CardContent className="pt-28 pb-20 text-center">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-xl mb-2 font-semibold">No professionals found</p>
              <p className="text-gray-400 mb-6">Try adjusting your filters or search query</p>
              <Button
                variant="outline"
                onClick={() => {
                  setRoleFilter('all');
                  setRegionFilter('all');
                  setTagFilter('all');
                  setSearchQuery('');
                }}
              >
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredProfiles.map((profile) => (
              <Card
                key={profile.id}
                className="hover:shadow-2xl hover:border-[#3D3935]/20 transition-all duration-300 cursor-pointer group bg-white border-gray-200"
              >
                <CardContent className="p-4 sm:p-6">
                  {/* Header with Type Badge */}
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${getProfileTypeColor(profile)} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                        {getProfileIcon(profile)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="playfair text-base sm:text-lg font-bold text-[#3D3935] group-hover:text-blue-600 transition-colors truncate">
                            {getProfileTitle(profile)}
                          </h3>
                        </div>
                        <Badge variant="outline" className={`text-xs ${getProfileTypeColor(profile)} border`}>
                          {getProfileTypeLabel(profile)}
                        </Badge>
                        {('certifications' in profile && profile.certifications && profile.certifications.length > 0) && (
                          <div className="flex items-center gap-1 mt-1">
                            <Award className="w-3 h-3 text-amber-500" />
                            <span className="text-xs text-gray-600 truncate">{profile.certifications.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Subtitle */}
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 font-medium">
                    {getProfileSubtitle(profile)}
                  </p>

                  {/* Bio */}
                  {profile.bio && (
                    <p className="text-xs sm:text-sm text-gray-700 mb-3 sm:mb-4 line-clamp-3 leading-relaxed">
                      {profile.bio}
                    </p>
                  )}

                  {/* Key Details */}
                  <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4 p-2.5 sm:p-3 bg-gray-50 rounded-lg">
                    {/* Regions */}
                    {('regions_served' in profile && profile.regions_served) && (
                      <div className="flex items-center gap-2 text-xs text-gray-700">
                        <MapPin className="w-3.5 h-3.5 text-gray-500" />
                        <span className="font-medium">{profile.regions_served.join(', ')}</span>
                      </div>
                    )}
                    {('locations' in profile && profile.locations) && (
                      <div className="flex items-center gap-2 text-xs text-gray-700">
                        <MapPin className="w-3.5 h-3.5 text-gray-500" />
                        <span className="font-medium">{profile.locations.join(', ')}</span>
                      </div>
                    )}

                    {/* MOQ for Suppliers */}
                    {('moq_min' in profile && profile.moq_min) && (
                      <div className="flex items-center gap-2 text-xs text-gray-700">
                        <TrendingUp className="w-3.5 h-3.5 text-gray-500" />
                        <span><strong>MOQ:</strong> {profile.moq_min.toLocaleString()}
                        {profile.moq_max && ` - ${profile.moq_max.toLocaleString()}`} units</span>
                      </div>
                    )}

                    {/* Rates for Experts */}
                    {('day_rate_min' in profile && profile.day_rate_min) && (
                      <div className="flex items-center gap-2 text-xs text-gray-700">
                        <TrendingUp className="w-3.5 h-3.5 text-gray-500" />
                        <span><strong>Day Rate:</strong> ${profile.day_rate_min.toLocaleString()}
                        {profile.day_rate_max && ` - $${profile.day_rate_max.toLocaleString()}`}</span>
                      </div>
                    )}

                    {/* Pricing for Suppliers */}
                    {('pricing_range' in profile && profile.pricing_range) && (
                      <div className="flex items-center gap-2 text-xs text-gray-700">
                        <TagIcon className="w-3.5 h-3.5 text-gray-500" />
                        <span><strong>Pricing:</strong> {profile.pricing_range.charAt(0).toUpperCase() + profile.pricing_range.slice(1)}</span>
                      </div>
                    )}

                    {/* Company Size for Brands */}
                    {('company_size' in profile && profile.company_size) && (
                      <div className="flex items-center gap-2 text-xs text-gray-700">
                        <Building2 className="w-3.5 h-3.5 text-gray-500" />
                        <span><strong>Size:</strong> {profile.company_size.charAt(0).toUpperCase() + profile.company_size.slice(1)}</span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {('tags' in profile && profile.tags && profile.tags.length > 0) && (
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                      {profile.tags.slice(0, 4).map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          {tag.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                      ))}
                      {profile.tags.length > 4 && (
                        <Badge variant="outline" className="text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 bg-white border-gray-300 text-gray-700">
                          +{profile.tags.length - 4}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Website Link */}
                  {profile.website && (
                    <div className="pt-2 sm:pt-3 border-t border-gray-100 mb-3 sm:mb-4">
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1.5 font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        Visit Website
                      </a>
                    </div>
                  )}

                  {/* View Profile Button */}
                  <Button
                    variant="outline"
                    className="w-full mt-1 sm:mt-2 border-2 hover:bg-[#3D3935] hover:text-white hover:border-[#3D3935] transition-colors text-sm sm:text-base"
                    onClick={() => {
                      window.location.href = `/profiles/${profile.id}`;
                    }}
                  >
                    View Full Profile
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Enhanced Featured Section */}
        {featuredProfiles.length > 0 && (
          <div className="mt-8 sm:mt-12 lg:mt-16 pt-8 sm:pt-12 border-t border-gray-200">
            <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-100">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 fill-amber-600" />
              </div>
              <div>
                <h2 className="playfair text-2xl sm:text-3xl font-bold text-[#3D3935]">Featured Professionals</h2>
                <p className="text-xs sm:text-sm text-gray-600">Handpicked by our team</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {featuredProfiles.map((profile) => (
                <Card
                  key={`featured-${profile.id}`}
                  className="border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-white shadow-lg hover:shadow-xl transition-all"
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl ${getProfileTypeColor(profile)} flex items-center justify-center flex-shrink-0 shadow-md`}>
                        {getProfileIcon(profile)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                          <h3 className="playfair text-lg sm:text-xl font-bold text-[#3D3935] truncate">
                            {getProfileTitle(profile)}
                          </h3>
                          <Badge className="bg-amber-500 text-white border-0 text-xs">
                            <Star className="w-3 h-3 mr-1 fill-white" />
                            Featured
                          </Badge>
                        </div>
                        <Badge variant="outline" className={`text-xs mb-2 ${getProfileTypeColor(profile)} border`}>
                          {getProfileTypeLabel(profile)}
                        </Badge>
                        <p className="text-xs sm:text-sm text-gray-700 mb-3 sm:mb-4 line-clamp-3 leading-relaxed">
                          {profile.bio}
                        </p>
                        <Button variant="outline" size="sm" className="w-full border-2 text-xs sm:text-sm">
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
