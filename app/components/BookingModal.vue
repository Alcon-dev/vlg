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
            <div :class="$style.headerTop">
              <h1 :class="$style.title">ВЫБЕРИТЕ ВИЛЛУ</h1>
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
            <h2 :class="$style.subtitle">ОТКРОЙТЕ НОВЫЙ ФОРМАТ ОТДЫХА</h2>
          </div>

          <div :class="$style.filtersBar">
            <div
              ref="datesWrapRef"
              :class="[
                $style.fieldGroup,
                $style.fieldGroupAccent,
                (checkInOpen || checkOutOpen) && $style.fieldGroupOpen,
              ]"
            >
              <div :class="$style.fieldCell">
                <span :class="$style.filterLabel">Дата заезда</span>
                <div :class="$style.dateInputWrap">
                  <button
                    type="button"
                    :class="$style.filterInput"
                    @click.stop.prevent="
                      checkInOpen = !checkInOpen;
                      checkOutOpen = false;
                      guestsOpen = false;
                      childAgeOpenIndex = null;
                    "
                  >
                    <img
                      :src="calendarIconUrl"
                      alt=""
                      :class="$style.filterIcon"
                      aria-hidden="true"
                    />
                    <span>{{ checkInFormatted || "Дата" }}</span>
                  </button>
                </div>
              </div>
              <div :class="$style.fieldCell">
                <span :class="$style.filterLabel">Дата выезда</span>
                <div :class="$style.dateInputWrap">
                  <button
                    type="button"
                    :class="$style.filterInput"
                    :disabled="!checkInDate"
                    @click.stop.prevent="
                      checkOutOpen = !checkOutOpen;
                      checkInOpen = false;
                      guestsOpen = false;
                      childAgeOpenIndex = null;
                    "
                  >
                    <img
                      :src="calendarIconUrl"
                      alt=""
                      :class="$style.filterIcon"
                      aria-hidden="true"
                    />
                    <span>{{ checkOutFormatted || "Дата" }}</span>
                  </button>
                </div>
              </div>
              <Transition name="dropdown">
                <div
                  v-show="checkInOpen"
                  :class="$style.calendarDropdown"
                  @mousedown.stop
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
              <Transition name="dropdown">
                <div
                  v-show="checkOutOpen"
                  :class="$style.calendarDropdown"
                  @mousedown.stop
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

            <div
              ref="guestsWrapRef"
              :class="[$style.fieldGroup, guestsOpen && $style.fieldGroupOpen]"
            >
              <div :class="$style.fieldCell">
                <span :class="$style.filterLabel">Кол-во взрослых</span>
                <div :class="$style.counterInner">
                  <button
                    type="button"
                    :class="$style.counterBtn"
                    :disabled="guestSelection.adults <= 1"
                    aria-label="Меньше взрослых"
                    @click="setAdults(guestSelection.adults - 1)"
                  >
                    −
                  </button>
                  <span :class="$style.counterValue">{{ adultsDisplay }}</span>
                  <button
                    type="button"
                    :class="$style.counterBtn"
                    :disabled="!canAddAdult"
                    aria-label="Больше взрослых"
                    @click="setAdults(guestSelection.adults + 1)"
                  >
                    +
                  </button>
                </div>
              </div>
              <div :class="$style.fieldCell">
                <span :class="$style.filterLabel">Детей</span>
                <div :class="$style.counterInner">
                  <button
                    type="button"
                    :class="$style.counterBtn"
                    :disabled="!guestSelection.children.length"
                    aria-label="Меньше детей"
                    @click="
                      removeChild(guestSelection.children.length - 1);
                      if (!guestSelection.children.length) guestsOpen = false;
                    "
                  >
                    −
                  </button>
                  <button
                    type="button"
                    :class="$style.counterValueBtn"
                    aria-label="Возраст детей"
                    @click="
                      guestsOpen = guestSelection.children.length
                        ? !guestsOpen
                        : false
                    "
                  >
                    {{ guestSelection.children.length }}
                  </button>
                  <button
                    type="button"
                    :class="$style.counterBtn"
                    :disabled="!canAddChild"
                    aria-label="Больше детей"
                    @click="
                      addChild();
                      guestsOpen = true;
                    "
                  >
                    +
                  </button>
                </div>
              </div>
              <Transition name="dropdown">
                <div
                  v-show="guestsOpen && guestSelection.children.length"
                  :class="$style.guestsDropdown"
                  @mousedown="onGuestsDropdownMousedown"
                >
                  <div :class="$style.guestsDropdownInner">
                    <div
                      v-for="(child, index) in guestSelection.children"
                      :key="index"
                      :class="[
                        $style.guestsChildField,
                        childAgeOpenIndex === index &&
                          $style.guestsChildFieldOpen,
                      ]"
                    >
                      <span :class="$style.guestsChildFieldLabel">
                        Ребенок
                      </span>
                      <div :class="$style.guestsChildFieldInner">
                        <button
                          type="button"
                          :class="$style.guestsChildTrigger"
                          aria-haspopup="listbox"
                          :aria-expanded="childAgeOpenIndex === index"
                          @click.stop="toggleChildAge(index)"
                        >
                          <span>{{ child.age }} лет</span>
                          <span
                            :class="$style.guestsChildChevron"
                            aria-hidden="true"
                          />
                        </button>
                        <button
                          type="button"
                          :class="$style.guestsChildRemove"
                          aria-label="Удалить"
                          @click.stop="
                            removeChild(index);
                            if (childAgeOpenIndex === index)
                              childAgeOpenIndex = null;
                            if (!guestSelection.children.length)
                              guestsOpen = false;
                          "
                        >
                          ×
                        </button>
                      </div>
                      <Transition name="dropdown">
                        <ul
                          v-show="childAgeOpenIndex === index"
                          :class="$style.guestsChildAgeList"
                          role="listbox"
                          @mousedown.stop
                        >
                          <li
                            v-for="a in childAges"
                            :key="a"
                            role="option"
                            :aria-selected="child.age === a"
                          >
                            <button
                              type="button"
                              :class="[
                                $style.guestsChildAgeOption,
                                child.age === a &&
                                  $style.guestsChildAgeOptionActive,
                              ]"
                              @click.stop="selectChildAge(index, a)"
                            >
                              {{ a }} лет
                            </button>
                          </li>
                        </ul>
                      </Transition>
                    </div>
                  </div>
                  <button
                    type="button"
                    :class="$style.guestsClose"
                    @click="
                      guestsOpen = false;
                      childAgeOpenIndex = null;
                    "
                  >
                    Готово
                  </button>
                </div>
              </Transition>
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
                        @click="
                          openPhotoGallery(
                            item.apartment,
                            lightboxIndexForPreviewSlot(
                              item.apartment.photos,
                              pi + 1
                            )
                          )
                        "
                      >
                        <img
                          :src="photo.url"
                          :alt="`${item.apartment.title} — фото ${pi + 2}`"
                          loading="lazy"
                        />
                        <div v-if="pi === 3" :class="$style.villaAllOverlay">
                          <span>Все фото</span>
                        </div>
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
import calendarIconUrl from "@app/assets/img/modals/calendar.svg";

const BOOKING_CONFIRM_URL =
  "https://realtycalendar.ru/v2/widget/HE3NXyOLk4/confirm";
const BOOKING_REDIRECT_URL = "https://homereserve.ru/HE3NXyOLk4/status";

const VueDatePicker = defineAsyncComponent(async () => {
  await import("@vuepic/vue-datepicker/dist/main.css");
  const mod = await import("@vuepic/vue-datepicker");
  return mod.VueDatePicker;
});

const CHILD_AGES = Array.from({ length: 18 }, (_, i) => String(i));

export default {
  name: "BookingModal",
  components: { VueDatePicker },
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
      calendarIconUrl,
      checkInDate: null,
      checkOutDate: null,
      checkInOpen: false,
      checkOutOpen: false,
      guestsOpen: false,
      childAgeOpenIndex: null,
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
      const checkIn = this.normalizeDate(this.checkInDate);
      const checkOut = this.normalizeDate(this.checkOutDate);
      return !!(checkIn && checkOut && checkOut.getTime() > checkIn.getTime());
    },
    totalGuests() {
      const g = this.guestSelection;
      return (g?.adults ?? 0) + (g?.children?.length ?? 0);
    },
    adultsDisplay() {
      const n = this.guestSelection.adults ?? 0;
      const last = n % 10;
      const last2 = n % 100;
      let word = "гостей";
      if (!(last2 >= 11 && last2 <= 19)) {
        if (last === 1) word = "гость";
        else if (last >= 2 && last <= 4) word = "гостя";
      }
      return `${n} ${word}`;
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
      const d = this.normalizeDate(date);
      if (!d) return "";
      const pad = (n) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    },
    formatDate(date) {
      const d = this.normalizeDate(date);
      if (!d) return "";
      const day = d.getDate();
      const month = d.toLocaleDateString("ru-RU", { month: "long" });
      return `${day} ${month}`;
    },
    normalizeDate(date) {
      if (!date) return null;
      const d =
        date instanceof Date ? new Date(date.getTime()) : new Date(date);
      if (Number.isNaN(d.getTime())) return null;
      d.setHours(0, 0, 0, 0);
      return d;
    },
    formatPrice(value) {
      if (value == null) return "—";
      return Number(value).toLocaleString("ru-RU");
    },
    isCheckInDisabled() {
      return false;
    },
    isCheckOutDisabled(date) {
      const checkIn = this.normalizeDate(this.checkInDate);
      const day = this.normalizeDate(date);
      if (!checkIn || !day) return true;
      return day.getTime() <= checkIn.getTime();
    },
    onCheckInSelect(value) {
      const normalized = this.normalizeDate(value ?? this.checkInDate);
      if (normalized) this.checkInDate = normalized;
      this.checkInOpen = false;
      const checkOut = this.normalizeDate(this.checkOutDate);
      if (checkOut && checkOut.getTime() <= (normalized?.getTime() ?? 0)) {
        this.checkOutDate = null;
      }
    },
    onCheckOutSelect(value) {
      const normalized = this.normalizeDate(value ?? this.checkOutDate);
      if (normalized) this.checkOutDate = normalized;
      this.checkOutOpen = false;
      this.$nextTick(() => {
        if (this.hasDates) this.fetchAvailability();
      });
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
    toggleChildAge(index) {
      this.childAgeOpenIndex = this.childAgeOpenIndex === index ? null : index;
    },
    selectChildAge(index, age) {
      this.setChildAge(index, age);
      this.childAgeOpenIndex = null;
    },
    onGuestsDropdownMousedown(event) {
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
        const firstName = (locationData.firstName || "").trim();
        const body = {
          apartment_id: String(item.apartment.id),
          begin_date: this.toDateStr(this.checkInDate),
          end_date: this.toDateStr(this.checkOutDate),
          first_name: firstName,
          last_name: firstName,
          guests,
          phone: phoneRaw,
          redirect_url: BOOKING_REDIRECT_URL,
          widget_type: "widget_page",
        };
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
          this.childAgeOpenIndex = null;
        } else {
          this.$emit("close");
        }
      }
    },
    onClickOutside(e) {
      const dates = this.$refs.datesWrapRef;
      const guests = this.$refs.guestsWrapRef;
      if (dates && !dates.contains(e.target)) {
        this.checkInOpen = false;
        this.checkOutOpen = false;
      }
      if (guests && !guests.contains(e.target)) {
        this.guestsOpen = false;
        this.childAgeOpenIndex = null;
      }
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
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  overflow: auto;
  box-sizing: border-box;
  @include tablet {
    padding: 0;
    align-items: stretch;
    justify-content: stretch;
    overflow: hidden;
    background: $bg-brown;
    backdrop-filter: none;
  }
  .panel {
    position: relative;
    width: 100%;
    max-width: 50rem;
    max-height: 90vh;
    height: max-content;
    margin: auto;
    padding: 2.5rem;
    background: $bg-brown;
    border-radius: 1.5rem;
    color: $text-white;
    box-sizing: border-box;
    overflow: visible;
    display: flex;
    flex-direction: column;
    @include tablet {
      max-width: none;
      max-height: none;
      width: 100%;
      height: 100%;
      min-height: 100%;
      margin: 0;
      padding: 1rem;
      border-radius: 0;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
    }
    .header {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
      margin-bottom: 2.5rem;
      flex-shrink: 0;
      @include tablet {
        margin-bottom: 1.25rem;
      }
      .headerTop {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        .title {
          margin: 0;
          font-size: 2rem;
          font-weight: 400;
          letter-spacing: -0.04em;
          text-transform: uppercase;
          line-height: 1;
          color: $text-white;
          @include tablet {
            font-size: 1.35rem;
          }
        }
        .closeBtn {
          position: relative;
          flex-shrink: 0;
          width: 1.5rem;
          height: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          border: none;
          border-radius: 0.25rem;
          background: transparent;
          color: $text-white;
          cursor: pointer;
          .closeLine {
            position: absolute;
            width: 1.125rem;
            height: 1.5px;
            background: currentColor;
            &:first-child {
              transform: rotate(45deg);
            }
            &:last-child {
              transform: rotate(-45deg);
            }
          }
        }
      }
      .subtitle {
        margin: 0;
        align-self: flex-end;
        text-align: right;
        font-size: 2rem;
        font-weight: 300;
        letter-spacing: -0.04em;
        text-transform: uppercase;
        color: $text-accent;
        line-height: 1;
        @include tablet {
          font-size: 1.35rem;
        }
      }
    }
    .filtersBar {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      padding: 0;
      overflow: visible;
      flex-shrink: 0;
      margin: 0 0 1.5rem;
      @include tablet {
        grid-template-columns: 1fr;
        margin-bottom: 1.25rem;
      }
      .fieldGroup {
        position: relative;
        display: grid;
        grid-template-columns: 1fr 1fr;
        min-width: 0;
        border: 1px solid rgba(255, 255, 255, 0.28);
        border-radius: 0.5rem;
        background: transparent;
        box-sizing: border-box;
        transition: border-color 0.2s;
        @include tablet {
          grid-template-columns: 1fr;
        }
        &.fieldGroupAccent {
          border-color: $text-accent;
          .filterIcon {
            opacity: 1;
            filter: none;
          }
          .fieldCell {
            .filterLabel {
              color: $text-accent;
            }
            &:not(:first-child) {
              border-left-color: $text-accent;
              @include tablet {
                border-left: none;
                border-top-color: $text-accent;
              }
            }
          }
        }
        &.fieldGroupOpen {
          z-index: 20;
          .filterLabel {
            z-index: 1001;
          }
        }
        .fieldCell {
          position: relative;
          min-width: 0;
          padding: 0.9rem 1rem 0.75rem;
          box-sizing: border-box;
          &:not(:first-child) {
            border-left: 1px solid rgba(255, 255, 255, 0.28);
            @include tablet {
              border-left: none;
              border-top: 1px solid rgba(255, 255, 255, 0.28);
            }
          }
          .filterLabel {
            position: absolute;
            top: 0;
            left: 0.85rem;
            z-index: 10;
            transform: translateY(-50%);
            padding: 0 0.35rem;
            font-size: 0.75rem;
            font-weight: 300;
            line-height: 1.2;
            color: rgba(255, 255, 255, 0.55);
            background: $bg-brown;
            pointer-events: none;
            transition: color 0.2s;
            white-space: nowrap;
          }
          .dateInputWrap {
            width: 100%;
            .filterInput {
              position: relative;
              z-index: 2;
              display: flex;
              align-items: center;
              gap: 0.65rem;
              min-width: 0;
              min-height: 1.75rem;
              padding: 0;
              background: transparent;
              border: none;
              border-radius: 0;
              color: $text-white;
              font-size: 1rem;
              font-weight: 400;
              font-family: inherit;
              cursor: pointer;
              text-align: left;
              width: 100%;
              span {
                min-width: 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              &:disabled {
                cursor: not-allowed;
                opacity: 0.45;
              }
              .filterIcon {
                flex-shrink: 0;
                width: 1rem;
                height: 1rem;
                opacity: 0.9;
                display: block;
              }
            }
          }
          .counterInner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.5rem;
            min-height: 1.75rem;
            .counterBtn {
              width: 1.75rem;
              height: 1.75rem;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 0;
              border: none;
              border-radius: 0;
              background: transparent;
              color: $text-white;
              font-size: 1.35rem;
              font-weight: 400;
              line-height: 1;
              cursor: pointer;
              transition: opacity 0.15s;
              &:disabled {
                opacity: 0.35;
                cursor: default;
              }
            }
            .counterValue,
            .counterValueBtn {
              flex: 1;
              min-width: 0;
              text-align: center;
              font-size: 1rem;
              font-weight: 400;
              color: $text-white;
              font-family: inherit;
              line-height: 1.2;
            }
            .counterValueBtn {
              padding: 0;
              border: none;
              background: transparent;
              cursor: pointer;
            }
          }
        }
        .calendarDropdown {
          grid-column: 1 / -1;
          position: absolute;
          left: 0;
          right: 0;
          top: calc(100% + 0.35rem);
          z-index: 1000;
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
          padding: 0.65rem 0.75rem;
          background: rgba(30, 30, 30, 0.98);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.5rem;
          box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.4);
          --dp-menu-min-width: 100%;
          --dp-menu-width: 100%;
          --dp-cell-size: 2.5rem;
          --dp-font-size: 0.875rem;
          --dp-common-padding: 0.35rem;
          --dp-calendar-wrap-padding: 0;
          --dp-menu-padding: 0;
          --dp-row-margin: 0.15rem 0;
          --dp-disabled-color: rgba(255, 255, 255, 0.08);
          --dp-disabled-color-text: rgba(255, 255, 255, 0.35);
          :global(.dp__main),
          :global(.dp__instance_calendar),
          :global(.dp__flex_display),
          :global(.dp__calendar_wrap),
          :global(.dp__calendar),
          :global(.dp__menu) {
            display: block;
            width: 100% !important;
            min-width: 0 !important;
            max-width: none !important;
            box-sizing: border-box;
          }
          :global(.dp__input_wrap) {
            display: none;
          }
          :global(.dp__calendar_header),
          :global(.dp__calendar_row) {
            display: flex;
            width: 100%;
            justify-content: stretch;
          }
          :global(.dp__calendar_header_item),
          :global(.dp__calendar_item) {
            flex: 1 1 0 !important;
            width: auto !important;
            min-width: 0 !important;
            max-width: none !important;
          }
          :global(.dp__cell_inner) {
            width: 100% !important;
            height: 2.5rem !important;
            max-width: none !important;
            box-sizing: border-box;
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
          :global(.dp__month_year_wrap) {
            width: 100%;
            font-size: 0.9375rem;
          }
        }
        .guestsDropdown {
          position: absolute;
          left: 0;
          right: 0;
          top: calc(100% + 0.35rem);
          z-index: 1000;
          padding: 0.85rem;
          background: rgba(30, 30, 30, 0.98);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.5rem;
          box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.4);
          overflow: visible;
          .guestsDropdownInner {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            .guestsChildField {
              position: relative;
              border: 1px solid rgba(255, 255, 255, 0.28);
              border-radius: 0.5rem;
              background: transparent;
              box-sizing: border-box;
              &.guestsChildFieldOpen {
                z-index: 2;
                .guestsChildFieldLabel {
                  z-index: 3;
                }
                .guestsChildChevron {
                  transform: rotate(180deg);
                }
              }
              .guestsChildFieldLabel {
                position: absolute;
                top: 0;
                left: 0.85rem;
                z-index: 2;
                transform: translateY(-50%);
                padding: 0 0.35rem;
                background: rgba(30, 30, 30, 0.98);
                font-size: 0.75rem;
                font-weight: 300;
                line-height: 1.2;
                color: rgba(255, 255, 255, 0.55);
                pointer-events: none;
                white-space: nowrap;
              }
              .guestsChildFieldInner {
                display: flex;
                align-items: center;
                gap: 0.35rem;
                min-height: 2.5rem;
                padding: 0.35rem 0.5rem 0.35rem 0.85rem;
                .guestsChildTrigger {
                  flex: 1;
                  min-width: 0;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  gap: 0.5rem;
                  padding: 0;
                  border: none;
                  background: transparent;
                  color: $text-white;
                  font-size: 1rem;
                  font-weight: 400;
                  font-family: inherit;
                  line-height: 1.2;
                  cursor: pointer;
                  text-align: left;
                  span:first-child {
                    min-width: 0;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  }
                }
                .guestsChildChevron {
                  flex-shrink: 0;
                  width: 0.45rem;
                  height: 0.45rem;
                  border-right: 1.5px solid rgba(255, 255, 255, 0.7);
                  border-bottom: 1.5px solid rgba(255, 255, 255, 0.7);
                  transform: rotate(45deg);
                  margin-top: -0.2rem;
                  transition: transform 0.15s ease;
                }
                .guestsChildRemove {
                  flex-shrink: 0;
                  width: 1.75rem;
                  height: 1.75rem;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  padding: 0;
                  background: none;
                  border: none;
                  color: rgba(255, 255, 255, 0.55);
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
              .guestsChildAgeList {
                position: absolute;
                left: 0;
                right: 0;
                top: calc(100% + 0.35rem);
                z-index: 5;
                margin: 0;
                padding: 0.35rem;
                list-style: none;
                display: flex;
                flex-direction: column;
                gap: 0.15rem;
                max-height: 11rem;
                overflow-y: auto;
                background: rgba(24, 24, 24, 0.98);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 0.5rem;
                box-shadow: 0 0.5rem 1.25rem rgba(0, 0, 0, 0.45);
                scrollbar-color: rgba(255, 255, 255, 0.25) transparent;
                &::-webkit-scrollbar {
                  width: 0.35rem;
                }
                &::-webkit-scrollbar-thumb {
                  background: rgba(255, 255, 255, 0.25);
                  border-radius: 0.25rem;
                }
                .guestsChildAgeOption {
                  width: 100%;
                  display: block;
                  padding: 0.55rem 0.75rem;
                  border: none;
                  border-radius: 0.35rem;
                  background: transparent;
                  color: rgba(255, 255, 255, 0.85);
                  font-size: 0.875rem;
                  font-weight: 300;
                  font-family: inherit;
                  line-height: 1.2;
                  text-align: left;
                  cursor: pointer;
                  transition:
                    background 0.15s,
                    color 0.15s;
                  &:hover {
                    background: rgba(255, 255, 255, 0.08);
                    color: $text-white;
                  }
                  &.guestsChildAgeOptionActive {
                    background: rgba(132, 99, 61, 0.35);
                    color: $text-white;
                  }
                }
              }
            }
          }
          .guestsClose {
            margin-top: 0.85rem;
            padding: 0.65rem 1rem;
            background: rgba(255, 255, 255, 0.12);
            border: none;
            border-radius: 0.45rem;
            color: $text-white;
            font-size: 0.875rem;
            font-weight: 400;
            font-family: inherit;
            letter-spacing: 0.04em;
            text-transform: uppercase;
            cursor: pointer;
            width: 100%;
            transition: background 0.2s;
            &:hover {
              background: rgba(255, 255, 255, 0.2);
            }
          }
        }
      }
    }
    .content {
      flex: 0 1 auto;
      min-height: 0;
      overflow-x: hidden;
      overflow-y: auto;
      scrollbar-color: rgba(255, 255, 255, 0.25) transparent;
      @include tablet {
        flex: 0 0 auto;
        min-height: auto;
        overflow: visible;
      }
      &::-webkit-scrollbar {
        width: 0.5rem;
      }
      &::-webkit-scrollbar-track {
        background: transparent;
      }
      &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.25);
        border-radius: 0.25rem;
      }
      .hint {
        color: rgba(255, 255, 255, 0.55);
        font-size: 0.875rem;
        font-weight: 300;
        line-height: 1.4;
        margin: 0;
        padding: 0;
      }
      .loadingWrap {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 12rem;
        padding: 2rem;
        .spinner {
          width: 2.5rem;
          height: 2.5rem;
          border: 3px solid rgba(255, 255, 255, 0.2);
          border-top-color: $text-white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
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
        gap: 2rem;
        .villaCard {
          padding-bottom: 0;
          .villaCardHeader {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
            align-items: center;
            margin-bottom: 0.75rem;
            @include tablet {
              grid-template-columns: 1fr;
              gap: 1rem;
              align-items: flex-start;
            }
            .villaCardTitleRow {
              display: flex;
              align-items: baseline;
              gap: 0.5rem;
              min-width: 0;
              .villaLabel {
                font-size: 1rem;
                color: $text-white;
                font-weight: 300;
              }
              .villaName {
                margin: 0;
                font-size: 3rem;
                font-weight: 600;
                color: $text-white;
                line-height: 1;
                letter-spacing: -0.02em;
                @include tablet {
                  font-size: 1.75rem;
                }
              }
            }
            .villaCardActions {
              display: grid;
              grid-template-columns: 1fr 1fr;
              width: 100%;
              min-width: 0;
              height: 3rem;
              border-radius: 0.5rem;
              overflow: hidden;
              .villaPriceBox {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                min-width: 0;
                height: 100%;
                padding: 0 0.75rem;
                border: none;
                background: $bg-white;
                color: $green-accent;
                font-size: 1rem;
                font-weight: 600;
                line-height: 1;
                box-sizing: border-box;
              }
              .bookBtn {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
                width: 100%;
                min-width: 0;
                height: 100%;
                padding: 0 0.75rem;
                background: #004f68;
                color: $text-white;
                border: none;
                font-size: 1rem;
                font-weight: 600;
                line-height: 1;
                font-family: inherit;
                cursor: pointer;
                box-sizing: border-box;
                transition: background 0.2s;
                &:hover:not(:disabled) {
                  background: #006080;
                }
                &:disabled {
                  opacity: 0.65;
                  cursor: default;
                }
                .bookBtnSpinner {
                  width: 1.25rem;
                  height: 1.25rem;
                  flex-shrink: 0;
                  border: 2px solid rgba(255, 255, 255, 0.25);
                  border-top-color: $text-white;
                  border-radius: 50%;
                  box-sizing: border-box;
                  animation: bookBtnSpin 0.8s linear infinite;
                }
              }
            }
          }
          .villaDesc {
            font-size: 0.9375rem;
            color: rgba(255, 255, 255, 0.78);
            line-height: 1.35;
            margin: 0 0 1rem;
            max-width: 42rem;
            :global(p) {
              margin: 0;
              &:last-child {
                margin-bottom: 0;
              }
            }
          }
          .villaGallery {
            display: grid;
            grid-template-columns: 1.45fr 1fr;
            gap: 0;
            border-radius: 1rem;
            overflow: hidden;
            min-height: 17rem;
            background: #111;
            @include tablet {
              grid-template-columns: 1fr;
              min-height: 0;
            }
            .villaMainImg {
              background: #111;
              overflow: hidden;
              min-height: 17rem;
              @include tablet {
                min-height: 12rem;
              }
              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                display: block;
                cursor: pointer;
                min-height: 17rem;
                @include tablet {
                  min-height: 12rem;
                }
              }
            }
            .villaThumbs {
              display: grid;
              grid-template-columns: 1fr 1fr;
              grid-template-rows: 1fr 1fr;
              gap: 0;
              min-height: 0;
              @include tablet {
                display: none;
              }
              .villaThumb {
                position: relative;
                background: #111;
                overflow: hidden;
                min-height: 0;
                cursor: pointer;
                img {
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                  display: block;
                }
                .villaAllOverlay {
                  position: absolute;
                  inset: 0;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background: rgba(0, 0, 0, 0.55);
                  font-size: 1rem;
                  font-weight: 600;
                  line-height: 1.2;
                  color: $text-white;
                  pointer-events: none;
                }
              }
            }
          }
        }
      }
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
        top: max(1rem, env(safe-area-inset-top));
        right: max(1rem, env(safe-area-inset-right));
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
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes bookBtnSpin {
  to {
    transform: rotate(360deg);
  }
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
</style>
<style lang="scss" scoped>
.booking-modal-enter-active,
.booking-modal-leave-active {
  transition: opacity 0.25s ease;
  @include tablet {
    transition: transform 0.35s ease;
  }
}
.booking-modal-enter-from,
.booking-modal-leave-to {
  opacity: 0;
  @include tablet {
    opacity: 1;
    transform: translateY(100%);
  }
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
