import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useEffect, useRef } from "react"

export default function HomePage() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Node properties
        const particlesArray: Particle[] = [];
        const numberOfParticles = 100;
        const maxDistance = 150;

        if (!ctx) return; // Ensure ctx is not null

        // Create particles
        class Particle {
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY: number;
            brightness: number;

            constructor() {
                this.x = Math.random() * (canvas?.width ?? 0);
                this.y = Math.random() * (canvas?.height ?? 0);
                this.size = Math.random() * 2 + 1;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.brightness = Math.random() * 50 + 50;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Bounce off edges
                if (canvas && (this.x > canvas.width || this.x < 0)) {
                    this.speedX = -this.speedX;
                }
                if (canvas && (this.y > canvas.height || this.y < 0)) {
                    this.speedY = -this.speedY;
                }
            }

            draw() {
                if (!ctx) return;

                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(100, 200, 255, ${this.brightness / 100})`;
                ctx.shadowBlur = 15;
                ctx.shadowColor = 'rgba(100, 200, 255, 0.8)';
                ctx.fill();
            }
        }

        // Draw connecting lines
        function connect() {
            for (let i = 0; i < particlesArray.length; i++) {
                for (let j = i; j < particlesArray.length; j++) {
                    const dx = particlesArray[i].x - particlesArray[j].x;
                    const dy = particlesArray[i].y - particlesArray[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        const opacity = 1 - (distance / maxDistance);
                        if (!ctx) return;
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(100, 200, 255, ${opacity * 0.5})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                        ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        // Initialize particles
        function init() {
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }

        // Animation loop
        function animate() {
            if (!ctx) return;
            if (canvas) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }

            // Create gradient background
            const gradient = canvas ? ctx.createLinearGradient(0, 0, 0, canvas.height) : ctx.createLinearGradient(0, 0, 0, 0);
            gradient.addColorStop(0, '#061029');
            gradient.addColorStop(1, '#0d2158');
            ctx.fillStyle = gradient;
            if (canvas) {
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            // Update and draw particles
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
            }
            connect();
            requestAnimationFrame(animate);
        }

        init();
        animate();

        // Handle resize
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particlesArray.length = 0;
            init();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <>
            {/* Fixed position canvas to cover entire viewport */}
            <canvas 
                ref={canvasRef} 
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    zIndex: -1
                }}
            />
            
            {/* Main content */}
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-white drop-shadow-lg">
                    Data Platform
                </h1>
                <p className="mt-6 text-lg text-white/90 max-w-3xl drop-shadow-md">
                    Manage your datasets and models with ease. Upload, analyze, and deploy your data science projects in one place.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" className="bg-blue-500 hover:bg-blue-600 px-8">
                        <Link to="/login">Login</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="border-blue-400 text-blue-100 hover:bg-blue-900/30 px-8">
                        <Link to="/signup">Sign Up</Link>
                    </Button>
                </div>
            </div>
        </>
    );
}