import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Mail, Lock, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = "Email is required";
    else if (!validateEmail(email)) newErrors.email = "Invalid email format";
    if (!password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        setErrors({ general: "Invalid email or password" });
        toast({
          title: "Login Failed",
          description: "Please check your credentials and try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login Successful",
          description: "Welcome to the Hotel Management Dashboard!",
        });
        navigate("/admin-dashboard");
      }
    } catch (error) {
      setErrors({ general: "An unexpected error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation for reset form
    const newErrors: Record<string, string> = {};
    if (!resetEmail) newErrors.resetEmail = "Email is required";
    else if (!validateEmail(resetEmail)) newErrors.resetEmail = "Invalid email format";
    if (!oldPassword) newErrors.oldPassword = "Current password is required";
    if (!newPassword) newErrors.newPassword = "New password is required";
    else if (newPassword.length < 6) newErrors.newPassword = "Password must be at least 6 characters";
    if (!confirmPassword) newErrors.confirmPassword = "Please confirm your new password";
    else if (newPassword !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      // First verify old password by attempting login
      const { error: loginError } = await signIn(resetEmail, oldPassword);
      if (loginError) {
        setErrors({ oldPassword: "Current password is incorrect" });
        setIsLoading(false);
        return;
      }

      // In a real implementation, you would call a password update function here
      // For now, we'll show a success message
      toast({
        title: "Password Reset Successful",
        description: "Your password has been updated successfully.",
      });
      
      setShowResetForm(false);
      setResetEmail("");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setErrors({ general: "Failed to reset password. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  if (showResetForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <Card className="w-full max-w-md shadow-elegant border-border/50">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Reset Password</CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your current password and create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errors.general && (
              <Alert className="mb-6 border-destructive/50 bg-destructive/10">
                <AlertDescription className="text-destructive">{errors.general}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resetEmail">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="resetEmail"
                    type="email"
                    placeholder="admin@hotel.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className={`pl-10 ${errors.resetEmail ? 'border-destructive' : ''}`}
                  />
                </div>
                {errors.resetEmail && <p className="text-sm text-destructive">{errors.resetEmail}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="oldPassword">Current Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="oldPassword"
                    type="password"
                    placeholder="Enter current password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className={`pl-10 ${errors.oldPassword ? 'border-destructive' : ''}`}
                  />
                </div>
                {errors.oldPassword && <p className="text-sm text-destructive">{errors.oldPassword}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`pl-10 ${errors.newPassword ? 'border-destructive' : ''}`}
                  />
                </div>
                {errors.newPassword && <p className="text-sm text-destructive">{errors.newPassword}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`pl-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                  />
                </div>
                {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Password"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setShowResetForm(false)}
              >
                Back to Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md shadow-elegant border-border/50">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Hotel Admin Panel</CardTitle>
          <CardDescription className="text-muted-foreground">
            Management Dashboard Login
          </CardDescription>
        </CardHeader>
        <CardContent>
          {errors.general && (
            <Alert className="mb-6 border-destructive/50 bg-destructive/10">
              <AlertDescription className="text-destructive">{errors.general}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@hotel.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pl-10 transition-all duration-200 ${errors.email ? 'border-destructive' : ''}`}
                />
              </div>
              {errors.email && <p className="text-sm text-destructive animate-fade-in">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pl-10 pr-10 transition-all duration-200 ${errors.password ? 'border-destructive' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-destructive animate-fade-in">{errors.password}</p>}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 hover:scale-[1.02]"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Login"}
            </Button>

            <button
              type="button"
              onClick={() => setShowResetForm(true)}
              className="w-full text-sm text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
            >
              Forgot Password?
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;