const DailyLimit = () => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 col-span-1">
      <h3 className="text-lg font-medium mb-2">Daily Limit</h3>
      <p className="text-sm mb-4">
        You're 75% through your budget. Review expenses to avoid overspending.
      </p>
      <div className="flex justify-between mb-2">
        <span>Spent $150</span>
        <span>Left $50</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-4">
        <div className="bg-blue-500 h-4 rounded-full w-3/4"></div>
      </div>
    </div>
  );
};

export default DailyLimit;
