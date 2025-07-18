import React from "react";
import "./loading-screen.css";

export default function LoadingScreen() {
    return (
        <div className="loading-bg">
            <div className="loading-logo">
                <div className="loading-blocks">
                    <div className="loading-block"></div>
                    <div className="loading-block"></div>
                    <div className="loading-block"></div>
                    <div className="loading-block"></div>
                </div>
                <svg width="80" height="80" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="36" stroke="#ff9800" strokeWidth="4" fill="none" />
                    <circle cx="40" cy="40" r="24" stroke="#fff3e0" strokeWidth="2" fill="none" />
                </svg>
            </div>
        </div>
    );
}