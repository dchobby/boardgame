import * as THREE from 'three';
import {World} from './World.js';

var world=null;

var lastUpdateTime = 0;
var fps=60;

function Animate() {
    setTimeout(() => {
        requestAnimationFrame( Animate );
    }, 1000 / fps);
    const now = Date.now();
    const dt = now - lastUpdateTime;
    lastUpdateTime = now;
    if(world != undefined){        
        world.Step(dt/1000.0);
        world.Render();
    }
}

function onWindowResize() {
    if(world != undefined){
      world.camera.aspect = window.innerWidth / window.innerHeight;
      world.camera.updateProjectionMatrix();
      world.renderer.setSize( window.innerWidth, window.innerHeight );  
    }
  }
  
function InitScene()
{
    world = new World();
    window.addEventListener( 'resize', onWindowResize, false );
    lastUpdateTime = Date.now();
    Animate();
}

export {InitScene, Animate};