<template>
  <section id="about" :class="$style.wrapper">
    <div :class="$style.header">
      <div :class="$style.titleRow">
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
      </div>
      <h2 :class="$style.titleSecondary">И КУЛЬТУРА ОТДЫХА</h2>
    </div>
    <div :class="$style.attractions">
      <div :class="$style.attractionsGrid">
        <div
          v-for="(a, index) in attractions"
          :key="index"
          :class="[
            $style.gridCell,
            index < 6 ? $style.gridCellTwo : $style.gridCellThree,
          ]"
        >
          <Attraction
            :title="a.title"
            :description="a.description"
            :distance="a.distance"
            :images="a.images"
            :tablet-image-limit="index < 5 ? 2 : 1"
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
  padding: 7.5rem 2rem;
  gap: 5rem;
  color: $text-primary;
  @include laptop {
    padding: 5rem 2rem;
    gap: 3rem;
  }
  @include tablet {
    padding: 2.5rem 1rem;
    gap: 1.5rem;
  }
  .header {
    display: flex;
    flex-direction: column;
    .titleRow {
      display: flex;
      align-items: center;
      width: 100%;
      gap: 2.5rem;
      width: 100%;
      @include tablet {
        flex-direction: column;
        gap: 0.75rem;
      }
      .titlePrimary {
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
          max-width: none;
          font-size: 0.75rem;
          line-height: 1.35;
        }
      }
    }
    .titleSecondary {
      margin: 0;
      font-weight: 400;
      font-size: 6.25rem;
      letter-spacing: -0.04em;
      text-transform: uppercase;
      color: $text-accent;
      align-self: flex-end;
      line-height: 1;
      @include laptop {
        font-size: 3.75rem;
      }
      @include tablet {
        font-size: 1.5rem;
      }
    }
  }
  .attractions {
    display: flex;
    flex-direction: column;
    @include tablet {
      gap: 0;
    }
  }
  .attractionsGrid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    @include tablet {
      border-bottom: 1px solid #d8d8d8;
    }
    @include tablet {
      grid-template-columns: 1fr;
      border-bottom: none;
      gap: 0;
    }
  }
  .gridCell {
    min-width: 0;
    padding: 1rem 0;
    border-bottom: 1px solid #d8d8d8;
    @include tablet {
      padding: 0.75rem 0;
      border-bottom: 1px solid #e8e8e8;
      overflow: hidden;
      &:last-child {
        border-bottom: none;
      }
    }
  }
  .gridCellTwo {
    grid-column: span 3;
    &:nth-child(even) {
      display: flex;
      justify-content: end;
    }
    @include tablet {
      grid-column: span 1;
      display: block;
    }
  }
  .gridCellThree {
    grid-column: span 2;
    @include tablet {
      width: min-content;
      border-bottom: none;
    }
    &:nth-child(3n) {
      display: flex;
      justify-content: end;
    }
    @include tablet {
      grid-column: span 1;
      display: block;
      width: auto;
      border-bottom: 1px solid #e8e8e8;
    }
  }
}
</style>
