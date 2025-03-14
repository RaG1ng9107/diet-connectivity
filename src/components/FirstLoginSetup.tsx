
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Loader2, Mail, Lock } from 'lucide-react';

const FirstLoginSetup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, completeFirstLoginSetup } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: 'Email Required',
        description: 'Please enter your email address',
        variant: 'destructive',
      });
      return;
    }
    
    if (!newPassword.trim()) {
      toast({
        title: 'Password Required',
        description: 'Please enter a new password',
        variant: 'destructive',
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Passwords Don\'t Match',
        description: 'Please make sure your passwords match',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await completeFirstLoginSetup(email, newPassword);
      
      toast({
        title: 'Account Setup Complete',
        description: 'Your account has been set up successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to set up your account',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Welcome to NutriTrack</CardTitle>
        <CardDescription>
          Complete your account setup to get started. You'll need to set a new password and add your email.
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="new-password"
                type="password"
                placeholder="Create a strong password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pl-9"
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-9"
                disabled={isLoading}
              />
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting Up...
              </>
            ) : (
              'Complete Setup'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default FirstLoginSetup;
