import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Building2, Factory, User, MapPin, Globe, Link as LinkIcon } from 'lucide-react';
import type { BrandProfile, SupplierProfile, ExpertProfile, ProfileCategory, SupplierCapability, Tag } from '@/types';

export default function OnboardingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Brand profile state
  const [brandProfile, setBrandProfile] = useState<Partial<BrandProfile>>({
    company_name: '',
    bio: '',
    website: '',
    abn: '',
    locations: [],
    categories: [],
    company_size: 'small'
  });

  // Supplier profile state
  const [supplierProfile, setSupplierProfile] = useState<Partial<SupplierProfile>>({
    company_name: '',
    bio: '',
    website: '',
    abn: '',
    capabilities: [],
    fabric_types: [],
    moq_min: undefined,
    moq_max: undefined,
    pricing_range: 'mid',
    regions_served: [],
    tags: []
  });

  // Expert profile state
  const [expertProfile, setExpertProfile] = useState<Partial<ExpertProfile>>({
    name: '',
    bio: '',
    website: '',
    skills: [],
    day_rate_min: undefined,
    day_rate_max: undefined,
    hourly_rate_min: undefined,
    hourly_rate_max: undefined,
    regions_served: [],
    tags: []
  });

  const handleSubmit = async () => {
    if (!user) return;

    setLoading(true);
    try {
      let profileData: Partial<BrandProfile | SupplierProfile | ExpertProfile>;
      
      if (user.role === 'brand') {
        profileData = { ...brandProfile, user_id: user.id };
      } else if (user.role === 'supplier') {
        profileData = { ...supplierProfile, user_id: user.id };
      } else {
        profileData = { ...expertProfile, user_id: user.id };
      }

      await base44.profiles.create(profileData);
      toast.success('Profile created successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="playfair text-4xl font-bold text-[#3D3935] mb-2">
            Complete Your Profile
          </h1>
          <p className="text-gray-600">Tell us about your business</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Step {step} of 3</CardTitle>
            <CardDescription>
              {step === 1 && 'Basic Information'}
              {step === 2 && 'Business Details'}
              {step === 3 && 'Capabilities & Preferences'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {user.role === 'brand' && (
              <>
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="company_name">Company Name *</Label>
                      <Input
                        id="company_name"
                        value={brandProfile.company_name}
                        onChange={(e) => setBrandProfile({ ...brandProfile, company_name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={brandProfile.bio}
                        onChange={(e) => setBrandProfile({ ...brandProfile, bio: e.target.value })}
                        rows={4}
                        placeholder="Tell us about your brand..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          type="url"
                          value={brandProfile.website}
                          onChange={(e) => setBrandProfile({ ...brandProfile, website: e.target.value })}
                          placeholder="https://..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="abn">ABN (Optional)</Label>
                        <Input
                          id="abn"
                          value={brandProfile.abn}
                          onChange={(e) => setBrandProfile({ ...brandProfile, abn: e.target.value })}
                          placeholder="12 345 678 901"
                        />
                      </div>
                    </div>
                  </div>
                )}
                {step === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Locations *</Label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={brandProfile.locations?.includes('AU') ? 'default' : 'outline'}
                          onClick={() => {
                            const locations = brandProfile.locations || [];
                            setBrandProfile({
                              ...brandProfile,
                              locations: locations.includes('AU')
                                ? locations.filter(l => l !== 'AU')
                                : [...locations, 'AU']
                            });
                          }}
                        >
                          <MapPin className="w-4 h-4 mr-2" />
                          Australia
                        </Button>
                        <Button
                          type="button"
                          variant={brandProfile.locations?.includes('International') ? 'default' : 'outline'}
                          onClick={() => {
                            const locations = brandProfile.locations || [];
                            setBrandProfile({
                              ...brandProfile,
                              locations: locations.includes('International')
                                ? locations.filter(l => l !== 'International')
                                : [...locations, 'International']
                            });
                          }}
                        >
                          <Globe className="w-4 h-4 mr-2" />
                          International
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Company Size *</Label>
                      <Select
                        value={brandProfile.company_size}
                        onValueChange={(value: any) => setBrandProfile({ ...brandProfile, company_size: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="startup">Startup (1-5 employees)</SelectItem>
                          <SelectItem value="small">Small (6-20 employees)</SelectItem>
                          <SelectItem value="medium">Medium (21-50 employees)</SelectItem>
                          <SelectItem value="large">Large (51-200 employees)</SelectItem>
                          <SelectItem value="enterprise">Enterprise (200+ employees)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Categories *</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['streetwear', 'rtw', 'luxury', 'uniforms', 'activewear', 'swim', 'accessories', 'footwear'] as ProfileCategory[]).map((cat) => (
                          <Button
                            key={cat}
                            type="button"
                            variant={brandProfile.categories?.includes(cat) ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => {
                              const categories = brandProfile.categories || [];
                              setBrandProfile({
                                ...brandProfile,
                                categories: categories.includes(cat)
                                  ? categories.filter(c => c !== cat)
                                  : [...categories, cat]
                              });
                            }}
                          >
                            {cat.charAt(0).toUpperCase() + cat.slice(1).replace('_', ' ')}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {user.role === 'supplier' && (
              <>
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="company_name">Company Name *</Label>
                      <Input
                        id="company_name"
                        value={supplierProfile.company_name}
                        onChange={(e) => setSupplierProfile({ ...supplierProfile, company_name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={supplierProfile.bio}
                        onChange={(e) => setSupplierProfile({ ...supplierProfile, bio: e.target.value })}
                        rows={4}
                        placeholder="Tell us about your capabilities..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          type="url"
                          value={supplierProfile.website}
                          onChange={(e) => setSupplierProfile({ ...supplierProfile, website: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="abn">ABN (Optional)</Label>
                        <Input
                          id="abn"
                          value={supplierProfile.abn}
                          onChange={(e) => setSupplierProfile({ ...supplierProfile, abn: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                )}
                {step === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Capabilities *</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['fabric_supplier', 'cut_sew', 'pattern_maker', 'full_production', 'sampling_only', 'logistics', 'design_support', 'technical_consulting'] as SupplierCapability[]).map((cap) => (
                          <Button
                            key={cap}
                            type="button"
                            variant={supplierProfile.capabilities?.includes(cap) ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => {
                              const capabilities = supplierProfile.capabilities || [];
                              setSupplierProfile({
                                ...supplierProfile,
                                capabilities: capabilities.includes(cap)
                                  ? capabilities.filter(c => c !== cap)
                                  : [...capabilities, cap]
                              });
                            }}
                          >
                            {cap.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="moq_min">Min MOQ</Label>
                        <Input
                          id="moq_min"
                          type="number"
                          value={supplierProfile.moq_min || ''}
                          onChange={(e) => setSupplierProfile({ ...supplierProfile, moq_min: parseInt(e.target.value) || undefined })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="moq_max">Max MOQ</Label>
                        <Input
                          id="moq_max"
                          type="number"
                          value={supplierProfile.moq_max || ''}
                          onChange={(e) => setSupplierProfile({ ...supplierProfile, moq_max: parseInt(e.target.value) || undefined })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Pricing Range</Label>
                      <Select
                        value={supplierProfile.pricing_range}
                        onValueChange={(value: any) => setSupplierProfile({ ...supplierProfile, pricing_range: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="budget">Budget</SelectItem>
                          <SelectItem value="mid">Mid-range</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="luxury">Luxury</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
                {step === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Regions Served *</Label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={supplierProfile.regions_served?.includes('AU') ? 'default' : 'outline'}
                          onClick={() => {
                            const regions = supplierProfile.regions_served || [];
                            setSupplierProfile({
                              ...supplierProfile,
                              regions_served: regions.includes('AU')
                                ? regions.filter(r => r !== 'AU')
                                : [...regions, 'AU']
                            });
                          }}
                        >
                          <MapPin className="w-4 h-4 mr-2" />
                          Australia
                        </Button>
                        <Button
                          type="button"
                          variant={supplierProfile.regions_served?.includes('International') ? 'default' : 'outline'}
                          onClick={() => {
                            const regions = supplierProfile.regions_served || [];
                            setSupplierProfile({
                              ...supplierProfile,
                              regions_served: regions.includes('International')
                                ? regions.filter(r => r !== 'International')
                                : [...regions, 'International']
                            });
                          }}
                        >
                          <Globe className="w-4 h-4 mr-2" />
                          International
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Tags</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['low_moq', 'sustainable', 'ethical_certified', 'sampling_only', 'full_package', 'fast_turnaround'] as Tag[]).map((tag) => (
                          <Button
                            key={tag}
                            type="button"
                            variant={supplierProfile.tags?.includes(tag) ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => {
                              const tags = supplierProfile.tags || [];
                              setSupplierProfile({
                                ...supplierProfile,
                                tags: tags.includes(tag)
                                  ? tags.filter(t => t !== tag)
                                  : [...tags, tag]
                              });
                            }}
                          >
                            {tag.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {user.role === 'expert' && (
              <>
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name *</Label>
                      <Input
                        id="name"
                        value={expertProfile.name}
                        onChange={(e) => setExpertProfile({ ...expertProfile, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={expertProfile.bio}
                        onChange={(e) => setExpertProfile({ ...expertProfile, bio: e.target.value })}
                        rows={4}
                        placeholder="Tell us about your expertise..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        type="url"
                        value={expertProfile.website}
                        onChange={(e) => setExpertProfile({ ...expertProfile, website: e.target.value })}
                      />
                    </div>
                  </div>
                )}
                {step === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="skills">Skills (comma-separated) *</Label>
                      <Input
                        id="skills"
                        value={expertProfile.skills?.join(', ') || ''}
                        onChange={(e) => setExpertProfile({
                          ...expertProfile,
                          skills: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                        })}
                        placeholder="Pattern making, Product development, Technical consulting"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="day_rate_min">Day Rate Min ($)</Label>
                        <Input
                          id="day_rate_min"
                          type="number"
                          value={expertProfile.day_rate_min || ''}
                          onChange={(e) => setExpertProfile({ ...expertProfile, day_rate_min: parseInt(e.target.value) || undefined })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="day_rate_max">Day Rate Max ($)</Label>
                        <Input
                          id="day_rate_max"
                          type="number"
                          value={expertProfile.day_rate_max || ''}
                          onChange={(e) => setExpertProfile({ ...expertProfile, day_rate_max: parseInt(e.target.value) || undefined })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="hourly_rate_min">Hourly Rate Min ($)</Label>
                        <Input
                          id="hourly_rate_min"
                          type="number"
                          value={expertProfile.hourly_rate_min || ''}
                          onChange={(e) => setExpertProfile({ ...expertProfile, hourly_rate_min: parseInt(e.target.value) || undefined })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hourly_rate_max">Hourly Rate Max ($)</Label>
                        <Input
                          id="hourly_rate_max"
                          type="number"
                          value={expertProfile.hourly_rate_max || ''}
                          onChange={(e) => setExpertProfile({ ...expertProfile, hourly_rate_max: parseInt(e.target.value) || undefined })}
                        />
                      </div>
                    </div>
                  </div>
                )}
                {step === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Regions Served *</Label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={expertProfile.regions_served?.includes('AU') ? 'default' : 'outline'}
                          onClick={() => {
                            const regions = expertProfile.regions_served || [];
                            setExpertProfile({
                              ...expertProfile,
                              regions_served: regions.includes('AU')
                                ? regions.filter(r => r !== 'AU')
                                : [...regions, 'AU']
                            });
                          }}
                        >
                          <MapPin className="w-4 h-4 mr-2" />
                          Australia
                        </Button>
                        <Button
                          type="button"
                          variant={expertProfile.regions_served?.includes('International') ? 'default' : 'outline'}
                          onClick={() => {
                            const regions = expertProfile.regions_served || [];
                            setExpertProfile({
                              ...expertProfile,
                              regions_served: regions.includes('International')
                                ? regions.filter(r => r !== 'International')
                                : [...regions, 'International']
                            });
                          }}
                        >
                          <Globe className="w-4 h-4 mr-2" />
                          International
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Tags</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['low_moq', 'sustainable', 'ethical_certified', 'fast_turnaround', 'custom_design'] as Tag[]).map((tag) => (
                          <Button
                            key={tag}
                            type="button"
                            variant={expertProfile.tags?.includes(tag) ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => {
                              const tags = expertProfile.tags || [];
                              setExpertProfile({
                                ...expertProfile,
                                tags: tags.includes(tag)
                                  ? tags.filter(t => t !== tag)
                                  : [...tags, tag]
                              });
                            }}
                          >
                            {tag.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="flex justify-between mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
              >
                Previous
              </Button>
              {step < 3 ? (
                <Button type="button" onClick={() => setStep(step + 1)}>
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Creating...' : 'Complete Profile'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

