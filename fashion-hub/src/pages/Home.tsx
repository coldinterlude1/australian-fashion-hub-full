import { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Filter, Users, ArrowUpDown, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import RequestCard from "@/components/RequestCard";
import SubmitRequestForm from "@/components/SubmitRequestForm";
import RequestDetailModal from "@/components/RequestDetailModal";
import RotatingText from "@/components/RotatingText";
import { toast } from "sonner";

interface Request {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  location?: string;
  created_date: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
}

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('-created_date');

  const queryClient = useQueryClient();

  // Map sort values to display labels
  const getSortLabel = (value: string): string => {
    const sortLabels: Record<string, string> = {
      '-created_date': 'Newest First',
      'created_date': 'Oldest First',
      'title': 'Title A-Z',
      '-title': 'Title Z-A'
    };
    return sortLabels[value] || value;
  };

  const scrollToContact = () => {
    document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const { data: requests = [], isLoading } = useQuery<Request[]>({
    queryKey: ['requests', sortBy],
    queryFn: () => base44.entities.Request.list(sortBy)
  });

  const createRequestMutation = useMutation({
    mutationFn: (data: Partial<Request>) => base44.entities.Request.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      setShowForm(false);
      toast.success('Request submitted successfully!');
    }
  });

  const filteredRequests = requests.filter((request) => {
    const matchesSearch = searchQuery === '' ||
    request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || request.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-[#e8e4d8] text-[#3D3935] overflow-hidden">
        <div className="relative max-w-2xl mx-auto px-6 py-16 md:py-20">
          <div className="flex flex-col items-center text-center">
            <p className="text-xs text-gray-600 mb-4 tracking-widest uppercase">
              Connecting fashion professionals
            </p>
            <h1 className="playfair text-3xl md:text-4xl font-bold mb-8 leading-tight tracking-tight">
              Australian Fashion Hub
            </h1>
            <div className="mb-8">
              <RotatingText onClick={scrollToContact} />
            </div>
            <button
              onClick={scrollToContact}
              className="text-gray-500 hover:text-gray-700 transition-colors animate-bounce"
              aria-label="Scroll to content"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="w-full bg-[#FAF8F3] px-6 py-12">
        <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <Button
              onClick={() => setShowForm(!showForm)}
              size="lg" className="bg-[#3D3935] text-white px-8 py-0.5 text-sm font-medium tracking-tight leading-relaxed rounded-lg h-12 hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            {showForm ? 'View All Requests' : 'Submit New Request'}
          </Button>
          <Link to={createPageUrl('Professionals')}>
            <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 font-medium text-sm rounded-lg w-full sm:w-auto">
              <Users className="w-4 h-4 mr-2" />
              Browse Professionals
            </Button>
          </Link>
        </div>

        {/* Form or Requests List */}
        {showForm ?
          <div>
            <SubmitRequestForm
              onSubmit={(data) => createRequestMutation.mutate(data)}
              isSubmitting={createRequestMutation.isPending} />
          </div> :
          <>
            {/* Search and Filters */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search requests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-10 bg-white border-gray-300 rounded-md text-sm" />
                </div>
                
                <div className="flex gap-3">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-44 h-10 bg-white border-gray-300 rounded-md text-sm">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Suppliers Needed">Suppliers Needed</SelectItem>
                      <SelectItem value="Materials & Resources">Materials & Resources</SelectItem>
                      <SelectItem value="Technical Help">Technical Help</SelectItem>
                      <SelectItem value="Collaboration">Collaboration</SelectItem>
                      <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-36 h-10 bg-white border-gray-300 rounded-md text-sm">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-36 h-10 bg-white border-gray-300 rounded-md text-sm">
                      <div className="flex items-center gap-2 flex-1">
                        <ArrowUpDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <SelectValue placeholder="Sort">
                          {getSortLabel(sortBy)}
                        </SelectValue>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="-created_date">Newest First</SelectItem>
                      <SelectItem value="created_date">Oldest First</SelectItem>
                      <SelectItem value="title">Title A-Z</SelectItem>
                      <SelectItem value="-title">Title Z-A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-8">
              <h2 className="playfair text-[#3D3935] text-3xl font-semibold mb-2">All Requests</h2>
              <p className="text-gray-600 text-sm">
                {filteredRequests.length} {filteredRequests.length === 1 ? 'request' : 'requests'}
              </p>
            </div>

            {/* Requests Grid */}
            {isLoading ?
            <div className="text-center py-20">
                <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 mt-4">Loading requests...</p>
              </div> :
            filteredRequests.length === 0 ?
            <div className="text-center py-20">
                <p className="text-gray-500 text-xl">No requests found. Be the first to submit one!</p>
              </div> :
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredRequests.map((request) =>
              <RequestCard
                key={request.id}
                request={request}
                onClick={() => setSelectedRequest(request)} />
              )}
              </div>
            }
            
            {selectedRequest &&
            <RequestDetailModal
              request={selectedRequest}
              onClose={() => setSelectedRequest(null)} />
            }
          </>
          }
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact-section" className="bg-[#e8e4d8] py-16 w-full">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left Column - Request a Meeting */}
            <div>
              <h2 className="playfair text-[#3D3935] text-2xl font-light tracking-wide mb-8">REQUEST A MEETING</h2>
              <form className="space-y-6">
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full bg-transparent border-b border-[#3D3935] pb-2 text-[#3D3935] placeholder-gray-600 focus:outline-none focus:border-[#3D3935]" />

                <input
                  type="email"
                  placeholder="E-mail"
                  className="w-full bg-transparent border-b border-[#3D3935] pb-2 text-[#3D3935] placeholder-gray-600 focus:outline-none focus:border-[#3D3935]" />

                <select className="w-full bg-transparent border-b border-[#3D3935] pb-2 text-gray-600 focus:outline-none focus:border-[#3D3935]">
                  <option>Choose country</option>
                  <option>Australia</option>
                  <option>New Zealand</option>
                  <option>China</option>
                  <option>Vietnam</option>
                  <option>Thailand</option>
                  <option>India</option>
                  <option>Bangladesh</option>
                  <option>Indonesia</option>
                  <option>Philippines</option>
                  <option>Cambodia</option>
                  <option>Myanmar</option>
                  <option>Malaysia</option>
                  <option>Singapore</option>
                  <option>South Korea</option>
                  <option>Japan</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Italy</option>
                  <option>France</option>
                  <option>Germany</option>
                  <option>Spain</option>
                  <option>Portugal</option>
                  <option>Turkey</option>
                  <option>Morocco</option>
                  <option>South Africa</option>
                  <option>Brazil</option>
                  <option>Mexico</option>
                  <option>Canada</option>
                  <option>Other</option>
                </select>
                <input
                  type="tel"
                  placeholder="Phone number"
                  className="w-full bg-transparent border-b border-[#3D3935] pb-2 text-[#3D3935] placeholder-gray-600 focus:outline-none focus:border-[#3D3935]" />

                <input
                  type="text"
                  placeholder="Service Interested"
                  className="w-full bg-transparent border-b border-[#3D3935] pb-2 text-[#3D3935] placeholder-gray-600 focus:outline-none focus:border-[#3D3935]" />

                <button
                  type="submit"
                  className="playfair w-full border border-[#3D3935] text-[#3D3935] py-3 font-light tracking-wide hover:bg-[#3D3935] hover:text-white transition-colors">
                  REQUEST A MEETING
                </button>
              </form>
            </div>

            {/* Right Column - Contact Info */}
            <div>
              <h2 className="playfair text-[#3D3935] text-2xl font-light tracking-wide mb-8">CONTACT</h2>
              <div className="space-y-8">
                <div>
                  <h3 className="playfair text-[#3D3935] font-light text-lg mb-3">Locations</h3>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    Australian Fashion Hub operates across three key fashion hubs, with dedicated teams in Melbourne, Shanghai, and Hangzhou ready to support your manufacturing needs locally and internationally.
                  </p>
                </div>
                <div>
                  <h3 className="playfair text-[#3D3935] font-light text-lg mb-3">Contact</h3>
                  <p className="text-gray-700 text-sm">
                    sinba@188.com • +61 4923 66888
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

