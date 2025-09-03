const Cards = () => {
  const cards = [
    { name: "Revolut", color: "bg-green-500", last4: "0965" },
    { name: "Revolut", color: "bg-red-500", last4: "0805" },
    { name: "Monobank", color: "bg-purple-500", last4: "8987", balance: "$5000.00" },
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-medium mb-4">Your Cards</h3>
      <ul className="space-y-3">
        {cards.map((card, index) => (
          <li key={index} className={`p-4 rounded-lg flex justify-between ${card.color}`}>
            <span>{card.name}</span>
            <span>{card.balance ? card.balance : `•••• ${card.last4}`}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Cards;
