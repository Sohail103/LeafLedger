import React, { useEffect, useRef } from "react";

export default function LandingPage({ onScrollDown }) {
    const canvasRef = useRef();
    const animationFrameIdRef = useRef(null);
    const runningRef = useRef(false);

    useEffect(() => {
        runningRef.current = true;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        let pipes = [];
        let pipeCount = Math.floor(width / 80);
        for (let i = 0; i < pipeCount; i++) {
            pipes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                dir: Math.random() * Math.PI * 2,
                len: 0,
                color: "#00ff66"
            });
        }

        function draw() {
            if (!runningRef.current) return;
            ctx.globalAlpha = 0.08;
            ctx.fillStyle = "#0a0a0a";
            ctx.fillRect(0, 0, width, height);
            ctx.globalAlpha = 1;
            pipes.forEach(pipe => {
                ctx.save();
                ctx.strokeStyle = pipe.color;
                ctx.shadowColor = pipe.color;
                ctx.shadowBlur = 16;
                ctx.lineWidth = 8;
                ctx.beginPath();
                ctx.moveTo(pipe.x, pipe.y);
                let nx = pipe.x + Math.cos(pipe.dir) * 12;
                let ny = pipe.y + Math.sin(pipe.dir) * 12;
                ctx.lineTo(nx, ny);
                ctx.stroke();
                ctx.restore();

                pipe.x = nx;
                pipe.y = ny;
                pipe.dir += (Math.random() - 0.5) * 0.3;
                if (pipe.x < 0 || pipe.x > width || pipe.y < 0 || pipe.y > height) {
                    pipe.x = Math.random() * width;
                    pipe.y = Math.random() * height;
                    pipe.dir = Math.random() * Math.PI * 2;
                }
            });
            animationFrameIdRef.current = requestAnimationFrame(draw);
        }
        draw();

        return () => {
            runningRef.current = false;
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
                animationFrameIdRef.current = null;
            }
        };
    }, []);

    return (
        <div
            style={{
                position: "relative",
                width: "100vw",
                height: "100vh",
                overflow: "hidden",
                background: "linear-gradient(120deg, #0a0a0a 0%, #1a1a1a 100%)"
            }}
        >
            <canvas
                ref={canvasRef}
                style={{
                    position: "absolute",
                    inset: 0,
                    width: "100vw",
                    height: "100vh",
                    zIndex: 0,
                    display: "block"
                }}
            />
            <div
                style={{
                    position: "relative",
                    zIndex: 1,
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <h1
                    style={{
                        fontSize: "5rem",
                        color: "#00ff66",
                        textShadow: "0 0 32px #00ff66, 0 0 8px #00ff66",
                        fontWeight: "900",
                        letterSpacing: "8px",
                        marginBottom: "2rem",
                        cursor: "pointer",
                        transition: "opacity 0.6s"
                    }}
                    onClick={onScrollDown}
                >
                    LeafLedger
                </h1>
            </div>
        </div>
    );
}