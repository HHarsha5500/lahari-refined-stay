import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Calendar, 
  BedDouble, 
  IndianRupee, 
  TrendingUp, 
  Clock,
  CheckCircle,
  XCircle,
  Shield,
  LogOut
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    occupancyRate: 0,
    pendingBookings: 0
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/admin-login");
      return;
    }
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      // Fetch bookings
      const { data: bookings, error: bookingsError } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (bookingsError) throw bookingsError;

      // Fetch rooms
      const { data: roomsData, error: roomsError } = await supabase
        .from("rooms")
        .select("*");

      if (roomsError) throw roomsError;

      // Calculate stats
      const totalBookings = bookings?.length || 0;
      const totalRevenue = bookings?.reduce((sum, booking) => sum + Number(booking.total_amount), 0) || 0;
      const pendingBookings = bookings?.filter(b => b.booking_status === 'pending').length || 0;
      const occupancyRate = roomsData?.length ? Math.round((totalBookings / roomsData.length) * 100) : 0;

      setStats({
        totalBookings,
        totalRevenue,
        occupancyRate,
        pendingBookings
      });

      setRecentBookings(bookings?.slice(0, 10) || []);
      setRooms(roomsData || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin-login");
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-500", text: "Pending" },
      confirmed: { color: "bg-green-500", text: "Confirmed" },
      cancelled: { color: "bg-red-500", text: "Cancelled" },
      checked_in: { color: "bg-blue-500", text: "Checked In" },
      checked_out: { color: "bg-gray-500", text: "Checked Out" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <Badge className={`${config.color} text-white`}>
        {config.text}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Hotel Management Dashboard</h1>
              <p className="text-sm text-muted-foreground">Welcome back, Admin</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={handleSignOut}
            className="flex items-center space-x-2 hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-elegant border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.totalBookings}</div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              <IndianRupee className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">₹{stats.totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Occupancy Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.occupancyRate}%</div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Bookings</CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.pendingBookings}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
            <TabsTrigger value="rooms">Room Management</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <Card className="shadow-elegant border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>Recent Bookings</span>
                </CardTitle>
                <CardDescription>Latest booking requests and confirmations</CardDescription>
              </CardHeader>
              <CardContent>
                {recentBookings.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No bookings found</p>
                ) : (
                  <div className="space-y-4">
                    {recentBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card/50 hover:bg-card transition-colors">
                        <div className="space-y-1">
                          <p className="font-medium text-foreground">{booking.guest_name}</p>
                          <p className="text-sm text-muted-foreground">{booking.guest_email}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(booking.check_in_date).toLocaleDateString()} - {new Date(booking.check_out_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right space-y-2">
                          {getStatusBadge(booking.booking_status)}
                          <p className="text-sm font-medium text-foreground">₹{Number(booking.total_amount).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rooms">
            <Card className="shadow-elegant border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BedDouble className="h-5 w-5 text-primary" />
                  <span>Room Management</span>
                </CardTitle>
                <CardDescription>Overview of all hotel rooms and their status</CardDescription>
              </CardHeader>
              <CardContent>
                {rooms.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No rooms found</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rooms.map((room) => (
                      <div key={room.id} className="p-4 rounded-lg border border-border/50 bg-card/50 hover:bg-card transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-foreground">{room.name}</h3>
                          {room.is_active ? (
                            <Badge className="bg-green-500 text-white">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          ) : (
                            <Badge className="bg-red-500 text-white">
                              <XCircle className="h-3 w-3 mr-1" />
                              Inactive
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{room.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Max: {room.max_guests} guests</span>
                          <span className="font-medium text-foreground">₹{Number(room.base_price).toLocaleString()}/night</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;