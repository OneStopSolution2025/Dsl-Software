# Map Icon Reference Guide

## Quick Reference Table

| Icon Type | Category | Default Color | Usage |
|-----------|----------|---------------|-------|
| **car** | Vehicles | Blue (#3B82F6) | Standard passenger vehicle |
| **bike** | Vehicles | Blue (#3B82F6) | Motorcycle or bicycle |
| **pickup** | Vehicles | Blue (#3B82F6) | Pickup truck |
| **lorry** | Vehicles | Blue (#3B82F6) | Large truck/lorry |
| **van** | Vehicles | Blue (#3B82F6) | Van or minibus |
| **bus** | Vehicles | Blue (#3B82F6) | Public bus |
| **man** | Pedestrians | Amber (#F59E0B) | Male pedestrian |
| **woman** | Pedestrians | Amber (#F59E0B) | Female pedestrian |
| **child** | Pedestrians | Amber (#F59E0B) | Child pedestrian |
| **arrow-straight** | Direction | Red (#EF4444) | Direction of travel |
| **arrow-turn** | Direction | Red (#EF4444) | Turn or maneuver |
| **impact-blast** | Direction | Red (#EF4444) | Point of impact |
| **tree** | Environment | Green (#10B981) | Tree or vegetation |
| **grass-verge** | Environment | Green (#10B981) | Grass area |
| **drain** | Environment | Green (#10B981) | Drain or gutter |
| **traffic-light** | Traffic | Red (#EF4444) | Traffic signal |
| **cctv** | Traffic | Red (#EF4444) | Security camera |
| **pedestrian-crossing** | Traffic | Red (#EF4444) | Crosswalk |
| **yellow-box** | Traffic | Red (#EF4444) | No-stop zone |
| **no-entry** | Traffic | Red (#EF4444) | No entry sign |
| **one-way** | Traffic | Red (#EF4444) | One-way street |
| **school** | Buildings | Slate (#64748B) | School building |
| **shops** | Buildings | Slate (#64748B) | Retail stores |
| **factory** | Buildings | Slate (#64748B) | Industrial facility |
| **bus-stop** | Buildings | Slate (#64748B) | Bus stop location |
| **office-building** | Buildings | Slate (#64748B) | Office complex |

## Icon Type Values (for API/Database)

```typescript
// Vehicle Types
'car'
'bike'
'pickup'
'lorry'
'van'
'bus'

// Pedestrian Types
'man'
'woman'
'child'

// Direction Types
'arrow-straight'
'arrow-turn'
'impact-blast'

// Environment Types
'tree'
'grass-verge'
'drain'

// Traffic Types
'traffic-light'
'cctv'
'pedestrian-crossing'
'yellow-box'
'no-entry'
'one-way'

// Building Types
'school'
'shops'
'factory'
'bus-stop'
'office-building'
```

## Available Preset Colors

| Color Name | Hex Code | Use Case |
|------------|----------|----------|
| Black | #000000 | High contrast, text markers |
| Blue | #3B82F6 | Default vehicles, water features |
| Red | #EF4444 | Danger, impact points, violations |
| Green | #10B981 | Safe zones, vegetation, clear paths |
| Amber | #F59E0B | Warnings, pedestrians, caution areas |
| Purple | #8B5CF6 | Special zones, authorities |
| Pink | #EC4899 | Injured parties, emergency services |
| Cyan | #06B6D4 | Wet conditions, water |
| Lime | #84CC16 | Emergency vehicles, safety equipment |
| Orange | #F97316 | Construction, temporary markers |
| Slate | #64748B | Infrastructure, buildings |
| White | #FFFFFF | Visibility markers, contrast |

## Common Use Cases

### Motor Vehicle Accident
```
- car (red) - Vehicle 1
- car (blue) - Vehicle 2
- impact-blast (red) - Point of collision
- arrow-straight (red) - Direction of Vehicle 1
- arrow-straight (blue) - Direction of Vehicle 2
- traffic-light (green) - Nearby traffic control
- cctv (slate) - Surveillance camera location
```

### Pedestrian Incident
```
- car (blue) - Involved vehicle
- woman (amber) - Pedestrian
- pedestrian-crossing (red) - Location
- tree (green) - Visibility obstruction
- bus-stop (slate) - Nearby reference point
```

### Multi-Vehicle Collision
```
- car (red) - Vehicle 1
- car (blue) - Vehicle 2
- lorry (green) - Vehicle 3
- impact-blast (red) - Primary impact
- arrow-turn (red) - Turning maneuver
- yellow-box (amber) - Junction marking
```

## Color Coding Best Practices

### By Involvement
- **Red**: Primary party/at-fault vehicle
- **Blue**: Secondary party/other vehicle
- **Green**: Third party/witness vehicle
- **Amber**: Pedestrians/vulnerable road users

### By Severity
- **Red**: High severity/danger
- **Orange**: Medium severity/caution
- **Yellow**: Low severity/warning
- **Green**: Safe/clear

### By Category
- **Vehicle colors**: Different colors per vehicle
- **Environment**: Green tones
- **Traffic control**: Red/amber
- **Buildings**: Grey/slate tones
- **Directions**: Match vehicle colors

## Icon Transform Operations

All icons support:
- **Scale**: 0.2 - 3.0x (adjustable by 0.2 increments)
- **Rotation**: 0° - 360° (adjustable by 15° increments)
- **Flip Horizontal**: Yes/No
- **Flip Vertical**: Yes/No
- **Color**: Any hex color value

## Keyboard Shortcuts (Future)

Planned shortcuts for power users:
- `C` - Open color picker
- `R` - Rotate 15°
- `Shift+R` - Rotate -15°
- `+` - Scale up
- `-` - Scale down
- `H` - Flip horizontal
- `V` - Flip vertical
- `Delete` - Remove marker

---

**Last Updated**: January 2025  
**Total Icons**: 30  
**Categories**: 6
