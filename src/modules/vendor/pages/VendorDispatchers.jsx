
import React from "react";
import { useAuth } from "../../../app/providers/AuthProvider";

// Schedules
import LightingScheduleManager from "./lighting/LightingScheduleManager";
import PhotographySchedule from "./photography/PhotographySchedule";
import SoundSchedule from "./sound/SoundSchedule";

// Equipment / Inventory
import LightingInventory from "./lighting/LightingInventory";

export const VendorScheduleDispatcher = () => {
    const { user } = useAuth();
    const catId = String(user?.category_id);

    if (catId === "3") return <LightingScheduleManager />;
    if (catId === "4") return <PhotographySchedule />;
    if (catId === "5") return <SoundSchedule />;

    return <div className="p-8 text-center text-gray-500">Schedule module not enabled for this category.</div>;
};

export const VendorEquipmentDispatcher = () => {
    const { user } = useAuth();
    const catId = String(user?.category_id);

    if (catId === "3") return <LightingInventory />;

    return <div className="p-8 text-center text-gray-500">Equipment module not enabled for this category.</div>;
};
