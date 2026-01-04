  // import React, { useState } from "react";
  // import { Link, useNavigate } from "react-router-dom";
  // import Navbar from "../../../components/layout/Navbar";
  // import { useAuth } from "../../../app/providers/AuthProvider";

  // export default function Home() {
  //   const { user } = useAuth();
  //   const navigate = useNavigate();
  //   const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  //   const [selectedCategories, setSelectedCategories] = useState([]);
  //   const [eventData, setEventData] = useState({
  //     eventType: "Wedding",
  //     budget: "",
  //     guests: ""
  //   });

  //   console.log("Modal state:", showCategoriesModal); // Debug log

  //   const goToDashboard = () => {
  //     if (!user) return navigate("/login");
  //     if (user.role === "admin") return navigate("/admin", { replace: true });
  //     if (user.role === "vendor") return navigate("/vendor/dashboard", { replace: true });
  //     return navigate("/", { replace: true });
  //   };

  //   const handleStartPlanning = (e) => {
  //     e.preventDefault();
  //     console.log("Start Planning clicked");
  //     console.log("Event Data:", eventData);
  //     setShowCategoriesModal(true);
  //   };

  //   const handleCategoryChange = (category) => {
  //     if (selectedCategories.includes(category)) {
  //       setSelectedCategories(selectedCategories.filter(c => c !== category));
  //     } else {
  //       setSelectedCategories([...selectedCategories, category]);
  //     }
  //   };

  //   const handleGeneratePlan = () => {
  //     console.log("Generating plan with:", {
  //       eventData,
  //       selectedCategories
  //     });
      
  //     // Close modal
  //     setShowCategoriesModal(false);
  //     setSelectedCategories([]);
      
  //     // Navigate based on authentication
  //     if (user) {
  //       navigate("/dashboard/plan", { 
  //         state: { 
  //           eventData, 
  //           categories: selectedCategories 
  //         } 
  //       });
  //     } else {
  //       navigate("/register", { 
  //         state: { 
  //           eventData, 
  //           categories: selectedCategories 
  //         } 
  //       });
  //     }
  //   };

  //   const eventCategories = [
  //     "Venue",
  //     "Catering",
  //     "Food",
  //     "Stage",
  //     "Lighting",
  //     "Entertainment",
  //     "Invitations",
  //     "Decor"
  //   ];

  //   return (
  //     <div className="min-h-screen bg-white text-gray-900 relative">
  //       <Navbar />

  //       {/* Categories Modal - Now properly positioned */}
  //       {showCategoriesModal && (
  //         <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black bg-opacity-50">
  //           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fadeIn">
  //             <div className="flex justify-between items-center mb-6">
  //               <h3 className="text-2xl font-bold text-gray-900">
  //                 What do you need to plan?
  //               </h3>
  //               <button
  //                 onClick={() => setShowCategoriesModal(false)}
  //                 className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
  //                 aria-label="Close"
  //               >
  //                 &times;
  //               </button>
  //             </div>
              
  //             <p className="text-gray-600 mb-6 text-lg">
  //               Select the categories you need help with.
  //             </p>
              
  //             <div className="space-y-4 mb-8">
  //               {eventCategories.map((category) => (
  //                 <div key={category} className="flex items-center">
  //                   <input
  //                     type="checkbox"
  //                     id={`category-${category.toLowerCase()}`}
  //                     checked={selectedCategories.includes(category)}
  //                     onChange={() => handleCategoryChange(category)}
  //                     className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
  //                   />
  //                   <label
  //                     htmlFor={`category-${category.toLowerCase()}`}
  //                     className="ml-3 text-gray-700 text-lg font-medium cursor-pointer"
  //                   >
  //                     {category}
  //                   </label>
  //                 </div>
  //               ))}
  //             </div>
              
  //             <div className="flex gap-3">
  //               <button
  //                 type="button"
  //                 onClick={() => {
  //                   setShowCategoriesModal(false);
  //                   setSelectedCategories([]);
  //                 }}
  //                 className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition"
  //               >
  //                 Cancel
  //               </button>
  //               <button
  //                 type="button"
  //                 onClick={handleGeneratePlan}
  //                 disabled={selectedCategories.length === 0}
  //                 className={`flex-1 py-3 rounded-xl font-semibold transition ${
  //                   selectedCategories.length === 0
  //                     ? "bg-gray-300 cursor-not-allowed text-gray-500"
  //                     : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg"
  //                 }`}
  //               >
  //                 Generate Plan
  //               </button>
  //             </div>
  //           </div>
  //         </div>
  //       )}

  //       <section className="text-center py-20 px-6">
  //         <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
  //           Your Event, Perfectly Planned
  //         </h2>
  //         <p className="text-gray-600 max-w-2xl mx-auto mb-10">
  //           Aivent is the all-in-one platform to efficiently bring your vision to
  //           life, from budget to final guest.
  //         </p>

  //         <div className="max-w-3xl mx-auto">
  //           {user ? (
  //             <button
  //               onClick={goToDashboard}
  //               className="mt-4 px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 text-lg font-semibold shadow-md hover:shadow-lg transition"
  //             >
  //               Go to Dashboard
  //             </button>
  //           ) : (
  //             <div className="flex items-center justify-center gap-4">
  //               <Link
  //                 to="/register"
  //                 className="mt-4 px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 text-lg font-semibold shadow-md hover:shadow-lg transition"
  //               >
  //                 Get Started
  //               </Link>
  //               <Link
  //                 to="/login"
  //                 className="mt-4 px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 font-medium transition"
  //               >
  //                 Login
  //               </Link>
  //             </div>
  //           )}
  //         </div>

  //         {/* Event Planning Form */}
  //         <div className="mt-10 max-w-3xl mx-auto bg-white p-8 shadow-xl rounded-2xl border">
  //           <div className="grid md:grid-cols-3 gap-6">
  //             <div className="flex flex-col">
  //               <label className="text-gray-700 font-semibold mb-2">Event Type</label>
  //               <select 
  //                 className="border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
  //                 value={eventData.eventType}
  //                 onChange={(e) => setEventData({...eventData, eventType: e.target.value})}
  //               >
  //                 <option>Wedding</option>
  //                 <option>Birthday</option>
  //                 <option>Corporate Event</option>
  //                 <option>Festival</option>
  //               </select>
  //             </div>

  //             <div className="flex flex-col">
  //               <label className="text-gray-700 font-semibold mb-2">Estimated Budget</label>
  //               <div className="relative">
  //                 <span className="absolute left-4 top-3 text-gray-500">₹</span>
  //                 <input
  //                   type="number"
  //                   className="border-2 border-gray-300 rounded-xl pl-10 pr-4 py-3 w-full focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
  //                   placeholder="50,000"
  //                   value={eventData.budget}
  //                   onChange={(e) => setEventData({...eventData, budget: e.target.value})}
  //                 />
  //               </div>
  //             </div>

  //             <div className="flex flex-col">
  //               <label className="text-gray-700 font-semibold mb-2">Number of Guests</label>
  //               <input
  //                 type="number"
  //                 className="border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
  //                 placeholder="100"
  //                 value={eventData.guests}
  //                 onChange={(e) => setEventData({...eventData, guests: e.target.value})}
  //               />
  //             </div>
  //           </div>

  //           <button 
  //             type="button"
  //             onClick={handleStartPlanning}
  //             className="w-full mt-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 text-lg font-semibold shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
  //           >
  //             Start Planning
  //           </button>
  //         </div>
  //       </section>

  //       <section className="bg-gray-50 py-20 px-6">
  //         <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
  //           All-in-One Planning, Simplified
  //         </h2>
  //         <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
  //           From finalizing the perfect vendors to collaborating with your team,
  //           our powerful tools make event planning seamless and enjoyable.
  //         </p>

  //         <div className="max-w-7xl mx-auto grid md:grid-cols-3 lg:grid-cols-4 gap-6">
  //           {[
  //             {
  //               title: "Budget-First Planning",
  //               desc: "Plan smarter with budgeting tools and real-time cost insights.",
  //             },
  //             {
  //               title: "Vendor Matching",
  //               desc: "Find the right vendors based on your style, budget, and needs.",
  //             },
  //             {
  //               title: "Live Chat Bargaining",
  //               desc: "Message and negotiate with vendors instantly inside the platform.",
  //             },
  //             {
  //               title: "AI Event Assistant",
  //               desc: "Get suggestions, timelines, and reminders powered by AI.",
  //             },
  //             {
  //               title: "Collaborative Planning Rooms",
  //               desc: "Invite team members to collaborate, vote, and manage tasks.",
  //             },
  //             {
  //               title: "Task Management",
  //               desc: "Track progress with checklists, deadlines, and smart reminders.",
  //             },
  //           ].map((item, i) => (
  //             <div
  //               key={i}
  //               className="p-6 bg-white shadow-lg rounded-xl border hover:shadow-xl transition transform hover:-translate-y-1"
  //             >
  //               <h3 className="font-semibold text-xl mb-3">{item.title}</h3>
  //               <p className="text-gray-600">{item.desc}</p>
  //             </div>
  //           ))}
  //         </div>
  //       </section>

  //       <footer className="py-10 px-6 border-t bg-white">
  //         <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 text-center md:text-left">
  //           <div>
  //             <h4 className="font-semibold text-lg mb-3">Product</h4>
  //             <p className="text-gray-600 hover:text-gray-900 cursor-pointer">Features</p>
  //             <p className="text-gray-600 hover:text-gray-900 cursor-pointer">Pricing</p>
  //             <p className="text-gray-600 hover:text-gray-900 cursor-pointer">Templates</p>
  //           </div>

  //           <div>
  //             <h4 className="font-semibold text-lg mb-3">Company</h4>
  //             <p className="text-gray-600 hover:text-gray-900 cursor-pointer">About</p>
  //             <p className="text-gray-600 hover:text-gray-900 cursor-pointer">Careers</p>
  //             <p className="text-gray-600 hover:text-gray-900 cursor-pointer">Contact</p>
  //           </div>

  //           <div>
  //             <h4 className="font-semibold text-lg mb-3">Legal</h4>
  //             <p className="text-gray-600 hover:text-gray-900 cursor-pointer">Privacy Policy</p>
  //             <p className="text-gray-600 hover:text-gray-900 cursor-pointer">Terms of Service</p>
  //           </div>
  //         </div>

  //         <p className="text-center text-gray-500 mt-8">
  //           © 2025 Aivent. All rights reserved.
  //         </p>
  //       </footer>

  //       {/* Add custom CSS for animation */}
  //       <style>{`
  //   @keyframes fadeIn {
  //     from {
  //       opacity: 0;
  //       transform: translateY(-20px);
  //     }
  //     to {
  //       opacity: 1;
  //       transform: translateY(0);
  //     }
  //   }
  //   .animate-fadeIn {
  //     animation: fadeIn 0.3s ease-out;
  //   }
  // `}</style>
  //     </div>
  //   );
  // }}