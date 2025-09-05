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
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="basis-3/5">
          <StatsCard className="h-full"/>
        </div>
        <div className="basis-2/5">
          <DailyLimit className="h-full" />
        </div>
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
