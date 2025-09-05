import StatsCard from "./StatsCard";
import DailyLimit from "./DailyLimit";
import ExpensesSummary from "./ExpensesSummary";
import Cards from "./Cards";
import RecentActivity from "./RecentActivity";
import { useAuthStore } from "@/stores/authStore";
import { CreateTransactionDialog } from "./CreateTransactionDialog";

const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-semibold">Hello, {user?.username}</h2>
        <CreateTransactionDialog />
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <StatsCard />
        <DailyLimit />
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ExpensesSummary />
        <Cards />
      </div>

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
};

export default Dashboard;
