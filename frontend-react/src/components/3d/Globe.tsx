import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Line } from '@react-three/drei'
import * as THREE from 'three'

function Atmosphere() {
  return (
    <mesh>
      <sphereGeometry args={[2.18, 64, 64]} />
      <meshStandardMaterial color="#3b82f6" transparent opacity={0.06} side={THREE.BackSide} />
    </mesh>
  )
}

function GlobeGrid() {
  const segments = useMemo(() => {
    const segs: { points: [number, number, number][] }[] = []
    const R = 2.02

    const toVec = (lat: number, lng: number): [number, number, number] => {
      const phi = THREE.MathUtils.degToRad(lat)
      const theta = THREE.MathUtils.degToRad(lng)
      return [R * Math.cos(phi) * Math.cos(theta), R * Math.sin(phi), R * Math.cos(phi) * Math.sin(theta)]
    }

    for (let lat = -80; lat <= 80; lat += 20) {
      const pts: [number, number, number][] = []
      for (let lng = 0; lng <= 360; lng += 5) pts.push(toVec(lat, lng))
      segs.push({ points: pts })
    }
    for (let lng = 0; lng < 360; lng += 30) {
      const pts: [number, number, number][] = []
      for (let lat = -90; lat <= 90; lat += 5) pts.push(toVec(lat, lng))
      segs.push({ points: pts })
    }
    return segs
  }, [])

  return (
    <group>
      {segments.map((s, i) => (
        <Line key={i} points={s.points} color="#3b82f6" transparent opacity={0.18} lineWidth={0.5} />
      ))}
    </group>
  )
}

function FlightArc({ from, to, color = '#f59e0b' }: {
  from: [number, number]; to: [number, number]; color?: string
}) {
  const points = useMemo((): [number, number, number][] => {
    const R = 2.06
    const toVec = ([lat, lng]: [number, number]): THREE.Vector3 => {
      const phi = THREE.MathUtils.degToRad(lat)
      const theta = THREE.MathUtils.degToRad(lng)
      return new THREE.Vector3(R * Math.cos(phi) * Math.cos(theta), R * Math.sin(phi), R * Math.cos(phi) * Math.sin(theta))
    }
    const s = toVec(from), e = toVec(to)
    const m = s.clone().add(e).normalize().multiplyScalar(R * 1.35)
    return new THREE.QuadraticBezierCurve3(s, m, e)
      .getPoints(60)
      .map(v => [v.x, v.y, v.z])
  }, [from, to])

  return <Line points={points} color={color} transparent opacity={0.55} lineWidth={1} />
}

function FlyingDot({ from, to, speed = 1, color = '#fbbf24' }: {
  from: [number, number]; to: [number, number]; speed?: number; color?: string
}) {
  const ref = useRef<THREE.Mesh>(null)
  const t = useRef(Math.random())

  const curve = useMemo(() => {
    const R = 2.1
    const toVec = ([lat, lng]: [number, number]) => {
      const phi = THREE.MathUtils.degToRad(lat)
      const theta = THREE.MathUtils.degToRad(lng)
      return new THREE.Vector3(R * Math.cos(phi) * Math.cos(theta), R * Math.sin(phi), R * Math.cos(phi) * Math.sin(theta))
    }
    const s = toVec(from), e = toVec(to)
    const m = s.clone().add(e).normalize().multiplyScalar(R * 1.38)
    return new THREE.QuadraticBezierCurve3(s, m, e)
  }, [from, to])

  useFrame((_, delta) => {
    t.current = (t.current + delta * 0.12 * speed) % 1
    if (ref.current) ref.current.position.copy(curve.getPoint(t.current))
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.025, 8, 8]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
    </mesh>
  )
}

const AIRPORTS: [number, number][] = [
  [25.2, 55.4], [51.5, -0.1], [40.6, -73.8], [48.9, 2.4],
  [1.4, 103.9], [35.7, 139.8], [34.0, -118.4], [37.6, -122.4],
  [52.4, 13.3], [55.9, 37.4], [-33.9, 151.2], [19.1, 72.9], [-23.4, -46.5],
]

const ROUTES: { from: [number, number]; to: [number, number]; color: string }[] = [
  { from: [25.2, 55.4], to: [51.5, -0.1], color: '#f59e0b' },
  { from: [51.5, -0.1], to: [40.6, -73.8], color: '#3b82f6' },
  { from: [40.6, -73.8], to: [34.0, -118.4], color: '#8b5cf6' },
  { from: [34.0, -118.4], to: [1.4, 103.9], color: '#06b6d4' },
  { from: [1.4, 103.9], to: [35.7, 139.8], color: '#f59e0b' },
  { from: [35.7, 139.8], to: [25.2, 55.4], color: '#3b82f6' },
  { from: [48.9, 2.4], to: [19.1, 72.9], color: '#8b5cf6' },
  { from: [-33.9, 151.2], to: [1.4, 103.9], color: '#06b6d4' },
  { from: [-23.4, -46.5], to: [51.5, -0.1], color: '#f59e0b' },
]

function GlobeScene() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial color="#040c1a" roughness={0.8} metalness={0.2} />
      </mesh>

      <GlobeGrid />
      <Atmosphere />

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.3, 0.03, 8, 128]} />
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={1} transparent opacity={0.4} />
      </mesh>

      {AIRPORTS.map(([lat, lng], i) => {
        const phi = THREE.MathUtils.degToRad(lat)
        const theta = THREE.MathUtils.degToRad(lng)
        const R = 2.04
        return (
          <mesh key={i} position={[R * Math.cos(phi) * Math.cos(theta), R * Math.sin(phi), R * Math.cos(phi) * Math.sin(theta)]}>
            <sphereGeometry args={[0.018, 8, 8]} />
            <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={3} />
          </mesh>
        )
      })}

      {ROUTES.map((r, i) => (
        <FlightArc key={i} from={r.from} to={r.to} color={r.color} />
      ))}
      {ROUTES.map((r, i) => (
        <FlyingDot key={i} from={r.from} to={r.to} speed={0.6 + i * 0.1} color={r.color} />
      ))}
    </group>
  )
}

export default function Globe() {
  return (
    <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }} style={{ background: 'transparent' }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#3b82f6" />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#8b5cf6" />
      <pointLight position={[0, 5, 0]} intensity={0.8} color="#fff" />
      <GlobeScene />
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  )
}
