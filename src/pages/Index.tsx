import { useState } from "react";
import { LoginPage } from "./LoginPage";
import { DashboardPage } from "./DashboardPage";
import { SuperAdminPage } from "./SuperAdminPage";

const Index = () => {
  const [user, setUser] = useState<any>(null);

  const handleLogin = (userData: any) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (user) {
    if (user.role === "superadmin") {
      return (
        <SuperAdminPage 
          user={user} 
          onLogout={handleLogout}
        />
      );
    }
    
    return (
      <DashboardPage 
        user={user} 
        onLogout={handleLogout}
      />
    );
  }

  return <LoginPage onLogin={handleLogin} />;
};

export default Index;
