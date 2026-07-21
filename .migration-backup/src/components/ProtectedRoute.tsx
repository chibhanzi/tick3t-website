
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOrganizer?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireOrganizer = false }) => {
  const { isAuthenticated, isOrganizer, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requireOrganizer && !isOrganizer) {
    return <Navigate to="/upgrade-to-organizer" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
