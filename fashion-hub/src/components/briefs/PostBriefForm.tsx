import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import type { Brief, BriefCategory, ProductCategory, Tag, BriefVisibility } from '@/types';

interface PostBriefFormProps {
  onSuccess?: () => void;
}

export default function PostBriefForm({ onSuccess }: PostBriefFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Brief>>({
    title: '',
    description: '',
    category: 'materials',
    product_category: [],
    quantity_moq: undefined,
    timeline: '',
    location_preference: 'australia_only',
    budget_range: undefined,
    nda_required: false,
    visibility: 'public',
    tags: [],
    client_team_contact: {}
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await base44.briefs.create({
        ...formData,
        user_id: user.id
      });
      toast.success('Brief posted successfully!');
      onSuccess?.();
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'materials',
        product_category: [],
        quantity_moq: undefined,
        timeline: '',
        location_preference: 'australia_only',
        budget_range: undefined,
        nda_required: false,
        visibility: 'public',
        tags: [],
        client_team_contact: {}
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to post brief');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="playfair text-2xl">Post a Brief</CardTitle>
        <CardDescription>Share what you need with the fashion community</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Brief Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Looking for sustainable fabric suppliers in Melbourne"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value as BriefCategory })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="materials">Materials</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="technical_pattern">Technical/Pattern</SelectItem>
                <SelectItem value="design_support">Design Support</SelectItem>
                <SelectItem value="collaboration_partnership">Collaboration/Partnership</SelectItem>
                <SelectItem value="logistics">Logistics</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Product Categories *</Label>
            <div className="grid grid-cols-2 gap-2">
              {(['wovens', 'knits', 'denim', 'activewear', 'swim', 'accessories', 'footwear'] as ProductCategory[]).map((cat) => (
                <Button
                  key={cat}
                  type="button"
                  variant={formData.product_category?.includes(cat) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    const categories = formData.product_category || [];
                    setFormData({
                      ...formData,
                      product_category: categories.includes(cat)
                        ? categories.filter(c => c !== cat)
                        : [...categories, cat]
                    });
                  }}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={6}
              placeholder="Provide detailed information about your needs..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity_moq">Quantity/MOQ</Label>
              <Input
                id="quantity_moq"
                type="number"
                value={formData.quantity_moq || ''}
                onChange={(e) => setFormData({ ...formData, quantity_moq: parseInt(e.target.value) || undefined })}
                placeholder="e.g., 1000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeline">Timeline</Label>
              <Input
                id="timeline"
                value={formData.timeline}
                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                placeholder="e.g., 3 months"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Location Preference *</Label>
              <Select
                value={formData.location_preference}
                onValueChange={(value: any) => setFormData({ ...formData, location_preference: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="australia_only">Australia Only</SelectItem>
                  <SelectItem value="international_ok">International OK</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Budget Range</Label>
              <Select
                value={formData.budget_range}
                onValueChange={(value: any) => setFormData({ ...formData, budget_range: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under_10k">Under $10k</SelectItem>
                  <SelectItem value="10k_50k">$10k - $50k</SelectItem>
                  <SelectItem value="50k_100k">$50k - $100k</SelectItem>
                  <SelectItem value="100k_plus">$100k+</SelectItem>
                  <SelectItem value="negotiable">Negotiable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Visibility *</Label>
            <Select
              value={formData.visibility}
              onValueChange={(value) => setFormData({ ...formData, visibility: value as BriefVisibility })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public (visible to all)</SelectItem>
                <SelectItem value="client_team_only">Client Team Only (contact via team)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.visibility === 'client_team_only' && (
            <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Label>Client Team Contact Information</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client_phone">Phone</Label>
                  <Input
                    id="client_phone"
                    value={formData.client_team_contact?.phone || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      client_team_contact: { ...formData.client_team_contact, phone: e.target.value }
                    })}
                    placeholder="+61..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client_email">Email</Label>
                  <Input
                    id="client_email"
                    type="email"
                    value={formData.client_team_contact?.email || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      client_team_contact: { ...formData.client_team_contact, email: e.target.value }
                    })}
                    placeholder="team@company.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="client_instructions">Instructions</Label>
                <Textarea
                  id="client_instructions"
                  value={formData.client_team_contact?.instructions || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    client_team_contact: { ...formData.client_team_contact, instructions: e.target.value }
                  })}
                  rows={2}
                  placeholder="Additional instructions for contacting your team..."
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="grid grid-cols-3 gap-2">
              {(['low_moq', 'sustainable', 'ethical_certified', 'fast_turnaround', 'custom_design'] as Tag[]).map((tag) => (
                <Button
                  key={tag}
                  type="button"
                  variant={formData.tags?.includes(tag) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    const tags = formData.tags || [];
                    setFormData({
                      ...formData,
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

          <div className="flex items-center space-x-2">
            <Checkbox
              id="nda_required"
              checked={formData.nda_required}
              onCheckedChange={(checked) => setFormData({ ...formData, nda_required: checked as boolean })}
            />
            <Label htmlFor="nda_required" className="cursor-pointer">
              NDA/Sensitivity required (high-level details only)
            </Label>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Posting...' : 'Post Brief'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

