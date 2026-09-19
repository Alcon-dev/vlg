<template>
  <div :class="$style.wrapper">
    <div :class="$style.info">
      <h4 :class="$style.title">{{ title }}</h4>
      <div :class="$style.meta">
        <p :class="$style.description">{{ description }}</p>
        <p :class="$style.distance">
          {{ distance.value }}<span>{{ distance.type }}</span>
        </p>
      </div>
    </div>
    <div
      :class="[
        $style.images,
        laptopImageLimit === 1 && $style.imagesLimit1,
        laptopImageLimit === 2 && $style.imagesLimit2,
      ]"
    >
      <img
        v-for="(image, index) in images"
        :key="index"
        :src="getImageSrc(image)"
        :alt="title"
        :class="getImageClasses(image)"
        :width="getImageWidth(image)"
        :height="getImageHeight(image)"
        loading="lazy"
        decoding="async"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "Attraction",
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
      required: true,
    },
    distance: {
      type: Object,
      required: true,
      validator(d) {
        return typeof d?.value !== "undefined" && typeof d?.type === "string";
      },
    },
    laptopImageLimit: {
      type: Number,
      default: null,
      validator(v) {
        return v == null || v === 1 || v === 2;
      },
    },
  },
  methods: {
    getImageSrc(image) {
      return typeof image === "string" ? image : image.src;
    },
    getImageSize(image) {
      return typeof image === "object" && image.size ? image.size : "medium";
    },
    getLaptopImageSize(image) {
      return typeof image === "object" && image.laptopSize
        ? image.laptopSize
        : null;
    },
    getImageClasses(image) {
      const size = this.getImageSize(image);
      const laptopSize = this.getLaptopImageSize(image);
      return [
        this.$style[size],
        laptopSize === "small" && this.$style.laptopSmall,
        laptopSize === "medium" && this.$style.laptopMedium,
        laptopSize === "large" && this.$style.laptopLarge,
      ];
    },
    getImageWidth(image) {
      const size = this.getImageSize(image);
      if (size === "small") return 76;
      if (size === "large") return 180;
      return 132;
    },
    getImageHeight() {
      return 100;
    },
  },
};
</script>

<style lang="scss" module>
.wrapper {
  display: flex;
  align-items: center;
  gap: 2rem;
  width: max-content;
  min-width: 0;
  @include tablet {
    width: 100%;
    max-width: 100%;
    gap: 0;
    flex-direction: column;
    align-items: stretch;
  }
  .info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex-shrink: 0;
    @include tablet {
      display: grid;
      grid-template-columns: 1fr 4.5rem;
      grid-template-areas:
        "title distance"
        "description distance";
      align-items: start;
      column-gap: 1rem;
      row-gap: 0.125rem;
      width: 100%;
      min-width: 0;
    }
    .title {
      margin: 0;
      font-size: 2rem;
      font-weight: 600;
      line-height: 1.1;
      letter-spacing: -0.04em;
      text-transform: uppercase;
      white-space: nowrap;
      color: $text-primary;
      @include tablet {
        grid-area: title;
        font-size: 0.875rem;
        line-height: 1.3;
        letter-spacing: 0;
        min-width: 0;
      }
    }
    .meta {
      display: flex;
      align-items: start;
      justify-content: space-between;
      gap: 0.75rem;
      @include tablet {
        display: contents;
      }
      .description {
        margin: 0;
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.2;
        color: $text-secondary;
        white-space: pre-line;
        @include tablet {
          grid-area: description;
          font-size: 0.75rem;
          line-height: 1.3;
          min-width: 0;
        }
      }
      .distance {
        margin: 0;
        font-size: 3rem;
        font-weight: 300;
        line-height: 1;
        white-space: nowrap;
        color: $text-accent;
        span {
          font-size: 2rem;
        }
        @include tablet {
          grid-area: distance;
          font-size: 1.875rem;
          align-self: start;
          text-align: right;
          span {
            font-size: 0.875rem;
          }
        }
      }
    }
  }
  .images {
    display: flex;
    gap: 0.5rem;
    flex-shrink: 0;
    img {
      border-radius: 0.75rem;
      object-fit: cover;
      flex-shrink: 0;
    }
    @include laptop {
      &.imagesLimit1 img:nth-child(n + 2) {
        display: none;
      }
      &.imagesLimit2 img:nth-child(n + 3) {
        display: none;
      }
    }
    @include tablet {
      display: none;
    }
    .small {
      width: 4.75rem;
      height: 6.25rem;
    }
    .medium {
      width: 8.25rem;
      height: 6.25rem;
    }
    .large {
      width: 11.25rem;
      height: 6.25rem;
    }
    .laptopSmall {
      @include laptop {
        width: 4.75rem;
        height: 6.25rem;
      }
    }
    .laptopMedium {
      @include laptop {
        width: 8.25rem;
        height: 6.25rem;
      }
    }
    .laptopLarge {
      @include laptop {
        width: 11.25rem;
        height: 6.25rem;
      }
    }
  }
}
</style>
