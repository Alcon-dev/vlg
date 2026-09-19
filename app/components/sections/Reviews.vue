<template>
  <div :class="$style.reviews">
    <div :class="$style.reviewsHeader">
      <div :class="$style.reviewsHeaderMobile">
        <h3 :class="$style.reviewsSectionTitleMobile">Отзывы наших клиентов</h3>
        <div :class="$style.reviewsHeaderMetaMobile">
          <a
            href="https://yandex.by/maps/org/rezidentsiya_volga/25605876128/reviews/?ll=49.372303%2C53.473734&z=16"
            target="_blank"
            rel="noopener noreferrer"
            :class="$style.reviewsYandexSourceLinkMobile"
          >
            <span :class="$style.reviewsYandexSourceLine"
              >На основании оценок пользователей</span
            >
            <span :class="$style.reviewsYandexSourceLine2">Яндекс.ru</span>
          </a>
          <div :class="$style.reviewsRatingCompactMobile">
            <span :class="$style.reviewsRatingValueMobile">5.0</span>
            <div :class="$style.reviewsRatingStarsMobile">
              <img
                v-for="i in 5"
                :key="i"
                :class="$style.reviewsHeaderStarIcon"
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
        <div :class="$style.reviewsRatingBlock">
          <button
            type="button"
            :class="[$style.reviewsNavBtn, $style.reviewsNavBtnPrev]"
            aria-label="Назад"
            @click="onReviewsPrev"
          />
          <div :class="$style.reviewsRatingCenter">
            <div :class="$style.reviewsRatingRow">
              <span :class="$style.reviewsRatingValue">5.0</span>
              <div :class="$style.reviewsRatingStars">
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
            <a
              href="https://yandex.by/maps/org/rezidentsiya_volga/25605876128/reviews/?ll=49.372303%2C53.473734&z=16"
              target="_blank"
              rel="noopener noreferrer"
              :class="$style.reviewsAvitoLink"
              >На основании оценок пользователей Яндекс.ru</a
            >
          </div>
          <button
            type="button"
            :class="[$style.reviewsNavBtn, $style.reviewsNavBtnNext]"
            aria-label="Вперёд"
            @click="onReviewsNext"
          />
        </div>
      </div>
    </div>
    <div :class="$style.reviewsSwiperWrap">
      <div :class="$style.reviewsSwiperOuter">
        <ClientOnly>
          <Swiper
            :modules="swiperModules"
            :slides-per-view="4"
            :space-between="8"
            :breakpoints="reviewsBreakpoints"
            :class="$style.reviewsSwiper"
            @swiper="onReviewsSwiper"
            @slide-change="onReviewsSlideChange"
          >
            <SwiperSlide
              v-for="(review, index) in reviews"
              :key="index"
              :class="$style.reviewSlide"
            >
              <div :class="$style.reviewCard">
                <div :class="$style.reviewHeader">
                  <img
                    :class="$style.reviewAvatar"
                    :src="review.avatar"
                    :alt="review.name"
                    width="64"
                    height="64"
                    loading="lazy"
                    decoding="async"
                  />
                  <div :class="$style.reviewMeta">
                    <div :class="$style.reviewNameRow">
                      <span :class="$style.reviewName">{{ review.name }}</span>
                    </div>
                    <div :class="$style.reviewStarsRow">
                      <div :class="$style.reviewStars">
                        <img
                          v-for="i in review.stars"
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
                      <span :class="$style.reviewDate">
                        {{ review.date }}
                      </span>
                    </div>
                  </div>
                </div>
                <p :class="$style.reviewText">{{ review.text }}</p>
                <div :class="$style.reviewFooter">
                  <a
                    :href="review.yandexUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    :class="$style.reviewYandexLink"
                  >
                    Читать полностью на Яндекс Отзывах
                    <img
                      :class="$style.reviewYandexChevron"
                      src="@app/assets/img/sections/about/arrow-right-blue.svg"
                      alt=""
                      width="5"
                      height="9"
                      loading="lazy"
                      decoding="async"
                    />
                  </a>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
          <template #fallback>
            <div :class="[$style.reviewsSwiper, $style.reviewsGridFallback]">
              <div
                v-for="(review, index) in reviews.slice(0, 4)"
                :key="index"
                :class="$style.reviewCard"
              >
                <div :class="$style.reviewHeader">
                  <img
                    :class="$style.reviewAvatar"
                    :src="review.avatar"
                    :alt="review.name"
                    width="64"
                    height="64"
                    loading="lazy"
                    decoding="async"
                  />
                  <div :class="$style.reviewMeta">
                    <div :class="$style.reviewNameRow">
                      <span :class="$style.reviewName">{{ review.name }}</span>
                    </div>
                    <div :class="$style.reviewStarsRow">
                      <div :class="$style.reviewStars">
                        <img
                          v-for="i in review.stars"
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
                      <span :class="$style.reviewDate">
                        {{ review.date }}
                      </span>
                    </div>
                  </div>
                </div>
                <p :class="$style.reviewText">{{ review.text }}</p>
                <div :class="$style.reviewFooter">
                  <a
                    :href="review.yandexUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    :class="$style.reviewYandexLink"
                  >
                    Читать полностью на Яндекс Отзывах
                    <img
                      :class="$style.reviewYandexChevron"
                      src="@app/assets/img/sections/about/arrow-right-blue.svg"
                      alt=""
                      width="5"
                      height="9"
                      loading="lazy"
                      decoding="async"
                    />
                  </a>
                </div>
              </div>
            </div>
          </template>
        </ClientOnly>
      </div>
    </div>
    <div :class="$style.paginationBar">
      <button
        v-for="(_, i) in paginationBullets"
        :key="i"
        type="button"
        :class="[
          $style.paginationBullet,
          {
            [$style.paginationBulletActive]: i === currentPaginationIndex,
          },
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

export default {
  name: "Reviews",
  components: { Swiper, SwiperSlide },
  data() {
    return {
      reviewsSwiperRef: null,
      currentPaginationIndex: 0,
      swiperModules: [],
      reviewsBreakpoints: {
        0: { slidesPerView: 1, slidesPerGroup: 1, spaceBetween: 8 },
        769: { slidesPerView: 3, slidesPerGroup: 1, spaceBetween: 8 },
        1291: { slidesPerView: 4, slidesPerGroup: 1, spaceBetween: 8 },
      },
      isMobileView: false,
      isMobileBreakpoint: false,
      reviews,
    };
  },
  computed: {
    paginationBullets() {
      const n = this.reviews?.length ?? 0;
      const perView = this.isMobileBreakpoint ? 1 : this.isMobileView ? 3 : 4;
      const count = Math.max(1, n - perView + 1);
      return Array.from({ length: count });
    },
  },
  mounted() {
    if (typeof window === "undefined") return;
    const check = () => {
      this.isMobileView = window.innerWidth <= 1290;
      this.isMobileBreakpoint = window.innerWidth <= 768;
    };
    check();
    window.addEventListener("resize", check);
    this._resizeCleanup = () => window.removeEventListener("resize", check);
  },
  beforeUnmount() {
    if (this._resizeCleanup) this._resizeCleanup();
  },
  methods: {
    onReviewsSwiper(swiper) {
      this.reviewsSwiperRef = swiper;
      this.currentPaginationIndex = swiper?.activeIndex ?? 0;
    },
    onReviewsSlideChange(swiper) {
      this.currentPaginationIndex = swiper?.activeIndex ?? 0;
    },
    goToReviewSlide(index) {
      this.reviewsSwiperRef?.slideTo?.(index);
    },
    onReviewsPrev() {
      this.reviewsSwiperRef?.slidePrev?.();
    },
    onReviewsNext() {
      this.reviewsSwiperRef?.slideNext?.();
    },
  },
};
</script>

<style lang="scss" module>
.reviews {
  display: flex;
  flex-direction: column;
}
.reviewsHeader {
  position: relative;
}
.reviewsHeaderMobile {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0 0 2.5rem 0;
  gap: 1.5rem;
  @include tablet {
    padding: 0 0 1.5rem 0;
  }
  @include tablet {
    align-items: stretch;
    padding: 0 0 1.5rem 0;
    gap: 1rem;
  }
}
.reviewsSectionTitleMobile {
  font-size: 3rem;
  font-weight: 600;
  margin: 0;
  color: $text-primary;
  text-align: center;
  width: 100%;
  @include tablet {
    font-size: 2rem;
  }
  @include tablet {
    font-size: 1.5rem;
    font-weight: 600;
  }
}
.reviewsHeaderMetaMobile {
  display: none;
  @include tablet {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: 0.75rem;
    box-sizing: border-box;
  }
}
.reviewsYandexSourceLinkMobile {
  flex: 1;
  font-size: 0.625rem;
  line-height: 1.25;
  color: #0d99ff;
  text-decoration: underline;
  text-align: left;
  text-underline-offset: 0.125em;
}
.reviewsYandexSourceLine {
  display: block;
}
.reviewsYandexSourceLine2 {
  display: block;
  margin-top: 0.125rem;
}
.reviewsRatingCompactMobile {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-shrink: 0;
  gap: 0.375rem;
}
.reviewsRatingValueMobile {
  font-size: 1.25rem;
  font-weight: 300;
  line-height: 1;
  color: $text-primary;
}
.reviewsRatingStarsMobile {
  display: flex;
  align-items: center;
  gap: 0.125rem;
}
.reviewsHeaderStarIcon {
  width: 1.25rem;
  height: 1.25rem;
  object-fit: contain;
  display: block;
}
.reviewsRatingBlock {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 1rem;
  @include tablet {
    display: none;
  }
}
.reviewsRatingCenter {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
}
.reviewsRatingRow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
.reviewsRatingValue {
  font-size: 3rem;
  font-weight: 300;
  color: $text-primary;
  @include tablet {
    font-size: 2rem;
  }
}
.reviewsRatingStars {
  display: flex;
  gap: 0.25rem;
  img {
    width: 2rem;
    height: 2rem;
    object-fit: contain;
    @include tablet {
      width: 1.5rem;
      height: 1.5rem;
    }
  }
}
.reviewsAvitoLink {
  font-size: 0.875rem;
  color: #0d99ff;
  text-decoration: underline;
  margin: 0;
}
.reviewsSwiperWrap {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0;
}
.reviewsNavBtn {
  display: block;
  flex-shrink: 0;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  border: none;
  background: $bg-primary;
  cursor: pointer;
  background-image: url("../../assets/img/sections/about/swiper-arrow.svg");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 2rem;
  padding: 0;
  z-index: 2;
  @include tablet {
    display: block;
    width: 2.5rem;
    height: 2.5rem;
    background-size: 1rem;
  }
  @include tablet {
    display: none;
  }
}
.reviewsNavBtnPrev {
  transform: scaleX(-1);
}
.reviewsSwiperOuter {
  flex: 1;
  min-width: 0;
  padding: 0 2.5rem;
  overflow: hidden;
  box-shadow: 0.25rem 0.5rem 3rem rgba(0, 0, 0, 0.08);
  border-radius: 1rem;
  @include tablet {
    padding: 0 0.5rem;
  }
  @include tablet {
    padding: 0;
  }
}
.reviewsSwiper {
  margin: 0 -2.5rem;
  width: calc(100% + 5rem);
  overflow: visible;
  @include tablet {
    margin: 0 -0.5rem;
    width: calc(100% + 1rem);
  }
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
.paginationBar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding-top: 0.5rem;
  @include tablet {
    margin-top: 1rem;
  }
}
.paginationBullet {
  width: 18rem;
  height: 0.25rem;
  border-radius: 0.125rem;
  background: $bg-primary;
  border: none;
  padding: 0;
  cursor: pointer;
  transition:
    background 0.2s,
    width 0.2s,
    height 0.2s;
  @include tablet {
    width: 1.5rem;
    height: 0.2rem;
    background: #e0e0e0;
  }
}
.paginationBulletActive {
  background: #004f68;
  @include tablet {
    background: #004f68;
  }
}
.paginationBulletActive:hover {
  background: #004f68;
}
.reviewsGridFallback {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}
.reviewSlide {
  height: auto;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 8px 48px rgba(0, 0, 0, 0.08);
  border-radius: 1rem;
}
.reviewCard {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2.5rem;
  border-radius: 1rem;
  flex: 1;
  min-height: 0;
  user-select: none;
  font-family: "VelaSans", sans-serif;
  @include tablet {
    padding: 2rem;
    gap: 0.5rem;
    border-radius: 0.75rem;
    background: $bg-white;
    box-shadow: 2px 4px 24px rgba(0, 0, 0, 0.06);
  }
  img {
    user-select: none;
    -webkit-user-drag: none;
  }
}
.reviewHeader {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  @include tablet {
    gap: 0.5rem;
  }
}
.reviewAvatar {
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
.reviewMeta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
  flex: 1;
  @include tablet {
    gap: 0.25rem;
  }
}
.reviewNameRow {
  display: flex;
  align-items: flex-start;
}
.reviewStarsRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  min-width: 0;
}
.reviewName {
  font-size: 1.5rem;
  font-weight: 600;
  @include tablet {
    font-size: 1.125rem;
  }
}
.reviewDate {
  font-size: 0.75rem;
  font-weight: 300;
  line-height: 1.2;
  color: $text-secondary;
  flex-shrink: 0;
  @include tablet {
    font-size: 0.6875rem;
  }
}
.reviewStars {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  @include tablet {
    gap: 0.125rem;
  }
}
.starIcon {
  width: 1.5rem;
  height: 1.5rem;
  @include tablet {
    width: 1.125rem;
    height: 1.125rem;
  }
}
.reviewText {
  flex: 1;
  min-height: 0;
  font-size: 1rem;
  line-height: 1.2;
  margin: 0;
  color: $text-primary;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;
  overflow: hidden;
  text-overflow: ellipsis;
  @include tablet {
    font-size: 0.875rem;
    line-height: 1.35;
  }
}
.reviewFooter {
  margin-top: auto;
  text-align: right;
  padding-top: 0.25rem;
}
.reviewYandexLink {
  font-size: 0.75rem;
  color: #0d99ff;
  text-decoration: underline;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  width: fit-content;
  margin-left: auto;
  @include tablet {
    font-size: 0.75rem;
  }
}
.reviewYandexChevron {
  flex-shrink: 0;
  display: block;
  width: 0.25rem;
  height: 0.5rem;
  object-fit: contain;
}
</style>
