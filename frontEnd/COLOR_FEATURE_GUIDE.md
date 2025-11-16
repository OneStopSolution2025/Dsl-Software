# Color Customization Feature - User Guide

## How to Use the New Color System

### Step 1: Place a Marker
1. Navigate to **Step 3: Road Map** in the insurance claims workflow
2. Browse the **Icon Palette** on the left side
3. Click on any category to expand it (Vehicles, Pedestrians, Direction, etc.)
4. **Drag an icon** onto the map or **click an icon** then click on the map

### Step 2: Automatic Default Color
- When you place a marker, it automatically gets a default color:
  - 🚗 **Vehicles**: Blue
  - 👤 **Pedestrians**: Amber/Orange
  - ➡️ **Directions**: Red
  - 🌳 **Environment**: Green
  - 🚦 **Traffic**: Red
  - 🏢 **Buildings**: Slate/Grey

### Step 3: Change the Color
1. **Click on any placed marker** on the map
2. The **Transform Controls** toolbar appears near the marker
3. Click the **🎨 Palette button** (shows current color dot)
4. A color picker dropdown appears with:
   - **12 Preset Colors**: Quick selection grid
   - **Custom Color Picker**: Choose any color you want

### Step 4: Select Your Color
**Option A - Preset Colors:**
- Click any of the 12 colorful circles
- Color applies instantly to the marker
- Dropdown closes automatically

**Option B - Custom Color:**
- Use the color input at the bottom
- Click to open your system color picker
- Select any custom color
- Color applies in real-time as you adjust

### Step 5: Verify the Change
- The marker on the map updates immediately
- The **Marker List** below shows the new color
- A color dot appears next to the marker name
- The color persists through all transforms

## Color Picker Interface

```
┌──────────────────────────────┐
│ Select Color                 │
├──────────────────────────────┤
│ ⚫ 🔵 🔴 🟢 🟡 🟣            │
│ 🩷 🩵 🟢 🟠 ⚪ ⚫            │
├──────────────────────────────┤
│ Custom                       │
│ [████████████████████]       │
└──────────────────────────────┘
```

## Transform Controls Toolbar

When you click a marker, you see:

```
┌─────────────────────────────────────────────────────┐
│ ↺  ↻  🔍+  🔍-  ↔️  ↕️  🎨  🗑️                      │
└─────────────────────────────────────────────────────┘
   │   │   │    │    │    │    │   │
   │   │   │    │    │    │    │   └─ Delete marker
   │   │   │    │    │    │    └───── Change color ⬅️ NEW!
   │   │   │    │    │    └────────── Flip vertical
   │   │   │    │    └─────────────── Flip horizontal  
   │   │   │    └──────────────────── Scale down
   │   │   └───────────────────────── Scale up
   │   └───────────────────────────── Rotate clockwise
   └───────────────────────────────── Rotate counter-clockwise
```

## Practical Examples

### Example 1: Two-Vehicle Accident
1. Place first **car** icon (automatically blue)
2. Place second **car** icon (automatically blue)
3. Click first car → Click palette → Select **RED**
4. Click second car → Keep as **BLUE**
5. Now you can clearly differentiate: Red car vs Blue car

### Example 2: Pedestrian Crossing Incident
1. Place **woman** icon (automatically amber)
2. Place **car** icon (automatically blue)
3. Place **pedestrian-crossing** icon (automatically red)
4. Click woman → Change to **PINK** (injured party)
5. Click car → Change to **RED** (at-fault vehicle)
6. Keep crossing marker as red

### Example 3: Complex Junction Scene
1. Place 3 **car** icons
2. Color them: **RED** (Vehicle A), **BLUE** (Vehicle B), **GREEN** (Vehicle C)
3. Place **arrow-straight** for each vehicle
4. Match arrow colors to vehicles: Red arrow for red car, etc.
5. Place **traffic-light** and color it **AMBER** (on yellow light)

## Tips & Best Practices

### 🎯 Color Coding Strategies

**By Fault/Involvement:**
- 🔴 Red: Primary/at-fault party
- 🔵 Blue: Secondary party
- 🟢 Green: Third party/witness
- 🟡 Amber: Pedestrians

**By Severity:**
- 🔴 Red: High severity
- 🟠 Orange: Medium severity
- 🟡 Yellow: Low severity
- 🟢 Green: No damage

**By Direction:**
- Match vehicle colors to their direction arrows
- Example: Red car → Red arrow

**For Visibility:**
- Use contrasting colors for overlapping markers
- Avoid similar colors (blue/cyan, red/pink) unless intentional
- Use white/black for high contrast needs

### ⚡ Quick Tips

1. **Default Colors Work**: Don't change unless needed for differentiation
2. **Consistent Scheme**: Use same color scheme across multiple accidents
3. **Color in Reports**: Colors show in screenshot captures
4. **Marker List**: Check the list to see all colors at once
5. **Click Outside**: Click anywhere to close color picker

## Troubleshooting

**Q: Color picker won't open?**
- Make sure you've selected a marker first (click on it)
- Check that Transform Controls toolbar is visible

**Q: Color not changing?**
- Click directly on the color circle or adjust the custom picker
- Check if marker is still selected

**Q: Lost which marker is which color?**
- Check the **Marker List** below the map
- Each marker shows its icon and color dot

**Q: Want to reset to default color?**
- Remember the default colors by category
- Or delete and re-place the marker

**Q: Colors not showing in screenshot?**
- Colors are captured in the map screenshot
- Ensure markers are visible before capturing

## Advanced Features

### Custom Color Values
You can enter hex codes directly if you know them:
- Insurance company brand colors
- Traffic light colors (#FF0000 red, #FFA500 amber, #00FF00 green)
- Standardized color schemes

### Color Consistency
- Same icon type can have different colors
- Example: Place 5 cars in 5 different colors
- Great for multi-vehicle accidents

### Color and Transforms
- Colors work with all transformations:
  - ✅ Scale up/down
  - ✅ Rotate
  - ✅ Flip horizontal/vertical
  - ✅ Position changes

---

**Feature Status**: ✅ Live and Ready to Use  
**Total Colors**: 12 presets + unlimited custom  
**Works With**: All 30 icon types across 6 categories
