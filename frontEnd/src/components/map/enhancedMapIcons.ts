import * as Icons from './MapIconsSVG';

export interface MapIcon {
  id: string;
  type: string;
  component: React.ComponentType<{ color?: string; size?: number }>;
  label: string;
  category: string;
  defaultColor: string;
  colorChangeable: boolean;
}

export const enhancedMapIcons: MapIcon[] = [
  // ==================== VEHICLES ====================
  { id: 'v001', type: 'car', component: Icons.CarIcon, label: 'Car', category: 'Vehicles', defaultColor: '#183159ff', colorChangeable: true },
  { id: 'v002', type: 'bike', component: Icons.BikeIcon, label: 'Bike', category: 'Vehicles', defaultColor: '#EF4444', colorChangeable: true },
  { id: 'v003', type: 'pickup-truck', component: Icons.PickupTruckIcon, label: 'Pickup Truck', category: 'Vehicles', defaultColor: '#10B981', colorChangeable: true },
  { id: 'v004', type: 'lorry', component: Icons.LorryIcon, label: 'Lorry', category: 'Vehicles', defaultColor: '#F59E0B', colorChangeable: true },
  { id: 'v005', type: 'van', component: Icons.VanIcon, label: 'Van', category: 'Vehicles', defaultColor: '#8B5CF6', colorChangeable: true },
  { id: 'v006', type: 'bus', component: Icons.BusIcon, label: 'Bus', category: 'Vehicles', defaultColor: '#EC4899', colorChangeable: true },

  // ==================== PEDESTRIANS ====================
  { id: 'p001', type: 'man', component: Icons.ManIcon, label: 'Man', category: 'Pedestrians', defaultColor: '#5AC1F2', colorChangeable: true },
  { id: 'p002', type: 'woman', component: Icons.WomanIcon, label: 'Woman', category: 'Pedestrians', defaultColor: '#F576AB', colorChangeable: true },
  { id: 'p003', type: 'child', component: Icons.ChildIcon, label: 'Child', category: 'Pedestrians', defaultColor: '#EAB308', colorChangeable: true },

  // ==================== DIRECTIONAL ARROWS ====================
  { id: 'd001', type: 'straight-arrow', component: Icons.StraightArrowIcon, label: 'Straight', category: 'Direction', defaultColor: '#059669', colorChangeable: false },
  { id: 'd002', type: 'turn-arrow', component: Icons.TurnArrowIcon, label: 'Turn', category: 'Direction', defaultColor: '#DC2626', colorChangeable: false },
  { id: 'd003', type: 'u-turn-arrow', component: Icons.UTurnArrowIcon, label: 'U-Turn', category: 'Direction', defaultColor: '#DC2626', colorChangeable: false },
  { id: 'd004', type: 'railway-cross', component: Icons.RailwayCrossingIcon, label: 'Railway Cross', category: 'Direction', defaultColor: '#DC2626', colorChangeable: false },
  { id: 'd004', type: 'impact-blast', component: Icons.ImpactBlastIcon, label: 'Impact Blast', category: 'Direction', defaultColor: '#FF0000', colorChangeable: false },

  // ==================== ENVIRONMENT ====================
  { id: 'e001', type: 'tree', component: Icons.TreeIcon, label: 'Tree', category: 'Environment', defaultColor: '#16A34A', colorChangeable: false },
  { id: 'e002', type: 'grass-verge', component: Icons.GrassVergeIcon, label: 'Grass Verge', category: 'Environment', defaultColor: '#84CC16', colorChangeable: false },
  { id: 'e003', type: 'drain', component: Icons.DrainIcon, label: 'Drain', category: 'Environment', defaultColor: '#6B7280', colorChangeable: false },

  // ==================== TRAFFIC ====================
  { id: 't001', type: 'traffic-light', component: Icons.TrafficLightIcon, label: 'Traffic Light', category: 'Traffic', defaultColor: '#EAB308', colorChangeable: false },
  { id: 't002', type: 'cctv', component: Icons.CCTVIcon, label: 'CCTV', category: 'Traffic', defaultColor: '#475569', colorChangeable: false },
  { id: 't003', type: 'pedestrian-crossing', component: Icons.PedestrianCrossingIcon, label: 'Pedestrian Crossing', category: 'Traffic', defaultColor: '#000000', colorChangeable: false },
  { id: 't004', type: 'yellow-box', component: Icons.YellowBoxIcon, label: 'Yellow Box', category: 'Traffic', defaultColor: '#FCD34D', colorChangeable: false },
  { id: 't005', type: 'no-entry', component: Icons.NoEntryIcon, label: 'No Entry', category: 'Traffic', defaultColor: '#DC2626', colorChangeable: false },
  { id: 't006', type: 'one-way', component: Icons.OneWayIcon, label: 'One Way', category: 'Traffic', defaultColor: '#1E40AF', colorChangeable: false },

  // ==================== BUILDINGS ====================
  { id: 'b001', type: 'school', component: Icons.SchoolIcon, label: 'School', category: 'Buildings', defaultColor: '#7C3AED', colorChangeable: true },
  { id: 'b002', type: 'shops', component: Icons.ShopsIcon, label: 'Shops', category: 'Buildings', defaultColor: '#F97316', colorChangeable: true },
  { id: 'b003', type: 'factory', component: Icons.FactoryIcon, label: 'Factory', category: 'Buildings', defaultColor: '#64748B', colorChangeable: true },
  { id: 'b004', type: 'bus-stop', component: Icons.BusStopIcon, label: 'Bus Stop', category: 'Buildings', defaultColor: '#0EA5E9', colorChangeable: true },
  { id: 'b005', type: 'office-building', component: Icons.OfficeBuildingIcon, label: 'Office Building', category: 'Buildings', defaultColor: '#334155', colorChangeable: true },
];

export const iconCategories = [
  'Vehicles',
  'Pedestrians',
  'Direction',
  'Environment',
  'Traffic',
  'Buildings',
];

export const getIconByType = (type: string) => {
  return enhancedMapIcons.find(icon => icon.type === type);
};

export const getIconsByCategory = (category: string) => {
  return enhancedMapIcons.filter(icon => icon.category === category);
};

export const isIconColorChangeable = (type: string): boolean => {
  const icon = getIconByType(type);
  return icon?.colorChangeable ?? false;
};
