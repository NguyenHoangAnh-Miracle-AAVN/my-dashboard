'use client';
import { useSelector } from "react-redux";

export default function CreatedCount() {
    const customerCreatedCount = useSelector((state:any) => state.counter.count);
    return (
        <div>
            <p>Number customer created: {customerCreatedCount}</p>
        </div>
    )
}