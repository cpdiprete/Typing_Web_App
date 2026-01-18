import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from 'recharts';
import { useState, useEffect } from 'react'

export async function get_wpm_and_accuracy_plot(id : number, wpmUpdater, accUpdater) {
    const endpoint = `http://127.0.0.1:5000/get_wpm_and_accuracy_plot/${id}`
    const response = fetch(endpoint).then((resp) => {
        if (!resp.ok) {
            throw new Error(`HTTP error in wpmplots.get_wpm_and_accuracy_plot()`)
        }
        return resp.json()
    }
    ).then((data) => {
        let i = 0
        let wpmsDict = []
        while (i < data.wpms.length) {
            const newEntry = {index: i, wpm: data.wpms[i], accuracy: data.accuracies[i]}
            wpmsDict = [...wpmsDict, newEntry]
            i += 1
        }
        // wpmUpdater(data.wpms)
        wpmUpdater(wpmsDict)
        // data.wpms.map((id) => {
        //     console.log("----------", id)
        //     console.log("----------", data.wpms[id])
        // })
        // accUpdater(data.accuracies)
        // return (data.wpms, data.accuracies)
    })
    // return (response[0], response[1]);
}
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


export function Wpmchart(id) {
    const [showPlot, setShowPlot] = useState(false)
    const [wpm_and_accuracy_plot, setWpm_and_accuracy_plot] = useState()
    const [accPlot, setAccPlot] = useState()

    // const data = [
    //     { time: '10:00', value: 400 },
    //     { time: '11:00', value: 300 },
    //     { time: '12:00', value: 600 },
    // ];
    useEffect(() => {
        setShowPlot(true)
    }, [wpm_and_accuracy_plot, accPlot])

    useEffect(() => {
        get_wpm_and_accuracy_plot(id.id, setWpm_and_accuracy_plot, setAccPlot) 
    }, [])


    return (

    showPlot ?
        
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={wpm_and_accuracy_plot} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
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
    :
    <div>
        No Plot data
    </div>

    )
}
//     return(
//         showPlot ? 
//             <ResponsiveContainer
//                 width={"100%"}
//                 height={300}
//             >
//                 <LineChart data={wpmPlot}>
//                     <XAxis dataKey="index" />
//                     <YAxis />
//                     <Tooltip cursor={false}/>
//                     <Line type="monotone" dataKey="wpm" stroke="red" />
//                     <Line type="monotone" dataKey="accuracy" stroke="blue" />

//                 </LineChart>
//             </ResponsiveContainer>
//         :
//         <div>
//             No plot data
//         </div>
//     )
// }


// Change LineChart to AreaChart and add <defs> for gradients
