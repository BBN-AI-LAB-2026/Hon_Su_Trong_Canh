export interface TourHotspot {
  id: string;
  yaw: number; // Horizontal angle (0 to 360)
  pitch: number; // Vertical angle (-90 to 90)
  title: string;
  description: string;
  targetSceneId?: string;
}

export interface VrScene {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  hotspots?: TourHotspot[];
}

export interface MonumentVrTour {
  id: string;
  monumentId: string;
  monumentName: string;
  location: string;
  defaultSceneId: string;
  scenes: VrScene[];
}
