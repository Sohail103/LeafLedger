import React, { useEffect, useState } from "react";

export default function FadeTransition({ children, duration = 700 }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);
        return () => setVisible(false);
    }, [children]);

    return (
        <div
            style={{
                transition: `opacity ${duration}ms`,
                opacity: visible ? 1 : 0,
                width: "100vw",
                height: "100vh",
                position: "absolute",
                inset: 0,
                zIndex: 10,
            }}
        >
            {children}
        </div>
    );
}