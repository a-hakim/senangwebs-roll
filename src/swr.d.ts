export as namespace SWR;

declare class SWR {
  constructor(selector: string | HTMLElement, config?: SWR.Config);
  static getInstance(selector: string | HTMLElement): SWR | null;
  static initAll(root?: ParentNode): SWR[];

  next(): void;
  prev(): void;
  goTo(index: number): void;

  addItem(item: SWR.Item, index?: number | null): void;
  removeItem(index: number): void;
  getCurrentIndex(): number;
  getTotalItems(): number;

  play(): void;
  pause(): void;
  isPlaying(): boolean;

  on(event: 'mediaPlaybackError', callback: SWR.EventCallback<{ index: number; error: unknown }>): () => void;
  on(event: string, callback: SWR.EventCallback): () => void;
  off(event: string, callback: SWR.EventCallback): void;
  getConfig(): SWR.ResolvedConfig;

  destroy(): void;
}

declare namespace SWR {
  type EventCallback<T = any> = (data: T) => void;

  interface Config {
    aspectRatio?: string;
    loop?: boolean;
    autoplay?: boolean;
    autoplayInterval?: number;
    enableKeyboard?: boolean;
    enableTouch?: boolean;
    enableWheel?: boolean;
    enableMouseDrag?: boolean;
    enableAutoplayPauseOnInteraction?: boolean;
    autoplayResumeDelay?: number;
    transitionDuration?: number;
    swipeThreshold?: number;
    items?: Item[];
  }

  interface ResolvedConfig {
    aspectRatio: string;
    loop: boolean;
    autoplay: boolean;
    autoplayInterval: number;
    enableKeyboard: boolean;
    enableTouch: boolean;
    enableWheel: boolean;
    enableMouseDrag: boolean;
    enableAutoplayPauseOnInteraction: boolean;
    autoplayResumeDelay: number;
    transitionDuration: number;
    swipeThreshold: number;
    items: Item[];
  }

  interface VideoItem {
    type: 'video';
    src: string;
    mimeType?: string;
    autoplay?: boolean;
    muted?: boolean;
    playsinline?: boolean;
    loop?: boolean;
    controls?: boolean;
  }

  interface ImageItem {
    type: 'image';
    src: string;
    alt?: string;
    title?: string;
  }

  interface HTMLItem {
    type: 'html';
    content: string;
  }

  type Item = VideoItem | ImageItem | HTMLItem;
}

export = SWR;
