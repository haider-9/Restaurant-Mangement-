import React from 'react'
import { Calendar, TimeCircle, User } from "react-iconly";

function ReservationSummary({ data }) {
    return (
        <div>
            <div className="bg-gray-100 p-2 rounded shadow-sm text-sm flex flex-wrap justify-between gap-2">
                <div className="flex items-center gap-3 font-semibold text-textSecondary">
                    <User size={20} />
                    <span> {data.people} People</span>
                </div>
                <div className="flex items-center gap-2 font-semibold text-textSecondary">
                    <Calendar size={20} />
                    <span> {data.date}</span>
                </div>
                <div className="flex items-center gap-2 font-semibold text-textSecondary">
                    <TimeCircle />
                    <span>{data.time}</span>
                </div>
            </div>
        </div>
    )
}

export default ReservationSummary