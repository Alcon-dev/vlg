<template>
  <div :class="$style.wrapper">
    <div :class="$style.info">
      <h4 :class="$style.title">{{ title }}</h4>
      <div :class="$style.infoWrapper">
        <p :class="$style.description">{{ description }}</p>
        <p :class="$style.distance">
          {{ distance.value }}<span>{{ distance.type }}</span>
        </p>
      </div>
    </div>
    <div
      :class="[
        $style.images,
        tabletImageLimit === 1 && $style.imagesTabletLimit1,
        tabletImageLimit === 2 && $style.imagesTabletLimit2,
      ]"
    >
      <img
        v-for="(image, index) in images"
        :key="index"
        :src="getImageSrc(image)"
        :alt="title"
        :class="$style[getImageSize(image)]"
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
    tabletImageLimit: {
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
    getImageWidth(image) {
      const size = this.getImageSize(image);
      if (size === "small") return 76;
      if (size === "large") return 180;
      return 132;
    },
    getImageHeight(image) {
      const size = this.getImageSize(image);
      if (size === "small") return 100;
      if (size === "large") return 100;
      return 100;
    },
  },
};
</script>

<style lang="scss" module>
@use "@app/assets/scss/mixins.scss" as *;

.wrapper {
  display: flex;
  align-items: center;
  gap: 2.5rem;
  @include tablet {
    gap: 1rem;
  }
  @include mobile {
    width: 100%;
    min-width: 0;
    gap: 0;
    flex-direction: column;
    align-items: stretch;
  }
}
.info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  @include mobile {
    display: grid;
    grid-template-columns: 1fr 4.5rem;
    grid-template-rows: auto auto;
    align-items: start;
    gap: 0.125rem 1rem;
    width: 100%;
    min-width: 0;
  }
}
.title {
  font-size: 2rem;
  font-weight: 600;
  white-space: nowrap;
  @include mobile {
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    margin: 0;
    padding: 0;
    line-height: 1.3;
    grid-column: 1;
    grid-row: 1;
    color: $text-primary;
    min-width: 0;
  }
}
.infoWrapper {
  display: flex;
  gap: 0.75rem;
  color: $text-secondary;
  @include mobile {
    display: contents;
  }
}
.description {
  font-size: 1rem;
  font-weight: 400;
  @include mobile {
    font-size: 0.75rem;
    margin: 0;
    padding: 0;
    color: $text-secondary;
    grid-column: 1;
    grid-row: 2;
    line-height: 1.3;
    min-width: 0;
  }
}
.distance {
  font-size: 3rem;
  text-wrap: nowrap;
  font-weight: 300;
  span {
    font-size: 2rem;
  }
  @include mobile {
    font-size: 1.875rem;
    font-weight: 300;
    color: $text-secondary;
    grid-column: 2;
    grid-row: 1 / -1;
    align-self: start;
    text-align: right;
    margin: 0;
    padding: 0;
    span {
      font-size: 0.875rem;
    }
  }
}
.images {
  display: flex;
  gap: 0.5rem;

  img {
    border-radius: 0.5rem;
    object-fit: cover;
  }

  @include tablet {
    &.imagesTabletLimit1 img:nth-child(n + 2) {
      display: none;
    }
    &.imagesTabletLimit2 img:nth-child(n + 3) {
      display: none;
    }
  }
  @include mobile {
    display: none;
  }
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
</style>
