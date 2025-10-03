import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { DocumentsTable } from "@/components/dashboard/DocumentsTable";
import { useAuth } from "@/contexts/AuthContext";
import { useUsers } from "@/hooks/useUsers"; // importa tu hook

export const DashboardPage = () => {
  const { usuario, signOut } = useAuth();
  const { users, loading } = useUsers();

  if (!usuario || loading) return null;

  // Obtener los workspaces del usuario actual
  const userWorkspaces = users.find(u => u.id === usuario.id)?.workspaces.map(w => ({
    id: w.workspace_id,
    name: w.workspace_name
  })) || [];

  // Datos simulados de estadísticas
  const mockStats = {
    totalDocuments: 1247,
    activeDocuments: 1139,
    expiredDocuments: 23,
    expiringDocuments: 85,
    totalValue: 15750000000, // 15.75 mil millones COP
    monthlyGrowth: 12.5
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      <DashboardHeader 
        user={usuario} 
        workspaces={userWorkspaces}  // ✅ le pasamos los workspaces reales
        onLogout={signOut} 
      />
      
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Tarjetas de estadísticas */}
        <StatsCards stats={mockStats} />
        
        {/* Tabla de documentos */}
        <DocumentsTable />
      </main>
    </div>
  );
};

// import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
// import { StatsCards } from "@/components/dashboard/StatsCards";
// import { DocumentsTable } from "@/components/dashboard/DocumentsTable";

// interface DashboardPageProps {
//   user: {
//     name: string;
//     email: string;
//     role: "admin" | "viewer";
//     workspace: string;
//     clientId: string;
//   };
//   onLogout: () => void;
// }

// export const DashboardPage = ({ user, onLogout }: DashboardPageProps) => {
//   // Datos simulados de estadísticas
//   const mockStats = {
//     totalDocuments: 1247,
//     activeDocuments: 1139,
//     expiredDocuments: 23,
//     expiringDocuments: 85,
//     totalValue: 15750000000 // 15.75 mil millones COP
//   };

//   return (
//     <div className="min-h-screen bg-gradient-background">
//       <DashboardHeader user={user} onLogout={onLogout} />
      
//       <main className="container mx-auto px-6 py-8 space-y-8">
//         {/* Tarjetas de estadísticas - Solo para administradores */}
//         {user.role === "admin" && <StatsCards stats={mockStats} />}
        
//         {/* Tabla de documentos */}
//         <DocumentsTable userRole={user.role} />
//       </main>
//     </div>
//   );
// };