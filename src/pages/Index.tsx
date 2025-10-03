import { useAuth } from "@/contexts/AuthContext"; 
import { LoginPage } from "./LoginPage";
import { DashboardPage } from "./DashboardPage";
import { SuperAdminPage } from "./SuperAdminPage";

const Index = () => {
  const { usuario, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  console.log("Usuario actual:", usuario);
  if (usuario) {
    if (usuario.rol === "Administrador") {
      return <SuperAdminPage />;
    }

    return <DashboardPage />;
  }

  return <LoginPage />;
};

export default Index;

// import { useState } from "react";
// import { LoginPage } from "./LoginPage";
// import { DashboardPage } from "./DashboardPage";
// import { SuperAdminPage } from "./SuperAdminPage";

// const Index = () => {
//   const [user, setUser] = useState<any>(null);

//   const handleLogin = (userData: any) => {
//     setUser(userData);
//   };

//   const handleLogout = () => {
//     setUser(null);
//   };

//   if (user) {
//     if (user.role === "superadmin") {
//       return (
//         <SuperAdminPage 
//           user={user} 
//           onLogout={handleLogout}
//         />
//       );
//     }
    
//     return (
//       <DashboardPage 
//         user={user} 
//         onLogout={handleLogout}
//       />
//     );
//   }

//   return <LoginPage onLogin={handleLogin} />;
// };

// export default Index;
