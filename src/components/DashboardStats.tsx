import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar, Users, CreditCard, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  occupancyRate: number;
  activeGuests: number;
  monthlyGrowth: {
    bookings: number;
    revenue: number;
    occupancy: number;
  };
}

const DashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    totalRevenue: 0,
    occupancyRate: 0,
    activeGuests: 0,
    monthlyGrowth: { bookings: 0, revenue: 0, occupancy: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch current month data
      const currentMonth = new Date();
      const currentMonthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const currentMonthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      
      // Fetch previous month data for comparison
      const previousMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
      const previousMonthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0);

      // Total bookings
      const { data: allBookings } = await supabase
        .from('bookings')
        .select('*')
        .in('booking_status', ['confirmed', 'checked_in', 'checked_out']);

      // Current month bookings
      const { data: currentMonthBookings } = await supabase
        .from('bookings')
        .select('*')
        .in('booking_status', ['confirmed', 'checked_in', 'checked_out'])
        .gte('created_at', currentMonthStart.toISOString())
        .lte('created_at', currentMonthEnd.toISOString());

      // Previous month bookings
      const { data: previousMonthBookings } = await supabase
        .from('bookings')
        .select('*')
        .in('booking_status', ['confirmed', 'checked_in', 'checked_out'])
        .gte('created_at', previousMonth.toISOString())
        .lte('created_at', previousMonthEnd.toISOString());

      // Calculate revenue
      const totalRevenue = allBookings?.reduce((sum, booking) => sum + Number(booking.total_amount), 0) || 0;
      const currentMonthRevenue = currentMonthBookings?.reduce((sum, booking) => sum + Number(booking.total_amount), 0) || 0;
      const previousMonthRevenue = previousMonthBookings?.reduce((sum, booking) => sum + Number(booking.total_amount), 0) || 0;

      // Active guests (currently checked in)
      const { data: activeBookings } = await supabase
        .from('bookings')
        .select('num_guests')
        .eq('booking_status', 'checked_in');
      
      const activeGuests = activeBookings?.reduce((sum, booking) => sum + booking.num_guests, 0) || 0;

      // Get total rooms for occupancy calculation
      const { data: rooms } = await supabase
        .from('rooms')
        .select('*')
        .eq('is_active', true);

      const totalRooms = rooms?.length || 1;
      const occupiedRooms = activeBookings?.length || 0;
      const occupancyRate = Math.round((occupiedRooms / totalRooms) * 100);

      // Calculate growth rates
      const bookingGrowth = previousMonthBookings?.length ? 
        Math.round(((currentMonthBookings?.length || 0) - previousMonthBookings.length) / previousMonthBookings.length * 100) : 0;
      
      const revenueGrowth = previousMonthRevenue ? 
        Math.round((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue * 100) : 0;

      setStats({
        totalBookings: allBookings?.length || 0,
        totalRevenue,
        occupancyRate,
        activeGuests,
        monthlyGrowth: {
          bookings: bookingGrowth,
          revenue: revenueGrowth,
          occupancy: 0 // This would require historical data to calculate properly
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
              <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2"></div>
              <div className="h-3 w-24 bg-muted animate-pulse rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalBookings}</div>
          <p className="text-xs text-muted-foreground">
            {stats.monthlyGrowth.bookings > 0 ? '+' : ''}{stats.monthlyGrowth.bookings}% from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {stats.monthlyGrowth.revenue > 0 ? '+' : ''}{stats.monthlyGrowth.revenue}% from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.occupancyRate}%</div>
          <p className="text-xs text-muted-foreground">
            Current room occupancy
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Guests</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeGuests}</div>
          <p className="text-xs text-muted-foreground">
            Currently checked in
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;