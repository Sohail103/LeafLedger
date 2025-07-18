import React, { useEffect, useRef, useState } from "react";
import "./loading-screen.css";

export default function LoadingScreen({ onFinish }) {
    const canvasRef = useRef();
    const [fade, setFade] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        // Pipe settings
        const pipeCount = 18;
        const pipes = [];
        const speed = 8;
        const maxLength = Math.max(width, height) / 2 + 80;

        for (let i = 0; i < pipeCount; i++) {
            const angle = (Math.PI * 2 * i) / pipeCount + Math.random() * 0.2;
            pipes.push({
                x: width / 2,
                y: height / 2,
                dir: angle,
                len: 0,
                color: "#00ff66",
                done: false,
            });
        }

        function draw() {
            ctx.globalAlpha = 0.08;
            ctx.fillStyle = "#0a0a0a";
            ctx.fillRect(0, 0, width, height);
            ctx.globalAlpha = 1;

            let allDone = true;
            pipes.forEach((pipe) => {
                if (!pipe.done) {
                    ctx.save();
                    ctx.strokeStyle = pipe.color;
                    ctx.shadowColor = pipe.color;
                    ctx.shadowBlur = 18;
                    ctx.lineWidth = 8;
                    ctx.beginPath();
                    ctx.moveTo(pipe.x, pipe.y);
                    let nx = pipe.x + Math.cos(pipe.dir) * speed;
                    let ny = pipe.y + Math.sin(pipe.dir) * speed;
                    ctx.lineTo(nx, ny);
                    ctx.stroke();
                    ctx.restore();

                    pipe.x = nx;
                    pipe.y = ny;
                    pipe.len += speed;

                    if (
                        pipe.x < 0 ||
                        pipe.x > width ||
                        pipe.y < 0 ||
                        pipe.y > height ||
                        pipe.len > maxLength
                    ) {
                        pipe.done = true;
                    } else {
                        allDone = false;
                    }
                }
            });

            if (!fade && allDone) {
                setFade(true);
                setTimeout(() => {
                    if (onFinish) onFinish();
                }, 700);
            }
            if (!fade) requestAnimationFrame(draw);
        }
        draw();

        return () => { };
    }, [fade, onFinish]);

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "linear-gradient(120deg, #0a0a0a 0%, #1a1a1a 100%)",
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "opacity 0.7s",
                opacity: fade ? 0 : 1,
                pointerEvents: fade ? "none" : "auto",
            }}
        >
            <canvas
                ref={canvasRef}
                style={{ width: "100vw", height: "100vh", display: "block" }}
            />
        </div>
    );
}