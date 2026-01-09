import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Send } from "lucide-react";

interface ContactUserModalProps {
  recipientEmail: string;
  recipientName: string;
  requestTitle: string;
  onClose: () => void;
}

export default function ContactUserModal({ recipientEmail, recipientName, requestTitle, onClose }: ContactUserModalProps) {
  const [messageData, setMessageData] = useState({
    sender_name: '',
    sender_email: '',
    subject: `Re: ${requestTitle}`,
    message: ''
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (data: typeof messageData) => {
      // Stub implementation - replace with actual API call
      console.log('Sending email:', { to: recipientEmail, ...data });
      // await base44.integrations.Core.SendEmail({
      //   to: recipientEmail,
      //   subject: data.subject,
      //   body: `From: ${data.sender_name} (${data.sender_email})\n\n${data.message}`
      // });
    },
    onSuccess: () => {
      toast.success('Message sent successfully!');
      onClose();
    },
    onError: () => {
      toast.error('Failed to send message');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessageMutation.mutate(messageData);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="playfair">Send Message to {recipientName}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-900">
            <p className="font-medium">About: {requestTitle}</p>
            <p className="text-blue-700">To: {recipientEmail}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sender_name" className="text-sm font-medium">Your Name *</Label>
            <Input
              id="sender_name"
              value={messageData.sender_name}
              onChange={(e) => setMessageData({...messageData, sender_name: e.target.value})}
              placeholder="Your full name"
              required
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sender_email" className="text-sm font-medium">Your Email *</Label>
            <Input
              id="sender_email"
              type="email"
              value={messageData.sender_email}
              onChange={(e) => setMessageData({...messageData, sender_email: e.target.value})}
              placeholder="your@email.com"
              required
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" className="text-sm font-medium">Subject *</Label>
            <Input
              id="subject"
              value={messageData.subject}
              onChange={(e) => setMessageData({...messageData, subject: e.target.value})}
              placeholder="Subject"
              required
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium">Message *</Label>
            <Textarea
              id="message"
              value={messageData.message}
              onChange={(e) => setMessageData({...messageData, message: e.target.value})}
              placeholder="Write your message..."
              required
              rows={5}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={sendMessageMutation.isPending}>
              <Send className="w-4 h-4 mr-2" />
              {sendMessageMutation.isPending ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

