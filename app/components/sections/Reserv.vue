<template>
  <component
    :is="embedded ? 'div' : 'section'"
    :id="embedded ? undefined : 'reserv'"
    :class="embedded ? $style.embeddedWrap : $style.wrapper"
  >
    <div v-if="!embedded" :class="$style.header">
      <div :class="$style.titleRow">
        <h2 :class="$style.titlePrimary">ВЫБЕРИТЕ ВИЛЛУ</h2>
        <div :class="$style.titleBrand">
          <p>Резиденция</p>
          <p>ВОЛГА</p>
        </div>
      </div>
      <h2 :class="$style.titleSecondary">ИЗ НАШЕЙ КОЛЛЕКЦИИ</h2>
    </div>
    <div :class="$style.reservContainer">
      <div :class="$style.switcher">
        <div
          v-for="(tab, index) in apartmentTabs"
          :key="tab.id"
          :class="$style.tabCard"
          role="button"
          tabindex="0"
          :aria-label="`Вилла ${tab.label}`"
          @click="selectTab(index)"
          @keydown.enter.prevent="selectTab(index)"
          @keydown.space.prevent="selectTab(index)"
        >
          <button
            type="button"
            :class="[
              $style.switcherTab,
              activeTabIndex === index && $style.switcherTabActive,
            ]"
            tabindex="-1"
            aria-hidden="true"
          >
            <span :class="$style.switcherTabVilla">Вилла</span>
            <span :class="$style.switcherTabLabel">{{ tab.label }}</span>
          </button>
        </div>
      </div>

      <template v-if="currentApartment">
        <Transition name="tab-content" mode="out-in">
          <div :key="currentApartment.id" :class="$style.tabContentInner">
            <div :class="$style.mainContent">
              <div :class="$style.carouselWrap">
                <p :class="$style.carouselPriceOverlay">
                  от
                  {{
                    formatPrice(
                      currentApartment.price?.common?.without_discount
                    )
                  }}
                </p>
                <button
                  type="button"
                  :class="[
                    $style.carouselNavBtn,
                    $style.carouselNavBtnPrev,
                    !canCarouselPrev && $style.carouselNavBtnDisabled,
                  ]"
                  aria-label="Предыдущее фото"
                  :disabled="!canCarouselPrev"
                  @click="carouselPrev"
                >
                  <img
                    :src="arrowLeftIcon"
                    alt=""
                    width="48"
                    height="48"
                    decoding="async"
                  />
                </button>
                <Swiper
                  :modules="swiperModules"
                  :slides-per-view="carouselSlidesPerView"
                  :centered-slides="true"
                  :space-between="carouselGap"
                  :initial-slide="0"
                  :loop="carouselLoop"
                  :loop-additional-slides="2"
                  :breakpoints="carouselBreakpoints"
                  :class="$style.carousel"
                  @swiper="onCarouselSwiper"
                  @slide-change="onCarouselSlideChange"
                >
                  <SwiperSlide
                    v-for="(photo, photoIndex) in carouselPhotos"
                    :key="photoIndex"
                  >
                    <img
                      :src="photo.url"
                      :alt="`${currentApartment.title} — фото ${
                        photoIndex + 1
                      }`"
                      :class="$style.carouselImg"
                      width="1200"
                      height="800"
                      loading="lazy"
                      decoding="async"
                    />
                  </SwiperSlide>
                </Swiper>
                <button
                  type="button"
                  :class="[
                    $style.carouselNavBtn,
                    $style.carouselNavBtnNext,
                    !canCarouselNext && $style.carouselNavBtnDisabled,
                  ]"
                  aria-label="Следующее фото"
                  :disabled="!canCarouselNext"
                  @click="carouselNext"
                >
                  <img
                    :src="arrowRightIcon"
                    alt=""
                    width="48"
                    height="48"
                    decoding="async"
                  />
                </button>
                <div
                  v-if="carouselPhotos.length > 0"
                  :class="$style.carouselPagination"
                  role="tablist"
                  aria-label="Пагинация слайдов"
                >
                  <button
                    v-for="dotIndex in 3"
                    :key="dotIndex"
                    type="button"
                    :class="[
                      $style.carouselPaginationDot,
                      carouselPaginationActiveDot === dotIndex - 1 &&
                        $style.carouselPaginationDotActive,
                    ]"
                    :aria-label="
                      dotIndex === 1
                        ? 'Первое фото'
                        : dotIndex === 2
                          ? 'Средние фото'
                          : 'Последнее фото'
                    "
                    :aria-current="
                      carouselPaginationActiveDot === dotIndex - 1
                        ? 'true'
                        : undefined
                    "
                    @click="goToCarouselDot(dotIndex - 1)"
                  />
                </div>
              </div>

              <div :class="$style.detailsColumn">
                <div
                  :class="[
                    $style.detailsHeader,
                    $style.detailsHeaderDesktopOnly,
                  ]"
                >
                  <h4 :class="$style.villaTitle">
                    {{ currentApartment.title }}
                  </h4>
                  <p :class="$style.villaPrice">
                    от
                    {{
                      formatPrice(
                        currentApartment.price?.common?.without_discount
                      )
                    }}
                  </p>
                </div>
                <div
                  v-if="currentApartment.desc"
                  :class="[$style.villaDesc, $style.villaDescDesktopOnly]"
                  v-html="currentApartment.desc"
                ></div>

                <div
                  v-if="nearestDatesItems.length || nearestDatesLoading"
                  :class="$style.upcomingDates"
                >
                  <span :class="$style.upcomingDatesTitle">Ближайшие даты</span>
                  <div :class="$style.upcomingDatesNavWrap">
                    <template v-if="nearestDatesLoading">
                      <div :class="$style.upcomingDatesSkeleton">
                        <span
                          v-for="n in 12"
                          :key="n"
                          :class="$style.upcomingDatesSkeletonCard"
                        />
                      </div>
                    </template>
                    <template v-else>
                      <button
                        type="button"
                        :class="[
                          $style.upcomingDatesNavBtn,
                          $style.upcomingDatesNavBtnPrev,
                          !canScrollNearestLeft &&
                            $style.upcomingDatesNavBtnDisabled,
                        ]"
                        aria-label="Назад"
                        :disabled="!canScrollNearestLeft"
                        @click="scrollNearestDates(-1)"
                      >
                        <img
                          :src="arrowLeftIcon"
                          alt=""
                          width="48"
                          height="48"
                          decoding="async"
                        />
                      </button>
                      <div
                        ref="nearestDatesScrollRef"
                        :class="$style.upcomingDatesScroll"
                        @scroll="updateNearestDatesScrollState"
                      >
                        <div :class="$style.upcomingDatesScrollInner">
                          <div
                            v-for="(item, index) in nearestDatesItems"
                            :key="index"
                            :class="[
                              $style.dateCard,
                              !item.available && $style.dateCardUnavailable,
                              isDateCardSelected(item) &&
                                $style.dateCardSelected,
                            ]"
                            @click="onDateCardClick(item)"
                          >
                            <span
                              v-if="item.available && item.discountPercent"
                              :class="$style.dateCardDiscount"
                            >
                              {{ item.discountLabel }}
                            </span>
                            <div :class="$style.dateCardMain">
                              <span
                                v-if="item.available && item.price != null"
                                :class="$style.dateCardPrice"
                              >
                                {{ item.priceFormatted }}
                              </span>
                              <span
                                v-else-if="!item.available"
                                :class="$style.dateCardBusy"
                              >
                                ЗАНЯТО
                              </span>
                              <span v-else :class="$style.dateCardPrice"
                                >—</span
                              >
                            </div>
                            <div :class="$style.dateCardFooter">
                              <span :class="$style.dateCardDays">{{
                                item.dayRange
                              }}</span>
                              <span :class="$style.dateCardMonth">{{
                                item.monthLabel
                              }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        :class="[
                          $style.upcomingDatesNavBtn,
                          $style.upcomingDatesNavBtnNext,
                          !canScrollNearestRight &&
                            $style.upcomingDatesNavBtnDisabled,
                        ]"
                        aria-label="Вперёд"
                        :disabled="!canScrollNearestRight"
                        @click="scrollNearestDates(1)"
                      >
                        <img
                          :src="arrowRightIcon"
                          alt=""
                          width="48"
                          height="48"
                          decoding="async"
                        />
                      </button>
                    </template>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="!embedded" :class="$style.bottomBlocks">
              <div
                :class="[
                  $style.block,
                  expandedBlocks.philosophy && $style.blockExpanded,
                ]"
              >
                <h5
                  :class="$style.blockTitle"
                  role="button"
                  tabindex="0"
                  :aria-expanded="expandedBlocks.philosophy"
                  @click="toggleBlock('philosophy')"
                  @keydown.enter.prevent="toggleBlock('philosophy')"
                  @keydown.space.prevent="toggleBlock('philosophy')"
                >
                  Философия и стиль
                  <AppIcon
                    name="reservArrowDownRight"
                    alt=""
                    :class="$style.blockTitleIcon"
                  />
                </h5>
                <div :class="$style.blockContent">
                  <div
                    v-if="currentApartment.desc"
                    :class="$style.blockDesc"
                    v-html="currentApartment.desc"
                  />
                  <p v-else :class="$style.blockListInline">—</p>
                </div>
              </div>
              <div
                :class="[
                  $style.block,
                  expandedBlocks.details && $style.blockExpanded,
                ]"
              >
                <h5
                  :class="$style.blockTitle"
                  role="button"
                  tabindex="0"
                  :aria-expanded="expandedBlocks.details"
                  @click="toggleBlock('details')"
                  @keydown.enter.prevent="toggleBlock('details')"
                  @keydown.space.prevent="toggleBlock('details')"
                >
                  Детали размещения
                  <AppIcon
                    name="reservArrowDownRight"
                    alt=""
                    :class="$style.blockTitleIcon"
                  />
                </h5>
                <div :class="$style.blockContent">
                  <div :class="$style.blockListTwoCol">
                    <div :class="$style.blockListRow">
                      <span :class="$style.blockListLabel">Кол-во гостей</span>
                      <span :class="$style.blockListValue">{{
                        currentApartment.capacity ?? "—"
                      }}</span>
                    </div>
                    <div :class="$style.blockListRow">
                      <span :class="$style.blockListLabel"
                        >Кол-во спальных мест</span
                      >
                      <span :class="$style.blockListValue">{{
                        sleepsTotal ?? "—"
                      }}</span>
                    </div>
                    <div :class="$style.blockListRow">
                      <span :class="$style.blockListLabel">Кол-во этажей</span>
                      <span :class="$style.blockListValue">{{
                        currentApartment.floor ?? "—"
                      }}</span>
                    </div>
                    <div :class="$style.blockListRow">
                      <span :class="$style.blockListLabel">Кол-во комнат</span>
                      <span :class="$style.blockListValue">{{
                        currentApartment.rooms ?? "—"
                      }}</span>
                    </div>
                    <div :class="$style.blockListRow">
                      <span :class="$style.blockListLabel"
                        >Кол-во санузлов</span
                      >
                      <span :class="$style.blockListValue">{{
                        bathroomsCount
                      }}</span>
                    </div>
                    <div :class="$style.blockListRow">
                      <span :class="$style.blockListLabel">Площадь</span>
                      <span :class="$style.blockListValue"
                        >{{ currentApartment.area ?? "—" }} м2</span
                      >
                    </div>
                  </div>
                </div>
              </div>
              <div
                :class="[
                  $style.block,
                  expandedBlocks.comfort && $style.blockExpanded,
                ]"
              >
                <h5
                  :class="$style.blockTitle"
                  role="button"
                  tabindex="0"
                  :aria-expanded="expandedBlocks.comfort"
                  @click="toggleBlock('comfort')"
                  @keydown.enter.prevent="toggleBlock('comfort')"
                  @keydown.space.prevent="toggleBlock('comfort')"
                >
                  Условия комфорта
                  <AppIcon
                    name="reservArrowDownRight"
                    alt=""
                    :class="$style.blockTitleIcon"
                  />
                </h5>
                <div :class="$style.blockContent">
                  <p v-if="comfortServicesText" :class="$style.blockListInline">
                    {{ comfortServicesText }}
                  </p>
                  <p v-else :class="$style.blockListInline">—</p>
                </div>
              </div>
              <div
                :class="[
                  $style.block,
                  expandedBlocks.etiquette && $style.blockExpanded,
                ]"
              >
                <h5
                  :class="$style.blockTitle"
                  role="button"
                  tabindex="0"
                  :aria-expanded="expandedBlocks.etiquette"
                  @click="toggleBlock('etiquette')"
                  @keydown.enter.prevent="toggleBlock('etiquette')"
                  @keydown.space.prevent="toggleBlock('etiquette')"
                >
                  Гостевой этикет
                  <AppIcon
                    name="reservArrowDownRight"
                    alt=""
                    :class="$style.blockTitleIcon"
                  />
                </h5>
                <div :class="$style.blockContent">
                  <div :class="$style.blockListTwoCol">
                    <div :class="$style.blockListRow">
                      <span :class="$style.blockListLabel">Время прибытия</span>
                      <span :class="$style.blockListValue">{{
                        rulesCheckInLabel || "—"
                      }}</span>
                    </div>
                    <div :class="$style.blockListRow">
                      <span :class="$style.blockListLabel">Время выезда</span>
                      <span :class="$style.blockListValue">{{
                        rulesCheckOutLabel || "—"
                      }}</span>
                    </div>
                    <div :class="$style.blockListRow">
                      <span :class="$style.blockListLabel">Можно курить</span>
                      <span :class="$style.blockListValue">{{
                        rulesSmokeAllowed ? "да" : "нет"
                      }}</span>
                    </div>
                    <div :class="$style.blockListRow">
                      <span :class="$style.blockListLabel"
                        >Есть отчётные документы</span
                      >
                      <span :class="$style.blockListValue">да</span>
                    </div>
                    <div :class="$style.blockListRow">
                      <span :class="$style.blockListLabel">С питомцем</span>
                      <span :class="$style.blockListValue">{{
                        rulesPetsAllowed ? "По согласованию" : "нет"
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </template>
      <div v-else :class="$style.loadingWrap">
        <div :class="$style.spinner" aria-hidden="true" />
      </div>
    </div>

    <Teleport to="body">
      <Transition name="photo-gallery">
        <div
          v-if="photoGalleryOpen"
          :class="$style.photoGalleryOverlay"
          role="dialog"
          aria-modal="true"
          aria-label="Фотографии"
          @click.self="closePhotoGallery"
        >
          <div :class="$style.photoGalleryPanel">
            <header :class="$style.photoGalleryHeader">
              <button
                type="button"
                :class="$style.photoGalleryBack"
                aria-label="Закрыть"
                @click="closePhotoGallery"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M15 18l-6-6 6-6"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
              <h2 :class="$style.photoGalleryTitle">Фотографии</h2>
              <div :class="$style.photoGalleryHeaderSpacer" />
            </header>
            <div :class="$style.photoGalleryGrid">
              <button
                v-for="(photo, idx) in carouselPhotos"
                :key="idx"
                type="button"
                :class="$style.photoGalleryItem"
                @click="openFullscreenPhoto(idx)"
              >
                <img
                  :src="photo.url"
                  :alt="`${currentApartment?.title ?? 'Вилла'} — фото ${
                    idx + 1
                  }`"
                  loading="lazy"
                  decoding="async"
                />
              </button>
            </div>

            <Transition name="photo-fullscreen">
              <div
                v-if="fullscreenPhotoIndex !== null"
                :class="$style.photoFullscreenOverlay"
                role="dialog"
                aria-modal="true"
                aria-label="Просмотр фото"
                @click.self="closeFullscreenPhoto"
              >
                <button
                  type="button"
                  :class="$style.photoFullscreenClose"
                  aria-label="Закрыть"
                  @click="closeFullscreenPhoto"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M18 6L6 18M6 6l12 12"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
                <button
                  v-if="carouselPhotos.length > 1 && fullscreenPhotoIndex > 0"
                  type="button"
                  :class="[
                    $style.photoFullscreenNav,
                    $style.photoFullscreenPrev,
                  ]"
                  aria-label="Предыдущее фото"
                  @click.stop="fullscreenPhotoIndex = fullscreenPhotoIndex - 1"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M15 18l-6-6 6-6"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
                <button
                  v-if="
                    carouselPhotos.length > 1 &&
                    fullscreenPhotoIndex < carouselPhotos.length - 1
                  "
                  type="button"
                  :class="[
                    $style.photoFullscreenNav,
                    $style.photoFullscreenNext,
                  ]"
                  aria-label="Следующее фото"
                  @click.stop="fullscreenPhotoIndex = fullscreenPhotoIndex + 1"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M9 18l6-6-6-6"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
                <div
                  :class="$style.photoFullscreenImgWrap"
                  @mousedown.prevent="onFullscreenDragStart($event)"
                  @touchstart.prevent="onFullscreenDragStart($event)"
                  @mousemove.prevent="onFullscreenDragMove($event)"
                  @touchmove.prevent="onFullscreenDragMove($event)"
                  @mouseup="onFullscreenDragEnd"
                  @mouseleave="onFullscreenDragEnd"
                  @touchend="onFullscreenDragEnd"
                  @wheel.prevent="onFullscreenWheel"
                >
                  <img
                    v-if="carouselPhotos[fullscreenPhotoIndex]"
                    :src="carouselPhotos[fullscreenPhotoIndex].url"
                    :alt="`${currentApartment?.title ?? 'Вилла'} — фото ${
                      fullscreenPhotoIndex + 1
                    }`"
                    :class="$style.photoFullscreenImg"
                    :style="{
                      transform: `translate(${fullscreenTranslateX}px, ${fullscreenTranslateY}px) scale(${fullscreenScale})`,
                    }"
                  />
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </Transition>
    </Teleport>
  </component>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ru } from "date-fns/locale";
import arrowLeftIcon from "@app/assets/icons/ui/arrow-left.svg?url";
import arrowRightIcon from "@app/assets/icons/ui/arrow-right.svg?url";

const VueDatePicker = defineAsyncComponent(async () => {
  await import("@vuepic/vue-datepicker/dist/main.css");
  const mod = await import("@vuepic/vue-datepicker");
  return mod.VueDatePicker;
});

const EQUIPMENT_KEYS = [
  "air_conditioning",
  "pool",
  "washing_machine",
  "refrigerator",
  "telephone",
  "stove",
  "dishwasher",
  "transfer",
  "music_center",
  "microwave",
  "iron",
  "tv",
  "crib",
  "parking",
  "sauna",
  "safe",
  "waterheater",
  "cabletv",
  "bathroom",
  "jacuzzi",
  "elevator",
];
const COMFORT_KEYS = [
  "seaview",
  "mountainview",
  "seafront",
  "wi_fi",
  "playground",
  "concierge",
  "romantic",
];
const CHILD_AGES = Array.from({ length: 18 }, (_, i) => String(i));
const SERVICE_LABELS = {
  seaview: "Вид на море",
  mountainview: "Вид на горы",
  seafront: "У моря",
  air_conditioning: "Индивидуальная система кондиционирования",
  pool: "Бассейн",
  washing_machine: "Стиральная машина",
  wi_fi: "Высокоскоростной Wi-Fi",
  animals: "Можно с животными",
  party: "Можно проводить вечеринки",
  tv: "Smart TV",
  kids: "Подходит для детей",
  playground: "Детская площадка",
  refrigerator: "Холодильник",
  telephone: "Телефон",
  stove: "Плита",
  dishwasher: "Посудомоечная машина",
  transfer: "Трансфер",
  music_center: "Музыкальный центр",
  microwave: "Микроволновка",
  iron: "Утюг",
  crib: "Детская кроватка",
  concierge: "Консьерж",
  parking: "Парковка",
  sauna: "Сауна",
  safe: "Сейф",
  waterheater: "Водонагреватель",
  cabletv: "Кабельное ТВ",
  bathroom: "Ванная комната",
  smoke: "Можно курить",
  romantic: "Романтический отдых",
  jacuzzi: "Джакузи",
  balcony: "Терраса / веранда",
  elevator: "Лифт",
};

const COMFORT_SERVICE_KEYS = [
  ...COMFORT_KEYS,
  ...EQUIPMENT_KEYS,
  "balcony",
  "party",
  "kids",
];

export default {
  name: "Reserv",
  components: { Swiper, SwiperSlide, VueDatePicker },
  props: {
    embedded: {
      type: Boolean,
      default: false,
    },
    initialBookingName: {
      type: String,
      default: "",
    },
    initialBookingPhone: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      arrowLeftIcon,
      arrowRightIcon,
      localSelectedIndex: 0,
      swiperModules: [Navigation],
      carouselSwiper: null,
      carouselActiveIndex: 1,
      canCarouselPrev: false,
      canCarouselNext: false,
      carouselGap: 16,
      carouselSlidesPerView: 1.35,
      photoGalleryOpen: false,
      fullscreenPhotoIndex: null,
      fullscreenScale: 1,
      fullscreenTranslateX: 0,
      fullscreenTranslateY: 0,
      fullscreenDragging: false,
      fullscreenDragStartX: 0,
      fullscreenDragStartY: 0,
      bookingName: this.initialBookingName ?? "",
      bookingPhone: this.initialBookingPhone ?? "",
      bookingSubmitting: false,
      bookingValidationError: "",
      bookingCheckInError: false,
      bookingCheckOutError: false,
      bookingApiErrors: {},
      guestsOpen: false,
      guestSelection: { adults: 1, children: [] },
      childAges: CHILD_AGES,
      calendarOpenCheckIn: false,
      calendarOpenCheckOut: false,
      checkInDate: null,
      checkOutDate: null,
      ruLocale: ru,
      calendarViewMonth: null,
      calendarViewYear: null,
      canScrollNearestLeft: false,
      canScrollNearestRight: false,
      nearestDatesLoading: false,
      isMobile: false,
      expandedBlocks: {
        philosophy: true,
        details: false,
        comfort: false,
        etiquette: false,
      },
    };
  },
  computed: {
    checkInDateFormatted() {
      if (!this.checkInDate) return "";
      const months = [
        "января",
        "февраля",
        "марта",
        "апреля",
        "мая",
        "июня",
        "июля",
        "августа",
        "сентября",
        "октября",
        "ноября",
        "декабря",
      ];
      return `${this.checkInDate.getDate()} ${months[this.checkInDate.getMonth()]}`;
    },
    checkOutDateFormatted() {
      if (!this.checkOutDate) return "";
      const months = [
        "января",
        "февраля",
        "марта",
        "апреля",
        "мая",
        "июня",
        "июля",
        "августа",
        "сентября",
        "октября",
        "ноября",
        "декабря",
      ];
      return `${this.checkOutDate.getDate()} ${months[this.checkOutDate.getMonth()]}`;
    },
    totalGuests() {
      const g = this.guestSelection;
      return (g?.adults ?? 0) + (g?.children?.length ?? 0);
    },
    maxGuests() {
      const cap = this.currentApartment?.capacity;
      return cap != null && cap > 0 ? cap : 99;
    },
    canAddAdult() {
      return this.totalGuests < this.maxGuests;
    },
    canAddChild() {
      return this.totalGuests < this.maxGuests;
    },
    guests() {
      const g = this.guestSelection;
      return {
        adults: g?.adults ?? 0,
        children: (g?.children ?? []).map((c) => ({ age: c?.age ?? "0" })),
      };
    },
    activeTabIndex() {
      if (this.embedded) return this.localSelectedIndex;
      return this.$store.state.selectedApartmentIndex ?? 0;
    },
    apartments() {
      return this.$store.state.apartments || [];
    },
    apartmentTabs() {
      return this.apartments.map((a) => ({
        id: a.id,
        label: a.title,
      }));
    },
    currentApartment() {
      return this.apartments[this.activeTabIndex] ?? this.apartments[0] ?? null;
    },
    carouselPhotos() {
      const photos = this.currentApartment?.photos;
      if (!Array.isArray(photos)) return [];
      return photos.slice(0, 25);
    },
    carouselLoop() {
      return this.carouselPhotos.length > 1;
    },
    carouselBreakpoints() {
      return {
        0: {
          slidesPerView: 1,
          centeredSlides: false,
          spaceBetween: this.carouselGap,
          loop: this.carouselLoop,
        },
        769: {
          slidesPerView: this.carouselSlidesPerView,
          centeredSlides: true,
          spaceBetween: this.carouselGap,
          loop: this.carouselLoop,
        },
      };
    },
    carouselPaginationActiveDot() {
      const len = this.carouselPhotos.length;
      const idx = this.carouselActiveIndex;
      if (len <= 0) return 0;
      if (idx <= 1) return 0;
      if (idx >= len) return 2;
      return 1;
    },
    sleepsTotal() {
      const s = this.currentApartment?.sleeps;
      if (s == null || typeof s !== "string") return null;
      const sum = s
        .split("+")
        .map((part) => parseInt(part.trim(), 10))
        .filter((n) => !Number.isNaN(n))
        .reduce((acc, n) => acc + n, 0);
      return sum > 0 ? sum : null;
    },
    bathroomsCount() {
      return "—";
    },
    comfortServicesText() {
      const services = this.currentApartment?.services;
      if (!Array.isArray(services) || !services.length) return "";
      const labels = COMFORT_SERVICE_KEYS.filter((key) =>
        services.includes(key)
      ).map((key) => this.serviceLabel(key));
      const unique = [...new Set(labels)];
      return unique.join(" · ");
    },
    rulesKidsAllowed() {
      return this.currentApartment?.services?.includes("kids") ?? false;
    },
    rulesPetsAllowed() {
      return this.currentApartment?.services?.includes("animals") ?? false;
    },
    rulesPartyAllowed() {
      return this.currentApartment?.services?.includes("party") ?? false;
    },
    rulesSmokeAllowed() {
      return this.currentApartment?.services?.includes("smoke") ?? false;
    },
    checkInRule() {
      const id = this.currentApartment?.id;
      return this.$store.state.apartmentDetails?.[id]?.check_in_rule ?? null;
    },
    rulesCheckInLabel() {
      const start = this.checkInRule?.check_in_time_start;
      return start ? `после ${start}` : "";
    },
    rulesCheckOutLabel() {
      const end = this.checkInRule?.check_out_time_end;
      return end ? `до ${end}` : "";
    },
    bookingValidationMessage() {
      const messages = {
        name: "Введите имя",
        phone: "Введите номер телефона",
      };
      return this.bookingValidationError
        ? messages[this.bookingValidationError] || ""
        : "";
    },
    bookingApiErrorName() {
      const list = this.bookingApiErrors?.first_name;
      return Array.isArray(list) && list.length ? list[0] : "";
    },
    bookingApiErrorPhone() {
      const list = this.bookingApiErrors?.phone;
      return Array.isArray(list) && list.length ? list[0] : "";
    },
    isAnyDropdownOpen() {
      return (
        this.calendarOpenCheckIn || this.calendarOpenCheckOut || this.guestsOpen
      );
    },
    calendarFromStore() {
      return this.$store.state.calendar || [];
    },
    calendarNearestFromStore() {
      return this.$store.state.calendarNearest || [];
    },
    nearestDatesItems() {
      const list = this.calendarNearestFromStore;
      return list.map((entry) => {
        const partsFrom = this.formatCalendarDateParts(entry.date);
        const nextDayStr = this.addDaysToDateStr(entry.date, 1);
        const partsTo = this.formatCalendarDateParts(nextDayStr);
        const shortFrom = this.formatCalendarDateShortMonth(entry.date);
        const shortTo = this.formatCalendarDateShortMonth(nextDayStr);
        const dayRange = `${partsFrom.day}-${partsTo.day}`;
        const monthLabel =
          partsFrom.month === partsTo.month
            ? partsTo.month
            : `${shortFrom}/${shortTo}`;
        const dateLabel = `${dayRange} ${monthLabel}`;
        const price = entry.price;
        const discountPercent = entry.discounts?.[0]?.percent ?? 0;
        const checkInDate = this.parseDateStr(entry.date);
        const checkOutDate = this.parseDateStr(nextDayStr);
        return {
          dayRange,
          monthLabel,
          dateLabel,
          price,
          priceFormatted:
            price != null ? this.formatPrice(price) : null,
          discountPercent: discountPercent || null,
          discountLabel: discountPercent ? `-${discountPercent}%` : "",
          available:
            entry.closed_on_arrival !== true && entry.available !== false,
          checkInDate,
          checkOutDate,
          checkInStr: entry.date,
          checkOutStr: nextDayStr,
        };
      });
    },
  },
  watch: {
    nearestDatesItems() {
      this.canScrollNearestLeft = false;
      this.canScrollNearestRight = false;
      this.$nextTick(() => {
        this.updateNearestDatesScrollState();
        requestAnimationFrame(() => {
          this.updateNearestDatesScrollState();
          requestAnimationFrame(() => this.updateNearestDatesScrollState());
        });
        setTimeout(() => this.updateNearestDatesScrollState(), 150);
      });
    },
    apartments(list) {
      if (!list.length) return;
      if (this.activeTabIndex >= list.length) {
        if (this.embedded) {
          this.localSelectedIndex = list.length - 1;
        } else {
          this.$store.commit("setSelectedApartmentIndex", list.length - 1);
        }
      }
    },
    activeTabIndex() {
      this.checkInDate = null;
      this.checkOutDate = null;
      this.guestSelection = { adults: 1, children: [] };
      this.guestsOpen = false;
      this.calendarOpenCheckIn = false;
      this.calendarOpenCheckOut = false;
      this.carouselActiveIndex = 1;
    },
    currentApartment(apt) {
      if (apt?.id && !this.$store.state.apartmentDetails?.[apt.id]) {
        this.$store.dispatch("getApartment", apt.id);
      }
      const cap = apt?.capacity;
      if (cap == null || cap < 1) return;
      const g = this.guestSelection;
      const total = (g?.adults ?? 0) + (g?.children?.length ?? 0);
      if (total > cap) {
        let adults = g?.adults ?? 1;
        const children = [...(g?.children ?? [])];
        while (adults + children.length > cap && adults > 1) adults -= 1;
        while (adults + children.length > cap && children.length)
          children.pop();
        this.guestSelection = { adults, children };
      }
      this.fetchCalendar();
    },
    calendarOpenCheckIn(open) {
      if (open) {
        this.calendarOpenCheckOut = false;
        const now = new Date();
        this.calendarViewMonth = now.getMonth();
        this.calendarViewYear = now.getFullYear();
        this.fetchCalendarForMonth(
          this.calendarViewMonth,
          this.calendarViewYear
        );
        this.$nextTick(() => {
          document.addEventListener("mousedown", this.onCalendarClickOutside);
          if (!this.embedded) {
            window.addEventListener("scroll", this.onCalendarScroll, true);
          }
        });
      } else {
        document.removeEventListener("mousedown", this.onCalendarClickOutside);
        window.removeEventListener("scroll", this.onCalendarScroll, true);
      }
    },
    calendarOpenCheckOut(open) {
      if (open) {
        this.calendarOpenCheckIn = false;
        const now = new Date();
        this.calendarViewMonth = now.getMonth();
        this.calendarViewYear = now.getFullYear();
        this.fetchCalendarForMonth(
          this.calendarViewMonth,
          this.calendarViewYear
        );
        this.$nextTick(() => {
          document.addEventListener("mousedown", this.onCalendarClickOutside);
          if (!this.embedded) {
            window.addEventListener("scroll", this.onCalendarScroll, true);
          }
        });
      } else {
        document.removeEventListener("mousedown", this.onCalendarClickOutside);
        window.removeEventListener("scroll", this.onCalendarScroll, true);
      }
    },
    guestsOpen(open) {
      if (open) {
        this.$nextTick(() => {
          document.addEventListener("mousedown", this.onGuestsClickOutside);
          if (!this.embedded) {
            window.addEventListener("scroll", this.onGuestsScroll, true);
          }
        });
      } else {
        document.removeEventListener("mousedown", this.onGuestsClickOutside);
        window.removeEventListener("scroll", this.onGuestsScroll, true);
      }
    },
    isAnyDropdownOpen(open) {
      if (open) {
        this.$nextTick(() => {
          window.addEventListener("wheel", this.onWheelCapture, {
            passive: false,
          });
        });
      } else {
        window.removeEventListener("wheel", this.onWheelCapture);
      }
    },
    photoGalleryOpen(open) {
      if (typeof document === "undefined") return;
      if (open) {
        this._prevBodyOverflowGallery = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", this.onPhotoGalleryKeydown);
      } else {
        document.body.style.overflow = this._prevBodyOverflowGallery ?? "";
        document.removeEventListener("keydown", this.onPhotoGalleryKeydown);
      }
    },
  },
  mounted() {
    if (this.embedded) {
      this.localSelectedIndex = this.$store.state.selectedApartmentIndex ?? 0;
    }
    this._resizeHandler = () => {
      this.isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
      this.syncCarouselGap();
      this.$nextTick(() => this.updateNearestDatesScrollState());
    };
    this._resizeHandler();
    if (typeof window !== "undefined") {
      window.addEventListener("resize", this._resizeHandler);
    }
  },
  beforeUnmount() {
    if (typeof window !== "undefined" && this._resizeHandler) {
      window.removeEventListener("resize", this._resizeHandler);
    }
    document.removeEventListener("keydown", this.onPhotoGalleryKeydown);
    if (this.photoGalleryOpen && typeof document !== "undefined") {
      document.body.style.overflow = this._prevBodyOverflowGallery ?? "";
    }
    document.removeEventListener("mousedown", this.onCalendarClickOutside);
    document.removeEventListener("mousedown", this.onGuestsClickOutside);
    window.removeEventListener("scroll", this.onCalendarScroll, true);
    window.removeEventListener("scroll", this.onGuestsScroll, true);
    window.removeEventListener("wheel", this.onWheelCapture);
  },
  methods: {
    onCarouselSwiper(swiper) {
      this.carouselSwiper = swiper;
      this.syncCarouselGap();
      if (swiper) {
        this.carouselActiveIndex = (swiper.realIndex ?? 0) + 1;
        this.updateCarouselNavState(swiper);
        swiper.on("realIndexChange", (s) => {
          this.carouselActiveIndex = (s.realIndex ?? s.activeIndex ?? 0) + 1;
          this.updateCarouselNavState(s);
        });
      }
    },
    syncCarouselGap() {
      if (typeof window === "undefined" || typeof document === "undefined")
        return;
      const rem =
        parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      this.carouselGap = rem;
      const swiper = this.carouselSwiper;
      if (!swiper?.params) return;
      swiper.params.spaceBetween = rem;
      if (swiper.params.breakpoints?.[769]) {
        swiper.params.breakpoints[769].spaceBetween = rem;
      }
      if (swiper.params.breakpoints?.[0]) {
        swiper.params.breakpoints[0].spaceBetween = rem;
      }
      swiper.update?.();
    },
    onCarouselSlideChange(swiper) {
      this.updateCarouselNavState(swiper);
    },
    updateCarouselNavState(swiper = this.carouselSwiper) {
      if (!swiper || this.carouselPhotos.length <= 1) {
        this.canCarouselPrev = false;
        this.canCarouselNext = false;
        return;
      }
      this.canCarouselPrev = true;
      this.canCarouselNext = true;
    },
    carouselPrev() {
      if (!this.canCarouselPrev) return;
      this.carouselSwiper?.slidePrev?.();
    },
    carouselNext() {
      if (!this.canCarouselNext) return;
      this.carouselSwiper?.slideNext?.();
    },
    goToCarouselDot(dotIndex) {
      if (!this.carouselSwiper || !this.carouselPhotos.length) return;
      const len = this.carouselPhotos.length;
      const target =
        dotIndex === 0 ? 0 : dotIndex === 1 ? Math.floor(len / 2) : len - 1;
      if (this.carouselLoop && this.carouselSwiper.slideToLoop) {
        this.carouselSwiper.slideToLoop(target);
      } else {
        this.carouselSwiper.slideTo(target);
      }
    },
    openPhotoGallery() {
      this.photoGalleryOpen = true;
    },
    closePhotoGallery() {
      this.resetFullscreenTransform();
      this.fullscreenPhotoIndex = null;
      this.photoGalleryOpen = false;
    },
    openFullscreenPhoto(idx) {
      this.resetFullscreenTransform();
      this.fullscreenPhotoIndex = idx;
    },
    closeFullscreenPhoto() {
      this.resetFullscreenTransform();
      this.fullscreenPhotoIndex = null;
    },
    resetFullscreenTransform() {
      this.fullscreenScale = 1;
      this.fullscreenTranslateX = 0;
      this.fullscreenTranslateY = 0;
      this.fullscreenDragging = false;
    },
    getFullscreenPoint(event) {
      if (event.touches && event.touches[0]) {
        return {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
        };
      }
      return { x: event.clientX, y: event.clientY };
    },
    onFullscreenDragStart(event) {
      if (this.fullscreenScale <= 1) return;
      const point = this.getFullscreenPoint(event);
      this.fullscreenDragging = true;
      this.fullscreenDragStartX = point.x - this.fullscreenTranslateX;
      this.fullscreenDragStartY = point.y - this.fullscreenTranslateY;
    },
    onFullscreenDragMove(event) {
      if (!this.fullscreenDragging) return;
      const point = this.getFullscreenPoint(event);
      this.fullscreenTranslateX = point.x - this.fullscreenDragStartX;
      this.fullscreenTranslateY = point.y - this.fullscreenDragStartY;
    },
    onFullscreenDragEnd() {
      this.fullscreenDragging = false;
    },
    onFullscreenWheel(event) {
      const delta = event.deltaY > 0 ? -0.2 : 0.2;
      let next = this.fullscreenScale + delta;
      if (next < 1) next = 1;
      if (next > 4) next = 4;
      if (next === 1) {
        this.fullscreenTranslateX = 0;
        this.fullscreenTranslateY = 0;
      }
      this.fullscreenScale = next;
    },
    onPhotoGalleryKeydown(e) {
      if (e.key === "Escape") {
        if (this.fullscreenPhotoIndex !== null) this.closeFullscreenPhoto();
        else this.closePhotoGallery();
      }
    },
    formatPrice(value) {
      if (value == null) return "—";
      return `${Number(value).toLocaleString("ru-RU")} ₽`;
    },
    formatCalendarDateParts(dateStr) {
      if (!dateStr) return { day: "", month: "" };
      const [, m, d] = dateStr.split("-").map(Number);
      const months = [
        "января",
        "февраля",
        "марта",
        "апреля",
        "мая",
        "июня",
        "июля",
        "августа",
        "сентября",
        "октября",
        "ноября",
        "декабря",
      ];
      return { day: d, month: months[(m || 1) - 1] || "" };
    },
    addDaysToDateStr(dateStr, days) {
      if (!dateStr) return "";
      const [y, m, d] = dateStr.split("-").map(Number);
      const date = new Date(y, m - 1, d + days);
      const pad = (n) => String(n).padStart(2, "0");
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate()
      )}`;
    },
    formatCalendarDateShortMonth(dateStr) {
      if (!dateStr) return "";
      const [, m] = dateStr.split("-").map(Number);
      const shortMonths = [
        "янв",
        "фев",
        "мар",
        "апр",
        "май",
        "июн",
        "июл",
        "авг",
        "сен",
        "окт",
        "ноя",
        "дек",
      ];
      return shortMonths[(m || 1) - 1] || "";
    },
    parseDateStr(dateStr) {
      if (!dateStr) return null;
      const [y, m, d] = dateStr.split("-").map(Number);
      return new Date(y, m - 1, d);
    },
    toDateStr(date) {
      if (!date || !(date instanceof Date)) return "";
      const pad = (n) => String(n).padStart(2, "0");
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate()
      )}`;
    },
    isDateCardSelected(item) {
      const start = this.checkInDate;
      const end = this.checkOutDate;
      if (!start || !end) return false;
      return (
        this.toDateStr(start) === item.checkInStr &&
        this.toDateStr(end) === item.checkOutStr
      );
    },
    onDateCardClick(item) {
      if (!item.available) return;
      this.checkInDate = new Date(item.checkInDate.getTime());
      this.checkOutDate = new Date(item.checkOutDate.getTime());
      this.bookingValidationError = "";
      this.bookingCheckInError = false;
      this.bookingCheckOutError = false;

      const apt = this.currentApartment;
      if (!apt?.id) return;

      const guests = {
        adults: this.guestSelection?.adults ?? 1,
        children: (this.guestSelection?.children ?? []).map((c) => ({
          age: c?.age ?? "0",
        })),
      };

      const basePrice =
        item.discountPercent && item.price != null
          ? Math.round(item.price / (1 - item.discountPercent / 100))
          : null;

      this.$store.commit("setBookingFormData", {
        checkInDate: this.toDateStr(this.checkInDate),
        checkOutDate: this.toDateStr(this.checkOutDate),
        guests,
        apartment: apt,
        price: item.price ?? null,
        priceFormatted: item.priceFormatted ?? null,
        discountPercent: item.discountPercent ?? null,
        basePrice,
      });
      this.$store.commit("setSelectedApartmentIndex", this.activeTabIndex);
      this.$store.commit("setBookingFormModalOpen", true);
    },
    isCalendarDateDisabledForCheckOut(date) {
      if (this.isCalendarDateDisabled(date)) return true;
      if (!this.checkInDate) return false;
      return this.toDateStr(date) <= this.toDateStr(this.checkInDate);
    },
    scrollNearestDates(direction) {
      const el = this.$refs.nearestDatesScrollRef;
      if (!el) return;
      const step = 220;
      el.scrollBy({ left: direction * step, behavior: "smooth" });
      setTimeout(() => this.updateNearestDatesScrollState(), 350);
    },
    updateNearestDatesScrollState() {
      const el = this.$refs.nearestDatesScrollRef;
      if (!el) return;
      const threshold = 1;
      const hasOverflow = el.scrollWidth > el.clientWidth;
      if (!hasOverflow) {
        this.canScrollNearestLeft = false;
        this.canScrollNearestRight = false;
        return;
      }
      this.canScrollNearestLeft = el.scrollLeft > threshold;
      this.canScrollNearestRight =
        el.scrollLeft + el.clientWidth < el.scrollWidth - threshold;
    },
    async fetchCalendar(monthsAhead = 1) {
      const apt = this.currentApartment;
      if (!apt?.id) return;
      this.nearestDatesLoading = true;
      try {
        const now = new Date();
        const begin = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );
        const end = new Date(
          now.getFullYear(),
          now.getMonth() + monthsAhead,
          now.getDate()
        );
        const pad = (n) => String(n).padStart(2, "0");
        const beginDate = `${begin.getFullYear()}-${pad(
          begin.getMonth() + 1
        )}-${pad(begin.getDate())}`;
        const endDate = `${end.getFullYear()}-${pad(end.getMonth() + 1)}-${pad(
          end.getDate()
        )}`;
        await this.$store.dispatch("getCalendar", {
          apartmentId: apt.id,
          beginDate,
          endDate,
          forNearest: true,
        });
      } finally {
        this.nearestDatesLoading = false;
      }
    },
    fetchCalendarForMonth(month, year) {
      const apt = this.currentApartment;
      if (!apt?.id) return;
      const firstOfMonth = new Date(year, month, 1);
      const dayOfWeek = firstOfMonth.getDay();
      const mondayFirst = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      const gridStart = new Date(year, month, 1 - mondayFirst);
      const gridEnd = new Date(gridStart);
      gridEnd.setDate(gridEnd.getDate() + 41);
      const pad = (n) => String(n).padStart(2, "0");
      const beginDate = `${gridStart.getFullYear()}-${pad(
        gridStart.getMonth() + 1
      )}-${pad(gridStart.getDate())}`;
      const endDate = `${gridEnd.getFullYear()}-${pad(
        gridEnd.getMonth() + 1
      )}-${pad(gridEnd.getDate())}`;
      this.$store.dispatch("getCalendar", {
        apartmentId: apt.id,
        beginDate,
        endDate,
        guests: this.guests,
        merge: true,
      });
    },
    onCalendarMonthYearChange({ month, year }) {
      this.calendarViewMonth = month;
      this.calendarViewYear = year;
      this.fetchCalendarForMonth(month, year);
    },
    isCalendarDateDisabled(date) {
      const dateStr = this.toDateStr(date);
      const entry = this.calendarFromStore.find((e) => e.date === dateStr);
      return entry
        ? entry.closed_on_arrival === true || entry.available === false
        : false;
    },
    hasService(key) {
      return this.currentApartment?.services?.includes(key);
    },
    serviceLabel(key) {
      return SERVICE_LABELS[key] ?? key;
    },
    guestsLabel(n) {
      const last = n % 10;
      const last2 = n % 100;
      if (last2 >= 11 && last2 <= 19) return "гостей";
      if (last === 1) return "гость";
      if (last >= 2 && last <= 4) return "гостя";
      return "гостей";
    },
    setAdults(n) {
      const min = 1;
      const max = this.maxGuests - this.guestSelection.children.length;
      this.guestSelection.adults = Math.max(min, Math.min(max, n));
    },
    addChild() {
      if (!this.canAddChild) return;
      this.guestSelection.children.push({ age: "0" });
    },
    removeChild(index) {
      this.guestSelection.children.splice(index, 1);
    },
    setChildAge(index, age) {
      if (this.guestSelection.children[index]) {
        this.guestSelection.children[index].age = age;
      }
    },
    onGuestsBlur(event) {
      const wrap = this.$refs.guestsSelectWrapRef;
      const related = event.relatedTarget;
      if (wrap && related && wrap.contains(related)) return;
      setTimeout(() => {
        this.guestsOpen = false;
      }, 150);
    },
    onGuestsDropdownMousedown(event) {
      const tag = event.target?.tagName;
      if (tag === "SELECT" || tag === "OPTION") return;
      event.preventDefault();
    },
    onCalendarClickOutside(event) {
      const checkInWrap = this.$refs.checkInWrapRef;
      const checkOutWrap = this.$refs.checkOutWrapRef;
      const insideCheckIn = checkInWrap && checkInWrap.contains(event.target);
      const insideCheckOut =
        checkOutWrap && checkOutWrap.contains(event.target);
      if (!insideCheckIn && !insideCheckOut) {
        this.calendarOpenCheckIn = false;
        this.calendarOpenCheckOut = false;
      }
    },
    onCalendarScroll() {
      this.calendarOpenCheckIn = false;
      this.calendarOpenCheckOut = false;
    },
    onGuestsClickOutside(event) {
      const wrap = this.$refs.guestsSelectWrapRef;
      if (wrap && !wrap.contains(event.target)) {
        this.guestsOpen = false;
      }
    },
    onGuestsScroll(event) {
      const guestsWrap = this.$refs.guestsSelectWrapRef;
      const scrollInsideDropdown =
        guestsWrap && guestsWrap.contains(event.target);
      if (!scrollInsideDropdown) {
        this.guestsOpen = false;
      }
    },
    onWheelCapture(event) {
      const checkInWrap = this.$refs.checkInWrapRef;
      const checkOutWrap = this.$refs.checkOutWrapRef;
      const insideCalendar =
        (checkInWrap && checkInWrap.contains(event.target)) ||
        (checkOutWrap && checkOutWrap.contains(event.target));
      if (insideCalendar) {
        event.preventDefault();
      }
    },
    toggleCheckInCalendar() {
      this.calendarOpenCheckIn = !this.calendarOpenCheckIn;
      if (this.calendarOpenCheckIn) this.calendarOpenCheckOut = false;
    },
    toggleCheckOutCalendar() {
      this.calendarOpenCheckOut = !this.calendarOpenCheckOut;
      if (this.calendarOpenCheckOut) this.calendarOpenCheckIn = false;
    },
    onCheckInDateSelect(value) {
      if (!(value instanceof Date)) return;
      this.checkInDate = value;
      if (
        this.checkOutDate &&
        this.toDateStr(this.checkOutDate) <= this.toDateStr(this.checkInDate)
      ) {
        this.checkOutDate = null;
      }
      this.bookingValidationError = "";
      this.bookingCheckInError = false;
      this.calendarOpenCheckIn = false;
    },
    onCheckOutDateSelect(value) {
      if (!(value instanceof Date)) return;
      if (
        this.checkInDate &&
        this.toDateStr(value) <= this.toDateStr(this.checkInDate)
      ) {
        return;
      }
      this.checkOutDate = value;
      this.bookingValidationError = "";
      this.bookingCheckOutError = false;
      this.calendarOpenCheckOut = false;
    },
    clearCheckInDate() {
      this.checkInDate = null;
      this.calendarOpenCheckIn = false;
    },
    clearCheckOutDate() {
      this.checkOutDate = null;
      this.calendarOpenCheckOut = false;
    },
    selectTab(index) {
      if (this.embedded) {
        this.localSelectedIndex = index;
      } else {
        this.$store.commit("setSelectedApartmentIndex", index);
      }
    },
    onBookingSubmit() {
      this.bookingValidationError = "";
      this.bookingCheckInError = false;
      this.bookingCheckOutError = false;
      const apt = this.currentApartment;
      if (!apt?.id) return;

      if (!this.checkInDate || !this.checkOutDate) {
        if (!this.checkInDate) this.bookingCheckInError = true;
        if (!this.checkOutDate) this.bookingCheckOutError = true;
        this.$nextTick(() => {
          if (!this.checkInDate) this.$refs.checkInTriggerRef?.focus();
          else this.$refs.checkOutTriggerRef?.focus();
        });
        return;
      }

      const guests = {
        adults: this.guestSelection?.adults ?? 1,
        children: (this.guestSelection?.children ?? []).map((c) => ({
          age: c?.age ?? "0",
        })),
      };

      this.$store.commit("setBookingFormData", {
        checkInDate: this.toDateStr(this.checkInDate),
        checkOutDate: this.toDateStr(this.checkOutDate),
        guests,
        apartment: apt,
      });
      this.$store.commit("setSelectedApartmentIndex", this.activeTabIndex);
      this.$store.commit("setBookingFormModalOpen", true);
    },
    toggleBlock(key) {
      if (!this.isMobile) return;
      this.expandedBlocks[key] = !this.expandedBlocks[key];
    },
  },
};
</script>

<style lang="scss" module>
.wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 7.5rem 0;
  background-color: $bg-brown;
  color: $text-white;
  gap: 5rem;
  @include laptop {
    padding: 5rem 0;
    gap: 3.5rem;
  }
  @include tablet {
    padding: 2.5rem 0;
    gap: 1.5rem;
  }
  .header {
    display: flex;
    flex-direction: column;
    @include content-width;
    .titleRow {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      width: 100%;
      gap: 0.25rem;
      .titlePrimary {
        margin: 0;
        font-weight: 400;
        font-size: 6.25rem;
        letter-spacing: -0.04em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.55);
        line-height: 1;
        @include laptop {
          font-size: 5rem;
        }
        @include tablet {
          font-size: 1.75rem;
        }
      }
      .titleBrand {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        flex-shrink: 0;
        font-size: 1.5rem;
        font-weight: 300;
        letter-spacing: -0.04em;
        line-height: 1.2;
        text-transform: uppercase;
        color: $text-tertiary;
        text-align: right;
        @include tablet {
          font-size: 0.75rem;
          padding-top: 0.125rem;
          p:first-child {
            text-transform: none;
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
        font-size: 5rem;
      }
      @include tablet {
        font-size: 1.5rem;
      }
    }
  }
}
.embeddedWrap {
  background-color: $bg-footer;
  color: $text-white;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: auto;
  .carouselWrap {
    width: 100%;
    margin-left: 0;
    margin-right: 0;
  }
  .upcomingDates {
    width: 100%;
    margin-left: 0;
    margin-right: 0;
  }
}
.reservContainer {
  @include content-width;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  @include tablet {
    gap: 1.5rem;
  }
  .switcher {
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    flex-wrap: wrap;
    gap: 4rem;
    border-bottom: none;
    @include laptop {
      gap: 2.5rem;
    }
    @include tablet {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0;
      padding-bottom: 0;
      -webkit-overflow-scrolling: touch;
      border-bottom: none;
      .tabCard:nth-child(1) .switcherTab {
        grid-row: 1;
        grid-column: 1;
      }
      .tabCard:nth-child(2) .switcherTab {
        grid-row: 1;
        grid-column: 2;
      }
      .tabCard:nth-child(3) .switcherTab {
        grid-row: 1;
        grid-column: 3;
      }
    }
    .tabCard {
      display: flex;
      flex-direction: column;
      flex: 0 0 auto;
      min-width: 0;
      cursor: pointer;
      @include tablet {
        display: contents;
      }
      &:hover .switcherTab {
        color: $text-white;
      }
      &:hover .switcherTabVilla {
        color: rgba(255, 255, 255, 0.85);
        @include tablet {
          color: $text-accent;
        }
      }
      .switcherTab {
        display: flex;
        align-items: flex-end;
        gap: 1rem;
        text-align: left;
        padding: 0;
        font-size: 3rem;
        font-weight: 300;
        color: $text-accent;
        background: none;
        border: none;
        cursor: pointer;
        font-family: inherit;
        transition: color 0.2s;
        line-height: 1;
        &:hover {
          color: rgba(255, 255, 255, 0.85);
        }
        @include laptop {
          font-size: 2.25rem;
        }
        @include tablet {
          flex-direction: column;
          align-items: flex-start;
          gap: 0.15rem;
          font-size: 1rem;
          font-weight: 400;
          padding: 0.35rem 0.15rem 0.5rem 0;
          white-space: nowrap;
          flex-shrink: 0;
          border-bottom: 2px solid rgba($text-accent, 0.45);
        }
        &.switcherTabActive {
          color: $text-white;
          font-weight: 600;
          @include tablet {
            border-bottom-color: $text-white;
            font-weight: 600;
          }
          .switcherTabVilla {
            color: rgba(255, 255, 255, 0.55);
          }
        }
        .switcherTabLabel {
          display: block;
        }
        .switcherTabVilla {
          display: block;
          font-size: 1rem;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.45);
          margin-bottom: 0.35rem;
          @include tablet {
            display: block !important;
            font-size: 0.625rem;
            font-weight: 400;
            margin-bottom: 0;
            color: rgba(255, 255, 255, 0.45);
            line-height: 1.2;
          }
        }
      }
    }
  }
  .tabContentInner {
    display: block;
    .mainContent {
      display: flex;
      flex-direction: column;
      gap: 0;
      align-items: stretch;
      width: 100%;
      .carouselWrap {
        position: relative;
        border-radius: 0;
        display: block;
        overflow: hidden;
        background: $bg-footer;
        min-height: 28rem;
        user-select: none;
        width: 100vw;
        max-width: 100vw;
        margin-left: calc(50% - 50vw);
        margin-right: calc(50% - 50vw);
        @include tablet {
          width: 100%;
          max-width: 100%;
          margin-left: 0;
          margin-right: 0;
          border-radius: 0;
          min-height: auto;
        }
        .carouselPriceOverlay {
          display: none;
          @include tablet {
            display: none;
            position: absolute;
            top: 0.75rem;
            left: 0.75rem;
            z-index: 10;
            margin: 0;
            padding: 0.5rem 0.75rem;
            background: $bg-overlay;
            backdrop-filter: blur(0.5rem);
            border-radius: 0.5rem;
            color: $text-white;
            font-size: 0.875rem;
            font-weight: 500;
          }
        }
        .carouselNavBtn {
          position: absolute;
          top: 50%;
          z-index: 12;
          width: 3rem;
          height: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          border: none;
          border-radius: 50%;
          background: transparent;
          cursor: pointer;
          transform: translateY(-50%);
          transition: opacity 0.2s;
          img {
            width: 3rem;
            height: 3rem;
            display: block;
            object-fit: contain;
          }
          &:hover:not(:disabled) {
            opacity: 0.75;
          }
          &.carouselNavBtnDisabled,
          &:disabled {
            opacity: 0.35;
            cursor: not-allowed;
          }
          @include tablet {
            display: none;
          }
          &.carouselNavBtnPrev {
            left: 1.5rem;
          }
          &.carouselNavBtnNext {
            right: 1.5rem;
          }
        }
        .carousel {
          width: 100%;
          height: 46rem;
          min-height: 0;
          border-radius: 0;
          :global(.swiper-wrapper) {
            height: 100% !important;
          }
          :global(.swiper-slide) {
            position: relative;
            height: 100% !important;
            min-height: 0;
            overflow: hidden;
            display: flex;
            align-items: stretch;
            border-radius: 0;
            &::after {
              content: "";
              position: absolute;
              inset: 0;
              background: rgba(0, 0, 0, 0.55);
              opacity: 1;
              transition: opacity 0.3s ease;
              pointer-events: none;
              z-index: 1;
            }
            &:global(.swiper-slide-active)::after {
              opacity: 0;
            }
          }
          :global(.swiper-button-prev),
          :global(.swiper-button-next) {
            display: none !important;
          }
          @include tablet {
            height: 11.25rem;
            margin: 0;
            border-radius: 0;
            :global(.swiper-slide) {
              border-radius: 0;
              &::after {
                display: none;
              }
            }
          }
        }
        .carouselPagination {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 2.5rem;
          display: none;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          z-index: 2;
          .carouselPaginationDot {
            width: 1rem;
            height: 1rem;
            padding: 0;
            border: 2px solid #685137;
            background-color: #000000;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.2s ease;
            &.carouselPaginationDotActive {
              width: 5rem;
              background: #004f68;
              border: 2px solid $bg-transparent-16;
              border-radius: 1rem;
            }
          }
        }
        .carouselImg {
          width: 100%;
          height: 100%;
          min-height: 0;
          max-height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }
      }
      .detailsColumn {
        display: flex;
        flex-direction: column;
        width: 100%;
        box-sizing: border-box;
        .detailsHeader {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          flex-wrap: wrap;
          &.detailsHeaderDesktopOnly {
            display: none;
          }
          .villaTitle {
            font-size: 2rem;
            font-weight: 300;
            margin: 0;
          }
          .villaPrice {
            display: none;
            font-size: 2rem;
            color: $text-tertiary;
            font-weight: 300;
            margin: 0;
          }
        }
        .villaDesc {
          font-size: 1rem;
          font-family: "Montserrat", sans-serif;
          color: $text-white;
          font-weight: 300;
          line-height: 1.2;
          text-align: justify;
          margin: 1rem 0 2.5rem 0;
          :global(p) {
            margin: 0 0 0.5em;
            &:last-child {
              margin-bottom: 0;
            }
          }
          &.villaDescDesktopOnly {
            display: none !important;
            @include tablet {
              display: none;
            }
          }
        }
        .upcomingDates {
          display: flex;
          flex-direction: column;
          order: -1;
          width: 100%;
          padding: 1.5rem 0;
          box-sizing: border-box;
          @include tablet {
            padding: 1.5rem 0 0;
          }
          .upcomingDatesTitle {
            font-size: 1rem;
            font-weight: 600;
            color: $text-white;
            margin: 0 0 0.5rem 0;
            display: none;
          }
          .upcomingDatesNavWrap {
            display: flex;
            align-items: center;
            width: 100%;
            min-height: 0;
            @include tablet {
              gap: 0;
            }
            .upcomingDatesSkeleton {
              flex: 1;
              min-width: 0;
              display: flex;
              gap: 0.5rem;
              align-items: center;
              overflow: hidden;
              .upcomingDatesSkeletonCard {
                flex: 0 0 auto;
                width: 10rem;
                max-width: 10rem;
                min-height: 4.5rem;
                height: auto;
                border-radius: 0.5rem;
                background: linear-gradient(
                  90deg,
                  rgba(255, 255, 255, 0.06) 0%,
                  rgba(255, 255, 255, 0.14) 50%,
                  rgba(255, 255, 255, 0.06) 100%
                );
                background-size: 200% 100%;
                animation: upcomingDatesShimmer 1.5s ease-in-out infinite;
                @include tablet {
                  width: 7.5rem;
                  max-width: 7.5rem;
                  min-height: 3.75rem;
                }
              }
            }
            .upcomingDatesNavBtn {
              flex-shrink: 0;
              width: 3rem;
              height: 3rem;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 0;
              border: none;
              border-radius: 50%;
              background: transparent;
              cursor: pointer;
              transition: opacity 0.2s;
              img {
                width: 3rem;
                height: 3rem;
                display: block;
                object-fit: contain;
              }
              &:hover:not(:disabled) {
                opacity: 0.75;
              }
              &.upcomingDatesNavBtnDisabled,
              &:disabled {
                opacity: 0.35;
                cursor: not-allowed;
                pointer-events: auto;
              }
              @include tablet {
                display: none;
              }
              &.upcomingDatesNavBtnPrev,
              &.upcomingDatesNavBtnNext {
                border-radius: 50%;
                transform: none;
              }
            }
            .upcomingDatesScroll {
              flex: 1;
              min-width: 0;
              overflow-x: auto;
              scroll-snap-type: x proximity;
              scrollbar-width: none;
              -ms-overflow-style: none;
              min-height: 0;
              &::-webkit-scrollbar {
                display: none;
              }
              .upcomingDatesScrollInner {
                display: flex;
                gap: 0.5rem;
                min-height: 0;
                align-items: stretch;
                @include tablet {
                  gap: 0.5rem;
                }
                .dateCard {
                  $date-card-ease: cubic-bezier(0.4, 0, 0.2, 1);
                  position: relative;
                  flex: 0 0 auto;
                  width: 100%;
                  max-width: 10rem;
                  height: auto;
                  padding: 1rem;
                  border: 1px solid rgba(255, 255, 255, 0.16);
                  border-radius: 0.5rem;
                  background: transparent;
                  display: flex;
                  flex-direction: column;
                  justify-content: flex-start;
                  align-items: stretch;
                  gap: 0.75rem;
                  scroll-snap-align: start;
                  cursor: pointer;
                  box-sizing: border-box;
                  transition:
                    background 0.3s $date-card-ease,
                    border-color 0.3s $date-card-ease;
                  @include tablet {
                    max-width: 7.5rem;
                    padding: 0.75rem;
                    border-radius: 0.5rem;
                    border-color: rgba(255, 255, 255, 0.22);
                  }
                  &:hover:not(.dateCardUnavailable):not(.dateCardSelected) {
                    background: rgba(255, 255, 255, 0.04);
                    border-color: rgba(255, 255, 255, 0.22);
                  }
                  &.dateCardUnavailable {
                    background: #4a4a4a;
                    border-color: transparent;
                    cursor: not-allowed;
                    pointer-events: none;
                    .dateCardBusy,
                    .dateCardDays,
                    .dateCardMonth {
                      color: $text-tertiary;
                    }
                    @include tablet {
                      background: #3d3d3d;
                      border-color: transparent;
                    }
                  }
                  &.dateCardSelected {
                    background: #000000;
                    border-color: #000000;
                    .dateCardPrice,
                    .dateCardDays,
                    .dateCardMonth {
                      color: $text-white;
                    }
                  }
                  .dateCardDiscount {
                    position: absolute;
                    top: 0.35rem;
                    left: 0.5rem;
                    margin: 0;
                    padding: 0;
                    font-size: 0.75rem;
                    font-weight: 500;
                    line-height: 1;
                    color: $main-red;
                    background: none;
                    @include tablet {
                      top: 0.5rem;
                      left: 0.625rem;
                      font-size: 0.625rem;
                      font-weight: 600;
                    }
                  }
                  .dateCardMain {
                    flex: 0 0 auto;
                    display: flex;
                    align-items: flex-end;
                    justify-content: flex-end;
                    min-height: 0;
                    width: 100%;
                    .dateCardPrice {
                      font-size: 1.125rem;
                      font-weight: 600;
                      color: $text-white;
                      line-height: 1.2;
                      text-align: right;
                      white-space: nowrap;
                      @include tablet {
                        font-size: 0.875rem;
                        font-weight: 600;
                        letter-spacing: -0.02em;
                      }
                    }
                    .dateCardBusy {
                      font-size: 1rem;
                      font-weight: 600;
                      letter-spacing: 0.04em;
                      text-transform: uppercase;
                      color: $text-tertiary;
                      line-height: 1.2;
                      text-align: right;
                      @include tablet {
                        font-size: 0.875rem;
                        font-weight: 600;
                        letter-spacing: 0.02em;
                      }
                    }
                  }
                  .dateCardFooter {
                    display: flex;
                    align-items: baseline;
                    justify-content: space-between;
                    width: 100%;
                    gap: 0.5rem;
                    .dateCardDays {
                      flex-shrink: 0;
                      font-size: 0.75rem;
                      font-weight: 300;
                      color: rgba(255, 255, 255, 0.75);
                      line-height: 1.2;
                      text-align: left;
                      @include tablet {
                        font-size: 0.6875rem;
                        color: rgba(255, 255, 255, 0.55);
                      }
                    }
                    .dateCardMonth {
                      flex-shrink: 0;
                      font-size: 0.75rem;
                      font-weight: 300;
                      color: rgba(255, 255, 255, 0.75);
                      line-height: 1.2;
                      text-align: right;
                      @include tablet {
                        font-size: 0.6875rem;
                        color: rgba(255, 255, 255, 0.55);
                      }
                    }
                  }
                }
              }
            }
          }
        }
        .formRow {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding: 0 0 1.5rem 0;
          @include tablet {
            flex-direction: column;
            padding: 0 0 1rem 0;
            gap: 0;
            padding: 0;
          }
        }
        .formRowOneRow {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          align-items: flex-start;
          gap: 1rem;
          padding: 0 0 1rem 0;
          & > .dateSelectWrap,
          & > .formGroupGuests,
          & > .bookButton {
            flex: 1 1 calc((100% - 3rem) / 4);
            width: calc((100% - 3rem) / 4);
            min-width: 0;
          }
          & > .dateSelectWrap,
          & > .formGroupGuests {
            position: relative;
            padding: 0.45rem 0 0 0;
            gap: 0;
          }
          & > .dateSelectWrap .formLabel,
          & > .formGroupGuests .formLabel {
            position: absolute;
            top: 0.45rem;
            left: 0.75rem;
            transform: translateY(-50%);
            margin: 0;
            padding: 0 0.35rem;
            font-size: 0.625rem;
            font-weight: 300;
            line-height: 1;
            color: rgba(255, 255, 255, 0.6);
            background: $text-primary;
            z-index: 2;
          }
          & > .bookButton {
            padding: 0 1rem;
            height: 3rem;
            min-height: 3rem;
            box-sizing: border-box;
            margin-top: 0.45rem;
          }
          .dateSelectTriggerWrap .formInput,
          .guestsSelectWrap .formInput {
            height: 3rem;
            min-height: 3rem;
            box-sizing: border-box;
          }
          .dateSelectTrigger,
          .guestsSelectTrigger {
            display: flex;
            align-items: center;
            text-align: left;
          }
          .dateSelectTrigger span,
          .guestsSelectTrigger span {
            width: 100%;
            text-align: left;
            line-height: 1.2;
          }
          @include tablet {
            flex-direction: column;
            align-items: stretch;
            & > .dateSelectWrap,
            & > .formGroupGuests,
            & > .bookButton {
              width: 100%;
              flex: 1 1 100%;
            }
            & > .bookButton {
              height: auto;
              margin-top: 0.5rem;
              padding: 0.875rem 1rem;
            }
          }
        }
        .formRowFullWidth {
          flex-basis: 100%;
          width: 100%;
        }
        .formGroup {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 0 0 1.5rem 0;
          flex: 1;
          min-width: 0;
          @include tablet {
            padding: 0 0 1rem 0;
          }
          &:last-child {
            padding: 0;
            @include tablet {
              padding: 0 0 1rem 0;
            }
          }
        }
        .formLabel {
          font-size: 1rem;
          font-weight: 600;
          color: $text-white;
          @include tablet {
            display: none;
          }
        }
        .dateField {
          .formInput {
            border-color: #685137 !important;
          }
          .formLabel {
            color: #685137 !important;
          }
        }
        .formGroupContact {
          padding: 0 0 2.5rem 0;
          @include tablet {
            padding: 0 0 1.5rem 0;
          }
        }
        .formContactRow {
          display: flex;
          flex-direction: row;
          gap: 1.5rem;
          @include tablet {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          .formInputUnderline {
            flex: 1;
            min-width: 0;
          }
        }
        .formLabelContact {
          font-size: 2.375rem;
          font-weight: 300;
          color: $text-tertiary;
          margin-bottom: 0.5rem;
          @include tablet {
            display: none;
          }
        }
        .formInputUnderline {
          padding: 1.125rem 0;
          border: none;
          border-bottom: 1px solid #685137;
          border-radius: 0;
          background: transparent;
          color: $text-white;
          font-size: 1rem;
          font-family: inherit;
          width: 100%;
          @include tablet {
            padding: 0.75rem;
            width: auto;
            border-radius: 0.5rem;
            font-size: 1rem;
            border: 1px solid $bg-transparent-16;
          }
          &::placeholder {
            color: $text-tertiary;
          }
          &:focus {
            transition: all 0.2s ease;
            outline: none;
            border-bottom-color: $text-white;
            @include tablet {
              border-color: $text-white;
            }
          }
        }
        .formInputError {
          border-color: $main-red !important;
          @include tablet {
            border-color: $main-red !important;
          }
        }
        .bookingValidationMessage {
          margin: 0 0 0.75rem 0;
          font-size: 0.875rem;
          color: $main-red;
          line-height: 1.3;
        }
        .fieldErrorSlot {
          flex-shrink: 0;
          min-height: 0.5rem;
          margin-top: 0.25rem;
          @include tablet {
            min-height: 0;
          }
        }
        .fieldError {
          margin: 0;
          font-size: 0.75rem;
          color: $main-red;
          line-height: 1.3;
          @include tablet {
            font-size: 0.6875rem;
          }
        }
        .formInputWrap {
          position: relative;
        }
        .formInput {
          padding: 1rem;
          border: 1px solid $bg-transparent-16 !important;
          border-radius: 0.5rem;
          background: transparent;
          color: $text-white;
          font-size: 1rem;
          font-family: inherit;
          @include tablet {
            padding: 0.75rem;
            font-size: 1rem;
          }
          &::placeholder {
            color: rgba(255, 255, 255, 0.45);
          }
          &.formInputError {
            border-color: $main-red !important;
          }
        }
        .formInputWithIcon {
          padding-right: 2.75rem;
        }
        .formInputIcon {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          width: 1.25rem;
          height: 1.25rem;
          pointer-events: none;
          opacity: 0.7;
        }
        .dateSelectClearBtn {
          position: absolute;
          right: 0.5rem;
          top: 50%;
          transform: translateY(-50%);
          width: 1.75rem;
          height: 1.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          border: none;
          border-radius: 0.25rem;
          background: transparent;
          color: rgba(255, 255, 255, 0.7);
          font-size: 1.5rem;
          line-height: 1;
          cursor: pointer;
          font-family: inherit;
          transition:
            color 0.2s,
            background 0.2s;
          &:hover {
            color: $text-white;
            background: rgba(255, 255, 255, 0.1);
          }
        }
        .dateSelectWrap {
          position: relative;
          z-index: 0;
          &.dateSelectWrapOpen {
            z-index: 3;
          }
        }
        .dateSelectWrapRow {
          display: flex;
          flex-wrap: nowrap;
          gap: 1rem;
          align-items: flex-end;
          flex: 0 1 auto;
          min-width: 0;
          .formGroup {
            padding: 0;
            flex: 0 1 auto;
            min-width: 10rem;
            width: 30rem;
            @include tablet {
              width: 37rem;
            }
          }
          .calendarDropdown {
            position: absolute;
            left: 0;
            top: 100%;
            margin-top: 0.25rem;
          }
          @include tablet {
            flex-wrap: wrap;
            .formGroup {
              min-width: 0;
              width: 100%;
            }
          }
        }
        .dateSelectTriggerWrap {
          position: relative;
          display: block;
        }
        .dateSelectTrigger {
          width: 100%;
          text-align: left;
          cursor: pointer;
          border: none;
          font-family: inherit;
          appearance: none;
        }
        .dateRangeText {
          color: inherit;
        }
        .calendarDropdown {
          position: absolute;
          left: 0;
          top: calc(100% + 0.25rem);
          padding: 0.5rem;
          background: rgba(30, 30, 30, 0.98);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.375rem;
          box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.3);
          --dp-disabled-color: rgba(255, 255, 255, 0.08);
          --dp-disabled-color-text: rgba(255, 255, 255, 0.35);
          :global(.dp__cell_inner.dp__cell_disabled) {
            background: rgba(80, 50, 50, 0.4) !important;
            color: rgba(255, 255, 255, 0.35) !important;
            cursor: not-allowed;
            text-decoration: line-through;
            opacity: 0.85;
          }
          :global(.dp__cell_inner.dp__cell_disabled:hover) {
            background: rgba(80, 50, 50, 0.5) !important;
          }
          :global(.dp__main) {
            border: none;
            background: transparent;
          }
          :global(.dp__input_wrap) {
            display: none;
          }
          :global(.dp__calendar_wrap),
          :global(.dp__calendar) {
            background: transparent;
          }
          :global(.dp__cell_inner),
          :global(.dp__calendar_item) {
            color: rgba(255, 255, 255, 0.9);
          }
          :global(.dp__active_date),
          :global(.dp__range_start),
          :global(.dp__range_end),
          :global(.dp__range_between) {
            background: rgba(255, 255, 255, 0.2);
            color: $text-white;
          }
          :global(.dp__month_year_select),
          :global(.dp__arrow_top) {
            color: $text-white;
          }
          :global(.dp__inner_nav:hover),
          :global(.dp__cell_inner:hover) {
            background: rgba(255, 255, 255, 0.15);
          }
          :global(.dp--time-overlay-btn),
          :global(.dp__button.dp__overlay_action),
          :global([data-dp-toggle-time]) {
            display: none !important;
          }
        }
        .guestsSelectWrap {
          position: relative;
          z-index: 0;
          &.guestsSelectWrapOpen {
            z-index: 2;
          }
        }
        .guestsSelectTrigger {
          width: 100%;
          text-align: left;
          cursor: pointer;
          border: none;
          font-family: inherit;
          appearance: none;
        }
        .guestsPlaceholder {
          color: rgba(255, 255, 255, 0.45);
        }
        .guestsSelectIconOpen {
          transform: translateY(-50%) rotate(180deg);
          transition: transform 0.25s ease;
        }
        .guestsDropdown {
          position: absolute;
          left: 0;
          right: 0;
          top: calc(100% + 0.25rem);
          max-height: 20rem;
          overflow-y: auto;
          scrollbar-width: 0.125rem;
          scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
          background: rgba(30, 30, 30, 0.98);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.375rem;
          box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.3);
          .guestsDropdownInner {
            padding: 0.75rem;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            .guestsRow {
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 1rem;
              .guestsRowLabel {
                font-size: 0.9375rem;
                color: rgba(255, 255, 255, 0.9);
              }
              .guestsCounter {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                .guestsCounterBtn {
                  width: 2rem;
                  height: 2rem;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  border-radius: 50%;
                  background: rgba(255, 255, 255, 0.15);
                  border: none;
                  color: $text-white;
                  font-size: 1.25rem;
                  line-height: 1;
                  cursor: pointer;
                  font-family: inherit;
                  transition: background 0.15s;
                  &:hover:not(:disabled) {
                    background: rgba(255, 255, 255, 0.25);
                  }
                  &:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                  }
                }
                .guestsCounterValue {
                  min-width: 1.5rem;
                  text-align: center;
                  font-size: 1rem;
                  font-weight: 500;
                }
              }
            }
            .guestsChildRow {
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 0.5rem;
              padding: 0.5rem 0.75rem;
              background: rgba(255, 255, 255, 0.08);
              border-radius: 0.375rem;
              .guestsChildLabel {
                font-size: 0.875rem;
                color: rgba(255, 255, 255, 0.9);
              }
              .guestsChildSelect {
                margin-left: 0.25rem;
                padding: 0.25rem 0.5rem;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 0.25rem;
                color: $text-white;
                font-size: 0.875rem;
                font-family: inherit;
                cursor: pointer;
              }
              .guestsChildRemove {
                width: 1.5rem;
                height: 1.5rem;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                background: none;
                border: none;
                color: rgba(255, 255, 255, 0.7);
                font-size: 1.25rem;
                line-height: 1;
                cursor: pointer;
                border-radius: 0.25rem;
                transition:
                  color 0.15s,
                  background 0.15s;
                &:hover {
                  color: $text-white;
                  background: rgba(255, 255, 255, 0.1);
                }
              }
            }
            .guestsAddChild {
              display: flex;
              align-items: center;
              justify-content: space-between;
              width: 100%;
              padding: 0.5rem 0.75rem;
              background: rgba(255, 255, 255, 0.08);
              border: none;
              border-radius: 0.375rem;
              color: rgba(255, 255, 255, 0.9);
              font-size: 0.875rem;
              font-family: inherit;
              cursor: pointer;
              text-align: left;
              transition: background 0.15s;
              &:hover {
                background: rgba(255, 255, 255, 0.12);
              }
              .guestsAddChildChevron {
                font-size: 0.75rem;
                opacity: 0.8;
              }
            }
          }
        }
        .bookButton {
          padding: 1rem 0;
          background: #004f68;
          color: $text-white;
          border: none;
          border-radius: 0.5rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: background 0.2s;
          width: 46rem;
          justify-content: center;
          @include tablet {
            margin-top: 0.5rem;
            padding: 0.875rem 1rem;
          }
          &:hover:not(:disabled) {
            background: #006080;
          }
          &:disabled {
            cursor: not-allowed;
            opacity: 0.9;
          }
          .bookButtonSpinner {
            width: 1.5rem;
            height: 1.5rem;
            min-width: 1.5rem;
            min-height: 1.5rem;
            flex-shrink: 0;
            border: 2px solid rgba(255, 255, 255, 0.25);
            border-top-color: $text-white;
            border-radius: 50%;
            box-sizing: border-box;
            animation: spinnerRotate 0.8s linear infinite;
          }
          .bookButtonIcon {
            width: 1.5rem;
            height: 1.5rem;
            min-width: 1.5rem;
            min-height: 1.5rem;
            flex-shrink: 0;
          }
        }
      }
    }
    .bottomBlocks {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      margin: 5rem 0 0 0;
      @include tablet {
        grid-template-columns: 1fr;
        margin-top: 1.5rem;
        padding-top: 0;
        border-top: none;
        gap: 0;
      }
      .block {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 0 1.5rem;
        border-right: 1px solid rgba($text-accent, 0.45);
        &:last-child {
          border-right: none;
        }
        @include tablet {
          padding: 0;
          gap: 0;
          border-right: none;
          border-top: 1px solid rgba($text-accent, 0.45);
          transition: border-top-color 0.2s ease;
        }
        &.blockExpanded {
          @include tablet {
            .blockTitle {
              color: $text-white;
            }
            .blockTitleIcon {
              transform: scaleY(-1);
              filter: brightness(0) invert(1);
            }
          }
          .blockContent {
            @include tablet {
              grid-template-rows: 1fr;
              padding-bottom: 0.75rem;
            }
          }
        }
        .blockTitle {
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          font-size: 2rem;
          font-weight: 300;
          letter-spacing: -0.04rem;
          line-height: 1.2;
          margin: 0;
          color: $text-tertiary;
          text-wrap: balance;
          @include laptop {
            font-size: 1.25rem;
          }
          @include tablet {
            font-size: 1.25rem;
            padding: 1rem 0;
            cursor: pointer;
            user-select: none;
            -webkit-tap-highlight-color: transparent;
            transition: color 0.2s ease;
            .blockTitleIcon {
              flex-shrink: 0;
              transition:
                transform 0.2s ease,
                filter 0.2s ease;
            }
          }
          &.blockTitleDesktopOnly {
            display: none;
          }
          &.blockTitleTabletOnly {
            display: none;
          }
          .blockTitleIcon {
            width: 1.5rem;
            height: 1.5rem;
            flex-shrink: 0;
            transform: none;
            opacity: 0.85;
            @include tablet {
              transform: none;
            }
          }
        }
        .blockContent {
          @include tablet {
            display: grid;
            grid-template-rows: 0fr;
            transition: grid-template-rows 0.3s ease-out;
            padding-bottom: 0;
            & > * {
              min-height: 0;
              overflow: hidden;
            }
          }
          .blockDesc {
            margin: 0;
            font-size: 1rem;
            font-weight: 400;
            line-height: 1.4;
            color: $text-white;
            :global(p) {
              margin: 0 0 0.75em;
              &:last-child {
                margin-bottom: 0;
              }
            }
            @include tablet {
              font-size: 0.875rem;
            }
          }
          .blockListInline {
            margin: 0;
            font-size: 1rem;
            font-weight: 300;
            color: $text-white;
            line-height: 1.6;
            @include tablet {
              font-size: 0.875rem;
            }
          }
          .blockListTwoCol {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            font-size: 1rem;
            font-weight: 300;
            color: $text-white;
            line-height: 1.5;
            @include tablet {
              font-size: 0.875rem;
              gap: 0.35rem;
            }
            .blockListRow {
              display: flex;
              justify-content: space-between;
              align-items: baseline;
              gap: 1rem;
              .blockListLabel {
                flex-shrink: 1;
                text-align: left;
                color: $text-white;
              }
              .blockListValue {
                flex-shrink: 0;
                text-align: right;
                color: $text-white;
              }
            }
          }
          .blockList {
            list-style: none;
            margin: 0;
            padding: 0;
            font-size: 1rem;
            color: $text-white;
            line-height: 1.6;
            li {
              margin-bottom: 0.25rem;
            }
          }
        }
      }
    }
  }
  .loadingWrap {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 20rem;
    padding: 3rem;
    .spinner {
      width: 3rem;
      height: 3rem;
      border: 3px solid rgba(255, 255, 255, 0.2);
      border-top-color: $text-white;
      border-radius: 50%;
      animation: spinnerRotate 0.8s linear infinite;
    }
  }
}
.photoGalleryOverlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: #0a0a0a;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .photoGalleryPanel {
    flex: 1 1 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .photoGalleryHeader {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 1rem 1.25rem;
      padding-top: max(1rem, env(safe-area-inset-top));
      background: #000;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      .photoGalleryBack {
        flex-shrink: 0;
        width: 2.5rem;
        height: 2.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        background: transparent;
        border: 0;
        color: $text-white;
        cursor: pointer;
        border-radius: 0.5rem;
        transition:
          background 0.2s,
          opacity 0.2s;
        &:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      }
      .photoGalleryTitle {
        flex: 1;
        margin: 0;
        font-size: 1.125rem;
        font-weight: 600;
        color: $text-white;
        text-align: center;
      }
      .photoGalleryHeaderSpacer {
        width: 2.5rem;
        flex-shrink: 0;
      }
    }
    .photoGalleryGrid {
      flex: 1 1 0;
      min-height: 0;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      padding: 0.5rem;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-auto-rows: minmax(min(40vmin, 12rem), auto);
      gap: 0.5rem;
      align-content: start;
      .photoGalleryItem {
        position: relative;
        min-height: min(40vmin, 12rem);
        overflow: hidden;
        background: #1a1a1a;
        border: 0;
        padding: 0;
        cursor: pointer;
        display: block;
        width: 100%;
        text-align: left;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          pointer-events: none;
        }
      }
    }
    .photoFullscreenOverlay {
      position: fixed;
      inset: 0;
      z-index: 10001;
      background: rgba(0, 0, 0, 0.97);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 3rem;
      box-sizing: border-box;
      .photoFullscreenClose {
        position: absolute;
        top: 1rem;
        right: 1rem;
        z-index: 2;
        width: 2.5rem;
        height: 2.5rem;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.1);
        border: 0;
        border-radius: 50%;
        color: $text-white;
        cursor: pointer;
        transition: background 0.2s;
        top: max(1rem, env(safe-area-inset-top));
        right: max(1rem, env(safe-area-inset-right));
        &:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      }
      .photoFullscreenNav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 2;
        width: 3rem;
        height: 3rem;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.15);
        border: 0;
        border-radius: 50%;
        color: $text-white;
        cursor: pointer;
        transition: background 0.2s;
        &:hover {
          background: rgba(255, 255, 255, 0.25);
        }
        &.photoFullscreenPrev {
          left: 1rem;
        }
        &.photoFullscreenNext {
          right: 1rem;
        }
      }
      .photoFullscreenImgWrap {
        max-width: 100%;
        max-height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        .photoFullscreenImg {
          max-width: 100%;
          max-height: 100%;
          width: auto;
          height: auto;
          object-fit: cover;
          display: block;
        }
      }
    }
  }
}
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
:global(.tab-content-enter-active),
:global(.tab-content-leave-active) {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}
:global(.tab-content-enter-from),
:global(.tab-content-leave-to) {
  opacity: 0;
  transform: translateY(0.625rem);
}
:global(.tab-content-enter-to),
:global(.tab-content-leave-from) {
  opacity: 1;
  transform: translateY(0);
}
:global(.photo-fullscreen-enter-active),
:global(.photo-fullscreen-leave-active) {
  transition: opacity 0.2s ease;
}
:global(.photo-fullscreen-enter-from),
:global(.photo-fullscreen-leave-to) {
  opacity: 0;
}
:global(.photo-gallery-enter-active),
:global(.photo-gallery-leave-active) {
  transition: opacity 0.25s ease;
  @include tablet {
    transition: transform 0.35s ease;
  }
}
:global(.photo-gallery-enter-from),
:global(.photo-gallery-leave-to) {
  opacity: 0;
  @include tablet {
    opacity: 1;
    transform: translateY(100%);
  }
}
:global(.date-dropdown-enter-active),
:global(.date-dropdown-leave-active) {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
:global(.date-dropdown-enter-from),
:global(.date-dropdown-leave-to) {
  opacity: 0;
  transform: translateY(-0.5rem);
}
:global(.date-dropdown-enter-to),
:global(.date-dropdown-leave-from) {
  opacity: 1;
  transform: translateY(0);
}
:global(.field-error-enter-active),
:global(.field-error-leave-active) {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
:global(.field-error-enter-from),
:global(.field-error-leave-to) {
  opacity: 0;
  transform: translateY(0.25rem);
}
:global(.field-error-enter-to),
:global(.field-error-leave-from) {
  opacity: 1;
  transform: translateY(0);
}
:global(.guests-dropdown-enter-active),
:global(.guests-dropdown-leave-active) {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
:global(.guests-dropdown-enter-from),
:global(.guests-dropdown-leave-to) {
  opacity: 0;
  transform: translateY(-0.5rem);
}
:global(.guests-dropdown-enter-to),
:global(.guests-dropdown-leave-from) {
  opacity: 1;
  transform: translateY(0);
}
.nav-btn-enter-active,
.nav-btn-leave-active {
  transition: opacity 0.25s ease;
}
.nav-btn-enter-from,
.nav-btn-leave-to {
  opacity: 0;
}
@keyframes upcomingDatesShimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
@keyframes spinnerRotate {
  to {
    transform: rotate(360deg);
  }
}
</style>
