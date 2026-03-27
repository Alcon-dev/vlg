<template>
  <section id="about" :class="$style.wrapper">
    <div :class="$style.titleWrapper">
      <div :class="$style.titleLine1">
        <div :class="$style.ratingDesktop">
          <span>5.0</span>
          <img
            v-for="i in 5"
            :key="i"
            src="@app/assets/img/sections/about/star.svg"
            alt=""
            width="40"
            height="40"
            loading="lazy"
            decoding="async"
          />
        </div>
        <h2 :class="$style.titlePrimary">ПОЧЕМУ</h2>
        <div :class="$style.rating">
          <span>5.0</span>
          <img
            v-for="i in 5"
            :key="i"
            src="@app/assets/img/sections/about/star.svg"
            alt=""
            width="40"
            height="40"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
      <div :class="$style.titleLine2">
        <h2 :class="$style.titleSecondary">НАС ВЫБИРАЮТ</h2>
      </div>
    </div>
    <div :class="$style.points">
      <div v-for="point in points" :key="point.number" :class="$style.point">
        <div :class="$style.pointNumber">{{ point.number }}</div>
        <AppIcon
          v-if="point.icon"
          :name="point.icon"
          :alt="point.title"
          :class="$style.pointIcon"
        />
        <div :class="$style.pointTitle">{{ point.title }}</div>
      </div>
    </div>
    <div :class="$style.attractions">
      <div :class="$style.titleContainer">
        <h3 :class="$style.title">Досуг и достопримечательности</h3>
        <p :class="$style.description">
          В шаговой доступности от резиденции более 10 уникальных объектов.<br />Для
          наших гостей действуют партнерские программы и скидки.
        </p>
      </div>
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
    <div :class="$style.reviews">
      <div :class="$style.reviewsHeader">
        <h3 :class="$style.reviewsSectionTitle">Отзывы клиентов на avito.ru</h3>
        <div :class="$style.reviewsHeaderMobile">
          <h3 :class="$style.reviewsSectionTitleMobile">
            Отзывы наших клиентов
          </h3>
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
                href="https://www.avito.ru/tolyatti/doma_dachi_kottedzhi/5-k._dom_185_m_7860719763?utm_campaign=native&utm_medium=item_page_ios&utm_source=soc_sharing_seller"
                target="_blank"
                rel="noopener noreferrer"
                :class="$style.reviewsAvitoLink"
                >На основании оценок пользователей avito.ru</a
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
                        <span :class="$style.reviewName">{{
                          review.name
                        }}</span>
                        <span :class="$style.reviewDate">
                          {{ review.date }}{{ review.guest ? " · Гость" : "" }}
                        </span>
                      </div>
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
                    </div>
                  </div>
                  <p :class="$style.reviewStay">{{ review.stayInfo }}</p>
                  <p :class="$style.reviewText">{{ review.text }}</p>
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
                        <span :class="$style.reviewName">{{
                          review.name
                        }}</span>
                        <span :class="$style.reviewDate">
                          {{ review.date }}{{ review.guest ? " · Гость" : "" }}
                        </span>
                      </div>
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
                    </div>
                  </div>
                  <p :class="$style.reviewStay">{{ review.stayInfo }}</p>
                  <p :class="$style.reviewText">{{ review.text }}</p>
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
  </section>
</template>

<script>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import AppIcon from "@app/components/AppIcon.vue";
import Attraction from "@app/components/Attraction.vue";
import { attractions } from "@app/data/attractions";
import { reviews } from "@app/data/reviews";

export default {
  name: "About",
  components: { AppIcon, Attraction, Swiper, SwiperSlide },
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
      points: [
        {
          number: "1",
          title: "Уникальное расположение",
          icon: "aboutMap",
        },
        {
          number: "2",
          title: "Размещение до 30 гостей",
          icon: "aboutUsers",
        },
        {
          number: "3",
          title: "Подогреваемый бассейн 12м.",
          icon: "aboutFlag",
        },
        {
          number: "4",
          title: "Панорамный вид на волгу и горы",
          icon: "aboutEye",
        },
      ],
      attractions,
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
.wrapper {
  display: flex;
  flex-direction: column;
  padding: 7.5rem 5rem;
  gap: 5rem;
  color: $text-primary;
  @include tablet {
    padding: 5rem 2.5rem;
  }
  @include mobile {
    padding: 2.5rem 1rem;
    gap: 2.5rem;
  }
}

.titleWrapper {
  @include mobile {
    margin-bottom: 0;
  }
}

.titleLine1,
.titleLine2 {
  display: flex;
  justify-content: center;
  @include mobile {
    justify-content: flex-start;
  }
}

.ratingDesktop {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  /* Скрываем блок, но оставляем занимаемое место,
     чтобы `titleLine1` (space-between) не переставил остальные элементы. */
  visibility: hidden;
  pointer-events: none;
  span {
    font-size: 3rem;
    margin: 0 1rem 0 0;
  }
  img {
    width: 2.5rem;
    height: 2.5rem;
  }
  @include tablet {
    display: none;
  }
}

.titleLine1 {
  justify-content: space-between;
  @include mobile {
    align-items: center;
  }
}
.titleLine2 {
  @include mobile {
    justify-content: flex-end;
  }
}

.titlePrimary,
.titleSecondary {
  color: $text-primary;
  text-align: center;
  font-weight: 400;
  @include mobile {
    text-align: left;
    font-weight: 300;
    font-size: 1.875rem;
  }
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.rating span {
  font-size: 3rem;
  margin: 0 1rem 0 0;
  @include mobile {
    font-size: 1.25rem;
    margin: 0 0.25rem 0 0;
  }
}

.rating img {
  width: 2.5rem;
  height: 2.5rem;
  @include mobile {
    width: 1.25rem;
    height: 1.25rem;
  }
}

.points {
  display: flex;
  justify-content: space-between;
  @include mobile {
    display: grid;
    grid-template-columns: 50% 50%;
    gap: 0;
  }
}

.point {
  display: flex;
  align-items: flex-end;
  padding: 1rem;
  width: 100%;
  @include mobile {
    align-items: center;
    width: auto;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border-right: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;
    &:nth-child(2n) {
      border-right: none;
    }
    &:nth-child(n + 3) {
      border-bottom: none;
    }
  }
}

.pointNumber {
  font-size: 6.25rem;
  font-weight: 300;
  line-height: 0.8;
  margin: 0 1rem 0 0;
  color: $text-secondary;
  @include mobile {
    display: none;
  }
}

.pointIcon {
  display: none;
  @include mobile {
    display: block;
    width: 1.5rem;
    height: 1.5rem;
    flex-shrink: 0;
    :global(img) {
      width: 100%;
      height: 100%;
      object-fit: contain;
      filter: brightness(0);
    }
  }
}

.pointTitle {
  max-width: 14rem;
  font-size: 1.5rem;
  font-weight: 300;
  @include mobile {
    max-width: none;
    font-size: 0.75rem;
    font-weight: 400;
    color: $text-primary;
    line-height: 1.3;
  }
}

.attractions {
  display: flex;
  flex-direction: column;
  @include mobile {
    gap: 0;
  }
}

.attractionsGrid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  @include tablet {
    border-bottom: 1px solid #d8d8d8;
  }
  @include mobile {
    grid-template-columns: 1fr;
    border-bottom: none;
    gap: 0;
  }
}

.gridCell {
  min-width: 0;
  padding: 1rem 0;
  border-bottom: 1px solid #d8d8d8;
  @include mobile {
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
  @include mobile {
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
  @include mobile {
    grid-column: span 1;
    display: block;
    width: auto;
    border-bottom: 1px solid #e8e8e8;
  }
}

.titleContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
  padding: 0 0 2.5rem 0;
  border-bottom: 1px solid #d8d8d8;
  @include mobile {
    align-items: center;
    text-align: center;
    padding: 0 0 1rem 0;
    gap: 0.5rem;
  }
  .title {
    font-size: 3rem;
    font-weight: 600;
    @include mobile {
      font-size: 1.25rem;
    }
  }
  .description {
    font-size: 1rem;
    line-height: 1;
    color: $text-secondary;
    @include mobile {
      font-size: 0.75rem;
      line-height: 1.4;
    }
  }
}

.reviews {
  display: flex;
  flex-direction: column;
}

.reviewsHeader {
  position: relative;
}

.reviewsSectionTitle {
  font-size: 3rem;
  font-weight: 600;
  text-align: center;
  padding: 0 0 2.5rem 0;

  @include tablet {
    display: none;
  }
  @include mobile {
    display: block;
    font-weight: 400;
    font-size: 1.25rem;
    text-align: center;
    padding: 0 0 2.5rem 0;
  }
}

.reviewsHeaderMobile {
  display: none;

  @include tablet {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 0 0 1.5rem 0;
    gap: 0.5rem;
  }
  @include mobile {
    display: none;
  }
}

.reviewsSectionTitleMobile {
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
  color: $text-primary;
}

.reviewsRatingBlock {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 1rem;
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
  font-size: 2rem;
  font-weight: 600;
  color: $text-primary;
}

.reviewsRatingStars {
  display: flex;
  gap: 0.25rem;

  img {
    width: 1.5rem;
    height: 1.5rem;
    object-fit: contain;
  }
}

.reviewsAvitoLink {
  font-size: 0.875rem;
  color: #2563eb;
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
  display: none;
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: none;
  background: $bg-primary;
  cursor: pointer;
  background-image: url("../../assets/img/sections/about/swiper-arrow.svg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 1rem;
  padding: 0;
  z-index: 2;

  @include tablet {
    display: block;
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
  @include mobile {
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
  @include mobile {
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
  @include mobile {
    margin-top: 1rem;
  }
}

.paginationBullet {
  width: 2rem;
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
  @include mobile {
    width: 1.5rem;
    height: 0.2rem;
    background: #e0e0e0;
  }
}

.paginationBulletActive {
  background: #004f68;
  @include mobile {
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
  @include mobile {
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
  @include mobile {
    gap: 0.5rem;
  }
}

.reviewAvatar {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  @include mobile {
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
  @include mobile {
    gap: 0.25rem;
  }
}

.reviewNameRow {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.reviewName {
  font-size: 1.5rem;
  font-weight: 600;
  @include mobile {
    font-size: 1.125rem;
  }
}

.reviewDate {
  font-size: 0.75rem;
  color: $text-secondary;
  flex-shrink: 0;
  font-weight: 700;
  @include mobile {
    font-size: 0.6875rem;
  }
}

.reviewStars {
  display: flex;
  gap: 0.25rem;
  @include mobile {
    gap: 0.125rem;
  }
}

.starIcon {
  width: 1.5rem;
  height: 1.5rem;
  @include mobile {
    width: 1.125rem;
    height: 1.125rem;
  }
}

.reviewStay {
  font-size: 0.875rem;
  color: $text-secondary;
  margin: 0;
  @include mobile {
    font-size: 0.75rem;
  }
}

.reviewText {
  flex: 1;
  min-height: 0;
  font-size: 1rem;
  line-height: 1.2;
  margin: 0;
  color: $text-primary;
  @include mobile {
    font-size: 0.875rem;
    line-height: 1.35;
  }
}
</style>
