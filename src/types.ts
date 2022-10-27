export type VideoState = {
  loaded: boolean;
  playing: boolean;
  ended: boolean;
};

export type UseVideo = [VideoState, HTMLVideoElement];
