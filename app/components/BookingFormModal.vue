<template>
  <Teleport to="body">
    <Transition name="booking-modal">
      <div
        v-if="open"
        :class="$style.overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Оформление бронирования"
        @click.self="close"
      >
        <div :class="$style.panel">
          <div :class="$style.header">
            <div :class="$style.headerTop">
              <h1 :class="$style.title">ЗАБРОНИРОВАТЬ ВИЛЛУ</h1>
              <button
                type="button"
                :class="$style.closeBtn"
                aria-label="Закрыть"
                @click="close"
              >
                <span :class="$style.closeLine" />
                <span :class="$style.closeLine" />
              </button>
            </div>
            <h2 :class="$style.subtitle">ОТКРОЙТЕ НОВЫЙ ФОРМАТ ОТДЫХА</h2>
            <div :class="$style.villaMeta">
              <span :class="$style.villaLabel">Вилла</span>
              <p :class="$style.villaName">{{ villaTitle }}</p>
            </div>
          </div>

          <div v-if="galleryPhotos.length" :class="$style.gallery">
            <button
              type="button"
              :class="$style.galleryPrev"
              aria-label="Предыдущее фото"
              @click.prevent
            >
              <span :class="$style.galleryPrevArrow" aria-hidden="true" />
            </button>
            <div :class="$style.galleryInner">
              <div :class="$style.galleryMain">
                <img
                  :src="galleryPhotos[0].url"
                  :alt="villaTitle"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div :class="$style.galleryGrid">
                <div
                  v-for="(photo, index) in galleryThumbs"
                  :key="index"
                  :class="$style.galleryThumb"
                >
                  <img
                    :src="photo.url"
                    :alt="`${villaTitle} — фото ${index + 2}`"
                    loading="lazy"
                    decoding="async"
                  />
                  <div
                    v-if="index === galleryThumbs.length - 1"
                    :class="$style.galleryAllOverlay"
                  >
                    <span>Все фото</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <form
            ref="formRef"
            :class="$style.form"
            @submit.prevent="onSubmit"
            @focusin="onFormFocusin"
          >
            <div :class="$style.formGrid">
              <div :class="$style.formLeft">
                <div :class="[$style.fieldRow, $style.fieldRowAccent]">
                  <div :class="$style.fieldCell">
                    <span :class="$style.fieldLabel">Дата заезда</span>
                    <div :class="$style.fieldValue">
                      <img
                        :src="calendarIconUrl"
                        alt=""
                        :class="$style.fieldIcon"
                        aria-hidden="true"
                      />
                      <span>{{ checkInFormatted || "—" }}</span>
                    </div>
                  </div>
                  <div :class="$style.fieldCell">
                    <span :class="$style.fieldLabel">Дата выезда</span>
                    <div :class="$style.fieldValue">
                      <img
                        :src="calendarIconUrl"
                        alt=""
                        :class="$style.fieldIcon"
                        aria-hidden="true"
                      />
                      <span>{{ checkOutFormatted || "—" }}</span>
                    </div>
                  </div>
                </div>

                <div
                  :class="[
                    $style.fieldRow,
                    {
                      [$style.fieldRowHasError]:
                        errors.firstName || errors.phone,
                    },
                  ]"
                >
                  <div
                    :class="[
                      $style.fieldCell,
                      { [$style.fieldCellError]: errors.firstName },
                    ]"
                  >
                    <span :class="$style.fieldLabel">Имя</span>
                    <input
                      v-model="firstName"
                      type="text"
                      :class="$style.fieldInput"
                      placeholder="Введите имя"
                      autocomplete="given-name"
                      @input="onFirstNameInput"
                    />
                  </div>
                  <div
                    :class="[
                      $style.fieldCell,
                      { [$style.fieldCellError]: errors.phone },
                    ]"
                  >
                    <span :class="$style.fieldLabel">Телефон</span>
                    <input
                      :value="phone"
                      type="tel"
                      inputmode="tel"
                      maxlength="18"
                      :class="$style.fieldInput"
                      placeholder="+7 (XXX) XXX-XX-XX"
                      autocomplete="tel"
                      @focus="onPhoneFocus"
                      @keydown="onPhoneKeydown"
                      @input="onPhoneInput"
                      @blur="onPhoneBlur"
                    />
                  </div>
                </div>

                <div
                  :class="[
                    $style.fieldRow,
                    $style.guestsFieldRow,
                    guestsOpen && $style.guestsFieldRowOpen,
                  ]"
                >
                  <div :class="$style.fieldCell">
                    <span :class="$style.fieldLabel">Кол-во взрослых</span>
                    <div :class="$style.stepper">
                      <button
                        type="button"
                        :class="$style.stepperBtn"
                        aria-label="Меньше взрослых"
                        :disabled="adults <= 1"
                        @click="changeAdults(-1)"
                      >
                        −
                      </button>
                      <span :class="$style.stepperValue">{{
                        adultsLabel
                      }}</span>
                      <button
                        type="button"
                        :class="$style.stepperBtn"
                        aria-label="Больше взрослых"
                        :disabled="!canAddGuest"
                        @click="changeAdults(1)"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div :class="$style.fieldCell">
                    <span :class="$style.fieldLabel">Детей</span>
                    <div :class="$style.stepper">
                      <button
                        type="button"
                        :class="$style.stepperBtn"
                        aria-label="Меньше детей"
                        :disabled="children.length <= 0"
                        @click="
                          changeChildren(-1);
                          if (!children.length) guestsOpen = false;
                        "
                      >
                        −
                      </button>
                      <button
                        type="button"
                        :class="$style.stepperValueBtn"
                        aria-label="Возраст детей"
                        @click="
                          guestsOpen = children.length ? !guestsOpen : false
                        "
                      >
                        {{ children.length }}
                      </button>
                      <button
                        type="button"
                        :class="$style.stepperBtn"
                        aria-label="Больше детей"
                        :disabled="!canAddGuest"
                        @click="
                          changeChildren(1);
                          guestsOpen = true;
                        "
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <Transition name="dropdown">
                    <div
                      v-show="guestsOpen && children.length"
                      :class="$style.guestsDropdown"
                      @mousedown.prevent
                    >
                      <div :class="$style.guestsDropdownInner">
                        <div
                          v-for="(child, index) in children"
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
                              <span>{{ formatAgeYears(child.age) }}</span>
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
                                if (!children.length) guestsOpen = false;
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
                                  {{ formatAgeYears(a) }}
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

              <div :class="[$style.fieldBox, $style.commentBox]">
                <span :class="$style.fieldLabel">Комментарий</span>
                <textarea
                  v-model="wishes"
                  :class="$style.commentInput"
                  placeholder="Ваши пожелания (опционально)"
                  rows="6"
                />
              </div>

              <div
                :class="[
                  $style.consentBlock,
                  { [$style.consentBlockError]: errors.consent },
                ]"
              >
                <label :class="$style.consentLabel">
                  <input
                    v-model="consent"
                    type="checkbox"
                    :class="$style.consentInput"
                    @change="clearError('consent')"
                  />
                  <span :class="$style.consentCheckbox" aria-hidden="true">
                    <span :class="$style.consentCheckmark" />
                  </span>
                  <span :class="$style.consentText">
                    Я даю согласие на обработку
                    <a href="#" :class="$style.consentLink" @click.stop.prevent
                      >персональных данных</a
                    >, и подтверждаю ознакомление с
                    <a href="#" :class="$style.consentLink" @click.stop.prevent
                      >Правилами бронирования</a
                    >, условиями оферты
                    <a href="#" :class="$style.consentLink" @click.stop.prevent
                      >Перевод без риска</a
                    >
                    и
                    <a href="#" :class="$style.consentLink" @click.stop.prevent
                      >Политикой в отношении обработки персональных данных</a
                    >.
                  </span>
                </label>
              </div>

              <div :class="$style.cta">
                <div :class="$style.ctaPrice">
                  <span v-if="basePriceFormatted" :class="$style.ctaPriceOld">{{
                    basePriceFormatted
                  }}</span>
                  <span :class="$style.ctaPriceCurrent">{{
                    priceFormatted || "—"
                  }}</span>
                </div>
                <button
                  type="submit"
                  :class="$style.ctaBtn"
                  :disabled="submitDisabled"
                >
                  <span
                    v-if="submitting"
                    :class="$style.ctaBtnSpinner"
                    aria-hidden="true"
                  />
                  <span>{{ submitting ? "Отправка…" : "Забронировать" }}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
import axios from "axios";
import calendarIconUrl from "@app/assets/img/modals/calendar.svg";

const BOOKING_CONFIRM_URL =
  "https://realtycalendar.ru/v2/widget/HE3NXyOLk4/confirm";
const BOOKING_REDIRECT_URL = "https://homereserve.ru/HE3NXyOLk4/status";

const EMPTY_ERRORS = () => ({
  firstName: false,
  phone: false,
  consent: false,
});

const CHILD_AGES = Array.from({ length: 18 }, (_, i) => String(i));

function onlyLettersName(value) {
  return (value || "").replace(/[^\p{L}\s\-'’]/gu, "");
}

function isValidName(value) {
  const text = (value || "").trim();
  if (text.length < 2) return false;
  return /^[\p{L}]+(?:[\s\-'’]+[\p{L}]+)*$/u.test(text);
}

function onlyDigits(value) {
  return (value || "").replace(/\D/g, "");
}

/** Маска: +7 (XXX) XXX-XX-XX, максимум 11 цифр */
function formatPhone(value) {
  let digits = onlyDigits(value);
  if (!digits) return "";

  if (digits[0] === "8") digits = `7${digits.slice(1)}`;
  if (digits[0] !== "7") digits = `7${digits}`;
  digits = digits.slice(0, 11);

  const local = digits.slice(1);
  if (!local.length) return "+7 ";

  let result = `+7 (${local.slice(0, 3)}`;
  if (local.length >= 3) result += ")";
  if (local.length > 3) result += ` ${local.slice(3, 6)}`;
  if (local.length > 6) result += `-${local.slice(6, 8)}`;
  if (local.length > 8) result += `-${local.slice(8, 10)}`;
  return result;
}

function isValidPhoneDigits(digits) {
  if (!digits) return false;
  if (digits.length === 10) return digits[0] === "9";
  if (digits.length === 11 && (digits[0] === "7" || digits[0] === "8")) {
    return digits[1] === "9";
  }
  return false;
}

function phoneForApi(digits) {
  if (digits.length === 10 && digits[0] === "9") return `7${digits}`;
  if (digits.length === 11 && digits[0] === "8") return `7${digits.slice(1)}`;
  return digits;
}

/** Курсор после N-й цифры в отформатированной строке */
function cursorAfterDigit(formatted, digitCount) {
  if (!formatted) return 0;
  if (digitCount <= 0) return Math.min(3, formatted.length);

  let seen = 0;
  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i])) {
      seen += 1;
      if (seen === digitCount) return i + 1;
    }
  }
  return formatted.length;
}

function formatPrice(value) {
  if (value == null || Number.isNaN(Number(value))) return "";
  return `${Number(value).toLocaleString("ru-RU")} ₽`;
}

export default {
  name: "BookingFormModal",
  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["close"],
  data() {
    return {
      calendarIconUrl,
      firstName: "",
      phone: "",
      wishes: "",
      consent: false,
      adults: 1,
      children: [],
      childAges: CHILD_AGES,
      guestsOpen: false,
      childAgeOpenIndex: null,
      submitting: false,
      errors: EMPTY_ERRORS(),
    };
  },
  computed: {
    formData() {
      return this.$store.state.bookingFormData;
    },
    apartment() {
      return this.formData?.apartment ?? null;
    },
    villaTitle() {
      return this.apartment?.title ?? "—";
    },
    galleryPhotos() {
      const photos = this.apartment?.photos;
      return Array.isArray(photos) ? photos.slice(0, 5) : [];
    },
    galleryThumbs() {
      const thumbs = this.galleryPhotos.slice(1, 5);
      while (thumbs.length < 4 && this.galleryPhotos[0]) {
        thumbs.push(this.galleryPhotos[0]);
      }
      return thumbs.slice(0, 4);
    },
    checkInFormatted() {
      return this.formatDateDisplay(this.formData?.checkInDate);
    },
    checkOutFormatted() {
      return this.formatDateDisplay(this.formData?.checkOutDate);
    },
    maxGuests() {
      const cap = this.apartment?.capacity;
      return cap != null && cap > 0 ? cap : 99;
    },
    totalGuests() {
      return this.adults + this.children.length;
    },
    canAddGuest() {
      return this.totalGuests < this.maxGuests;
    },
    adultsLabel() {
      const n = this.adults;
      const mod10 = n % 10;
      const mod100 = n % 100;
      let word = "гостей";
      if (mod10 === 1 && mod100 !== 11) word = "гость";
      else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
        word = "гостя";
      }
      return `${n} ${word}`;
    },
    priceFormatted() {
      if (this.formData?.price != null) return formatPrice(this.formData.price);
      if (this.formData?.priceFormatted) {
        const text = String(this.formData.priceFormatted);
        return text.includes("₽") ? text : `${text} ₽`;
      }
      const fallback = this.apartment?.price?.common?.without_discount;
      return fallback != null ? formatPrice(fallback) : "";
    },
    basePriceFormatted() {
      if (this.formData?.basePrice != null) {
        return formatPrice(this.formData.basePrice);
      }
      return "";
    },
    submitDisabled() {
      return (
        this.submitting ||
        !this.apartment?.id ||
        !this.formData?.checkInDate ||
        !this.formData?.checkOutDate
      );
    },
  },
  watch: {
    open(isOpen) {
      if (isOpen && this.formData) {
        this.resetForm();
      }
      if (typeof document === "undefined") return;
      if (isOpen) {
        document.addEventListener("keydown", this.onEscape);
        this._prevBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
      } else {
        document.removeEventListener("keydown", this.onEscape);
        document.body.style.overflow = this._prevBodyOverflow ?? "";
      }
    },
  },
  beforeUnmount() {
    if (typeof document === "undefined") return;
    document.removeEventListener("keydown", this.onEscape);
    document.body.style.overflow = this._prevBodyOverflow ?? "";
  },
  methods: {
    resetForm() {
      const prefill = this.$store.state.bookingModalPrefill;
      this.firstName = onlyLettersName(prefill?.name ?? "");
      this.phone = formatPhone(prefill?.phone ?? "");
      this.wishes = "";
      this.consent = false;
      this.adults = Math.max(1, this.formData?.guests?.adults ?? 1);
      this.children = Array.isArray(this.formData?.guests?.children)
        ? this.formData.guests.children.map((c) => ({
            age: String(c?.age ?? "0"),
          }))
        : [];
      this.errors = EMPTY_ERRORS();
      this.guestsOpen = false;
      this.childAgeOpenIndex = null;
    },
    formatAgeYears(age) {
      const n = Number(age);
      if (!Number.isFinite(n)) return `${age} лет`;
      const mod10 = n % 10;
      const mod100 = n % 100;
      let word = "лет";
      if (mod10 === 1 && mod100 !== 11) word = "год";
      else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
        word = "года";
      }
      return `${n} ${word}`;
    },
    setChildAge(index, age) {
      if (!this.children[index]) return;
      this.children[index] = { ...this.children[index], age: String(age) };
    },
    toggleChildAge(index) {
      this.childAgeOpenIndex = this.childAgeOpenIndex === index ? null : index;
    },
    selectChildAge(index, age) {
      this.setChildAge(index, age);
      this.childAgeOpenIndex = null;
    },
    removeChild(index) {
      this.children.splice(index, 1);
    },
    clearError(field) {
      this.errors = { ...this.errors, [field]: false };
    },
    resetErrors() {
      this.errors = EMPTY_ERRORS();
    },
    onFormFocusin() {
      requestAnimationFrame(() => {
        const form = this.$refs.formRef;
        if (form) form.scrollLeft = 0;
      });
    },
    onEscape(e) {
      if (e.key === "Escape") this.close();
    },
    close() {
      this.$emit("close");
    },
    formatDateDisplay(dateStr) {
      if (!dateStr || typeof dateStr !== "string") return "";
      const [year, month, day] = dateStr.split("-").map(Number);
      if (!year || !month || !day) return dateStr;
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
      return `${day} ${months[month - 1]}`;
    },
    onFirstNameInput(e) {
      this.firstName = onlyLettersName(e.target.value);
      this.clearError("firstName");
    },
    applyPhone(el, formatted, digitCount) {
      this.phone = formatted;
      this.$nextTick(() => {
        if (!el) return;
        const pos = cursorAfterDigit(formatted, digitCount);
        el.setSelectionRange(pos, pos);
      });
    },
    removePhoneDigitBefore(el, cursorPos) {
      const value = el.value;
      const digitsBefore = onlyDigits(value.slice(0, cursorPos)).length;
      if (digitsBefore <= 1) {
        this.applyPhone(el, "+7 ", 1);
        return;
      }
      const digits = onlyDigits(value);
      const next =
        digits.slice(0, digitsBefore - 1) + digits.slice(digitsBefore);
      this.applyPhone(el, formatPhone(next), digitsBefore - 1);
      this.clearError("phone");
    },
    onPhoneFocus(e) {
      const digits = onlyDigits(this.phone);
      if (!digits || digits === "7") {
        this.phone = "+7 ";
        this.$nextTick(() => {
          const el = e.target;
          el.setSelectionRange(el.value.length, el.value.length);
        });
        return;
      }
      this.phone = formatPhone(this.phone);
    },
    onPhoneKeydown(e) {
      const el = e.target;
      const start = el.selectionStart ?? 0;
      const end = el.selectionEnd ?? 0;
      const isShortcut = e.ctrlKey || e.metaKey || e.altKey;

      if (!isShortcut && e.key.length === 1 && !/^\d$/.test(e.key)) {
        e.preventDefault();
        return;
      }
      if (start !== end) return;

      if (e.key === "Backspace") {
        if (start <= 3) {
          e.preventDefault();
          return;
        }
        if (/\D/.test(el.value[start - 1] || "")) {
          e.preventDefault();
          this.removePhoneDigitBefore(el, start);
        }
        return;
      }

      if (e.key === "Delete") {
        const value = el.value;
        if (start >= value.length || !/\D/.test(value[start] || "")) return;
        e.preventDefault();
        let i = start;
        while (i < value.length && /\D/.test(value[i])) i += 1;
        if (i >= value.length) return;
        this.removePhoneDigitBefore(el, i + 1);
      }
    },
    onPhoneInput(e) {
      const el = e.target;
      const cursor = el.selectionStart ?? el.value.length;
      const digitCount = onlyDigits(el.value.slice(0, cursor)).length;
      const formatted = formatPhone(el.value) || "+7 ";
      this.applyPhone(el, formatted, Math.max(digitCount, 1));
      this.clearError("phone");
    },
    onPhoneBlur() {
      const digits = onlyDigits(this.phone);
      if (!digits || digits === "7") {
        this.phone = "";
        this.clearError("phone");
        return;
      }
      this.phone = formatPhone(this.phone);
      this.errors = {
        ...this.errors,
        phone: !isValidPhoneDigits(digits),
      };
    },
    changeAdults(delta) {
      const next = this.adults + delta;
      if (next < 1) return;
      if (delta > 0 && !this.canAddGuest) return;
      this.adults = next;
    },
    changeChildren(delta) {
      if (delta > 0) {
        if (!this.canAddGuest) return;
        this.children.push({ age: "0" });
        return;
      }
      if (this.children.length <= 0) return;
      this.children.pop();
    },
    validateForm() {
      const name = (this.firstName || "").trim();
      const phoneDigits = onlyDigits(this.phone);
      const nextErrors = EMPTY_ERRORS();

      if (!name || !isValidName(name)) nextErrors.firstName = true;
      if (
        !phoneDigits ||
        phoneDigits === "7" ||
        !isValidPhoneDigits(phoneDigits)
      ) {
        nextErrors.phone = true;
      }
      if (!this.consent) nextErrors.consent = true;

      this.errors = nextErrors;
      return !nextErrors.firstName && !nextErrors.phone && !nextErrors.consent;
    },
    applyApiErrors(apiErrors) {
      const next = { ...this.errors };
      if (apiErrors?.first_name) next.firstName = true;
      if (apiErrors?.phone) next.phone = true;
      this.errors = next;
    },
    async onSubmit() {
      this.resetErrors();
      if (!this.apartment?.id) return;
      if (!this.validateForm()) return;

      const phoneDigits = onlyDigits(this.phone);
      const body = {
        apartment_id: String(this.apartment.id),
        begin_date: this.formData.checkInDate,
        end_date: this.formData.checkOutDate,
        first_name: this.firstName.trim(),
        last_name: this.firstName.trim(),
        guests: {
          adults: this.adults,
          children: [],
        },
        phone: phoneForApi(phoneDigits),
        wish: (this.wishes || "").trim(),
        redirect_url: BOOKING_REDIRECT_URL,
        widget_type: "widget_page",
      };

      this.submitting = true;
      try {
        const response = await axios.post(BOOKING_CONFIRM_URL, body);
        const paymentUrl = response?.data?.url;
        if (paymentUrl && typeof window !== "undefined") {
          window.location.href = paymentUrl;
        }
      } catch (err) {
        console.error("Booking confirm error:", err);
        const apiErrors = err.response?.data?.errors;
        if (err.response?.status === 422 && apiErrors) {
          this.applyApiErrors(apiErrors);
          return;
        }
        const msg =
          err.response?.data?.message ||
          (apiErrors && Object.values(apiErrors).flat().join("\n")) ||
          err.message ||
          "Произошла ошибка при отправке заявки.";
        if (typeof window !== "undefined") alert(msg);
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>

<style lang="scss" module>
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
    max-width: 58rem;
    margin: auto;
    padding: 2.5rem;
    background: $bg-brown;
    border-radius: 1.5rem;
    color: $text-white;
    box-sizing: border-box;
    @include tablet {
      max-width: none;
      width: 100%;
      height: 100%;
      min-height: 100%;
      margin: 0;
      padding: 1rem;
      border-radius: 0;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
    }
  }
  .header {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    margin-bottom: 1.5rem;
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
        font-size: 2.75rem;
        font-weight: 400;
        letter-spacing: -0.04em;
        text-transform: uppercase;
        line-height: 1;
        color: $text-white;
        @include laptop {
          font-size: 2.25rem;
        }
        @include tablet {
          font-size: 1.35rem;
        }
      }
      .closeBtn {
        position: relative;
        flex-shrink: 0;
        width: 2rem;
        height: 2rem;
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
      font-size: 2.75rem;
      font-weight: 300;
      letter-spacing: -0.04em;
      text-transform: uppercase;
      color: $text-accent;
      line-height: 1;
      @include laptop {
        font-size: 2.25rem;
      }
      @include tablet {
        font-size: 1.35rem;
      }
    }
    .villaMeta {
      display: flex;
      align-items: baseline;
      gap: 0.75rem;
      margin-top: 1.35rem;
      @include tablet {
        margin-top: 0.85rem;
      }
      .villaLabel {
        font-size: 1rem;
        font-weight: 300;
        line-height: 1;
        color: $text-white;
        @include tablet {
          font-size: 0.75rem;
        }
      }
      .villaName {
        margin: 0;
        font-size: 3.25rem;
        font-weight: 600;
        line-height: 1;
        letter-spacing: -0.04em;
        color: $text-white;
        @include laptop {
          font-size: 2.5rem;
        }
        @include tablet {
          font-size: 1.75rem;
        }
      }
    }
  }
  .gallery {
    position: relative;
    margin-bottom: 1.5rem;
    @include tablet {
      margin-bottom: 1.25rem;
    }
    .galleryPrev {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      z-index: 2;
      transform: translateY(-50%);
      width: 2.75rem;
      height: 2.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      border: none;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.45);
      cursor: pointer;
      @include tablet {
        display: none;
      }
      .galleryPrevArrow {
        display: block;
        width: 0.65rem;
        height: 0.65rem;
        border-left: 2px solid $text-white;
        border-bottom: 2px solid $text-white;
        transform: rotate(45deg);
        margin-left: 0.2rem;
      }
    }
    .galleryInner {
      display: grid;
      grid-template-columns: 1.45fr 1fr;
      gap: 0;
      align-items: stretch;
      border-radius: 1rem;
      overflow: hidden;
      background: #111;
      @include tablet {
        grid-template-columns: 1fr;
      }
      .galleryMain {
        min-height: 16.5rem;
        height: 100%;
        background: #111;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          min-height: 16.5rem;
        }
        @include tablet {
          min-height: 11rem;
          img {
            min-height: 11rem;
          }
        }
      }
      .galleryGrid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        gap: 0;
        min-height: 16.5rem;
        @include tablet {
          display: none;
        }
        .galleryThumb {
          position: relative;
          min-height: 0;
          background: #111;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }
          .galleryAllOverlay {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.55);
            font-size: 1rem;
            font-weight: 400;
            color: $text-white;
            letter-spacing: -0.02em;
          }
        }
      }
    }
  }
  .form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    .formGrid {
      display: grid;
      grid-template-columns: 1.4fr 1fr;
      gap: 1.5rem;
      align-items: stretch;
      overflow: visible;
      @include tablet {
        grid-template-columns: 1fr;
      }
      .formLeft {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        min-width: 0;
        overflow: visible;
      }
      .fieldRow {
        display: grid;
        grid-template-columns: 1fr 1fr;
        border: 1px solid rgba(255, 255, 255, 0.28);
        border-radius: 0.5rem;
        background: transparent;
        box-sizing: border-box;
        @include tablet {
          grid-template-columns: 1fr;
        }
        &.fieldRowAccent {
          border-color: $text-accent;
          .fieldLabel {
            color: $text-accent;
          }
          .fieldCell:not(:first-child) {
            border-left-color: $text-accent;
            @include tablet {
              border-left: none;
              border-top-color: $text-accent;
            }
          }
        }
        &.fieldRowHasError {
          .fieldCell.fieldCellError:not(:first-child),
          .fieldCellError + .fieldCell {
            border-left-color: $main-red;
            @include tablet {
              border-top-color: $main-red;
            }
          }
        }
        .fieldCell {
          position: relative;
          min-width: 0;
          padding: 0.9rem 1rem 0.75rem;
          box-sizing: border-box;
          &.fieldCellError {
            z-index: 1;
            .fieldLabel {
              color: $main-red;
              background: $bg-brown;
              z-index: 2;
            }
            &::after {
              content: "";
              position: absolute;
              inset: -1px;
              z-index: 0;
              border: 1px solid $main-red;
              pointer-events: none;
              box-sizing: border-box;
            }
            &:first-child::after {
              border-radius: 0.5rem 0 0 0.5rem;
              @include tablet {
                border-radius: 0.5rem 0.5rem 0 0;
              }
            }
            &:last-child::after {
              border-radius: 0 0.5rem 0.5rem 0;
              @include tablet {
                border-radius: 0 0 0.5rem 0.5rem;
              }
            }
          }
          &:not(:first-child) {
            border-left: 1px solid rgba(255, 255, 255, 0.28);
            @include tablet {
              border-left: none;
              border-top: 1px solid rgba(255, 255, 255, 0.28);
            }
          }
          .fieldLabel {
            position: absolute;
            top: 0;
            left: 0.85rem;
            z-index: 2;
            transform: translateY(-50%);
            padding: 0 0.35rem;
            background: $bg-brown;
            font-size: 0.75rem;
            line-height: 1.2;
            font-weight: 300;
            color: rgba(255, 255, 255, 0.55);
          }
          .fieldValue {
            display: flex;
            align-items: center;
            gap: 0.65rem;
            min-width: 0;
            min-height: 1.75rem;
            font-size: 1rem;
            font-weight: 400;
            color: $text-white;
            .fieldIcon {
              width: 1rem;
              height: 1rem;
              flex-shrink: 0;
              opacity: 0.9;
            }
            span {
              min-width: 0;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
          .fieldInput {
            width: 100%;
            min-width: 0;
            min-height: 1.75rem;
            padding: 0;
            border: none;
            background: transparent;
            color: $text-white;
            font-size: 1rem;
            font-family: inherit;
            outline: none;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            &::placeholder {
              color: rgba(255, 255, 255, 0.4);
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
          .stepper {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.5rem;
            min-height: 1.75rem;
            .stepperBtn {
              width: 1.75rem;
              height: 1.75rem;
              display: flex;
              align-items: center;
              justify-content: center;
              border: none;
              background: transparent;
              color: $text-white;
              font-size: 1.35rem;
              line-height: 1;
              cursor: pointer;
              padding: 0;
              &:disabled {
                opacity: 0.35;
                cursor: default;
              }
            }
            .stepperValue {
              flex: 1;
              text-align: center;
              font-size: 1rem;
              color: $text-white;
            }
            .stepperValueBtn {
              flex: 1;
              min-width: 0;
              padding: 0;
              border: none;
              background: transparent;
              color: $text-white;
              font-size: 1rem;
              font-family: inherit;
              line-height: 1;
              cursor: pointer;
              text-align: center;
            }
          }
        }
        &.guestsFieldRow {
          position: relative;
          overflow: visible;
          z-index: 3;
        }
        &.guestsFieldRowOpen {
          z-index: 5;
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
            background: rgba(255, 255, 255, 0.18);
          }
        }
      }
      .fieldBox {
        position: relative;
        min-width: 0;
        border: 1px solid rgba(255, 255, 255, 0.28);
        border-radius: 0.5rem;
        padding: 0.9rem 1rem 0.75rem;
        background: transparent;
        box-sizing: border-box;
        .fieldLabel {
          position: absolute;
          top: 0;
          left: 0.85rem;
          z-index: 2;
          transform: translateY(-50%);
          padding: 0 0.35rem;
          background: $bg-brown;
          font-size: 0.75rem;
          line-height: 1.2;
          font-weight: 300;
          color: rgba(255, 255, 255, 0.55);
        }
        &.commentBox {
          display: flex;
          flex-direction: column;
          min-height: 100%;
          @include tablet {
            min-height: 8rem;
          }
          .commentInput {
            flex: 1;
            width: 100%;
            min-height: 8rem;
            padding: 0;
            border: none;
            resize: none;
            background: transparent;
            color: $text-white;
            font-size: 1rem;
            font-family: inherit;
            outline: none;
            &::placeholder {
              color: rgba(255, 255, 255, 0.4);
            }
          }
        }
      }
      .consentBlock {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        align-self: end;
        @include tablet {
          order: 1;
        }
        .consentLabel {
          display: flex;
          align-items: flex-start;
          gap: 0.65rem;
          cursor: pointer;
          .consentInput {
            position: absolute;
            opacity: 0;
            pointer-events: none;
            &:checked + .consentCheckbox {
              background: #004f68;
              border-color: #004f68;
              .consentCheckmark {
                display: flex;
              }
            }
          }
          .consentCheckbox {
            position: relative;
            width: 1.5rem;
            height: 1.5rem;
            margin-top: 0.1rem;
            flex-shrink: 0;
            border: 1px solid rgba(255, 255, 255, 0.35);
            border-radius: 0.2rem;
            background: transparent;
            box-sizing: border-box;
            .consentCheckmark {
              position: absolute;
              inset: 0;
              display: none;
              align-items: center;
              justify-content: center;
              &::before {
                content: "";
                width: 0.28rem;
                height: 0.55rem;
                margin-top: -0.1rem;
                border: solid $text-white;
                border-width: 0 2px 2px 0;
                transform: rotate(45deg);
              }
            }
          }
          .consentText {
            font-size: 0.75rem;
            line-height: 1.4;
            color: rgba(255, 255, 255, 0.45);
            .consentLink {
              color: inherit;
              text-decoration: underline;
              text-underline-offset: 0.12em;
            }
          }
        }
        &.consentBlockError {
          .consentCheckbox {
            border-color: $main-red;
          }
        }
      }
      .cta {
        display: grid;
        grid-template-columns: 1fr 1fr;
        width: 100%;
        min-width: 0;
        height: 3rem;
        border-radius: 0.5rem;
        overflow: hidden;
        align-self: start;
        @include tablet {
          order: 2;
        }
        .ctaPrice {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          min-width: 0;
          height: 100%;
          padding: 0 0.75rem;
          background: $bg-white;
          box-sizing: border-box;
          .ctaPriceOld {
            font-size: 0.8125rem;
            font-weight: 400;
            color: $green-accent;
            opacity: 0.55;
            text-decoration: line-through;
            line-height: 1;
            white-space: nowrap;
          }
          .ctaPriceCurrent {
            font-size: 1rem;
            font-weight: 600;
            color: $green-accent;
            line-height: 1;
            white-space: nowrap;
          }
        }
        .ctaBtn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          min-width: 0;
          height: 100%;
          padding: 0 0.75rem;
          border: none;
          background: $green-accent;
          color: $text-white;
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
          .ctaBtnSpinner {
            width: 1.25rem;
            height: 1.25rem;
            flex-shrink: 0;
            border: 2px solid rgba(255, 255, 255, 0.25);
            border-top-color: $text-white;
            border-radius: 50%;
            box-sizing: border-box;
            animation: bookingSpin 0.7s linear infinite;
          }
        }
      }
    }
  }
}
@keyframes bookingSpin {
  to {
    transform: rotate(360deg);
  }
}
:global(.booking-modal-enter-active),
:global(.booking-modal-leave-active) {
  transition: opacity 0.25s ease;
  @include tablet {
    transition: transform 0.35s ease;
  }
}
:global(.booking-modal-enter-from),
:global(.booking-modal-leave-to) {
  opacity: 0;
  @include tablet {
    opacity: 1;
    transform: translateY(100%);
  }
}
:global(.dropdown-enter-active),
:global(.dropdown-leave-active) {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}
:global(.dropdown-enter-from),
:global(.dropdown-leave-to) {
  opacity: 0;
  transform: translateY(-0.25rem);
}
</style>
