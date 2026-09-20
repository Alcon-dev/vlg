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
                        firstNameHasError || phoneHasError,
                    },
                  ]"
                >
                  <div
                    :class="[
                      $style.fieldCell,
                      { [$style.fieldCellError]: firstNameHasError },
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
                      { [$style.fieldCellError]: phoneHasError },
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
                      @blur="validatePhoneField"
                    />
                  </div>
                </div>

                <div :class="$style.fieldRow">
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
                        :disabled="childrenCount <= 0"
                        @click="changeChildren(-1)"
                      >
                        −
                      </button>
                      <span :class="$style.stepperValue">{{
                        childrenCount
                      }}</span>
                      <button
                        type="button"
                        :class="$style.stepperBtn"
                        aria-label="Больше детей"
                        :disabled="!canAddGuest"
                        @click="changeChildren(1)"
                      >
                        +
                      </button>
                    </div>
                  </div>
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
                  { [$style.consentBlockError]: consentHasError },
                ]"
              >
                <label :class="$style.consentLabel">
                  <input
                    v-model="consent"
                    type="checkbox"
                    :class="$style.consentInput"
                    @change="clearFieldError('consent')"
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
  "https://realtycalendar.ru/v2/widget/NVGNpGgXO7/confirm";
const BOOKING_REDIRECT_URL = "https://homereserve.ru/HE3NXyOLk4/status";

function sanitizePersonName(value) {
  return (value || "").replace(/[^\p{L}\s\-'’]/gu, "");
}

function isValidPersonName(value) {
  const t = (value || "").trim();
  if (t.length < 2) return false;
  return /^[\p{L}]+(?:[\s\-'’]+[\p{L}]+)*$/u.test(t);
}

function digitsOnly(value) {
  return (value || "").replace(/\D/g, "");
}

function formatRuPhone(value) {
  let d = digitsOnly(value);
  if (!d) return "";
  if (d[0] === "8") d = `7${d.slice(1)}`;
  if (d[0] !== "7") d = `7${d}`;
  d = d.slice(0, 11);
  const rest = d.slice(1);
  if (!rest.length) return "+7 ";
  let out = "+7";
  out += ` (${rest.slice(0, 3)}`;
  if (rest.length >= 3) out += ")";
  if (rest.length > 3) out += ` ${rest.slice(3, 6)}`;
  if (rest.length > 6) out += `-${rest.slice(6, 8)}`;
  if (rest.length > 8) out += `-${rest.slice(8, 10)}`;
  return out;
}

function caretPosAfterDigits(formatted, digitCount) {
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

function isValidRuPhoneDigits(d) {
  if (!d || typeof d !== "string") return false;
  if (d.length === 10) return d[0] === "9";
  if (d.length === 11 && (d[0] === "7" || d[0] === "8")) return d[1] === "9";
  return false;
}

function normalizePhoneForApi(d) {
  if (d.length === 10 && d[0] === "9") return `7${d}`;
  if (d.length === 11 && d[0] === "8") return `7${d.slice(1)}`;
  return d;
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
      lastName: "",
      phone: "",
      wishes: "",
      consent: false,
      adults: 1,
      childrenCount: 0,
      submitting: false,
      apiErrors: {},
      clientErrors: {
        first_name: "",
        phone: "",
        consent: "",
      },
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
      const rest = this.galleryPhotos.slice(1, 5);
      while (rest.length < 4 && this.galleryPhotos[0]) {
        rest.push(this.galleryPhotos[0]);
      }
      return rest.slice(0, 4);
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
      return this.adults + this.childrenCount;
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
      else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14))
        word = "гостя";
      return `${n} ${word}`;
    },
    priceFormatted() {
      if (this.formData?.priceFormatted) return this.formData.priceFormatted;
      if (this.formData?.price != null) return formatPrice(this.formData.price);
      const fallback = this.apartment?.price?.common?.without_discount;
      return fallback != null ? formatPrice(fallback) : "";
    },
    basePriceFormatted() {
      if (this.formData?.basePrice != null)
        return formatPrice(this.formData.basePrice);
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
    firstNameHasError() {
      return !!(
        this.clientErrors.first_name || this.apiErrorLine("first_name")
      );
    },
    phoneHasError() {
      return !!(this.clientErrors.phone || this.apiErrorLine("phone"));
    },
    consentHasError() {
      return !!this.clientErrors.consent;
    },
  },
  watch: {
    open(isOpen) {
      if (isOpen && this.formData) {
        const prefill = this.$store.state.bookingModalPrefill;
        this.firstName = sanitizePersonName(prefill?.name ?? "");
        this.lastName = "";
        this.phone = formatRuPhone(prefill?.phone ?? "");
        this.wishes = "";
        this.consent = false;
        this.adults = Math.max(1, this.formData?.guests?.adults ?? 1);
        this.childrenCount = Array.isArray(this.formData?.guests?.children)
          ? this.formData.guests.children.length
          : 0;
        this.apiErrors = {};
        this.resetClientErrors();
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
    if (typeof document !== "undefined") {
      document.removeEventListener("keydown", this.onEscape);
      document.body.style.overflow = this._prevBodyOverflow ?? "";
    }
  },
  methods: {
    onFormFocusin() {
      requestAnimationFrame(() => {
        const el = this.$refs.formRef;
        if (el) el.scrollLeft = 0;
      });
    },
    onEscape(e) {
      if (e.key === "Escape") this.close();
    },
    formatDateDisplay(dateStr) {
      if (!dateStr || typeof dateStr !== "string") return "";
      const [y, m, d] = dateStr.split("-").map(Number);
      if (!m || !d) return dateStr;
      const date = new Date(y, m - 1, d);
      return date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
      });
    },
    close() {
      this.$emit("close");
    },
    resetClientErrors() {
      this.clientErrors = {
        first_name: "",
        phone: "",
        consent: "",
      };
    },
    apiErrorLine(key) {
      const list = this.apiErrors?.[key];
      return Array.isArray(list) && list.length ? list[0] : "";
    },
    clearFieldError(key) {
      this.clientErrors[key] = "";
      if (this.apiErrors[key]) {
        const next = { ...this.apiErrors };
        delete next[key];
        this.apiErrors = next;
      }
    },
    onFirstNameInput(e) {
      this.firstName = sanitizePersonName(e.target.value);
      this.clearFieldError("first_name");
    },
    onPhoneFocus(e) {
      const d = digitsOnly(this.phone);
      if (!d || d === "7") {
        this.phone = "+7 ";
        this.$nextTick(() => {
          const el = e.target;
          const pos = el.value.length;
          el.setSelectionRange(pos, pos);
        });
        return;
      }
      this.phone = formatRuPhone(this.phone);
    },
    setPhoneValue(el, formatted, digitCount) {
      this.phone = formatted;
      this.$nextTick(() => {
        if (!el) return;
        const pos = caretPosAfterDigits(formatted, digitCount);
        el.setSelectionRange(pos, pos);
      });
    },
    onPhoneKeydown(e) {
      const el = e.target;
      const start = el.selectionStart ?? 0;
      const end = el.selectionEnd ?? 0;
      const allowKeys = [
        "Backspace",
        "Delete",
        "Tab",
        "Escape",
        "Enter",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
      ];
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (allowKeys.includes(e.key)) {
        // handled below for Backspace/Delete
      } else if (e.key.length === 1 && !/^\d$/.test(e.key)) {
        e.preventDefault();
        return;
      }

      if (start !== end) return;

      if (e.key === "Backspace") {
        const val = el.value;
        if (start <= 3) {
          e.preventDefault();
          return;
        }
        if (/\D/.test(val[start - 1] || "")) {
          e.preventDefault();
          const count = digitsOnly(val.slice(0, start)).length;
          if (count <= 1) {
            this.setPhoneValue(el, "+7 ", 1);
            return;
          }
          const digits = digitsOnly(val);
          const next = digits.slice(0, count - 1) + digits.slice(count);
          this.setPhoneValue(el, formatRuPhone(next), count - 1);
          this.clearFieldError("phone");
        }
        return;
      }

      if (e.key === "Delete") {
        const val = el.value;
        if (start < val.length && /\D/.test(val[start] || "")) {
          e.preventDefault();
          let i = start;
          while (i < val.length && /\D/.test(val[i])) i += 1;
          if (i >= val.length) return;
          const count = digitsOnly(val.slice(0, i + 1)).length;
          if (count <= 1) return;
          const digits = digitsOnly(val);
          const next = digits.slice(0, count - 1) + digits.slice(count);
          this.setPhoneValue(el, formatRuPhone(next), count - 1);
          this.clearFieldError("phone");
        }
      }
    },
    onPhoneInput(e) {
      const el = e.target;
      const cursor = el.selectionStart ?? el.value.length;
      const digitCount = digitsOnly(el.value.slice(0, cursor)).length;
      let formatted = formatRuPhone(el.value);
      if (!formatted) formatted = "+7 ";
      this.setPhoneValue(el, formatted, Math.max(digitCount, 1));
      this.clearFieldError("phone");
    },
    validatePhoneField() {
      const d = digitsOnly(this.phone);
      if (!d || d === "7") {
        this.phone = "";
        this.clearFieldError("phone");
        return;
      }
      this.phone = formatRuPhone(this.phone);
      if (!isValidRuPhoneDigits(d)) {
        this.clientErrors.phone =
          "Введите номер в формате 9XXXXXXXXX или +7/8 9XXXXXXXXX";
      } else {
        this.clearFieldError("phone");
      }
    },
    changeAdults(delta) {
      const next = this.adults + delta;
      if (next < 1) return;
      if (delta > 0 && !this.canAddGuest) return;
      this.adults = next;
    },
    changeChildren(delta) {
      const next = this.childrenCount + delta;
      if (next < 0) return;
      if (delta > 0 && !this.canAddGuest) return;
      this.childrenCount = next;
    },
    async onSubmit() {
      this.resetClientErrors();
      this.apiErrors = {};
      const apt = this.apartment;
      if (!apt?.id) return;

      const firstName = (this.firstName || "").trim();
      const phoneDigits = digitsOnly(this.phone);
      let invalid = false;

      if (!firstName) {
        this.clientErrors.first_name = "Введите имя";
        invalid = true;
      } else if (!isValidPersonName(firstName)) {
        this.clientErrors.first_name =
          "Только буквы, без цифр и символов (минимум 2 символа)";
        invalid = true;
      }
      if (!phoneDigits || phoneDigits === "7") {
        this.clientErrors.phone = "Введите телефон";
        invalid = true;
      } else if (!isValidRuPhoneDigits(phoneDigits)) {
        this.clientErrors.phone =
          "Введите номер в формате 9XXXXXXXXX или +7/8 9XXXXXXXXX";
        invalid = true;
      }
      if (!this.consent) {
        this.clientErrors.consent =
          "Необходимо согласие на обработку персональных данных";
        invalid = true;
      }
      if (invalid) return;

      const body = {
        apartment_id: String(apt.id),
        begin_date: this.formData.checkInDate,
        end_date: this.formData.checkOutDate,
        first_name: firstName,
        last_name: (this.lastName || "").trim() || firstName,
        guests: {
          adults: this.adults,
          children: Array.from({ length: this.childrenCount }, () => ({
            age: "0",
          })),
        },
        phone: normalizePhoneForApi(phoneDigits),
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
          return;
        }
      } catch (err) {
        console.error("Booking confirm error:", err);
        if (err.response?.status === 422 && err.response?.data?.errors) {
          this.apiErrors = { ...err.response.data.errors };
          return;
        }
        const msg =
          err.response?.data?.message ||
          (err.response?.data?.errors &&
            Object.values(err.response.data.errors).flat().join("\n")) ||
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
}
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
.header {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  margin-bottom: 1.5rem;
  @include tablet {
    margin-bottom: 1.25rem;
  }
}
.headerTop {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
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
.gallery {
  position: relative;
  margin-bottom: 1.5rem;
  @include tablet {
    margin-bottom: 1.25rem;
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
.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.formGrid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 1.5rem;
  align-items: stretch;
  @include tablet {
    grid-template-columns: 1fr;
  }
}
.formLeft {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 0;
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
}
.fieldRowAccent {
  border-color: $text-accent;
  .fieldLabel {
    color: $text-accent;
  }
  .fieldCell + .fieldCell {
    border-left-color: $text-accent;
    @include tablet {
      border-left: none;
      border-top-color: $text-accent;
    }
  }
}
.fieldCell {
  position: relative;
  min-width: 0;
  padding: 0.9rem 1rem 0.75rem;
  box-sizing: border-box;
  & + & {
    border-left: 1px solid rgba(255, 255, 255, 0.28);
    @include tablet {
      border-left: none;
      border-top: 1px solid rgba(255, 255, 255, 0.28);
    }
  }
}
.fieldCellError {
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
.fieldRowHasError {
  .fieldCell + .fieldCell.fieldCellError {
    border-left-color: $main-red;
    @include tablet {
      border-top-color: $main-red;
    }
  }
  .fieldCellError + .fieldCell {
    border-left-color: $main-red;
    @include tablet {
      border-top-color: $main-red;
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
  line-height: 1;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.55);
}
.fieldValue {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  min-height: 1.75rem;
  font-size: 1rem;
  font-weight: 400;
  color: $text-white;
}
.fieldIcon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  opacity: 0.9;
}
.fieldInput {
  width: 100%;
  min-height: 1.75rem;
  padding: 0;
  border: none;
  background: transparent;
  color: $text-white;
  font-size: 1rem;
  font-family: inherit;
  outline: none;
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
}
.stepper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  min-height: 1.75rem;
}
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
.commentBox {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  @include tablet {
    min-height: 8rem;
  }
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
.consentBlock {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  align-self: end;
  @include tablet {
    order: 1;
  }
}
.consentBlockError {
  .consentCheckbox {
    border-color: $main-red;
  }
}
.consentInput {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
.consentLabel {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  cursor: pointer;
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
}
.consentCheckmark {
  position: absolute;
  inset: 0;
  display: none;
  &::before {
    content: "";
    position: absolute;
    left: 0.3rem;
    top: 0.08rem;
    width: 0.28rem;
    height: 0.55rem;
    border: solid $text-white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
}
.consentInput:checked + .consentCheckbox {
  background: #004f68;
  border-color: #004f68;
  .consentCheckmark {
    display: block;
  }
}
.consentText {
  font-size: 0.75rem;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.45);
}
.consentLink {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 0.12em;
}
.cta {
  display: flex;
  align-items: stretch;
  width: 100%;
  min-width: 0;
  border: 1px solid $text-accent;
  border-radius: 0.5rem;
  overflow: hidden;
  align-self: start;
  @include tablet {
    order: 2;
  }
}
.ctaPrice {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.15rem;
  padding: 0.75rem 1.25rem;
  min-width: 8.5rem;
}
.ctaPriceOld {
  font-size: 0.875rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.45);
  text-decoration: line-through;
  line-height: 1.2;
}
.ctaPriceCurrent {
  font-size: 1.25rem;
  font-weight: 600;
  color: $text-white;
  line-height: 1.2;
}
.ctaBtn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 3.75rem;
  min-width: 10rem;
  padding: 0.75rem 1.75rem;
  border: none;
  background: #555555;
  color: $text-white;
  font-size: 1rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.2s;
  &:hover:not(:disabled) {
    background: #636363;
  }
  &:disabled {
    opacity: 0.55;
    cursor: default;
  }
}
.ctaBtnSpinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: $text-white;
  border-radius: 50%;
  animation: bookingSpin 0.7s linear infinite;
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
</style>
