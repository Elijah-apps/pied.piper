import * as THREE from "three";
import { createStage, Male, Mannequin, blend } from "mannequin";
import { camera, controls, renderer, scene, systemAnimate } from "mannequin/scene.js";

// ============================================================================
// CONSTANTS & GLOBALS
// ============================================================================

const EPS = 0.00001;
let model = null;
let animationData = {
    name: "Untitled Animation",
    duration: 5.0,
    fps: 30,
    keyframes: []
};

let isPlaying = false;
let isLooping = false;
let currentTime = 0;
let selectedKeyframeIndex = -1;

// UI Elements
const elements = {
    // Animation Info
    animName: document.getElementById('anim-name'),
    animDuration: document.getElementById('anim-duration'),
    animFps: document.getElementById('anim-fps'),

    // Playback
    btnPlay: document.getElementById('btn-play'),
    btnStop: document.getElementById('btn-stop'),
    btnLoop: document.getElementById('btn-loop'),
    playIcon: document.getElementById('play-icon'),
    pauseIcon: document.getElementById('pause-icon'),
    currentTimeDisplay: document.getElementById('current-time'),
    totalTimeDisplay: document.getElementById('total-time'),

    // Keyframes
    btnAddKeyframe: document.getElementById('btn-add-keyframe'),
    btnDeleteKeyframe: document.getElementById('btn-delete-keyframe'),
    keyframeCount: document.getElementById('keyframe-count'),
    selectedKeyframe: document.getElementById('selected-keyframe'),

    // File Operations
    btnNew: document.getElementById('btn-new'),
    btnLoad: document.getElementById('btn-load'),
    btnSave: document.getElementById('btn-save'),
    fileInput: document.getElementById('file-input'),

    // Posture Editor
    cbInverseKinematics: document.getElementById('inverse-kinematics'),
    cbBiologicalConstraints: document.getElementById('biological-constraints'),
    btnResetPose: document.getElementById('btn-reset-pose'),

    // Timeline
    timeline: document.getElementById('timeline'),
    timelineCanvas: document.getElementById('timeline-canvas'),
    playhead: document.getElementById('playhead'),

    // Viewport
    viewport: document.getElementById('viewport'),
    selectedPart: document.getElementById('selected-part'),
    keyframeDetails: document.getElementById('keyframe-details')
};

// ============================================================================
// INITIALIZATION
// ============================================================================

function init() {
    // Create scene
    createStage(animate);

    // Create mannequin
    model = new Male();

    // Setup viewport
    setupViewport();

    // Setup event listeners
    setupEventListeners();

    // Initialize timeline
    initTimeline();

    // Update UI
    updateUI();

    console.log("Animation Editor initialized");
}

function setupViewport() {
    // Move renderer to viewport
    elements.viewport.appendChild(renderer.domElement);

    // Handle resize
    const resizeObserver = new ResizeObserver(() => {
        const width = elements.viewport.clientWidth;
        const height = elements.viewport.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        renderer.render(scene, camera);
    });

    resizeObserver.observe(elements.viewport);
}

function setupEventListeners() {
    // Animation Info
    elements.animName.addEventListener('input', (e) => {
        animationData.name = e.target.value;
    });

    elements.animDuration.addEventListener('input', (e) => {
        animationData.duration = parseFloat(e.target.value) || 5.0;
        elements.totalTimeDisplay.textContent = animationData.duration.toFixed(2);
        updateTimeline();
    });

    elements.animFps.addEventListener('input', (e) => {
        animationData.fps = parseInt(e.target.value) || 30;
    });

    // Playback Controls
    elements.btnPlay.addEventListener('click', togglePlayback);
    elements.btnStop.addEventListener('click', stopPlayback);
    elements.btnLoop.addEventListener('click', toggleLoop);

    // Keyframe Controls
    elements.btnAddKeyframe.addEventListener('click', addKeyframe);
    elements.btnDeleteKeyframe.addEventListener('click', deleteKeyframe);

    // File Operations
    elements.btnNew.addEventListener('click', newAnimation);
    elements.btnLoad.addEventListener('click', () => elements.fileInput.click());
    elements.btnSave.addEventListener('click', saveAnimation);
    elements.fileInput.addEventListener('change', loadAnimation);

    // Posture Editor
    elements.btnResetPose.addEventListener('click', resetPose);

    // Timeline
    elements.timeline.addEventListener('click', onTimelineClick);

    // Mannequin interaction
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('pointerup', onPointerUp);
    document.addEventListener('pointermove', onPointerMove);

    // Controls
    controls.addEventListener('start', () => {
        renderer.setAnimationLoop(systemAnimate);
    });

    controls.addEventListener('end', () => {
        renderer.setAnimationLoop(null);
        renderer.render(scene, camera);
    });
}

// ============================================================================
// TIMELINE
// ============================================================================

function initTimeline() {
    const canvas = elements.timelineCanvas;
    const container = elements.timeline;

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    updateTimeline();
}

function updateTimeline() {
    const canvas = elements.timelineCanvas;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw time markers
    ctx.strokeStyle = '#475569';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px Inter, sans-serif';

    const duration = animationData.duration;
    const numMarkers = Math.min(20, Math.floor(duration) + 1);

    for (let i = 0; i <= numMarkers; i++) {
        const time = (i / numMarkers) * duration;
        const x = (time / duration) * width;

        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();

        ctx.fillText(time.toFixed(1) + 's', x + 4, 15);
    }

    // Draw keyframes
    animationData.keyframes.forEach((keyframe, index) => {
        const x = (keyframe.time / duration) * width;
        const isSelected = index === selectedKeyframeIndex;

        // Keyframe diamond
        ctx.fillStyle = isSelected ? '#ec4899' : '#6366f1';
        ctx.beginPath();
        ctx.moveTo(x, height / 2 - 8);
        ctx.lineTo(x + 8, height / 2);
        ctx.lineTo(x, height / 2 + 8);
        ctx.lineTo(x - 8, height / 2);
        ctx.closePath();
        ctx.fill();

        // Glow effect
        if (isSelected) {
            ctx.shadowColor = '#ec4899';
            ctx.shadowBlur = 15;
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        // Vertical line
        ctx.strokeStyle = isSelected ? '#ec4899' : '#6366f1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
        ctx.lineWidth = 1;
    });
}

function onTimelineClick(e) {
    const rect = elements.timeline.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;

    const clickedTime = (x / width) * animationData.duration;

    // Check if clicked on a keyframe
    let clickedKeyframe = -1;
    const threshold = 10; // pixels

    animationData.keyframes.forEach((keyframe, index) => {
        const keyframeX = (keyframe.time / animationData.duration) * width;
        if (Math.abs(x - keyframeX) < threshold) {
            clickedKeyframe = index;
        }
    });

    if (clickedKeyframe !== -1) {
        // Select keyframe
        selectedKeyframeIndex = clickedKeyframe;
        currentTime = animationData.keyframes[clickedKeyframe].time;
        applyKeyframe(clickedKeyframe);
    } else {
        // Seek to time
        currentTime = clickedTime;
        selectedKeyframeIndex = -1;
    }

    updatePlayhead();
    updateUI();
    updateTimeline();
}

function updatePlayhead() {
    const percent = (currentTime / animationData.duration) * 100;
    elements.playhead.style.left = percent + '%';
    elements.currentTimeDisplay.textContent = currentTime.toFixed(2);
}

// ============================================================================
// ANIMATION PLAYBACK
// ============================================================================

function togglePlayback() {
    isPlaying = !isPlaying;

    if (isPlaying) {
        elements.playIcon.style.display = 'none';
        elements.pauseIcon.style.display = 'block';
        elements.btnPlay.classList.add('active');
        startPlayback();
    } else {
        elements.playIcon.style.display = 'block';
        elements.pauseIcon.style.display = 'none';
        elements.btnPlay.classList.remove('active');
    }
}

function stopPlayback() {
    isPlaying = false;
    currentTime = 0;
    elements.playIcon.style.display = 'block';
    elements.pauseIcon.style.display = 'none';
    elements.btnPlay.classList.remove('active');
    updatePlayhead();

    // Reset to first keyframe or default pose
    if (animationData.keyframes.length > 0) {
        applyKeyframe(0);
    } else {
        resetPose();
    }
}

function toggleLoop() {
    isLooping = !isLooping;
    elements.btnLoop.classList.toggle('active', isLooping);
}

let lastTime = 0;

function startPlayback() {
    lastTime = performance.now();
    playbackLoop();
}

function playbackLoop() {
    if (!isPlaying) return;

    const now = performance.now();
    const delta = (now - lastTime) / 1000; // Convert to seconds
    lastTime = now;

    currentTime += delta;

    if (currentTime >= animationData.duration) {
        if (isLooping) {
            currentTime = 0;
        } else {
            stopPlayback();
            return;
        }
    }

    updatePlayhead();
    interpolateAnimation(currentTime);

    requestAnimationFrame(playbackLoop);
}

function interpolateAnimation(time) {
    if (animationData.keyframes.length === 0) return;

    // Find surrounding keyframes
    let prevKeyframe = null;
    let nextKeyframe = null;

    for (let i = 0; i < animationData.keyframes.length; i++) {
        const kf = animationData.keyframes[i];

        if (kf.time <= time) {
            prevKeyframe = kf;
        }

        if (kf.time >= time && !nextKeyframe) {
            nextKeyframe = kf;
        }
    }

    if (!prevKeyframe && nextKeyframe) {
        // Before first keyframe
        applyPosture(nextKeyframe.posture);
    } else if (prevKeyframe && !nextKeyframe) {
        // After last keyframe
        applyPosture(prevKeyframe.posture);
    } else if (prevKeyframe && nextKeyframe && prevKeyframe !== nextKeyframe) {
        // Interpolate between keyframes
        const t = (time - prevKeyframe.time) / (nextKeyframe.time - prevKeyframe.time);
        const blendedPosture = blend(prevKeyframe.posture, nextKeyframe.posture, t);
        applyPosture(blendedPosture);
    } else if (prevKeyframe) {
        // Exactly on a keyframe
        applyPosture(prevKeyframe.posture);
    }

    renderer.render(scene, camera);
}

// ============================================================================
// KEYFRAME MANAGEMENT
// ============================================================================

function addKeyframe() {
    const keyframe = {
        time: currentTime,
        posture: model.posture
    };

    // Check if keyframe already exists at this time
    const existingIndex = animationData.keyframes.findIndex(
        kf => Math.abs(kf.time - currentTime) < 0.01
    );

    if (existingIndex !== -1) {
        // Update existing keyframe
        animationData.keyframes[existingIndex] = keyframe;
        selectedKeyframeIndex = existingIndex;
    } else {
        // Add new keyframe
        animationData.keyframes.push(keyframe);
        animationData.keyframes.sort((a, b) => a.time - b.time);
        selectedKeyframeIndex = animationData.keyframes.findIndex(kf => kf === keyframe);
    }

    updateUI();
    updateTimeline();

    console.log(`Keyframe added at ${currentTime.toFixed(2)}s`);
}

function deleteKeyframe() {
    if (selectedKeyframeIndex === -1) {
        alert('Please select a keyframe to delete');
        return;
    }

    animationData.keyframes.splice(selectedKeyframeIndex, 1);
    selectedKeyframeIndex = -1;

    updateUI();
    updateTimeline();

    console.log('Keyframe deleted');
}

function applyKeyframe(index) {
    if (index < 0 || index >= animationData.keyframes.length) return;

    const keyframe = animationData.keyframes[index];
    applyPosture(keyframe.posture);
    renderer.render(scene, camera);
}

function applyPosture(posture) {
    try {
        model.posture = posture;
    } catch (error) {
        console.error('Error applying posture:', error);
    }
}

function resetPose() {
    model.posture = {
        version: 7,
        data: [
            0, [0, 0, 0],
            0, [0, 0, 0],
            0, [0, 0, 0],
            0, [0, 0, 0],
            0, [0, 0, 0],
            0, [0, 0, 0],
            0, [0, 0, 0],
            0, [0, 0, 0],
            0, [0, 0, 0],
            0, [0, 0, 0],
            0, [0, 0, 0]
        ]
    };
    renderer.render(scene, camera);
}

// ============================================================================
// FILE OPERATIONS
// ============================================================================

function newAnimation() {
    if (animationData.keyframes.length > 0) {
        if (!confirm('Create new animation? Current animation will be lost.')) {
            return;
        }
    }

    animationData = {
        name: "Untitled Animation",
        duration: 5.0,
        fps: 30,
        keyframes: []
    };

    currentTime = 0;
    selectedKeyframeIndex = -1;

    elements.animName.value = animationData.name;
    elements.animDuration.value = animationData.duration;
    elements.animFps.value = animationData.fps;

    resetPose();
    updateUI();
    updateTimeline();

    console.log('New animation created');
}

function saveAnimation() {
    const data = JSON.stringify(animationData, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${animationData.name.replace(/\s+/g, '_')}.json`;
    link.click();

    URL.revokeObjectURL(url);

    console.log('Animation saved');
}

function loadAnimation(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target.result);

            // Validate data
            if (!data.name || !data.duration || !data.keyframes) {
                throw new Error('Invalid animation file format');
            }

            animationData = data;
            currentTime = 0;
            selectedKeyframeIndex = -1;

            elements.animName.value = animationData.name;
            elements.animDuration.value = animationData.duration;
            elements.animFps.value = animationData.fps || 30;

            if (animationData.keyframes.length > 0) {
                applyKeyframe(0);
            } else {
                resetPose();
            }

            updateUI();
            updateTimeline();

            console.log('Animation loaded:', animationData.name);
        } catch (error) {
            alert('Error loading animation file: ' + error.message);
            console.error(error);
        }
    };

    reader.readAsText(file);

    // Reset file input
    e.target.value = '';
}

// ============================================================================
// MANNEQUIN INTERACTION
// ============================================================================

let mouse = new THREE.Vector2();
let mouseButton = undefined;
let raycaster = new THREE.Raycaster();
let dragPoint = new THREE.Mesh();
let selectedObj = undefined;

function onPointerDown(event) {
    if (event.target !== renderer.domElement) return;

    userInput(event);

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([model], true);

    if (intersects.length && (intersects[0].object.name || intersects[0].object.parent.name)) {
        controls.enabled = false;

        let name = intersects[0].object.name || intersects[0].object.parent.name;

        if (name === 'neck') name = 'head';
        if (name === 'pelvis') name = 'body';

        selectedObj = model[name];

        if (selectedObj) {
            elements.selectedPart.textContent = name.replace(/_/g, ' ').toUpperCase();

            dragPoint.position.copy(selectedObj.worldToLocal(intersects[0].point));
            selectedObj.image.add(dragPoint);
        }

        renderer.setAnimationLoop(systemAnimate);
    }
}

function onPointerUp() {
    controls.enabled = true;
    mouseButton = undefined;
    selectedObj = undefined;
    elements.selectedPart.textContent = 'No part selected';
    renderer.setAnimationLoop(null);
    renderer.render(scene, camera);
}

function onPointerMove(event) {
    if (selectedObj && event.target === renderer.domElement) {
        userInput(event);
    }
}

function userInput(event) {
    event.preventDefault();
    mouseButton = event.buttons || 0x1;

    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

// ============================================================================
// UI UPDATES
// ============================================================================

function updateUI() {
    // Update keyframe count
    elements.keyframeCount.textContent = `Keyframes: ${animationData.keyframes.length}`;

    // Update selected keyframe
    if (selectedKeyframeIndex !== -1) {
        const kf = animationData.keyframes[selectedKeyframeIndex];
        elements.selectedKeyframe.textContent = `Selected: ${kf.time.toFixed(2)}s`;

        // Update keyframe details
        elements.keyframeDetails.innerHTML = `
            <div style="margin-bottom: 0.5rem;">
                <strong>Time:</strong> ${kf.time.toFixed(2)}s
            </div>
            <div style="margin-bottom: 0.5rem;">
                <strong>Frame:</strong> ${Math.round(kf.time * animationData.fps)}
            </div>
            <div>
                <strong>Posture Version:</strong> ${kf.posture.version}
            </div>
        `;
    } else {
        elements.selectedKeyframe.textContent = 'Selected: None';
        elements.keyframeDetails.innerHTML = '<p class="empty-state">Select a keyframe to view details</p>';
    }

    // Update total time
    elements.totalTimeDisplay.textContent = animationData.duration.toFixed(2);
}

function animate() {
    // Animation loop for interactive editing
    if (selectedObj && mouseButton) {
        // Simple inverse kinematics would go here
        // For now, we'll keep the existing posture editor logic
    }
}

// ============================================================================
// START APPLICATION
// ============================================================================

init();
