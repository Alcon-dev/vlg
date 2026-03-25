<template>
  <Transition name="scroll-to-top">
    <button
      v-show="showButton"
      type="button"
      :class="$style.button"
      aria-label="Наверх"
      @click="scrollToTop"
    >
      <span :class="$style.arrow" aria-hidden="true">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 19V5M12 5L5 12M12 5L19 12"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
    </button>
  </Transition>
</template>

<script>
const SCROLL_THRESHOLD = 100;

export default {
  name: "ScrollToTop",
  data() {
    return {
      showButton: false,
    };
  },
  mounted() {
    this.updateVisibility();
    window.addEventListener("scroll", this.updateVisibility, { passive: true });
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.updateVisibility);
  },
  methods: {
    updateVisibility() {
      this.showButton = window.scrollY > SCROLL_THRESHOLD;
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  },
};
</script>

<style lang="scss" module>
@use "@app/assets/scss/colors.scss" as *;
@use "@app/assets/scss/mixins.scss" as *;

.button {
  position: fixed;
  right: 1.5rem;
  bottom: 1.5rem;
  z-index: 1000;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  border-radius: 0.5rem;
  background: $text-primary;
  color: $text-white;
  cursor: pointer;
  box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.2);
  transition:
    background 0.2s,
    transform 0.2s;

  &:hover {
    background: #1f1f1f;
  }

  &:active {
    transform: scale(0.96);
  }

  @include mobile {
    right: 1rem;
    bottom: 1rem;
    width: 2.75rem;
    height: 2.75rem;
  }
}

.arrow {
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
}
</style>

<style lang="scss" scoped>
.scroll-to-top-enter-active,
.scroll-to-top-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.scroll-to-top-enter-from,
.scroll-to-top-leave-to {
  opacity: 0;
  transform: translateY(0.5rem);
}
</style>
