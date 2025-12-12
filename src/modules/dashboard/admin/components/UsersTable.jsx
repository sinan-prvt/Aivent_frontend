import React, { useState } from "react";
import { approveVendor, revokeTokens } from "../api/adminApi";

export default function UsersTable({ users, refresh, onUserClick }) {
  const [actionLoading, setActionLoading] = useState({});

  async function handleAction(userId, actionFn, actionName, e) {
    e.stopPropagation();
    setActionLoading(prev => ({ ...prev, [userId]: actionName }));
    try {
      await actionFn(userId);
      await refresh();
    } catch (err) {
      console.error(`${actionName} failed:`, err);
      alert(`Failed to ${actionName.toLowerCase()}. Please try again.`);
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: null }));
    }
  }

  const RoleBadge = ({ role }) => {
    const roleConfig = {
      admin: { color: "bg-purple-100 text-purple-800", label: "Admin" },
      vendor: { color: "bg-blue-100 text-blue-800", label: "Vendor" },
      user: { color: "bg-gray-100 text-gray-800", label: "User" }
    };
    
    const config = roleConfig[role] || roleConfig.user;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vendor Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        
        <tbody className="bg-white divide-y divide-gray-200">
          {users.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-6 py-12 text-center">
                <div className="flex flex-col items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-6.197a4 4 0 00-4-4m4 4a4 4 0 010 8m-4-4a4 4 0 100-8" />
                  </svg>
                  <p className="text-gray-500 font-medium">No users found</p>
                  <p className="text-gray-400 text-sm mt-1">Try changing your search or filters</p>
                </div>
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr 
                key={user.id} 
                className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer group"
                onClick={() => onUserClick(user.id)}
              >
                {/* User Info */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold group-hover:shadow-md transition-shadow">
                      {user.email?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {user.username || "No username"}
                        <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Role */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <RoleBadge role={user.role} />
                </td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-2">
                    <div className={`inline-flex items-center text-sm ${user.email_verified ? 'text-green-600' : 'text-red-600'}`}>
                      {user.email_verified ? (
                        <>
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Verified
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          Not Verified
                        </>
                      )}
                    </div>
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.email_verified && user.vendor_approved ? 'bg-green-100 text-green-800' :
                      !user.email_verified ? 'bg-yellow-100 text-yellow-800' :
                      !user.vendor_approved ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.email_verified && user.vendor_approved ? 'Active' :
                       !user.email_verified ? 'Pending Verification' :
                       !user.vendor_approved ? 'Awaiting Approval' :
                       'Inactive'}
                    </div>
                  </div>
                </td>

                {/* Vendor Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.role === "vendor" ? (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      user.vendor_approved 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.vendor_approved ? (
                        <>
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Approved
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          Pending
                        </>
                      )}
                    </span>
                  ) : (
                    <span className="text-gray-500 text-sm italic">Not a vendor</span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2">
                    {user.role === "vendor" && !user.vendor_approved && (
                      <button
                        onClick={(e) => handleAction(user.id, approveVendor, "approve", e)}
                        disabled={actionLoading[user.id] === "approve"}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {actionLoading[user.id] === "approve" ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Approving...
                          </>
                        ) : (
                          "Approve"
                        )}
                      </button>
                    )}
                    
                    <button
                      onClick={(e) => handleAction(user.id, revokeTokens, "revoke", e)}
                      disabled={actionLoading[user.id] === "revoke"}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Revoke all user tokens"
                    >
                      {actionLoading[user.id] === "revoke" ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Revoking...
                        </>
                      ) : (
                        "Revoke Tokens"
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}