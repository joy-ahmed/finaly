const ExpensesSummary = () => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 lg:col-span-2">
      <h3 className="text-lg font-medium mb-4">Expenses Summary</h3>
      <ul className="space-y-2">
        <li className="flex justify-between"><span>Rent</span><span>$1750.89</span></li>
        <li className="flex justify-between"><span>Restaurants</span><span>$375</span></li>
        <li className="flex justify-between"><span>Education</span><span>$225</span></li>
        <li className="flex justify-between"><span>Car</span><span>$105</span></li>
        <li className="flex justify-between"><span>Vacation</span><span>$45</span></li>
      </ul>
    </div>
  );
};

export default ExpensesSummary;
