# Mannequin Animation Editor

A powerful, modern JSON-based animation editor for creating custom mannequin animations with an intuitive timeline interface.

## Features

✨ **Visual Timeline Editor**
- Interactive timeline with keyframe visualization
- Drag and click to navigate through animation
- Real-time playback with smooth interpolation
- Loop mode for continuous playback

🎨 **Premium UI Design**
- Modern dark theme with glassmorphism effects
- Vibrant color gradients and smooth animations
- Responsive layout that adapts to your screen
- Professional controls and indicators

🎭 **Mannequin Control**
- Interactive 3D mannequin manipulation
- Inverse kinematics support
- Biological constraint checking
- Real-time posture preview

💾 **JSON Import/Export**
- Save animations as JSON files
- Load and edit existing animations
- Sample animations included
- Compatible with mannequin.js posture format

## Getting Started

### Opening the Editor

1. Navigate to the editor directory:
   ```
   src/editor/animation-editor.html
   ```

2. Open the file in a web browser (requires a local server for ES modules)

### Using a Local Server

You can use any of these methods:

**Python:**
```bash
# Python 3
python -m http.server 8000

# Then open: http://localhost:8000/src/editor/animation-editor.html
```

**Node.js:**
```bash
npx http-server -p 8000

# Then open: http://localhost:8000/src/editor/animation-editor.html
```

**VS Code:**
- Install "Live Server" extension
- Right-click on `animation-editor.html` and select "Open with Live Server"

## How to Use

### Creating a New Animation

1. Click the **"New"** button in the header
2. Set your animation name, duration, and FPS in the left panel
3. Pose the mannequin by clicking and dragging body parts
4. Click **"Add Keyframe"** to save the current pose at the current time
5. Move the playhead to a different time
6. Create a new pose and add another keyframe
7. Repeat to create your animation

### Playback Controls

- **Play/Pause**: Start or pause animation playback
- **Stop**: Reset to the beginning
- **Loop**: Toggle continuous playback

### Timeline Interaction

- **Click** on the timeline to jump to a specific time
- **Click** on a keyframe diamond to select and edit it
- **Selected keyframes** are highlighted in pink
- The **playhead** (pink line) shows the current time

### Keyframe Management

- **Add Keyframe**: Saves the current pose at the current time
- **Delete Keyframe**: Removes the selected keyframe
- **Update Keyframe**: Add a keyframe at the same time to update it

### Saving and Loading

- **Save**: Export your animation as a JSON file
- **Load**: Import a previously saved animation
- Sample animations are provided in `sample-animations/`

## Animation JSON Format

```json
{
  "name": "My Animation",
  "duration": 5.0,
  "fps": 30,
  "keyframes": [
    {
      "time": 0.0,
      "posture": {
        "version": 7,
        "data": [
          0, [0, 0, 0],
          0, [0, 0, 0],
          ...
        ]
      }
    }
  ]
}
```

### Posture Data Structure

The posture data follows the mannequin.js format (version 7):
- Each body part has rotation values
- Format: `rotation, [x, y, z]`
- Rotations are in radians
- Positions are relative to parent joints

### Body Parts Order

1. Body (root)
2. Pelvis
3. Torso
4. Neck
5. Head
6. Left Leg
7. Left Knee
8. Left Ankle
9. Right Leg
10. Right Knee
11. Right Ankle
12. Left Arm
13. Left Elbow
14. Left Wrist
15. Right Arm
16. Right Elbow
17. Right Wrist

## Sample Animations

### Walking Animation
- **File**: `sample-animations/walking.json`
- **Duration**: 2 seconds
- **Description**: Basic walking cycle with alternating leg movement

### Wave Animation
- **File**: `sample-animations/wave.json`
- **Duration**: 3 seconds
- **Description**: Friendly waving gesture with right arm

## Tips and Tricks

### Creating Smooth Animations

1. **Use more keyframes** for complex movements
2. **Space keyframes evenly** for consistent motion
3. **Test with loop mode** to check for smooth transitions
4. **Start and end with similar poses** for seamless loops

### Working with Constraints

- Enable **"Biological Constraints"** to prevent impossible poses
- Use **"Inverse Kinematics"** for more natural limb movement
- **Reset Pose** to return to the default standing position

### Performance

- Higher FPS values (60+) create smoother playback but larger files
- 30 FPS is recommended for most animations
- Keep duration reasonable (under 10 seconds) for better performance

## Keyboard Shortcuts

- **Space**: Play/Pause (when implemented)
- **Home**: Jump to start
- **End**: Jump to end

## Troubleshooting

### Animation not loading
- Check that the JSON file is valid
- Ensure posture version is 7
- Verify all keyframes have valid time values

### Mannequin not responding
- Make sure you're clicking directly on the 3D model
- Try disabling "Biological Constraints" if movement is limited
- Reset the pose if the mannequin gets stuck

### Timeline not updating
- Refresh the page
- Check browser console for errors
- Ensure animation duration is greater than 0

## Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ⚠️ Requires ES6 module support

## Technical Details

### Dependencies

- **Three.js** v0.170.0 - 3D rendering
- **mannequin.js** - Mannequin models and posture system

### File Structure

```
src/editor/
├── animation-editor.html    # Main HTML file
├── animation-editor.css     # Styles
├── animation-editor.js      # Application logic
└── sample-animations/       # Example animations
    ├── walking.json
    └── wave.json
```

## Future Enhancements

- [ ] Onion skinning (ghost frames)
- [ ] Easing curve editor
- [ ] Multiple mannequin support
- [ ] Export to video/GIF
- [ ] Undo/Redo functionality
- [ ] Copy/paste keyframes
- [ ] Animation presets library

## License

This project uses the same license as mannequin.js.

## Credits

Built with ❤️ using mannequin.js and Three.js
