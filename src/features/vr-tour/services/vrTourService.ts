import { VR_TOURS } from '../constants/vrToursData';
import { MonumentVrTour, VrScene } from '../types';

export const vrTourService = {
  getAllTours(): MonumentVrTour[] {
    return VR_TOURS;
  },

  getTourByMonumentId(monumentId: string): MonumentVrTour | undefined {
    return VR_TOURS.find((t) => t.monumentId === monumentId);
  },

  getTourById(tourId: string): MonumentVrTour | undefined {
    return VR_TOURS.find((t) => t.id === tourId);
  },

  getScene(tour: MonumentVrTour, sceneId?: string): VrScene {
    if (!sceneId) {
      return tour.scenes.find((s) => s.id === tour.defaultSceneId) || tour.scenes[0];
    }
    return tour.scenes.find((s) => s.id === sceneId) || tour.scenes[0];
  },
};
