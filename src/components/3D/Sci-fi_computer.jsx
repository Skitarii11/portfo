import React from 'react'
import { useGLTF, Html } from '@react-three/drei'
import { useNavigate } from 'react-router-dom';

export default function SciFiComputer({ showContent = true, ...props }) {
  const { nodes, materials } = useGLTF('/sci-fi_computer-transformed.glb')
  
  materials.Carcasa_1.color.set('#818589');
  materials.Carcasa_2.color.set('#818589');


  const navigate = useNavigate();

  const goToSimPage = () =>{
    navigate('/sim');
  }

  return (
    <group {...props} dispose={null}>
      {/* Screen Mesh */}
      <mesh geometry={nodes.defaultMaterial.geometry} material={materials.Pantalla}>
        {showContent && (
          <Html
            transform 
            distanceFactor={0.5}
            position={[-0.07, 0.25, 0]}
            wrapperClass="computer-screen-wrapper"
          >
            <div className="screen-inner">
              <h2>About Me</h2>
              <p>
                I am a passionate developer creating futuristic web experiences...
              </p>
              <button className='hire-me-btn' onClick={goToSimPage}>
                ENTER
              </button>
            </div>
          </Html>
        )}
      </mesh>
      
      <mesh geometry={nodes.defaultMaterial_1.geometry} material={materials.Detalles} />
      <mesh geometry={nodes.defaultMaterial_2.geometry} material={materials.Bisagras} />
      <mesh geometry={nodes.defaultMaterial_3.geometry} material={materials.Bases} />
      <mesh geometry={nodes.defaultMaterial_4.geometry} material={materials.Marcos} />
      <mesh geometry={nodes.defaultMaterial_5.geometry} material={materials.Forros} />
      <mesh geometry={nodes.defaultMaterial_6.geometry} material={materials.Carcasa_2} />
      <mesh geometry={nodes.defaultMaterial_7.geometry} material={materials.Carcasa_1} />
    </group>
  )
}

useGLTF.preload('/sci-fi_computer-transformed.glb')