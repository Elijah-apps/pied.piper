# Animation Editor - Quick Reference Guide

## 🎯 Quick Start (3 Steps)

1. **Start the server**: Run `./start-animation-editor.sh` or `python3 -m http.server 8000`
2. **Open browser**: Navigate to `http://localhost:8000/src/editor/animation-editor.html`
3. **Create**: Pose the mannequin, add keyframes, and save your animation!

## 🎨 Creating Your First Animation

### Step-by-Step Tutorial

1. **Set Animation Properties**
   - Name: "My First Animation"
   - Duration: 3.0 seconds
   - FPS: 30

2. **Create First Keyframe (0.0s)**
   - Click on mannequin's right arm
   - Drag to raise it
   - Click "Add Keyframe"

3. **Create Second Keyframe (1.5s)**
   - Click on timeline at 1.5s mark
   - Lower the arm
   - Click "Add Keyframe"

4. **Create Third Keyframe (3.0s)**
   - Click on timeline at 3.0s mark
   - Raise arm again
   - Click "Add Keyframe"

5. **Test Your Animation**
   - Click the green Play button
   - Enable Loop to see it continuously
   - Adjust timing by clicking keyframes

6. **Save Your Work**
   - Click "Save" button
   - File downloads as JSON

## 🎮 Controls Reference

### Playback
| Button | Action |
|--------|--------|
| ▶️ Play/Pause | Start or pause animation |
| ⏹️ Stop | Reset to beginning |
| 🔄 Loop | Toggle continuous playback |

### Keyframes
| Button | Action |
|--------|--------|
| ➕ Add Keyframe | Save current pose at current time |
| ➖ Delete Keyframe | Remove selected keyframe |

### File Operations
| Button | Action |
|--------|--------|
| 📄 New | Create new animation |
| 📂 Load | Import JSON animation |
| 💾 Save | Export JSON animation |

## 🖱️ Mouse Controls

### 3D Viewport
- **Left Click + Drag**: Rotate camera
- **Right Click + Drag**: Pan camera
- **Scroll Wheel**: Zoom in/out
- **Click on Body Part**: Select for manipulation

### Timeline
- **Click**: Jump to time
- **Click on Diamond**: Select keyframe
- **Pink Line**: Current playhead position

## 📊 Understanding the Timeline

```
Time Markers:  0.0s    1.0s    2.0s    3.0s
               |       |       |       |
Keyframes:     ◆-------◆-------◆-------◆
               ^               ^
            Selected        Unselected
            (Pink)          (Blue)
```

## 🎭 Body Parts You Can Animate

### Upper Body
- Head (tilt, turn, nod)
- Torso (tilt, turn, bend)
- Arms (straddle, turn, raise)
- Elbows (bend)
- Wrists (tilt, turn, bend)
- Fingers (individual control)

### Lower Body
- Pelvis (tilt, turn, bend)
- Legs (straddle, turn, raise)
- Knees (bend)
- Ankles (tilt, turn, bend)

### Full Body
- Body (root position and rotation)

## 💡 Pro Tips

### 🎯 Animation Principles

1. **Anticipation**: Add a small movement before the main action
2. **Follow-through**: Let body parts settle after movement
3. **Overlap**: Different parts move at different times
4. **Ease In/Out**: Movements slow at start and end

### 🔧 Technical Tips

1. **Keyframe Spacing**
   - Close together = slow movement
   - Far apart = fast movement

2. **Loop-Ready Animations**
   - First and last keyframe should be identical
   - Duration should match your loop timing

3. **Performance**
   - Keep animations under 10 seconds
   - Use 30 FPS for most cases
   - More keyframes = smoother but larger files

4. **Biological Constraints**
   - Enable for realistic poses
   - Disable for creative/impossible movements

## 📁 Sample Animations Included

### Walking (`walking.json`)
- Duration: 2.0s
- Keyframes: 3
- Shows: Basic locomotion

### Wave (`wave.json`)
- Duration: 3.0s
- Keyframes: 6
- Shows: Arm animation with wrist movement

### Jump (`jump.json`)
- Duration: 1.5s
- Keyframes: 5
- Shows: Vertical movement with arm coordination

## 🐛 Common Issues & Solutions

### Issue: Mannequin won't move
**Solution**: 
- Check if "Biological Constraints" is enabled
- Try clicking directly on the body part
- Reset pose and try again

### Issue: Animation is jerky
**Solution**:
- Add more keyframes between poses
- Increase FPS (try 60)
- Check keyframe timing

### Issue: Can't load animation
**Solution**:
- Verify JSON format is correct
- Check posture version is 7
- Ensure all keyframe times are within duration

### Issue: Timeline not showing keyframes
**Solution**:
- Refresh the page
- Check animation duration is set
- Verify keyframes were actually added

## 🎨 Color Guide

| Color | Meaning |
|-------|---------|
| 🟦 Blue | Unselected keyframe |
| 🟪 Purple | Primary UI elements |
| 🩷 Pink | Selected keyframe / Playhead |
| 🟢 Green | Play button / Success |
| 🔴 Red | Delete button / Danger |

## ⌨️ Future Keyboard Shortcuts

Coming soon:
- `Space` - Play/Pause
- `Home` - Jump to start
- `End` - Jump to end
- `Delete` - Delete selected keyframe
- `Ctrl+S` - Save animation
- `Ctrl+Z` - Undo
- `Ctrl+Y` - Redo

## 📚 JSON Format Quick Reference

```json
{
  "name": "Animation Name",
  "duration": 5.0,
  "fps": 30,
  "keyframes": [
    {
      "time": 0.0,
      "posture": {
        "version": 7,
        "data": [/* posture data */]
      }
    }
  ]
}
```

## 🚀 Advanced Features

### Inverse Kinematics
- Enable for automatic joint chain movement
- Useful for reaching specific positions
- More natural limb movement

### Biological Constraints
- Prevents impossible joint angles
- Based on human anatomy
- Can be disabled for creative freedom

### Posture Export
- Compatible with mannequin.js
- Can be used in other applications
- Standard format for sharing

## 📞 Need Help?

1. Check the full README.md
2. Review sample animations
3. Experiment with the interface
4. Check browser console for errors

## 🎓 Learning Path

1. **Beginner**: Load and play sample animations
2. **Intermediate**: Modify existing animations
3. **Advanced**: Create complex multi-part animations
4. **Expert**: Build animation libraries and sequences

---

**Happy Animating! 🎭✨**
