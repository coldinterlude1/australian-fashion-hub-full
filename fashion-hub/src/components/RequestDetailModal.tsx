import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, User, Mail, Phone, MessageCircle, ThumbsUp, Send as SendIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import ContactUserModal from "./ContactUserModal";

const categoryColors: Record<string, string> = {
  "Suppliers Needed": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Materials & Resources": "bg-purple-50 text-purple-700 border-purple-200",
  "Technical Help": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Collaboration": "bg-amber-50 text-amber-700 border-amber-200",
  "Manufacturing": "bg-rose-50 text-rose-700 border-rose-200",
  "Other": "bg-gray-50 text-gray-700 border-gray-200"
};

const statusColors: Record<string, string> = {
  "Open": "bg-green-50 text-green-700 border-green-200",
  "In Progress": "bg-blue-50 text-blue-700 border-blue-200",
  "Resolved": "bg-gray-50 text-gray-600 border-gray-200"
};

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

interface Comment {
  id: string;
  author_name: string;
  author_email?: string;
  content: string;
  can_help: boolean;
  created_date: string;
}

interface RequestDetailModalProps {
  request: Request;
  onClose: () => void;
}

export default function RequestDetailModal({ request, onClose }: RequestDetailModalProps) {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [contactingUser, setContactingUser] = useState<{ email: string; name: string } | null>(null);
  const [commentData, setCommentData] = useState({
    author_name: '',
    author_email: '',
    content: '',
    can_help: false
  });

  const queryClient = useQueryClient();

  const { data: comments = [] } = useQuery<Comment[]>({
    queryKey: ['comments', request.id],
    queryFn: () => base44.entities.Comment.filter({ request_id: request.id }, '-created_date'),
  });

  const createCommentMutation = useMutation({
    mutationFn: (data: typeof commentData) => base44.entities.Comment.create({ ...data, request_id: request.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', request.id] });
      setCommentData({ author_name: '', author_email: '', content: '', can_help: false });
      setShowCommentForm(false);
      toast.success('Response posted successfully!');
    },
  });

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    createCommentMutation.mutate(commentData);
  };

  const helpersCount = comments.filter(c => c.can_help).length;

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className={`${categoryColors[request.category] || ''} border font-normal px-3 py-1 rounded-full text-xs`}>
                    {request.category}
                  </Badge>
                  <Badge variant="outline" className={`${statusColors[request.status] || ''} border font-normal px-3 py-1 rounded-full text-xs`}>
                    {request.status}
                  </Badge>
                </div>
                <DialogTitle className="playfair text-3xl font-bold leading-tight pr-8 mb-1">
                  {request.title}
                </DialogTitle>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            {/* Request Details */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">Description</h3>
                <p className="text-gray-700 leading-relaxed text-base">{request.description}</p>
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {request.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{request.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(request.created_date), "MMM d, yyyy")}</span>
                </div>
              </div>

              {/* Contact Info */}
              {(request.contact_name || request.contact_email || request.contact_phone) && (
                <div className="bg-gray-50 rounded-xl p-5 space-y-3 border border-gray-200">
                  <h4 className="font-semibold text-sm text-gray-900 uppercase tracking-wide">Contact Information</h4>
                  {request.contact_name && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4" />
                      <span>{request.contact_name}</span>
                    </div>
                  )}
                  {request.contact_email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{request.contact_email}</span>
                    </div>
                  )}
                  {request.contact_phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{request.contact_phone}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Comments Section */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <h3 className="playfair font-semibold text-2xl flex items-center gap-2">
                    <MessageCircle className="w-6 h-6" />
                    Community Responses
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {comments.length} {comments.length === 1 ? 'response' : 'responses'}
                    </span>
                    {helpersCount > 0 && (
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        <ThumbsUp className="w-3 h-3 mr-1" />
                        {helpersCount} can help
                      </Badge>
                    )}
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowCommentForm(!showCommentForm)}
                  className="rounded-full px-4"
                >
                  {showCommentForm ? 'Cancel' : 'Add a Response'}
                </Button>
              </div>

              {/* Comment Form */}
              {showCommentForm && (
                <form onSubmit={handleSubmitComment} className="bg-gray-50 rounded-xl p-6 mb-6 space-y-4 border border-gray-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="author_name">Your Name *</Label>
                      <Input
                        id="author_name"
                        value={commentData.author_name}
                        onChange={(e) => setCommentData({...commentData, author_name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="author_email">Your Email</Label>
                      <Input
                        id="author_email"
                        type="email"
                        value={commentData.author_email}
                        onChange={(e) => setCommentData({...commentData, author_email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Your Response *</Label>
                    <Textarea
                      id="content"
                      value={commentData.content}
                      onChange={(e) => setCommentData({...commentData, content: e.target.value})}
                      placeholder="Share your thoughts, suggestions, or offer to help..."
                      required
                      rows={4}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="can_help"
                      checked={commentData.can_help}
                      onCheckedChange={(checked) => setCommentData({...commentData, can_help: checked})}
                    />
                    <Label htmlFor="can_help" className="text-sm cursor-pointer">
                      I can help with this request
                    </Label>
                  </div>
                  <Button type="submit" disabled={createCommentMutation.isPending}>
                    <SendIcon className="w-4 h-4 mr-2" />
                    {createCommentMutation.isPending ? 'Posting...' : 'Post Response'}
                  </Button>
                </form>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="border border-gray-200 rounded-xl p-5 bg-white hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{comment.author_name}</p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(comment.created_date), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {comment.can_help && (
                          <Badge className="bg-green-100 text-green-700">
                            <ThumbsUp className="w-3 h-3 mr-1" />
                            Can Help
                          </Badge>
                        )}
                        {comment.author_email && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setContactingUser({
                              email: comment.author_email!,
                              name: comment.author_name
                            })}
                          >
                            <Mail className="w-3 h-3 mr-1" />
                            Contact
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">{comment.content}</p>
                  </div>
                ))}
                {comments.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No responses yet. Be the first to respond!</p>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {contactingUser && (
        <ContactUserModal
          recipientEmail={contactingUser.email}
          recipientName={contactingUser.name}
          requestTitle={request.title}
          onClose={() => setContactingUser(null)}
        />
      )}
    </>
  );
}

