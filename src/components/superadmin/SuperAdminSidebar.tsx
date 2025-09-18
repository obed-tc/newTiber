import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  BarChart3, 
  Shield 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SuperAdminSidebarProps {
  currentView: string;
  onViewChange: (view: "dashboard" | "workspaces" | "users" | "stats") => void;
}

const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Vista general"
  },
  {
    id: "workspaces",
    label: "Workspaces",
    icon: Building2,
    description: "Gestión de empresas"
  },
  {
    id: "users",
    label: "Usuarios",
    icon: Users,
    description: "Gestión de usuarios"
  },
  {
    id: "stats",
    label: "Estadísticas",
    icon: BarChart3,
    description: "Métricas del sistema"
  }
];

export const SuperAdminSidebar = ({ currentView, onViewChange }: SuperAdminSidebarProps) => {
  return (
    <Sidebar className="w-64" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2 px-2">
            <Shield className="h-4 w-4 text-primary" />
            <span>SuperAdmin</span>
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id} className="mb-2">
                  <SidebarMenuButton 
                    onClick={() => onViewChange(item.id as any)}
                    className={cn(
                      "w-full justify-start transition-all duration-200 hover:bg-accent/50",
                      currentView === item.id && "bg-accent text-accent-foreground font-medium py-3 px-4 shadow-sm"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <div className="flex flex-col items-start">
                      <span>{item.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {item.description}
                      </span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};