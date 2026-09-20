<template>
  <section
    id="main"
    :class="[
      $style.wrapper,
      isPlaying && $style.wrapperPlaying,
      showRotate && $style.wrapperNeedsRotate,
    ]"
  >
    <div :class="$style.media">
      <img
        :src="heroImage"
        :class="[
          $style.poster,
          { [$style.posterHidden]: isPlaying || showRotate },
        ]"
        alt=""
        width="1920"
        height="1080"
        decoding="async"
        loading="eager"
        fetchpriority="high"
      />
      <video
        ref="videoRef"
        :class="$style.video"
        loop
        muted
        playsinline
        preload="none"
        :poster="heroImage"
        @playing="isPlaying = true"
        @pause="isPlaying = false"
        @ended="isPlaying = false"
      >
        <source v-if="videoSrc" :src="videoSrc" type="video/webm" />
      </video>
    </div>

    <div :class="$style.headerWrap" @click.capture="onHeaderClick">
      <AppHeader />
    </div>

    <div v-if="showRotate" :class="$style.rotatePrompt" aria-live="polite">
      <img
        :src="rotatePhoneIcon"
        :class="$style.rotateIcon"
        alt="Поверните устройство горизонтально"
        width="115"
        height="120"
        decoding="async"
      />
    </div>

    <button
      v-if="isPlaying"
      type="button"
      :class="$style.pauseButton"
      aria-label="Пауза"
      @click="exitVideo"
    >
      <span :class="$style.pauseIcon" aria-hidden="true" />
    </button>

    <div v-show="!isPlaying && !showRotate" :class="$style.content">
      <div :class="$style.heroRow">
        <div :class="$style.heroCopy">
          <h1 :class="$style.title">
            <span :class="$style.titlePrimary">ИСКУССТВО УЕДИНЕНИЯ</span>
            <span :class="$style.titleSecondary">
              <span>ФИЛОСОФИЯ</span>
              <span>ТИШИНЫ</span>
            </span>
          </h1>
          <div :class="$style.descRow">
            <div :class="$style.desc">
              <p :class="$style.descLead">
                Приватная резиденция на берегу Волги — это эксклюзивный формат
                отдыха в сосновом лесу для тех, кто перерос классические
                загородные отели. Всего 15 минут от города, и вы попадаете в мир
                тишины и безупречного сервиса: три премиальных виллы, общий
                подогреваемый бассейн и вдохновляющий панорамный вид на Волгу и
                Жигулевские горы.
              </p>
              <p :class="$style.descTrail">
                Здесь вам не придется думать о мелочах: персональный консьерж
                полностью организует ваше пребывание — от изысканного питания до
                любых сценариев отдыха и развлечений.
              </p>
            </div>
            <button
              type="button"
              :class="$style.videoCircle"
              aria-label="Смотреть видеообзор резиденции"
              @click="onVideoClick"
            >
              <span :class="$style.videoCircleText">
                ВИДЕООБЗОР<br />РЕЗИДЕНЦИИ
              </span>
            </button>
          </div>
        </div>
      </div>

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
    </div>
  </section>
</template>

<script>
import AppHeader from "@app/components/AppHeader.vue";
import mainVideo from "@app/assets/video/main.webm";
import heroImage from "@app/assets/img/sections/main-block/hero.webp";
import rotatePhoneIcon from "@app/assets/img/sections/main-block/rotate_phone.svg";
export default {
  name: "MainBlock",
  components: {
    AppHeader,
  },
  data() {
    return {
      heroImage,
      rotatePhoneIcon,
      videoSrc: null,
      isPlaying: false,
      showRotate: false,
      features: [
        { icon: "mainBlockMapPin", text: "Уникальное\nрасположение" },
        { icon: "mainBlockUsers", text: "Размещение до\n30 гостей" },
        { icon: "mainBlockFlag", text: "Подогреваемый\nбассейн 12м." },
        {
          icon: "mainBlockEye",
          text: "Панорамный вид\nна волгу и горы",
        },
      ],
    };
  },
  mounted() {
    if (typeof window === "undefined") return;
    window.addEventListener("resize", this.onScreenChange);
    window.addEventListener("orientationchange", this.onScreenChange);
  },
  beforeUnmount() {
    if (typeof window === "undefined") return;
    window.removeEventListener("resize", this.onScreenChange);
    window.removeEventListener("orientationchange", this.onScreenChange);
  },
  methods: {
    isMobile() {
      return typeof window !== "undefined" && window.innerWidth <= 768;
    },
    isPortrait() {
      return (
        typeof window !== "undefined" && window.innerHeight > window.innerWidth
      );
    },
    onVideoClick() {
      if (this.isMobile() && this.isPortrait()) {
        this.showRotate = true;
        return;
      }
      this.startVideo();
    },
    onHeaderClick() {
      if (!this.showRotate) return;
      this.showRotate = false;
    },
    onScreenChange() {
      if (this.showRotate && !this.isPortrait()) {
        this.showRotate = false;
        this.startVideo();
        return;
      }
      if (this.isPlaying && this.isMobile() && this.isPortrait()) {
        this.$refs.videoRef?.pause();
        this.isPlaying = false;
        this.showRotate = true;
      }
    },
    async startVideo() {
      const video = this.$refs.videoRef;
      if (!video) return;
      if (!this.videoSrc) {
        this.videoSrc = mainVideo;
        await this.$nextTick();
        video.load?.();
      }
      this.showRotate = false;
      video.play().catch(() => {});
    },
    exitVideo() {
      this.$refs.videoRef?.pause();
      this.isPlaying = false;
      this.showRotate = false;
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
  display: flex;
  flex-direction: column;
  &.wrapperPlaying {
    :global(header) {
      position: relative;
      z-index: 4;
    }
    @include tablet {
      :global(header) {
        display: none;
      }
    }
  }
  &.wrapperNeedsRotate {
    :global(header) {
      position: relative;
      z-index: 4;
    }
    background: #2b2b2b;
    .media {
      background: #2b2b2b;
    }
  }
  .headerWrap {
    position: relative;
    z-index: 4;
  }
  .rotatePrompt {
    position: absolute;
    inset: 0;
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #2b2b2b;
    pointer-events: none;
    .rotateIcon {
      width: 7.1875rem;
      height: 7.5rem;
      object-fit: contain;
      @include tablet {
        width: 5.75rem;
        height: 6rem;
      }
    }
  }
  .media {
    position: absolute;
    inset: 0;
    z-index: 0;
    background: #000;
    .poster {
      position: absolute;
      inset: 0;
      z-index: 2;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 1;
      transition: opacity 0.25s ease;
      pointer-events: none;
      &.posterHidden {
        opacity: 0;
        visibility: hidden;
      }
    }
    .video {
      position: absolute;
      inset: 0;
      z-index: 1;
      width: 100%;
      height: 100%;
      object-fit: cover;
      background: transparent;
    }
  }
  .pauseButton {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;
    width: 10rem;
    height: 10rem;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.55);
    background: $bg-transparent-16;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    transition: background 0.2s ease;
    &:hover {
      background: $bg-transparent-40;
    }
    @include laptop {
      width: 8rem;
      height: 8rem;
    }
    @include tablet {
      width: 6rem;
      height: 6rem;
    }
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
    @include laptop {
      width: 1.5rem;
      height: 2.25rem;
      gap: 0.375rem;
      &::before,
      &::after {
        width: 0.55rem;
        height: 2.25rem;
      }
    }
    @include tablet {
      width: 1.125rem;
      height: 1.75rem;
      gap: 0.3rem;
      &::before,
      &::after {
        width: 0.4rem;
        height: 1.75rem;
      }
    }
  }
  .content {
    position: relative;
    z-index: 2;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 8rem;
    width: 100%;
    max-width: min(105rem, 1680px);
    margin: 0 auto;
    padding: 5rem 2.5rem 2.5rem;
    box-sizing: border-box;
    @include laptop {
      padding: 2rem;
    }
    @include tablet {
      padding: 0.75rem 1rem 1.25rem;
      gap: 1.25rem;
      justify-content: flex-start;
    }
    .heroRow {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      min-height: 0;
      width: 100%;
      @include tablet {
        flex: 0 0 auto;
        justify-content: flex-start;
      }
      .heroCopy {
        display: flex;
        flex-direction: column;
        gap: 5rem;
        width: 100%;
        min-width: 0;
        @include laptop {
          gap: 5.25rem;
        }
        @include tablet {
          gap: 1.25rem;
        }
        .title {
          display: flex;
          flex-direction: column;
          margin: 0;
          font-weight: 400;
          text-transform: uppercase;
          line-height: 1;
          .titlePrimary {
            display: block;
            font-size: 4.5rem;
            letter-spacing: -0.04em;
            color: $text-white;
            @include laptop {
              font-size: 3rem;
            }
            @include tablet {
              width: 100%;
              font-size: 1.75rem;
              letter-spacing: -0.04em;
              white-space: nowrap;
            }
          }
          .titleSecondary {
            display: flex;
            justify-content: space-between;
            gap: 1.5rem;
            width: 100%;
            font-size: 4.5rem;
            letter-spacing: -0.04em;
            color: $text-accent;
            @include laptop {
              font-size: 3rem;
            }
            @include tablet {
              font-size: 1.5rem;
              letter-spacing: -0.04em;
              gap: 0.75rem;
            }
          }
        }
        .descRow {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 2rem;
          width: 100%;
          @include tablet {
            display: grid;
            grid-template-columns: 1fr;
            grid-template-areas:
              "lead"
              "video"
              "trail";
            gap: 2.625rem;
            align-items: stretch;
          }
          .desc {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            max-width: 30rem;
            min-width: 0;
            @include tablet {
              display: contents;
              max-width: none;
            }
            p {
              margin: 0;
              font-size: 1.125rem;
              font-weight: 600;
              line-height: 1.2;
              color: $text-white;
              @include laptop {
                font-size: 1rem;
              }
              @include tablet {
                font-size: 0.875rem;
                font-weight: 400;
              }
            }
            .descLead {
              @include tablet {
                grid-area: lead;
              }
            }
            .descTrail {
              @include tablet {
                grid-area: trail;
              }
            }
          }
          .videoCircle {
            flex-shrink: 0;
            width: 15rem;
            height: 15rem;
            border-radius: 50%;
            border: 2px solid $bg-white;
            background: transparent;
            color: $text-white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            transition:
              background 0.2s ease,
              border-color 0.2s ease;
            &:hover {
              background: rgba(255, 255, 255, 0.08);
              border-color: $text-white;
            }
            @include laptop {
              width: 12.5rem;
              height: 12.5rem;
            }
            @include tablet {
              grid-area: video;
              justify-self: center;
              background: $bg-overlay;
              border: none;
            }
            .videoCircleText {
              font-size: 1.125rem;
              font-weight: 600;
              line-height: 1.2;
              text-align: center;
              text-transform: uppercase;
              @include laptop {
                font-size: 0.75rem;
                max-width: 6rem;
              }
              @include tablet {
                font-size: 0.8125rem;
                line-height: 1.2;
                max-width: 7rem;
              }
            }
          }
        }
      }
    }
    .features {
      max-width: 57rem;
      width: 100%;
      margin: 0 auto;
      display: flex;
      align-items: stretch;
      gap: 3rem;
      height: 8.875rem;
      padding: 1.2375rem 1.5rem;
      border-radius: 0.5rem;
      background: $bg-overlay;
      backdrop-filter: blur(2px);
      -webkit-backdrop-filter: blur(2px);
      box-sizing: border-box;
      @include tablet {
        max-width: none;
        height: auto;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0;
        padding: 0;
        margin-top: auto;
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
      }
      .featureItem {
        position: relative;
        flex: 1 1 0;
        min-width: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        text-align: center;
        &:not(:last-child)::after {
          content: "";
          position: absolute;
          top: 50%;
          right: -1.5rem;
          transform: translate(50%, -50%);
          width: 1px;
          height: 6.4rem;
          background: $text-accent;
        }
        @include tablet {
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
          gap: 0.75rem;
          padding: 0.75rem;
          text-align: left;
          &:not(:last-child)::after {
            display: none;
          }
          &:nth-child(odd) {
            border-right: 1px solid rgba($text-accent, 0.5);
          }
          &:nth-child(-n + 2) {
            border-bottom: 1px solid rgba($text-accent, 0.5);
          }
        }
        .featureIcon {
          width: 3rem;
          height: 3rem;
          object-fit: contain;
          flex-shrink: 0;
          @include tablet {
            width: 1.625rem;
            height: 1.625rem;
          }
        }
        .featureText {
          margin: 0;
          font-size: 1rem;
          line-height: 1.2;
          font-weight: 600;
          text-align: center;
          color: $text-white;
          white-space: pre-line;
          @include tablet {
            font-size: 0.75rem;
            font-weight: 300;
            line-height: 1.2;
            text-align: left;
            letter-spacing: -0.04em;
          }
        }
      }
    }
  }
}
</style>
