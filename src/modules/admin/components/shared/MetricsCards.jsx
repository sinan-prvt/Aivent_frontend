export default function MetricsCards({ metrics }) {
  const metricCards = [
    {
      title: "Total Users",
      value: metrics.total_users,
      change: "+12%",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-6.197a4 4 0 00-4-4m4 4a4 4 0 010 8m-4-4a4 4 0 100-8" />
        </svg>
      ),
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      borderColor: "border-blue-500",
      textColor: "text-blue-600"
    },
    {
      title: "Vendors",
      value: metrics.total_vendors,
      change: "+8%",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: "bg-gradient-to-r from-green-500 to-green-600",
      borderColor: "border-green-500",
      textColor: "text-green-600"
    },
    {
      title: "Pending Approval",
      value: metrics.awaiting_vendor_approval,
      change: null,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "bg-gradient-to-r from-amber-500 to-amber-600",
      borderColor: "border-amber-500",
      textColor: "text-amber-600"
    },
    {
      title: "Active Users",
      value: metrics.active_users,
      change: "+5%",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      borderColor: "border-purple-500",
      textColor: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricCards.map((card, index) => (
        <div 
          key={index} 
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-lg ${card.color} bg-opacity-10`}>
              <div className={card.textColor}>
                {card.icon}
              </div>
            </div>
            {card.change && (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                card.change.startsWith('+') 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {card.change.startsWith('+') ? (
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {card.change}
              </span>
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-3xl font-bold text-gray-900">{card.value}</h3>
            <p className="text-gray-600 font-medium">{card.title}</p>
            <p className="text-gray-500 text-sm">
              {card.title === "Total Users" && "Registered platform users"}
              {card.title === "Vendors" && "Approved vendors"}
              {card.title === "Pending Approval" && "Vendors awaiting approval"}
              {card.title === "Active Users" && "Users active in last 30 days"}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="text-xs text-gray-500">
              Updated just now
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}