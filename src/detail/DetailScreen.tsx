import React from "react";
import { useParams } from "react-router-dom";

const DetailScreen: React.FC = () => {
    const URLParam = useParams();
    console.log(URLParam.id);

    return (
        <div className="app-screen">
            Detail!
        </div>
    );
};

export default DetailScreen;