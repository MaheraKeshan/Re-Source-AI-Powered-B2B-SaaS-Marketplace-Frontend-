import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function RotatingNodes() {
    const groupRef = useRef();

    useFrame(({ clock }) => {
        const elapsedTime = clock.getElapsedTime();
        if (groupRef.current) {
            groupRef.current.rotation.y = elapsedTime * 0.1;
            groupRef.current.rotation.x = elapsedTime * 0.05;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Glowing inner core */}
            <Sphere args={[1, 64, 64]} scale={1.2}>
                <MeshDistortMaterial
                    color="#000000"
                    emissive="#10b981"
                    emissiveIntensity={0.8}
                    distort={0.4}
                    speed={2}
                    roughness={0.2}
                />
            </Sphere>

            {/* Wireframe outer sphere matching circular economy theme */}
            <Sphere args={[2.2, 32, 32]}>
                <meshStandardMaterial
                    color="#10b981"
                    wireframe
                    transparent
                    opacity={0.15}
                />
            </Sphere>

            <Sphere args={[3, 16, 16]}>
                <meshStandardMaterial
                    color="#ffffff"
                    wireframe
                    transparent
                    opacity={0.03}
                />
            </Sphere>
        </group>
    );
}

function FloatingParticles({ count = 100 }) {
    const mesh = useRef();
    const dummy = useMemo(() => new THREE.Object3D(), []);

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.01 + Math.random() / 200;
            const xFactor = -50 + Math.random() * 100;
            const yFactor = -50 + Math.random() * 100;
            const zFactor = -50 + Math.random() * 100;
            temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
        }
        return temp;
    }, [count]);

    useFrame((state) => {
        if (!mesh.current) return;
        particles.forEach((particle, i) => {
            let { factor, speed, xFactor, yFactor, zFactor } = particle;
            let t = particle.t += speed / 2;
            const a = Math.cos(t) + Math.sin(t * 1) / 10;
            const b = Math.sin(t) + Math.cos(t * 2) / 10;
            const s = Math.cos(t);

            dummy.position.set(
                (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
                (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
                (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
            );
            dummy.scale.set(s, s, s);
            dummy.rotation.set(s * 5, s * 5, s * 5);
            dummy.updateMatrix();
            mesh.current.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[null, null, count]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color="#10b981" transparent opacity={0.6} />
        </instancedMesh>
    );
}

export default function ThreeBackground() {
    return (
        <div className="absolute inset-0 w-full h-full bg-neutral-950">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                <ambientLight intensity={0.2} />
                <directionalLight position={[10, 10, 5]} intensity={1} color="#10b981" />
                <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#ffffff" />

                <RotatingNodes />
                <FloatingParticles count={250} />

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate
                    autoRotateSpeed={0.8}
                />
            </Canvas>
            {/* Gradient overlays to blend smoothly into the form section */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-950/40 to-neutral-950 pointer-events-none"></div>
            <div className="absolute inset-0 bg-repeat bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
        </div>
    );
}
