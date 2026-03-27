<template>
  <section id="main" :class="$style.wrapper">
    <div :class="$style.media">
      <picture v-if="posterWebpUrl">
        <source :srcset="posterWebpUrl" type="image/webp" />
        <img
          :src="posterJpgUrl"
          :class="[$style.poster, { [$style.posterHidden]: isPlaying }]"
          alt=""
          width="1920"
          height="1080"
          decoding="async"
          loading="eager"
          fetchpriority="high"
        />
      </picture>
      <video
        ref="videoRef"
        :class="$style.video"
        loop
        muted
        playsinline
        preload="none"
        :poster="posterJpgUrl"
        @pause="isPlaying = false"
        @ended="isPlaying = false"
        @playing="onVideoPlaying"
      >
        <source v-if="videoSrc" :src="videoSrc" type="video/webm" />
      </video>
      <button
        type="button"
        :class="[
          $style.videoButton,
          { [$style.videoButtonPlaying]: isPlaying },
        ]"
        :aria-label="isPlaying ? 'Пауза' : 'Смотреть видео'"
        @click="isPlaying ? pauseVideo() : playVideo()"
      >
        <span :class="$style.iconFlipContainer">
          <span
            :class="[
              $style.iconWrap,
              $style.iconPlay,
              { [$style.iconFlipped]: isPlaying },
            ]"
            aria-hidden="true"
          >
            <span :class="$style.playIcon" />
          </span>
          <span
            :class="[
              $style.iconWrap,
              $style.iconPause,
              { [$style.iconFlipped]: !isPlaying },
            ]"
            aria-hidden="true"
          >
            <span :class="$style.pauseIcon" />
          </span>
        </span>
      </button>
    </div>

    <AppHeader />

    <div :class="$style.features">
      <div
        v-for="item in features"
        :key="item.text"
        :class="$style.featureItem"
      >
        <AppIcon
          :name="item.icon"
          :alt="item.text"
          :class="$style.featureIcon"
        />
        <span :class="$style.featureText">{{ item.text }}</span>
      </div>
    </div>
  </section>
</template>

<script>
import AppHeader from "@app/components/AppHeader.vue";
import mainVideo from "@app/assets/video/main.webm";

export default {
  name: "MainBlock",
  components: {
    AppHeader,
  },
  setup() {
    const { app } = useRuntimeConfig();
    const baseURL = app?.baseURL || "/";
    const publicBaseURL = baseURL.endsWith("/") ? baseURL : `${baseURL}/`;
    return { publicBaseURL };
  },
  data() {
    return {
      // Lazy-load video only on user interaction to cut initial payload/TTFB
      videoSrc: null,
      isPlaying: false,
      features: [
        { icon: "mainBlockMapPin", text: "Уникальное расположение" },
        { icon: "mainBlockUsers", text: "Размещение до 30 гостей" },
        { icon: "mainBlockFlag", text: "Подогреваемый бассейн 12м." },
        { icon: "mainBlockEye", text: "Панорамный\u00A0вид\nна\u00A0горы\u00A0и\u00A0волгу" },
      ],
    };
  },
  computed: {
    posterWebpUrl() {
      return `${this.publicBaseURL}main-poster.webp`;
    },
    posterJpgUrl() {
      // Fallback for browsers/video-poster that may not support WebP
      return `${this.publicBaseURL}main-poster.webp`;
    },
  },
  methods: {
    async playVideo() {
      const video = this.$refs.videoRef;
      if (!video) return;
      if (!this.videoSrc) {
        this.videoSrc = mainVideo;
        await this.$nextTick();
        video.load?.();
      }
      video.play().catch(() => {});
    },
    onVideoPlaying() {
      this.isPlaying = true;
    },
    pauseVideo() {
      const video = this.$refs.videoRef;
      if (!video) return;
      video.pause();
    },
  },
};
</script>

<style lang="scss" module>
.wrapper {
  position: relative;
  color: $text-white;
  min-height: 100vh;
  overflow: hidden;
}

.media {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: #000;
}

.poster {
  position: absolute;
  inset: 0;
  // Keep preview above the <video> element, because the video has no source
  // until user interaction and otherwise paints its own (black) background.
  z-index: 2;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 1;
  // Use filter instead of opacity so layers behind never show through.
  filter: brightness(0.85);
  transition: opacity 0.25s ease;
  pointer-events: none;
}

.posterHidden {
  opacity: 0;
  visibility: hidden;
}

.video {
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  object-fit: cover;
  // Don’t paint a black rectangle above the poster while the video source is not loaded.
  background: transparent;
  opacity: 1;
  // Match poster look without allowing bleed-through.
  filter: brightness(0.85);
}

.videoButton {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
  width: 10rem;
  height: 10rem;
  border-radius: 50%;
  border: none;
  background: $bg-transparent-16;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background 0.2s,
    backdrop-filter 0.2s;

  &:hover {
    background: $bg-transparent-40;
  }

  &.videoButtonPlaying {
    background: transparent;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;

    &:hover {
      background: $bg-transparent-16;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }
  }
}

.iconFlipContainer {
  position: relative;
  width: 3rem;
  height: 3rem;
  perspective: 120px;
  perspective-origin: center;
  transform-style: preserve-3d;
}

.iconWrap {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.iconPlay {
  transform: rotateY(0deg);

  &.iconFlipped {
    transform: rotateY(-180deg);
  }
}

.iconPause {
  transform: rotateY(180deg);

  &:not(.iconFlipped) {
    transform: rotateY(0deg);
  }
}

.playIcon {
  width: 0;
  height: 0;
  margin-left: 1.75rem;
  border-style: solid;
  border-width: 1.5rem 1.5rem 1.5rem 2.5rem;
  border-color: transparent transparent transparent $text-white;
}

.pauseIcon {
  width: 2rem;
  height: 3rem;
  display: flex;
  gap: 0.5rem;
  align-items: stretch;

  &::before,
  &::after {
    content: "";
    width: 0.75rem;
    height: 3rem;
    background: $text-white;
    border-radius: 2px;
  }
}

.features {
  max-width: 110rem;
  margin: 0 auto;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  justify-content: center;
  flex-wrap: wrap;
  padding: 1.5rem 1rem;
  @include mobile {
    grid-template-columns: repeat(2, 1fr);
    padding: 0.75rem 0.5rem 1rem;
    gap: 0.25rem;
  }
}

.featureItem {
  display: flex;
  align-items: center;
  width: auto;
  gap: 1.5rem;
  text-align: center;
  padding: 1.5rem;
  @include tablet {
    padding: 1rem 1.25rem;
    gap: 1rem;
  }
  @include mobile {
    padding: 0.5rem 0.375rem;
    gap: 0.5rem;
  }
}

.featureIcon {
  width: 3rem;
  height: 3rem;
  object-fit: contain;
  filter: brightness(0) invert(1);
  @include tablet {
    width: 2.5rem;
    height: 2.5rem;
  }
  @include mobile {
    width: 1.5rem;
    height: 1.5rem;
    flex-shrink: 0;
  }
}

.featureText {
  font-size: 1.5rem;
  line-height: 1.3;
  font-weight: 600;
  text-align: left;
  white-space: pre-line;
  max-width: 14rem;
  @include tablet {
    font-size: 1rem;
    max-width: 10rem;
  }
  @include mobile {
    font-size: 0.6875rem;
    line-height: 1.25;
    max-width: none;
    font-weight: 300;
  }
}
</style>
