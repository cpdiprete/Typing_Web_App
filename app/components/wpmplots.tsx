import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from 'recharts';
import { useState, useEffect } from 'react'
import { get_wpm_and_accuracy_plot } from '../lib/appCRUDfunctions';

// 1. Add this custom Tooltip component above your main component
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                backgroundColor: 'rgba(23, 23, 23, 0.85)',
                backdropFilter: 'blur(4px)',
                padding: '12px',
                border: '1px solid #444',
                borderRadius: '8px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
            }}>
                <p style={{ color: '#999', margin: 0, fontSize: '12px' }}>Attempt {label}</p>
                <p style={{ color: '#ff4757', fontWeight: 'bold', margin: '4px 0' }}>WPM: {payload[0].value}</p>
                <p style={{ color: '#2e86de', fontWeight: 'bold', margin: 0 }}>Accuracy: {payload[1].value}%</p>
            </div>
        );
    }
    return null;
};

export function Wpmchart({ data }) {
    return (
        data && data.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                <XAxis dataKey="index" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#444', strokeWidth: 2 }} />
                <Line 
                    type="monotone" 
                    dataKey="wpm" 
                    stroke="#ff4757" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#ff4757' }} 
                    activeDot={{ r: 6, strokeWidth: 0 }} 
                />
                <Line 
                    type="monotone" 
                    dataKey="accuracy" 
                    stroke="#2e86de" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#2e86de' }} 
                    // activeDot={{ r: 6, strokeWidth: 0 }} 
                />
                </LineChart>
            </ResponsiveContainer>
        ) : (
            <div>
                Loading Plot data...
            </div>
        )
    );
}