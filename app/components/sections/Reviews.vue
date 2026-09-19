<template>
  <div :class="$style.wrapper">
    <div :class="$style.header">
      <div :class="$style.titleRow">
        <h2 :class="$style.titlePrimary">ОТЗЫВЫ</h2>
        <div :class="$style.rating">
          <span :class="$style.ratingValue">5.0</span>
          <div :class="$style.ratingStars" aria-hidden="true">
            <img
              v-for="i in 5"
              :key="i"
              :class="$style.starIcon"
              src="@app/assets/img/sections/about/star.svg"
              alt=""
              width="24"
              height="24"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
      <h2 :class="$style.titleSecondary">И ВПЕЧАТЛЕНИЯ ГОСТЕЙ</h2>
    </div>

    <div :class="$style.swiperWrap">
      <div :class="$style.swiperOuter">
        <ClientOnly>
          <Swiper
            :modules="swiperModules"
            :slides-per-view="4"
            :space-between="8"
            :breakpoints="reviewsBreakpoints"
            :class="$style.swiper"
            @swiper="onReviewsSwiper"
            @slide-change="onReviewsSlideChange"
            @breakpoint="onReviewsBreakpoint"
          >
            <SwiperSlide
              v-for="(review, index) in reviews"
              :key="'review-' + index"
              :class="$style.slide"
            >
              <article :class="$style.card">
                <div :class="$style.cardHeader">
                  <img
                    :class="$style.avatar"
                    :src="review.avatar"
                    :alt="review.name"
                    width="64"
                    height="64"
                    loading="lazy"
                    decoding="async"
                  />
                  <div :class="$style.cardMeta">
                    <span :class="$style.name">{{ review.name }}</span>
                    <div :class="$style.cardStarsRow">
                      <div :class="$style.cardStars" aria-hidden="true">
                        <img
                          v-for="i in review.stars"
                          :key="i"
                          :class="$style.cardStarIcon"
                          src="@app/assets/img/sections/about/star.svg"
                          alt=""
                          width="24"
                          height="24"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <span :class="$style.date">{{ review.date }}</span>
                    </div>
                  </div>
                </div>
                <p :class="$style.text">{{ review.text }}</p>
                <a
                  :href="review.yandexUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  :class="$style.yandexLink"
                >
                  Читать на яндекс отзывы
                  <img
                    :class="$style.yandexChevron"
                    src="@app/assets/img/sections/about/arrow-right-blue.svg"
                    alt=""
                    width="5"
                    height="9"
                    loading="lazy"
                    decoding="async"
                  />
                </a>
              </article>
            </SwiperSlide>
          </Swiper>
          <template #fallback>
            <div :class="[$style.swiper, $style.gridFallback]">
              <article
                v-for="(review, index) in reviews.slice(0, 4)"
                :key="index"
                :class="$style.card"
              >
                <div :class="$style.cardHeader">
                  <img
                    :class="$style.avatar"
                    :src="review.avatar"
                    :alt="review.name"
                    width="64"
                    height="64"
                    loading="lazy"
                    decoding="async"
                  />
                  <div :class="$style.cardMeta">
                    <span :class="$style.name">{{ review.name }}</span>
                    <div :class="$style.cardStarsRow">
                      <div :class="$style.cardStars" aria-hidden="true">
                        <img
                          v-for="i in review.stars"
                          :key="i"
                          :class="$style.cardStarIcon"
                          src="@app/assets/img/sections/about/star.svg"
                          alt=""
                          width="24"
                          height="24"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <span :class="$style.date">{{ review.date }}</span>
                    </div>
                  </div>
                </div>
                <p :class="$style.text">{{ review.text }}</p>
                <a
                  :href="review.yandexUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  :class="$style.yandexLink"
                >
                  Читать на яндекс отзывы
                  <img
                    :class="$style.yandexChevron"
                    src="@app/assets/img/sections/about/arrow-right-blue.svg"
                    alt=""
                    width="5"
                    height="9"
                    loading="lazy"
                    decoding="async"
                  />
                </a>
              </article>
            </div>
          </template>
        </ClientOnly>
      </div>
    </div>

    <div :class="$style.pagination">
      <button
        v-for="(_, i) in bullets"
        :key="i"
        type="button"
        :class="[
          $style.paginationBullet,
          { [$style.paginationBulletActive]: i === activeBullet },
        ]"
        :aria-label="`Слайд ${i + 1}`"
        @click="goToReviewSlide(i)"
      />
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import { reviews } from "@app/data/reviews";

const TABLET_QUERY = "(max-width: 768px)";

export default {
  name: "Reviews",
  components: { Swiper, SwiperSlide },
  data() {
    return {
      swiper: null,
      activeBullet: 0,
      isTablet: false,
      swiperModules: [],
      reviewsBreakpoints: {
        0: { slidesPerView: 1, slidesPerGroup: 1, spaceBetween: 8 },
        769: { slidesPerView: 3, slidesPerGroup: 1, spaceBetween: 8 },
        1291: { slidesPerView: 4, slidesPerGroup: 1, spaceBetween: 8 },
      },
      reviews,
    };
  },
  computed: {
    bulletCount() {
      const count = this.reviews.length;
      if (!count) return 0;
      return this.isTablet ? count : Math.ceil(count / 2);
    },
    bullets() {
      return Array.from({ length: this.bulletCount });
    },
  },
  mounted() {
    this.updateIsTablet();
    window.addEventListener("resize", this.updateIsTablet);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.updateIsTablet);
  },
  methods: {
    updateIsTablet() {
      const next = window.matchMedia(TABLET_QUERY).matches;
      if (next === this.isTablet) return;
      this.isTablet = next;
      this.$nextTick(() => this.syncBullet());
    },
    lastSlideIndex() {
      if (!this.swiper) return 0;
      const perView = Number(this.swiper.params.slidesPerView) || 1;
      return Math.max(0, this.swiper.slides.length - perView);
    },
    slideFromBullet(bullet) {
      const lastBullet = this.bulletCount - 1;
      if (lastBullet <= 0) return 0;
      return Math.round((bullet * this.lastSlideIndex()) / lastBullet);
    },
    bulletFromSlide(slide) {
      const lastBullet = this.bulletCount - 1;
      const lastSlide = this.lastSlideIndex();
      if (lastBullet <= 0 || lastSlide <= 0) return 0;
      return Math.min(lastBullet, Math.round((slide * lastBullet) / lastSlide));
    },
    syncBullet(swiper = this.swiper) {
      if (!swiper) return;
      this.activeBullet = this.isTablet
        ? Math.min(swiper.activeIndex, this.bulletCount - 1)
        : this.bulletFromSlide(swiper.activeIndex);
    },
    onReviewsSwiper(swiper) {
      this.swiper = swiper;
      this.updateIsTablet();
      this.syncBullet(swiper);
    },
    onReviewsBreakpoint(swiper) {
      this.syncBullet(swiper);
    },
    onReviewsSlideChange(swiper) {
      this.syncBullet(swiper);
    },
    goToReviewSlide(bullet) {
      this.activeBullet = bullet;
      if (!this.swiper) return;
      const target = this.isTablet
        ? Math.min(bullet, this.lastSlideIndex())
        : this.slideFromBullet(bullet);
      this.swiper.slideTo(target);
    },
  },
};
</script>

<style lang="scss" module>
.wrapper {
  display: flex;
  flex-direction: column;
  padding: 7.5rem 0;
  gap: 2.75rem;
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
    display: flex;
    flex-direction: column;
    .titleRow {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      width: 100%;
      gap: 1.5rem;
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
      .rating {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex-shrink: 0;
        padding-top: 0.5rem;
        @include tablet {
          padding-top: 0;
          gap: 0.375rem;
        }
        .ratingValue {
          font-size: 3rem;
          font-weight: 300;
          line-height: 1;
          color: $text-primary;
          @include laptop {
            font-size: 2rem;
          }
          @include tablet {
            font-size: 1.25rem;
          }
        }
        .ratingStars {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          .starIcon {
            width: 2rem;
            height: 2rem;
            object-fit: contain;
            display: block;
            @include laptop {
              width: 1.5rem;
              height: 1.5rem;
            }
            @include tablet {
              width: 1rem;
              height: 1rem;
            }
          }
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
  .swiperWrap {
    position: relative;
    display: flex;
    align-items: center;
    .swiperOuter {
      flex: 1;
      min-width: 0;
      padding: 0 2.5rem;
      overflow: hidden;
      box-shadow: 0.25rem 0.5rem 3rem rgba(0, 0, 0, 0.08);
      border-radius: 1rem;
      @include tablet {
        padding: 0;
      }
      .swiper {
        margin: 0 -2.5rem;
        width: calc(100% + 5rem);
        overflow: visible;
        @include tablet {
          margin: 0;
          width: 100%;
        }
        :global(.swiper-wrapper) {
          align-items: stretch;
          cursor: grab;
        }
        &:global(.swiper-grabbing) :global(.swiper-wrapper) {
          cursor: grabbing;
        }
      }
      .gridFallback {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 0.5rem;
        @include laptop {
          grid-template-columns: repeat(3, 1fr);
        }
        @include tablet {
          grid-template-columns: 1fr;
        }
      }
      .slide {
        height: auto;
        display: flex;
        flex-direction: column;
        box-shadow: 4px 8px 48px rgba(0, 0, 0, 0.08);
        border-radius: 1rem;
      }
      .card {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 2.5rem;
        border-radius: 1rem;
        flex: 1;
        min-height: 0;
        user-select: none;
        @include tablet {
          padding: 1.25rem;
          gap: 0.75rem;
          border-radius: 0.75rem;
          background: $bg-white;
          box-shadow: 2px 4px 24px rgba(0, 0, 0, 0.06);
        }
        img {
          user-select: none;
          -webkit-user-drag: none;
        }
        .cardHeader {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
          .avatar {
            width: 4rem;
            height: 4rem;
            border-radius: 50%;
            object-fit: cover;
            flex-shrink: 0;
            @include tablet {
              width: 2.75rem;
              height: 2.75rem;
            }
          }
          .cardMeta {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            min-width: 0;
            flex: 1;
            .name {
              font-size: 1.5rem;
              font-weight: 600;
              line-height: 1.2;
              @include laptop {
                font-size: 1.25rem;
              }
              @include tablet {
                font-size: 1rem;
              }
            }
            .cardStarsRow {
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 0.5rem;
              min-width: 0;
              .cardStars {
                display: flex;
                align-items: center;
                gap: 0.25rem;
                .cardStarIcon {
                  width: 1.5rem;
                  height: 1.5rem;
                  object-fit: contain;
                  display: block;
                  @include tablet {
                    width: 1.125rem;
                    height: 1.125rem;
                  }
                }
              }
              .date {
                font-size: 0.75rem;
                font-weight: 300;
                line-height: 1.2;
                color: $text-secondary;
                flex-shrink: 0;
              }
            }
          }
        }
        .text {
          flex: 1;
          min-height: 0;
          margin: 0;
          font-size: 1rem;
          line-height: 1.2;
          color: $text-primary;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 5;
          overflow: hidden;
          text-overflow: ellipsis;
          @include tablet {
            font-size: 0.875rem;
            -webkit-line-clamp: 4;
          }
        }
        .yandexLink {
          margin-top: auto;
          display: flex;
          align-items: center;
          gap: 0.625rem;
          width: fit-content;
          margin-left: auto;
          font-size: 0.75rem;
          color: $main-blue;
          text-decoration: underline;
          text-underline-offset: 0.125em;
          .yandexChevron {
            flex-shrink: 0;
            display: block;
            width: 0.25rem;
            height: 0.5rem;
            object-fit: contain;
          }
        }
      }
    }
  }
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    .paginationBullet {
      flex: 1;
      height: 0.25rem;
      max-width: 7.5rem;
      border-radius: 0.125rem;
      background: $bg-primary;
      border: none;
      padding: 0;
      cursor: pointer;
      transition: background 0.2s;
      @include tablet {
        height: 0.2rem;
        background: #e0e0e0;
      }
    }
    .paginationBulletActive {
      background: #004f68;
    }
  }
}
</style>
