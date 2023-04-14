import React from "react";
import AppSidebar from "../components/AppSidebar";

interface RootProps {
    component: React.FC;
}

export default function Root ({ component } : RootProps) {
    

    return (
        <AppSidebar SubPage={ component } />
    )
}