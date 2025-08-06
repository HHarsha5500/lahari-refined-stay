import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Mail, User, Calendar, Phone, MessageSquare } from 'lucide-react';

interface ContactMessage {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  message_type: string;
  status: string;
  created_at: string;
  user_id?: string;
}

const MessagesManagement = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error loading messages",
        description: "Failed to load contact messages.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateMessageStatus = async (messageId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status: newStatus })
        .eq('id', messageId);

      if (error) throw error;

      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, status: newStatus } : msg
        )
      );

      if (selectedMessage && selectedMessage.id === messageId) {
        setSelectedMessage({ ...selectedMessage, status: newStatus });
      }

      toast({
        title: "Status updated",
        description: `Message marked as ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating message status:', error);
      toast({
        title: "Error updating status",
        description: "Failed to update message status.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread':
        return 'bg-red-100 text-red-800';
      case 'read':
        return 'bg-blue-100 text-blue-800';
      case 'replied':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Messages</p>
                <p className="text-2xl font-bold">{messages.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Unread</p>
                <p className="text-2xl font-bold">
                  {messages.filter(m => m.status === 'unread').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Replied</p>
                <p className="text-2xl font-bold">
                  {messages.filter(m => m.status === 'replied').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages List */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Messages</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No messages found
                </div>
              ) : (
                <div className="space-y-2 p-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedMessage?.id === message.id
                          ? 'border-gold-500 bg-gold-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedMessage(message)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-sm">
                            {message.first_name} {message.last_name}
                          </h4>
                          <p className="text-xs text-gray-600">{message.email}</p>
                        </div>
                        <Badge className={getStatusColor(message.status)}>
                          {message.status}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium mb-1">{message.subject}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(message.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Message Details */}
        <Card>
          <CardHeader>
            <CardTitle>Message Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedMessage ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">From</label>
                    <p className="font-semibold">
                      {selectedMessage.first_name} {selectedMessage.last_name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Date</label>
                    <p>{formatDate(selectedMessage.created_at)}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p>{selectedMessage.email}</p>
                </div>

                {selectedMessage.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <p>{selectedMessage.phone}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-600">Subject</label>
                  <p className="font-semibold">{selectedMessage.subject}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Message</label>
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>

                <div className="flex space-x-2 pt-4 border-t">
                  {selectedMessage.status === 'unread' && (
                    <Button
                      onClick={() => updateMessageStatus(selectedMessage.id, 'read')}
                      variant="outline"
                      size="sm"
                    >
                      Mark as Read
                    </Button>
                  )}
                  {selectedMessage.status !== 'replied' && (
                    <Button
                      onClick={() => updateMessageStatus(selectedMessage.id, 'replied')}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Mark as Replied
                    </Button>
                  )}
                  {selectedMessage.status === 'replied' && (
                    <Button
                      onClick={() => updateMessageStatus(selectedMessage.id, 'read')}
                      variant="outline"
                      size="sm"
                    >
                      Mark as Read
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Select a message to view details
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MessagesManagement;