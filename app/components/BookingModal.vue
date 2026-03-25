<template>
  <Teleport to="body">
    <Transition name="booking-modal">
      <div
        v-if="open"
        :class="$style.overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Бронирование"
        @click.self="$emit('close')"
      >
        <div :class="$style.panel">
          <div :class="$style.header">
            <div :class="$style.headerTitles">
              <h1 :class="$style.title">ВЫБЕРИТЕ ВИЛЛУ</h1>
              <h2 :class="$style.subtitle">ДАТЫ БРОНИРОВАНИЯ</h2>
            </div>
            <button
              type="button"
              :class="$style.closeBtn"
              aria-label="Закрыть"
              @click="$emit('close')"
            >
              <span :class="$style.closeLine" />
              <span :class="$style.closeLine" />
            </button>
          </div>

          <div :class="$style.filtersBar">
            <div :class="$style.filterGroup">
              <div
                :class="[
                  $style.filterInputBox,
                  checkInDate && $style.filterInputBoxFilled,
                ]"
              >
                <span :class="$style.filterLabel">Дата заезда</span>
                <div
                  ref="checkInWrapRef"
                  :class="[
                    $style.dateInputWrap,
                    checkInOpen && $style.dateInputWrapOpen,
                  ]"
                >
                  <button
                    type="button"
                    :class="$style.filterInput"
                    @click.stop.prevent="
                      checkInOpen = !checkInOpen;
                      checkOutOpen = false;
                    "
                  >
                    <AppIcon
                      name="reservCalendar"
                      alt=""
                      :class="$style.filterIcon"
                    />
                    <span>{{ checkInFormatted || "Выберите дату" }}</span>
                  </button>
                  <Transition name="dropdown">
                    <div
                      v-show="checkInOpen"
                      :class="$style.calendarDropdown"
                      @mousedown.prevent
                    >
                      <VueDatePicker
                        v-if="checkInOpen"
                        v-model="checkInDate"
                        :inline="true"
                        :dark="true"
                        :locale="ruLocale"
                        :enable-time-picker="false"
                        :hide-navigation="['time']"
                        :min-date="minCheckInDate"
                        :disabled-dates="isCheckInDisabled"
                        auto-apply
                        :teleport="false"
                        @update:model-value="onCheckInSelect"
                      />
                    </div>
                  </Transition>
                </div>
              </div>
            </div>
            <div :class="$style.filterGroup">
              <div
                :class="[
                  $style.filterInputBox,
                  checkOutDate && $style.filterInputBoxFilled,
                ]"
              >
                <span :class="$style.filterLabel">Дата выезда</span>
                <div
                  ref="checkOutWrapRef"
                  :class="[
                    $style.dateInputWrap,
                    checkOutOpen && $style.dateInputWrapOpen,
                  ]"
                >
                  <button
                    type="button"
                    :class="$style.filterInput"
                    :disabled="!checkInDate"
                    @click.stop.prevent="
                      checkOutOpen = !checkOutOpen;
                      checkInOpen = false;
                    "
                  >
                    <AppIcon
                      name="reservCalendar"
                      alt=""
                      :class="$style.filterIcon"
                    />
                    <span>{{ checkOutFormatted || "Выберите дату" }}</span>
                  </button>
                  <Transition name="dropdown">
                    <div
                      v-show="checkOutOpen"
                      :class="$style.calendarDropdown"
                      @mousedown.prevent
                    >
                      <VueDatePicker
                        v-if="checkOutOpen"
                        v-model="checkOutDate"
                        :inline="true"
                        :dark="true"
                        :locale="ruLocale"
                        :enable-time-picker="false"
                        :hide-navigation="['time']"
                        :min-date="minCheckOutDate"
                        :disabled-dates="isCheckOutDisabled"
                        auto-apply
                        :teleport="false"
                        @update:model-value="onCheckOutSelect"
                      />
                    </div>
                  </Transition>
                </div>
              </div>
            </div>
            <div ref="guestsWrapRef" :class="$style.filterGroup">
              <div
                :class="[
                  $style.filterInputBox,
                  totalGuests > 0 && $style.filterInputBoxFilled,
                  guestsOpen && $style.filterInputBoxOpen,
                ]"
              >
                <span :class="$style.filterLabel">Кол-во гостей</span>
                <button
                  type="button"
                  :class="$style.filterInput"
                  @click="guestsOpen = !guestsOpen"
                >
                  <AppIcon
                    name="aboutUsers"
                    alt=""
                    :class="$style.filterIcon"
                  />
                  <span :class="totalGuests ? '' : $style.guestsPlaceholder">
                    {{
                      totalGuests
                        ? `${totalGuests} ${guestsLabel(totalGuests)}`
                        : "Выберите гостей"
                    }}
                  </span>
                </button>
                <Transition name="dropdown">
                  <div
                    v-show="guestsOpen"
                    :class="$style.guestsDropdown"
                    @mousedown="onGuestsDropdownMousedown"
                  >
                    <div :class="$style.guestsDropdownInner">
                      <div :class="$style.guestsRow">
                        <span :class="$style.guestsRowLabel">Взрослые</span>
                        <div :class="$style.guestsCounter">
                          <button
                            type="button"
                            :class="$style.guestsCounterBtn"
                            :disabled="guestSelection.adults <= 1"
                            aria-label="Меньше"
                            @click="setAdults(guestSelection.adults - 1)"
                          >
                            −
                          </button>
                          <span :class="$style.guestsCounterValue">{{
                            guestSelection.adults
                          }}</span>
                          <button
                            type="button"
                            :class="$style.guestsCounterBtn"
                            :disabled="!canAddAdult"
                            aria-label="Больше"
                            @click="setAdults(guestSelection.adults + 1)"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div
                        v-for="(child, index) in guestSelection.children"
                        :key="index"
                        :class="$style.guestsChildRow"
                      >
                        <span :class="$style.guestsChildLabel">
                          Ребенок:
                          <select
                            :value="child.age"
                            :class="$style.guestsChildSelect"
                            @change="setChildAge(index, $event.target.value)"
                          >
                            <option v-for="a in childAges" :key="a" :value="a">
                              {{ a }} лет
                            </option>
                          </select>
                        </span>
                        <button
                          type="button"
                          :class="$style.guestsChildRemove"
                          aria-label="Удалить"
                          @click="removeChild(index)"
                        >
                          ×
                        </button>
                      </div>
                      <button
                        v-if="canAddChild"
                        type="button"
                        :class="$style.guestsAddChild"
                        @click="addChild"
                      >
                        Добавить ребенка
                        <span :class="$style.guestsAddChildChevron">▼</span>
                      </button>
                    </div>
                    <button
                      type="button"
                      :class="$style.guestsClose"
                      @click="guestsOpen = false"
                    >
                      Готово
                    </button>
                  </div>
                </Transition>
              </div>
            </div>
          </div>

          <div :class="$style.content">
            <template v-if="!hasDates">
              <p :class="$style.hint">
                Выберите даты заезда и выезда, чтобы увидеть доступные виллы.
              </p>
            </template>
            <template v-else>
              <div v-if="availabilityLoading" :class="$style.loadingWrap">
                <div :class="$style.spinner" aria-hidden="true" />
              </div>
              <div
                v-else-if="availableVillas.length === 0"
                :class="$style.empty"
              >
                На выбранные даты свободных вилл нет.
              </div>
              <div v-else :class="$style.villaList">
                <article
                  v-for="(item, index) in availableVillas"
                  :key="item.apartment.id"
                  :class="$style.villaCard"
                >
                  <div :class="$style.villaCardHeader">
                    <div :class="$style.villaCardTitleRow">
                      <span :class="$style.villaLabel">Вилла</span>
                      <h3 :class="$style.villaName">
                        {{ item.apartment.title }}
                      </h3>
                    </div>
                    <div :class="$style.villaCardActions">
                      <span :class="$style.villaPriceBox">
                        {{ item.priceFormatted }} ₽
                      </span>
                      <button
                        type="button"
                        :class="$style.bookBtn"
                        :disabled="locationConfirmSubmitting"
                        @click="onBookVilla(index)"
                      >
                        <span
                          v-if="
                            locationConfirmSubmitting &&
                            confirmingVillaIndex === index
                          "
                          :class="$style.bookBtnSpinner"
                          aria-hidden="true"
                        />
                        {{
                          locationConfirmSubmitting &&
                          confirmingVillaIndex === index
                            ? "Отправка…"
                            : "Забронировать"
                        }}
                      </button>
                    </div>
                  </div>
                  <p
                    v-if="item.apartment.desc"
                    :class="$style.villaDesc"
                    v-html="item.apartment.desc"
                  />
                  <div :class="$style.villaGallery">
                    <div :class="$style.villaMainImg">
                      <img
                        v-if="getGalleryPhotos(item.apartment.photos).length"
                        :src="getGalleryPhotos(item.apartment.photos)[0].url"
                        :alt="item.apartment.title"
                        loading="lazy"
                        @click="
                          openPhotoGallery(
                            item.apartment,
                            lightboxIndexForPreviewSlot(
                              item.apartment.photos,
                              0
                            )
                          )
                        "
                      />
                    </div>
                    <div :class="$style.villaThumbs">
                      <div
                        v-for="(photo, pi) in getGalleryPhotos(
                          item.apartment.photos
                        ).slice(1, 5)"
                        :key="pi"
                        :class="$style.villaThumb"
                      >
                        <img
                          :src="photo.url"
                          :alt="`${item.apartment.title} — фото ${pi + 2}`"
                          loading="lazy"
                          @click="
                            openPhotoGallery(
                              item.apartment,
                              lightboxIndexForPreviewSlot(
                                item.apartment.photos,
                                pi + 1
                              )
                            )
                          "
                        />
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
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
            <h2 :class="$style.photoGalleryTitle">
              {{ photoGalleryTitle || "Фотографии" }}
            </h2>
            <div :class="$style.photoGalleryHeaderSpacer" />
          </header>
          <div :class="$style.photoGalleryGrid">
            <button
              v-for="(photo, idx) in photoGalleryPhotos"
              :key="idx"
              type="button"
              :class="$style.photoGalleryItem"
              @click="openFullscreenPhoto(idx)"
            >
              <img
                :src="photo.url"
                :alt="`${photoGalleryTitle || 'Вилла'} — фото ${idx + 1}`"
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
                v-if="photoGalleryPhotos.length > 1 && fullscreenPhotoIndex > 0"
                type="button"
                :class="[$style.photoFullscreenNav, $style.photoFullscreenPrev]"
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
                  photoGalleryPhotos.length > 1 &&
                  fullscreenPhotoIndex < photoGalleryPhotos.length - 1
                "
                type="button"
                :class="[$style.photoFullscreenNav, $style.photoFullscreenNext]"
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
                  v-if="photoGalleryPhotos[fullscreenPhotoIndex]"
                  :src="photoGalleryPhotos[fullscreenPhotoIndex].url"
                  :alt="`${photoGalleryTitle || 'Вилла'} — фото ${
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
</template>

<script>
import { defineAsyncComponent } from "vue";
import { ru } from "date-fns/locale";
import axios from "axios";
import AppIcon from "@app/components/AppIcon.vue";

const BOOKING_CONFIRM_URL =
  "https://realtycalendar.ru/v2/widget/NVGNpGgXO7/confirm";
const BOOKING_REDIRECT_URL = "https://homereserve.ru/HE3NXyOLk4/status";

const VueDatePicker = defineAsyncComponent(async () => {
  await import("@vuepic/vue-datepicker/dist/main.css");
  const mod = await import("@vuepic/vue-datepicker");
  return mod.VueDatePicker;
});

const CHILD_AGES = Array.from({ length: 18 }, (_, i) => String(i));

export default {
  name: "BookingModal",
  components: { AppIcon, VueDatePicker },
  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["close"],
  data() {
    return {
      ruLocale: ru,
      checkInDate: null,
      checkOutDate: null,
      checkInOpen: false,
      checkOutOpen: false,
      guestsOpen: false,
      guestSelection: { adults: 1, children: [] },
      childAges: CHILD_AGES,
      availabilityLoading: false,
      availabilityMap: {},
      locationConfirmSubmitting: false,
      confirmingVillaIndex: null,
      photoGalleryOpen: false,
      photoGalleryPhotos: [],
      photoGalleryTitle: "",
      fullscreenPhotoIndex: null,
      fullscreenScale: 1,
      fullscreenTranslateX: 0,
      fullscreenTranslateY: 0,
      fullscreenDragging: false,
      fullscreenDragStartX: 0,
      fullscreenDragStartY: 0,
      prevBodyOverflowGallery: "",
    };
  },
  computed: {
    maxGuests() {
      const caps = this.apartments
        .map((a) => a?.capacity)
        .filter((c) => c != null && c > 0);
      return caps.length ? Math.max(...caps) : 99;
    },
    canAddAdult() {
      return this.totalGuests < this.maxGuests;
    },
    canAddChild() {
      return this.totalGuests < this.maxGuests;
    },
    apartments() {
      return this.$store.state.apartments || [];
    },
    checkInFormatted() {
      return this.formatDate(this.checkInDate);
    },
    checkOutFormatted() {
      return this.formatDate(this.checkOutDate);
    },
    minCheckInDate() {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      return d;
    },
    minCheckOutDate() {
      if (!this.checkInDate) return this.minCheckInDate;
      const d = new Date(this.checkInDate);
      d.setDate(d.getDate() + 1);
      return d;
    },
    hasDates() {
      return (
        this.checkInDate &&
        this.checkOutDate &&
        this.checkOutDate > this.checkInDate
      );
    },
    totalGuests() {
      const g = this.guestSelection;
      return (g?.adults ?? 0) + (g?.children?.length ?? 0);
    },
    beginDateStr() {
      return this.toDateStr(this.checkInDate);
    },
    endDateStr() {
      return this.toDateStr(this.checkOutDate);
    },
    availableVillas() {
      if (!this.hasDates) return [];
      return this.apartments
        .map((apartment) => {
          const info = this.availabilityMap[apartment.id];
          if (!info || !info.available) return null;
          const price = info.price != null ? this.formatPrice(info.price) : "—";
          return { apartment, priceFormatted: price, available: true };
        })
        .filter(Boolean);
    },
  },
  watch: {
    open(isOpen) {
      if (typeof document === "undefined") return;
      if (isOpen) {
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", this.onEscape);
        document.addEventListener("mousedown", this.onClickOutside);
      } else {
        document.body.style.overflow = "";
        document.removeEventListener("keydown", this.onEscape);
        document.removeEventListener("mousedown", this.onClickOutside);
        this.checkInOpen = false;
        this.checkOutOpen = false;
        this.guestsOpen = false;
      }
    },
    hasDates(val) {
      if (val) this.fetchAvailability();
    },
    photoGalleryOpen(open) {
      if (typeof document === "undefined") return;
      if (open) {
        this.prevBodyOverflowGallery = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", this.onPhotoGalleryKeydown);
      } else {
        document.body.style.overflow = this.prevBodyOverflowGallery || "";
        document.removeEventListener("keydown", this.onPhotoGalleryKeydown);
      }
    },
  },
  beforeUnmount() {
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", this.onEscape);
      document.removeEventListener("mousedown", this.onClickOutside);
      document.removeEventListener("keydown", this.onPhotoGalleryKeydown);
    }
  },
  methods: {
    /** Возвращает ровно 5 фото для галереи, при нехватке повторяет имеющиеся */
    getGalleryPhotos(photos) {
      const list = photos || [];
      if (list.length === 0) return [];
      const result = [];
      for (let i = 0; i < 5; i++) {
        result.push(list[i % list.length]);
      }
      return result;
    },
    /** Как в Reserv.vue — до 25 оригинальных фото для модалки галереи */
    getLightboxPhotos(photos) {
      if (!Array.isArray(photos)) return [];
      return photos.slice(0, 25);
    },
    /**
     * Индекс в lightbox для слота превью-сетки (0 — большое фото, 1–4 — миниатюры),
     * согласован с getGalleryPhotos (i % length).
     */
    lightboxIndexForPreviewSlot(photos, slotIndex) {
      const raw = Array.isArray(photos) ? photos : [];
      if (!raw.length) return 0;
      const idxInSource = slotIndex % raw.length;
      const lightboxLen = Math.min(25, raw.length);
      return Math.min(idxInSource, lightboxLen - 1);
    },
    openPhotoGallery(apartment, startIndex) {
      const list = this.getLightboxPhotos(apartment?.photos);
      if (!list.length) return;
      let idx = startIndex == null || Number.isNaN(startIndex) ? 0 : startIndex;
      idx = Math.max(0, Math.min(idx, list.length - 1));
      this.photoGalleryPhotos = list;
      this.photoGalleryTitle = apartment?.title || "";
      this.photoGalleryOpen = true;
      this.fullscreenPhotoIndex = idx;
      this.resetFullscreenTransform();
    },
    closePhotoGallery() {
      this.photoGalleryOpen = false;
      this.fullscreenPhotoIndex = null;
      this.resetFullscreenTransform();
    },
    openFullscreenPhoto(idx) {
      if (!this.photoGalleryPhotos.length) return;
      this.resetFullscreenTransform();
      this.fullscreenPhotoIndex = idx;
    },
    closeFullscreenPhoto() {
      this.fullscreenPhotoIndex = null;
      this.resetFullscreenTransform();
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
    toDateStr(date) {
      if (!date || !(date instanceof Date)) return "";
      const pad = (n) => String(n).padStart(2, "0");
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    },
    formatDate(date) {
      if (!date || !(date instanceof Date)) return "";
      const day = date.getDate();
      const month = date.toLocaleDateString("ru-RU", { month: "long" });
      return `${day} ${month}`;
    },
    formatPrice(value) {
      if (value == null) return "—";
      return Number(value).toLocaleString("ru-RU");
    },
    isCheckInDisabled() {
      return false;
    },
    isCheckOutDisabled(date) {
      if (!this.checkInDate) return true;
      return date <= this.checkInDate;
    },
    onCheckInSelect() {
      this.checkInOpen = false;
      if (this.checkOutDate && this.checkOutDate <= this.checkInDate) {
        this.checkOutDate = null;
      }
    },
    onCheckOutSelect() {
      this.checkOutOpen = false;
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
    onGuestsDropdownMousedown(event) {
      const tag = event.target?.tagName;
      if (tag === "SELECT" || tag === "OPTION") return;
      event.preventDefault();
    },
    async fetchAvailability() {
      if (!this.hasDates || !this.apartments.length) return;
      this.availabilityLoading = true;
      this.availabilityMap = {};
      try {
        const guests = {
          adults: this.guestSelection.adults,
          children: (this.guestSelection.children || []).map((c) => ({
            age: c?.age ?? "0",
          })),
        };
        for (const apt of this.apartments) {
          if (!apt.id) continue;
          try {
            const calendar = await this.$store.dispatch(
              "fetchCalendarForApartment",
              {
                apartmentId: apt.id,
                beginDate: this.beginDateStr,
                endDate: this.endDateStr,
                guests,
              }
            );
            const entry = Array.isArray(calendar)
              ? calendar.find((e) => e.date === this.beginDateStr)
              : null;
            const available =
              entry &&
              entry.closed_on_arrival !== true &&
              entry.available !== false;
            this.availabilityMap = {
              ...this.availabilityMap,
              [apt.id]: {
                available: !!available,
                price: entry?.price ?? apt.price?.common?.without_discount,
              },
            };
          } catch {
            this.availabilityMap = {
              ...this.availabilityMap,
              [apt.id]: { available: false },
            };
          }
        }
      } finally {
        this.availabilityLoading = false;
      }
    },
    async onBookVilla(index) {
      const item = this.availableVillas[index];
      if (!item) return;
      const guests = {
        adults: this.guestSelection.adults,
        children: (this.guestSelection.children || []).map((c) => ({
          age: c?.age ?? "0",
        })),
      };
      const fromLocation = this.$store.state.bookingModalOpenedFromLocation;
      const locationData = this.$store.state.locationFormData;

      if (fromLocation && locationData) {
        const phoneRaw = (locationData.phone || "").replace(/\D/g, "");
        if (!phoneRaw) return;
        const body = {
          apartment_id: String(item.apartment.id),
          begin_date: this.toDateStr(this.checkInDate),
          end_date: this.toDateStr(this.checkOutDate),
          first_name: (locationData.firstName || "").trim(),
          last_name: (locationData.lastName || "").trim(),
          guests,
          phone: phoneRaw,
          redirect_url: BOOKING_REDIRECT_URL,
          widget_type: "widget_page",
        };
        if ((locationData.email || "").trim()) {
          body.email = locationData.email.trim();
        }
        if ((locationData.wish || "").trim()) {
          body.wish = locationData.wish.trim();
        }
        this.confirmingVillaIndex = index;
        this.locationConfirmSubmitting = true;
        try {
          const response = await axios.post(BOOKING_CONFIRM_URL, body);
          const paymentUrl = response?.data?.url;
          if (paymentUrl && typeof window !== "undefined") {
            this.$store.commit("setBookingModalOpen", false);
            window.location.href = paymentUrl;
            return;
          }
        } catch (err) {
          console.error("Booking confirm error:", err);
          const msg =
            err.response?.data?.message ||
            (err.response?.data?.errors &&
              Object.values(err.response.data.errors).flat().join("\n")) ||
            err.message ||
            "Произошла ошибка при отправке заявки.";
          if (typeof window !== "undefined") alert(msg);
        } finally {
          this.locationConfirmSubmitting = false;
          this.confirmingVillaIndex = null;
        }
        return;
      }

      this.$store.commit("setBookingFormData", {
        checkInDate: this.toDateStr(this.checkInDate),
        checkOutDate: this.toDateStr(this.checkOutDate),
        guests,
        apartment: item.apartment,
      });
      const aptIndex = this.apartments.findIndex(
        (a) => a.id === item.apartment.id
      );
      if (aptIndex >= 0) {
        this.$store.commit("setSelectedApartmentIndex", aptIndex);
      }
      this.$store.commit("setBookingModalPrefill", {
        name: this.$store.state.bookingModalPrefill?.name ?? "",
        phone: this.$store.state.bookingModalPrefill?.phone ?? "",
      });
      this.$emit("close");
      this.$nextTick(() => {
        this.$store.commit("setBookingFormModalOpen", true);
      });
    },
    onEscape(e) {
      if (e.key === "Escape") {
        if (this.checkInOpen || this.checkOutOpen || this.guestsOpen) {
          this.checkInOpen = false;
          this.checkOutOpen = false;
          this.guestsOpen = false;
        } else {
          this.$emit("close");
        }
      }
    },
    onClickOutside(e) {
      const checkIn = this.$refs.checkInWrapRef;
      const checkOut = this.$refs.checkOutWrapRef;
      const guests = this.$refs.guestsWrapRef;
      if (checkIn && !checkIn.contains(e.target)) this.checkInOpen = false;
      if (checkOut && !checkOut.contains(e.target)) this.checkOutOpen = false;
      if (guests && !guests.contains(e.target)) this.guestsOpen = false;
    },
  },
};
</script>

<style lang="scss" module>
@use "@app/assets/scss/colors.scss" as *;
@use "@app/assets/scss/mixins.scss" as *;

.overlay {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  overflow-y: auto;

  @include mobile {
    padding: 0;
    align-items: stretch;
    justify-content: stretch;
  }
}

.panel {
  position: relative;
  width: 100%;
  max-width: 50rem;
  max-height: 80vh;
  height: max-content;
  margin: 0 auto;
  background: $text-primary;
  overflow: visible;
  display: flex;
  flex-direction: column;
  border-radius: 1.25rem;
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.32);
  padding: 2.5rem;

  @include mobile {
    width: 100vw;
    height: 100vh;
    max-width: none;
    max-height: none;
    margin: 0;
    border-radius: 0;
    box-shadow: none;
    padding: 1.25rem 1rem 1rem;
    padding-top: max(1.25rem, env(safe-area-inset-top));
    padding-left: max(1rem, env(safe-area-inset-left));
    padding-right: max(1rem, env(safe-area-inset-right));
    padding-bottom: max(1rem, env(safe-area-inset-bottom));
    overflow-y: auto;
  }
}

.header {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-shrink: 0;
  gap: 1rem;
  margin: 0 0 2.5rem 0;
  padding-bottom: 0.5rem;
  background: $text-primary;

  @include mobile {
    position: static;
    top: auto;
    z-index: auto;
    padding-bottom: 0;
    margin-bottom: 1.5rem;
  }
}

.headerTitles {
  display: flex;
  flex-direction: column;
  gap: 0.08rem;
}

.title {
  margin: 0;
  font-size: 2rem;
  font-weight: 300;
  color: $text-white;
  line-height: 0.96;
  letter-spacing: -0.05em;
  @include mobile {
    font-size: 1.5rem;
  }
}

.subtitle {
  margin: 0;
  font-size: 2rem;
  font-weight: 300;
  color: #685137;
  line-height: 0.96;
  letter-spacing: -0.05em;
  @include mobile {
    font-size: 1.375rem;
  }
}

.closeBtn {
  position: relative;
  width: 3rem;
  height: 3rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: rgba(255, 255, 255, 0.12);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
}

.closeLine {
  position: absolute;
  width: 1.25rem;
  height: 2px;
  background: $text-white;
  border-radius: 1px;
  &:first-child {
    transform: rotate(45deg);
  }
  &:last-child {
    transform: rotate(-45deg);
  }
}

.filtersBar {
  display: flex;
  gap: 1rem;
  flex-wrap: nowrap;
  padding: 0;
  overflow: visible;
  flex-shrink: 0;
  margin: 0 0 2.5rem 0;

  @include mobile {
    flex-direction: column;
    margin-bottom: 1.5rem;
  }
}

.filterGroup {
  position: relative;
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.filterInputBox {
  position: relative;
  border: 1px solid $text-tertiary;
  border-radius: 0.4375rem;
  background: rgba(255, 255, 255, 0.02);
  transition:
    border-color 0.2s,
    background 0.2s;

  &.filterInputBoxFilled {
    border-color: #685137;

    .filterLabel {
      color: #685137;
    }
  }
}

.filterInputBoxOpen {
  /* Класс для подъёма z-index подписи при открытом выпадающем списке гостей */
}

.filterLabel {
  position: absolute;
  top: 0;
  left: 0.75rem;
  transform: translateY(-50%);
  padding: 0 0.35rem;
  font-size: 0.75rem;
  font-weight: 400;
  z-index: 10;
  line-height: 1;
  color: $text-tertiary;
  background: $text-primary;
  pointer-events: none;
  transition: color 0.2s;
}

/* Только подпись того поля, у которого открыт календарь/гости — поверх выпадающего списка */
.filterInputBox:has(.dateInputWrapOpen) .filterLabel,
.filterInputBoxOpen .filterLabel {
  z-index: 1001;
}

.filterInput {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 0.4375rem;
  min-height: 2.75rem;
  padding: 0.75rem;
  background: #2c2c2c;
  border: none;
  border-radius: 0.4375rem;
  color: $text-white;
  font-size: 1rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  text-align: left;
  width: 100%;
  transition: background 0.2s;
  &:disabled {
    cursor: not-allowed;
  }
}

.filterIcon {
  flex-shrink: 0;
  opacity: 1;
  filter: brightness(0) invert(1);
  width: 1.5rem;
  height: 1.5rem;
}

.dateInputWrap {
  position: relative;
  z-index: 2;
  overflow: visible;
  &.dateInputWrapOpen {
    z-index: 100;
  }
}

.calendarDropdown {
  position: absolute;
  left: 0;
  top: calc(100% + 0.25rem);
  z-index: 1000;
  padding: 0.5rem;
  background: rgba(30, 30, 30, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.4);
  --dp-disabled-color: rgba(255, 255, 255, 0.08);
  --dp-disabled-color-text: rgba(255, 255, 255, 0.35);
  :global(.dp__main) {
    border: none;
    background: transparent;
  }
  :global(.dp__input_wrap) {
    display: none;
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
}

.guestsDropdown {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + 0.25rem);
  z-index: 1000;
  padding: 0.75rem;
  background: rgba(30, 30, 30, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.4);
  max-height: 20rem;
  overflow-y: auto;
}

.guestsPlaceholder {
  color: rgba(255, 255, 255, 0.5);
}

.guestsDropdownInner {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.guestsRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  color: $text-white;
  font-size: 0.9375rem;
}

.guestsRowLabel {
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.9);
}

.guestsCounter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: $text-white;
}

.guestsCounterValue {
  min-width: 1.5rem;
  text-align: center;
  font-size: 1rem;
  font-weight: 500;
}

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
  cursor: pointer;
  transition: background 0.15s;
  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.25);
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
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
}

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
}

.guestsAddChildChevron {
  font-size: 0.75rem;
  opacity: 0.8;
}

.guestsClose {
  margin-top: 0.75rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  border-radius: 0.375rem;
  color: $text-white;
  font-size: 0.875rem;
  cursor: pointer;
  width: 100%;
  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }
}

.content {
  flex: 0 1 auto;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-color: rgba(255, 255, 255, 0.25) transparent;

  @include mobile {
    flex: 0 0 auto;
    min-height: auto;
    overflow: visible;
  }
}

.content::-webkit-scrollbar {
  width: 0.5rem;
}
.content::-webkit-scrollbar-track {
  background: transparent;
}
.content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.25);
  border-radius: 0.25rem;
}

.hint {
  color: rgba(255, 255, 255, 0.6);
  font-size: 1rem;
  margin: 0;
  padding: 2rem 0;
}

.loadingWrap {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 12rem;
  padding: 2rem;
}

.spinner {
  width: 2.5rem;
  height: 2.5rem;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-top-color: $text-white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  padding: 2rem 0;
  text-align: center;
}

.villaList {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.villaCard {
  padding-bottom: 0.25rem;
}

.villaCardHeader {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  @include mobile {
    flex-wrap: wrap;
    align-items: flex-start;
  }
}

.villaCardTitleRow {
  display: flex;
  align-items: flex-end;
  gap: 0.625rem;
  min-width: 0;
}

.villaLabel {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 400;
  line-height: 1.1;
  transform: translateY(-0.18rem);
}

.villaName {
  margin: 0;
  font-size: 3rem;
  font-weight: 600;
  color: $text-white;
  line-height: 1;
  letter-spacing: -0.05em;
  @include mobile {
    font-size: 1.875rem;
  }
}

.villaCardActions {
  display: flex;
  align-items: stretch;
  gap: 0;
  flex-shrink: 0;
}

.villaPriceBox {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 5.5rem;
  padding: 0 0.95rem;
  border: none;
  border-radius: 0.4375rem 0 0 0.4375rem;
  background: $bg-transparent-16;
  color: $text-white;
  font-size: 1rem;
  font-weight: 600;
}

.bookBtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-width: 8.75rem;
  padding: 0.75rem 1.1rem;
  background: #004f68;
  color: $text-white;
  border: none;
  border-radius: 0 0.4375rem 0.4375rem 0;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #006080;
  }
}

.bookBtnSpinner {
  width: 1.25rem;
  height: 1.25rem;
  min-width: 1.25rem;
  min-height: 1.25rem;
  flex-shrink: 0;
  border: 2px solid rgba(255, 255, 255, 0.25);
  border-top-color: $text-white;
  border-radius: 50%;
  box-sizing: border-box;
  animation: bookBtnSpin 0.8s linear infinite;
}

@keyframes bookBtnSpin {
  to {
    transform: rotate(360deg);
  }
}

.villaDesc {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.18;
  margin: 0 0 0.75rem 0;
  :global(p) {
    margin: 0;
    &:last-child {
      margin-bottom: 0;
    }
  }
}

.villaGallery {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 0;
  border-radius: 1.5rem;
  overflow: hidden;
  min-height: 18rem;
  @include mobile {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }
}

.villaMainImg {
  grid-column: 1;
  grid-row: 1 / -1;
  background: rgba(0, 0, 0, 0.3);
  overflow: hidden;
  @include mobile {
    grid-row: auto;
    min-height: 12rem;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    cursor: pointer;
  }
}

.villaThumbs {
  grid-column: 2;
  grid-row: 1 / -1;
  min-height: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 0;
  @include mobile {
    grid-column: 1;
    grid-row: auto;
    grid-template-columns: repeat(2, 1fr);
  }
}

.villaThumb {
  position: relative;
  background: rgba(0, 0, 0, 0.3);
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    cursor: pointer;
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
}

.photoGalleryPanel {
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

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
}

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
}

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
}

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
}

.photoFullscreenPrev {
  left: 1rem;
}

.photoFullscreenNext {
  right: 1rem;
}

.photoFullscreenImgWrap {
  max-width: 100%;
  max-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.photoFullscreenImg {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: cover;
  display: block;
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
  transition: opacity 0.2s ease;
}
:global(.photo-gallery-enter-from),
:global(.photo-gallery-leave-to) {
  opacity: 0;
}
</style>

<style lang="scss" scoped>
.booking-modal-enter-active,
.booking-modal-leave-active {
  transition: opacity 0.2s ease;
}
.booking-modal-enter-from,
.booking-modal-leave-to {
  opacity: 0;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.1s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-0.25rem);
}
</style>
