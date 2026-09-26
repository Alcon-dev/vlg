<template>
  <section id="about" :class="$style.wrapper">
    <div :class="$style.header">
      <h2 :class="$style.titlePrimary">ГЕОГРАФИЯ</h2>
      <div :class="$style.titleDescription">
        <p>
          Портпосёлок — уникальная лесопарковая зона Тольятти, где вековой
          сосновый бор соединяется с побережьем Жигулёвского моря.
        </p>
        <p>
          Вокруг нашей Резиденции в радиусе 5 км., сосредоточены главные
          культурные, спортивные и развлекательные объекты города.
        </p>
      </div>
      <h2 :class="$style.titleSecondary">И КУЛЬТУРА ОТДЫХА</h2>
    </div>
    <div :class="$style.attractions">
      <div :class="$style.attractionsGrid">
        <div
          v-for="(a, index) in attractions.slice(0, 6)"
          :key="index"
          :class="[$style.gridCell, $style.gridCellTwo]"
        >
          <Attraction
            :title="a.title"
            :description="a.description"
            :distance="a.distance"
            :images="a.images"
            :laptop-image-limit="index < 5 ? 2 : 1"
          />
        </div>
        <div :class="[$style.gridCell, $style.attractionsRowLast]">
          <Attraction
            v-for="(a, index) in attractions.slice(6)"
            :key="index + 6"
            :title="a.title"
            :description="a.description"
            :distance="a.distance"
            :images="a.images"
            :laptop-image-limit="1"
          />
        </div>
      </div>
    </div>
    <Reviews />
  </section>
</template>

<script>
import Attraction from "@app/components/Attraction.vue";
import Reviews from "@app/components/sections/Reviews.vue";
import { attractions } from "@app/data/attractions";

export default {
  name: "About",
  components: { Attraction, Reviews },
  data() {
    return {
      attractions,
    };
  },
};
</script>

<style lang="scss" module>
.wrapper {
  display: flex;
  flex-direction: column;
  padding: 7.5rem 0;
  gap: 7.5rem;
  color: $text-primary;
  @include laptop {
    padding: 5rem 0;
    gap: 3rem;
  }
  @include tablet {
    padding: 2.5rem 0;
    gap: 1.5rem;
  }
  .header {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-areas:
      "primary description"
      "secondary secondary";
    align-items: center;
    column-gap: 2.5rem;
    .titlePrimary {
      grid-area: primary;
      margin: 0;
      font-weight: 400;
      font-size: 6.25rem;
      letter-spacing: -0.04em;
      text-transform: uppercase;
      color: $text-primary;
      line-height: 1;
      @include laptop {
        font-size: 3.75rem;
      }
      @include tablet {
        font-size: 1.5rem;
      }
    }
    .titleDescription {
      grid-area: description;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      margin: 0;
      font-size: 1rem;
      font-weight: 400;
      line-height: 1.2;
      @include laptop {
        font-size: 0.875rem;
      }
      @include tablet {
        font-size: 0.75rem;
      }
    }
    .titleSecondary {
      grid-area: secondary;
      margin: 0;
      font-weight: 400;
      font-size: 6.25rem;
      letter-spacing: -0.04em;
      text-transform: uppercase;
      color: $text-accent;
      justify-self: end;
      line-height: 1;
      @include laptop {
        font-size: 3.75rem;
      }
      @include tablet {
        font-size: 1.5rem;
      }
    }
    @include tablet {
      grid-template-columns: 1fr;
      grid-template-areas:
        "primary"
        "secondary"
        "description";
      align-items: start;
      row-gap: 0.25rem;
      .titleSecondary {
        justify-self: end;
      }
    }
  }
  .attractions {
    display: flex;
    flex-direction: column;
    @include tablet {
      gap: 0;
    }
    .attractionsGrid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      border-top: 1px solid #d8d8d8;
      @include tablet {
        grid-template-columns: 1fr;
        border-top: none;
        border-bottom: none;
        gap: 0;
      }
      .gridCell {
        min-width: 0;
        overflow: visible;
        padding: 1rem 0;
        border-bottom: 1px solid #d8d8d8;
        @include tablet {
          overflow: hidden;
          padding: 0.75rem 0;
          border-bottom: 1px solid #e8e8e8;
          &:last-child {
            border-bottom: none;
          }
        }
      }
      .gridCellTwo {
        grid-column: span 3;
        display: flex;
        &:nth-child(odd) {
          justify-content: flex-start;
        }
        &:nth-child(even) {
          justify-content: flex-end;
        }
        @include tablet {
          grid-column: span 1;
          display: block;
        }
      }
      .attractionsRowLast {
        grid-column: 1 / -1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        @include tablet {
          flex-direction: column;
          align-items: stretch;
          border-bottom: none;
          padding: 0;
          > * {
            padding: 0.75rem 0;
            border-bottom: 1px solid #e8e8e8;
            &:last-child {
              border-bottom: none;
            }
          }
        }
      }
    }
  }
}
</style>
