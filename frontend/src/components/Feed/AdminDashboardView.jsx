import React, { useState, useEffect } from "react";
import { Users, FileText, AlertOctagon, Eye, Check, Trash2 } from "lucide-react";
import api from "../../services/api";

export default function AdminDashboardView() {
  const [reports, setReports] = useState([]);
  
  const fetchReports = async () => {
    try {
      const data = await api.getReports();
      setReports(data);
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleUpdateStatus = async (reportId, status) => {
    try {
      await api.updateReportStatus(reportId, status);
      await fetchReports();
    } catch (err) {
      console.error("Error updating report status:", err);
    }
  };

  const stats = [
    { id: 1, name: "Total Users", value: "542,000", change: "+4.5% from last month", icon: Users, color: '#1064ea', bg: '#e0f2fe' },
    { id: 2, name: "Active Posts", value: "128,400", change: "+2.1% from last month", icon: FileText, color: '#10b981', bg: '#d1fae5' },
    { id: 3, name: "Reports", value: reports.length.toString(), change: "+12% from last month", icon: AlertOctagon, color: '#ef4444', bg: '#fee2e2' }
  ];

  return (
    <div style={{ padding: '24px', boxSizing: 'border-box', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <div>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#9ca3af' }}>{stat.name}</span>
                <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1f2937', margin: '6px 0' }}>{stat.value}</h2>
                <span style={{ fontSize: '12px', color: stat.color === '#ef4444' ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>{stat.change}</span>
              </div>
              <div style={{ background: stat.bg, color: stat.color, padding: '12px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      {/* User Growth Chart Card matching Image 7 */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: 'bold', color: '#1f2937' }}>User Growth (Last 30 Days)</h3>
        
        {/* SVG Chart placeholder that looks beautiful */}
        <div style={{ position: 'relative', height: '240px', width: '100%' }}>
          <svg viewBox="0 0 500 150" style={{ width: '100%', height: '100%' }}>
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1064ea" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="#1064ea" stopOpacity="0"/>
              </linearGradient>
            </defs>
            {/* Area Path */}
            <path d="M0,120 Q50,110 100,98 T200,85 T300,75 T400,50 T500,20 L500,150 L0,150 Z" fill="url(#gradient)" />
            {/* Line Path */}
            <path d="M0,120 Q50,110 100,98 T200,85 T300,75 T400,50 T500,20" fill="none" stroke="#1064ea" strokeWidth="3" />
            
            {/* Circular points */}
            <circle cx="0" cy="120" r="4" fill="#1064ea" />
            <circle cx="100" cy="98" r="4" fill="#1064ea" />
            <circle cx="200" cy="85" r="4" fill="#1064ea" />
            <circle cx="300" cy="75" r="4" fill="#1064ea" />
            <circle cx="400" cy="50" r="4" fill="#1064ea" />
            <circle cx="500" cy="20" r="4" fill="#1064ea" />
          </svg>
          
          {/* Axis Labels */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#9ca3af', marginTop: '8px' }}>
            <span>Date 1</span>
            <span>Date 7</span>
            <span>Date 14</span>
            <span>Date 21</span>
            <span>Date 28</span>
            <span>Date 30</span>
          </div>
        </div>
      </div>

      {/* Recent Reports Table Card */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: 'bold', color: '#1f2937' }}>Recent Reports</h3>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '12px' }}>
              <th style={{ padding: '12px', fontSize: '12px', fontWeight: 'bold', color: '#9ca3af' }}>ID</th>
              <th style={{ padding: '12px', fontSize: '12px', fontWeight: 'bold', color: '#9ca3af' }}>Reporter</th>
              <th style={{ padding: '12px', fontSize: '12px', fontWeight: 'bold', color: '#9ca3af' }}>Reported Content</th>
              <th style={{ padding: '12px', fontSize: '12px', fontWeight: 'bold', color: '#9ca3af' }}>Date</th>
              <th style={{ padding: '12px', fontSize: '12px', fontWeight: 'bold', color: '#9ca3af' }}>Status</th>
              <th style={{ padding: '12px', fontSize: '12px', fontWeight: 'bold', color: '#9ca3af' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.reportId} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '12px', fontSize: '13px', color: '#4b5563', fontWeight: '600' }}>#{report.reportId}</td>
                <td style={{ padding: '12px', fontSize: '13px', color: '#1f2937', fontWeight: '600' }}>{report.reporterName}</td>
                <td style={{ padding: '12px', fontSize: '13px', color: '#4b5563' }}>{report.reason}</td>
                <td style={{ padding: '12px', fontSize: '13px', color: '#9ca3af' }}>{new Date(report.reportedAt).toLocaleDateString()}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ 
                    background: report.reportStatus === 'PENDING' ? '#fef3c7' : '#d1fae5', 
                    color: report.reportStatus === 'PENDING' ? '#d97706' : '#10b981', 
                    fontSize: '11px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '12px' 
                  }}>
                    {report.reportStatus}
                  </span>
                </td>
                <td style={{ padding: '12px', display: 'flex', gap: '8px' }}>
                  <button onClick={() => alert("View content functionality")} style={{ padding: '6px 12px', background: '#1064ea', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Eye size={14} /> View
                  </button>
                  {report.reportStatus === 'PENDING' && (
                    <>
                      <button onClick={() => handleUpdateStatus(report.reportId, 'IGNORED')} style={{ padding: '6px 12px', background: '#f3f4f6', border: 'none', borderRadius: '6px', color: '#4b5563', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Check size={14} /> Ignore
                      </button>
                      <button onClick={() => handleUpdateStatus(report.reportId, 'BANNED_USER')} style={{ padding: '6px 12px', background: '#fee2e2', border: 'none', borderRadius: '6px', color: '#ef4444', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Trash2 size={14} /> Ban
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
