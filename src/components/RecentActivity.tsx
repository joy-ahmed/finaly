const RecentActivity = () => {
  const activities = [
    { name: "Love Clip", category: "Restaurants", date: "29 Apr 1:33 PM", type: "Expenses", location: "Sauchob Terrace 87", amount: "-$32.0" },
    { name: "Septo Wolves", category: "Attractions", date: "29 Apr 10:33 AM", type: "Transactions", location: "Oban Ground 67", amount: "-$45.0" },
    { name: "Hearts", category: "Education", date: "29 Apr 7:33 AM", type: "Transactions", location: "Sauchob Terrace 87", amount: "-$43.0" },
    { name: "Starbucks coffee", category: "Restaurants", date: "29 Apr 12:35 AM", type: "Expenses", location: "Wootton Croft 1", amount: "-$10.1" },
    { name: "Beats Electronics", category: "Work", date: "28 Apr 8:53 AM", type: "Income", location: "Vestry Lane 43", amount: "+$1120.0" },
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-6 overflow-x-auto">
      <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
      <table className="w-full text-left table-auto">
        <thead>
          <tr>
            <th className="pb-2">Name</th>
            <th className="pb-2">Category</th>
            <th className="pb-2">Date</th>
            <th className="pb-2">Type</th>
            <th className="pb-2">Location</th>
            <th className="pb-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((act, i) => (
            <tr key={i} className="border-t border-gray-700">
              <td className="py-2">{act.name}</td>
              <td>{act.category}</td>
              <td>{act.date}</td>
              <td className={act.type === "Income" ? "text-green-400" : "text-red-400"}>{act.type}</td>
              <td>{act.location}</td>
              <td>{act.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentActivity;
