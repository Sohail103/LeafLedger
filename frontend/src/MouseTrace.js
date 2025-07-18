import React, { useRef, useEffect } from "react";

export default function MouseTrace() {
    const canvasRef = useRef();
    const points = useRef([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        function onMouseMove(e) {
            points.current.push({ x: e.clientX, y: e.clientY, t: Date.now() });
            if (points.current.length > 40) points.current.shift();
        }

        window.addEventListener("mousemove", onMouseMove);

        function draw() {
            ctx.clearRect(0, 0, width, height);
            ctx.beginPath();
            for (let i = 0; i < points.current.length - 1; i++) {
                const p1 = points.current[i];
                const p2 = points.current[i + 1];
                ctx.strokeStyle = "#00ff66";
                ctx.lineWidth = 4 - i * 0.08;
                ctx.globalAlpha = 0.5 - i * 0.012;
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
            }
            ctx.stroke();
            ctx.globalAlpha = 1;
            requestAnimationFrame(draw);
        }
        draw();

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                inset: 0,
                width: "100vw",
                height: "100vh",
                pointerEvents: "none",
                zIndex: 100,
            }}
        />
    );
}