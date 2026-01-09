import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

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
}

interface RequestCardProps {
  request: Request;
  onClick: () => void;
}

export default function RequestCard({ request, onClick }: RequestCardProps) {
  const { data: comments = [] } = useQuery({
    queryKey: ['comments', request.id],
    queryFn: () => base44.entities.Comment.filter({ request_id: request.id })
  });

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Card
      onClick={onClick}
      className="hover:shadow-xl hover:border-gray-300 transition-all duration-300 border-gray-200 rounded-xl overflow-hidden cursor-pointer group bg-white">

      <CardHeader className="pb-4">
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline" className={`${categoryColors[request.category] || ''} border font-normal px-2.5 py-0.5 rounded-full text-xs`}>
            {request.category}
          </Badge>
          <Badge variant="outline" className={`${statusColors[request.status] || ''} border font-normal px-2.5 py-0.5 rounded-full text-xs`}>
            {request.status}
          </Badge>
        </div>
        <CardTitle className="playfair text-[#3D3935] text-xl font-bold tracking-tight leading-tight group-hover:text-blue-600 transition-colors">{request.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-700 text-sm leading-relaxed">
          {truncateText(request.description, 150)}
        </p>
        
        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-gray-500">
              {request.location &&
              <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{request.location}</span>
                </div>
              }
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{format(new Date(request.created_date), "MMM d")}</span>
              </div>
            </div>
            {comments.length > 0 &&
            <div className="flex items-center gap-1 text-xs text-blue-600">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{comments.length}</span>
              </div>
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

