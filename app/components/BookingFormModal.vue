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
            <div :class="$style.headerContent">
              <span :class="$style.villaLabel">Вилла</span>
              <h1 :class="$style.villaName">{{ villaTitle }}</h1>
              <p v-if="villaAddress" :class="$style.villaAddress">
                {{ villaAddress }}
              </p>
            </div>
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

          <form
            ref="formRef"
            :class="$style.form"
            @submit.prevent="onSubmit"
            @focusin="onFormFocusin"
          >
            <div :class="$style.labeledRow">
              <div :class="$style.labeledCell">
                <span :class="$style.cellLabel">Дата заезда</span>
                <div :class="$style.staticField">
                  <img
                    :src="calendarIconUrl"
                    alt=""
                    :class="[$style.fieldIcon, $style.fieldIconCalendar]"
                    aria-hidden="true"
                  />
                  <span :class="$style.staticFieldValue">{{
                    checkInFormatted
                  }}</span>
                </div>
              </div>
              <div :class="$style.labeledCell">
                <span :class="$style.cellLabel">Дата выезда</span>
                <div :class="$style.staticField">
                  <img
                    :src="calendarIconUrl"
                    alt=""
                    :class="[$style.fieldIcon, $style.fieldIconCalendar]"
                    aria-hidden="true"
                  />
                  <span :class="$style.staticFieldValue">{{
                    checkOutFormatted
                  }}</span>
                </div>
              </div>
            </div>

            <div :class="$style.labeledRow">
              <div :class="$style.labeledCell">
                <span :class="$style.cellLabel">Время заезда</span>
                <div :class="[$style.staticField, $style.staticFieldDisabled]">
                  <img
                    :src="clockIconUrl"
                    alt=""
                    :class="[$style.fieldIcon, $style.fieldIconClock]"
                    aria-hidden="true"
                  />
                  <span :class="$style.staticFieldValue">15:00</span>
                </div>
              </div>
              <div :class="$style.labeledCell">
                <span :class="$style.cellLabel">Время выезда</span>
                <div :class="[$style.staticField, $style.staticFieldDisabled]">
                  <img
                    :src="clockIconUrl"
                    alt=""
                    :class="[$style.fieldIcon, $style.fieldIconClock]"
                    aria-hidden="true"
                  />
                  <span :class="$style.staticFieldValue">12:00</span>
                </div>
              </div>
            </div>

            <div :class="$style.fieldRowBlock">
              <div :class="$style.inputRow">
                <input
                  v-model="firstName"
                  type="text"
                  :class="[$style.rowInput, $style.rowInputHalf]"
                  placeholder="Введите имя"
                  autocomplete="given-name"
                  @input="onFirstNameInput"
                />
                <input
                  v-model="lastName"
                  type="text"
                  :class="[$style.rowInput, $style.rowInputHalf]"
                  placeholder="Введите фамилию"
                  autocomplete="family-name"
                  @input="onLastNameInput"
                />
              </div>
              <div :class="$style.inputErrorsRow">
                <div :class="$style.inputErrorCell">
                  <Transition name="field-error">
                    <p
                      v-if="firstNameErrorText"
                      :key="firstNameErrorText"
                      :class="$style.fieldError"
                    >
                      {{ firstNameErrorText }}
                    </p>
                  </Transition>
                </div>
                <div :class="$style.inputErrorCell">
                  <Transition name="field-error">
                    <p
                      v-if="lastNameErrorText"
                      :key="lastNameErrorText"
                      :class="$style.fieldError"
                    >
                      {{ lastNameErrorText }}
                    </p>
                  </Transition>
                </div>
              </div>
            </div>

            <div :class="$style.fieldRowBlock">
              <div :class="$style.inputRow">
                <input
                  v-model="phone"
                  type="tel"
                  :class="[$style.rowInput, $style.rowInputHalf]"
                  placeholder="Телефон"
                  autocomplete="tel"
                  @input="onPhoneInput"
                  @blur="validatePhoneField"
                />
                <input
                  v-model="email"
                  type="email"
                  :class="[$style.rowInput, $style.rowInputHalf]"
                  placeholder="E-mail (опционально)"
                  autocomplete="email"
                  @input="onEmailInput"
                  @blur="validateEmailField"
                />
              </div>
              <div :class="$style.inputErrorsRowBare">
                <div :class="$style.inputErrorBareCell">
                  <Transition name="field-error">
                    <p
                      v-if="phoneErrorText"
                      :key="phoneErrorText"
                      :class="$style.fieldError"
                    >
                      {{ phoneErrorText }}
                    </p>
                  </Transition>
                </div>
                <div :class="$style.inputErrorBareCell">
                  <Transition name="field-error">
                    <p
                      v-if="emailErrorText"
                      :key="emailErrorText"
                      :class="$style.fieldError"
                    >
                      {{ emailErrorText }}
                    </p>
                  </Transition>
                </div>
              </div>
            </div>

            <div :class="$style.textareaWrap">
              <textarea
                v-model="wishes"
                :class="$style.textarea"
                placeholder="Ваши пожелания (опционально)"
                rows="3"
              />
            </div>

            <div :class="$style.consentRow">
              <input
                id="booking-form-consent"
                v-model="consent"
                type="checkbox"
                :class="$style.consentInput"
                @change="clearFieldError('consent')"
              />
              <label for="booking-form-consent" :class="$style.consentLabel">
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
            <div :class="$style.consentErrorWrap">
              <Transition name="field-error">
                <p
                  v-if="consentErrorText"
                  :key="consentErrorText"
                  :class="$style.fieldError"
                >
                  {{ consentErrorText }}
                </p>
              </Transition>
            </div>

            <button
              type="submit"
              :class="$style.submitBtn"
              :disabled="submitDisabled"
            >
              <span
                v-if="submitting"
                :class="$style.submitBtnSpinner"
                aria-hidden="true"
              />
              <span>{{ submitting ? "Отправка…" : "Забронировать" }}</span>
            </button>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
import axios from "axios";
import calendarIconUrl from "@app/assets/img/modals/calendar.svg";
import clockIconUrl from "@app/assets/img/modals/clock.svg";

const BOOKING_CONFIRM_URL =
  "https://realtycalendar.ru/v2/widget/NVGNpGgXO7/confirm";
const BOOKING_REDIRECT_URL = "https://homereserve.ru/HE3NXyOLk4/status";
const DEFAULT_ADDRESS = "г. Тольятти, СНТ Волгарь 18А/3 р-н Центральный";

function sanitizePersonName(value) {
  return (value || "").replace(/[^\p{L}\s\-'’]/gu, "");
}

function isValidPersonName(value) {
  const t = (value || "").trim();
  if (t.length < 2) return false;
  return /^[\p{L}]+(?:[\s\-'’]+[\p{L}]+)*$/u.test(t);
}

function sanitizePhoneInput(value) {
  return (value || "").replace(/[^\d+()\s\-]/g, "");
}

function digitsOnly(value) {
  return (value || "").replace(/\D/g, "");
}

/**
 * Российский мобильный: 10 цифр, начинается с 9;
 * или 11 цифр с 7/8 и второй цифрой 9 (7 9XX … / 8 9XX …).
 */
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

/**
 * Проверка e-mail: непустая локальная часть, домен с точкой, зона ≥2 букв.
 */
function isValidEmailFormat(email) {
  const t = (email || "").trim();
  if (!t) return true;
  if (t.length > 254 || /\s/.test(t)) return false;
  if ((t.match(/@/g) || []).length !== 1) return false;
  const [local, domain] = t.split("@");
  if (!local || !domain || local.length > 64) return false;
  if (local.startsWith(".") || local.endsWith(".") || local.includes(".."))
    return false;
  if (!domain.includes(".") || domain.startsWith(".") || domain.endsWith("."))
    return false;
  const tld = domain.slice(domain.lastIndexOf(".") + 1);
  if (tld.length < 2 || !/^[a-zA-Z]+$/i.test(tld)) return false;
  return (
    /^[a-zA-Z0-9._%+\-]+$/.test(local) &&
    /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/i.test(
      domain
    )
  );
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
      clockIconUrl,
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      wishes: "",
      consent: false,
      submitting: false,
      apiErrors: {},
      clientErrors: {
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
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
    villaAddress() {
      return this.apartment?.address ?? DEFAULT_ADDRESS;
    },
    checkInFormatted() {
      return this.formatDateDisplay(this.formData?.checkInDate);
    },
    checkOutFormatted() {
      return this.formatDateDisplay(this.formData?.checkOutDate);
    },
    submitDisabled() {
      return (
        this.submitting ||
        !this.apartment?.id ||
        !this.formData?.checkInDate ||
        !this.formData?.checkOutDate
      );
    },
    firstNameErrorText() {
      return (
        this.clientErrors.first_name || this.apiErrorLine("first_name") || ""
      );
    },
    lastNameErrorText() {
      return (
        this.clientErrors.last_name || this.apiErrorLine("last_name") || ""
      );
    },
    phoneErrorText() {
      return this.clientErrors.phone || this.apiErrorLine("phone") || "";
    },
    emailErrorText() {
      return this.clientErrors.email || this.apiErrorLine("email") || "";
    },
    consentErrorText() {
      return this.clientErrors.consent || "";
    },
  },
  watch: {
    open(isOpen) {
      if (isOpen && this.formData) {
        const prefill = this.$store.state.bookingModalPrefill;
        this.firstName = sanitizePersonName(prefill?.name ?? "");
        this.lastName = "";
        this.phone = sanitizePhoneInput(prefill?.phone ?? "");
        this.email = "";
        this.wishes = "";
        this.consent = false;
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
        last_name: "",
        phone: "",
        email: "",
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
    onLastNameInput(e) {
      this.lastName = sanitizePersonName(e.target.value);
      this.clearFieldError("last_name");
    },
    onPhoneInput(e) {
      this.phone = sanitizePhoneInput(e.target.value);
      this.clearFieldError("phone");
    },
    onEmailInput(e) {
      this.email = e.target.value;
      this.clearFieldError("email");
    },
    validatePhoneField() {
      const d = digitsOnly(this.phone);
      if (!d) {
        this.clearFieldError("phone");
        return;
      }
      if (!isValidRuPhoneDigits(d)) {
        this.clientErrors.phone =
          "Введите номер в формате 9XXXXXXXXX или +7/8 9XXXXXXXXX";
      } else {
        this.clearFieldError("phone");
      }
    },
    validateEmailField() {
      const t = (this.email || "").trim();
      if (!t) {
        this.clearFieldError("email");
        return;
      }
      if (!isValidEmailFormat(t)) {
        this.clientErrors.email = "Введите корректный e-mail";
      } else {
        this.clearFieldError("email");
      }
    },
    async onSubmit() {
      this.resetClientErrors();
      this.apiErrors = {};
      const apt = this.apartment;
      if (!apt?.id) return;

      const firstName = (this.firstName || "").trim();
      const lastName = (this.lastName || "").trim();
      const phoneDigits = digitsOnly(this.phone);
      const emailTrim = (this.email || "").trim();
      let invalid = false;

      if (!firstName) {
        this.clientErrors.first_name = "Введите имя";
        invalid = true;
      } else if (!isValidPersonName(firstName)) {
        this.clientErrors.first_name =
          "Только буквы, без цифр и символов (минимум 2 символа)";
        invalid = true;
      }
      if (!lastName) {
        this.clientErrors.last_name = "Введите фамилию";
        invalid = true;
      } else if (!isValidPersonName(lastName)) {
        this.clientErrors.last_name =
          "Только буквы, без цифр и символов (минимум 2 символа)";
        invalid = true;
      }
      if (!phoneDigits) {
        this.clientErrors.phone = "Введите телефон";
        invalid = true;
      } else if (!isValidRuPhoneDigits(phoneDigits)) {
        this.clientErrors.phone =
          "Введите номер в формате 9XXXXXXXXX или +7/8 9XXXXXXXXX";
        invalid = true;
      }
      if (!isValidEmailFormat(emailTrim)) {
        this.clientErrors.email =
          "Некорректный адрес: проверьте формат name@домен.зона";
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
        last_name: lastName,
        guests: this.formData.guests ?? { adults: 1, children: [] },
        phone: normalizePhoneForApi(phoneDigits),
        email: emailTrim,
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
@use "@app/assets/scss/colors.scss" as *;
@use "@app/assets/scss/mixins.scss" as *;

.overlay {
  position: fixed;
  inset: 0;
  width: 100%;
  max-width: 100vw;
  height: 100%;
  max-height: 100vh;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.75rem;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  overflow-x: hidden;
  overflow-y: hidden;
  box-sizing: border-box;
}

.panel {
  width: 100%;
  max-width: 46rem;
  max-height: calc(100vh - 3.5rem);
  margin: auto;
  padding: 2.5rem;
  background: $text-primary;
  border-radius: 1.75rem;
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.42);
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: hidden;
  min-width: 0;
  box-sizing: border-box;
}

.header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 1.45rem;
  flex-shrink: 0;
}

.headerContent {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: flex-end;
  gap: 0.9rem;
  padding-top: 0.1rem;
  @include mobile {
    flex-wrap: wrap;
    gap: 0.35rem 0.75rem;
  }
}

.villaLabel {
  display: block;
  padding-bottom: 0.55rem;
  font-size: 0.96rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.78);
  white-space: nowrap;
}

.villaName {
  margin: 0;
  font-size: clamp(3rem, 6vw, 4.35rem);
  font-weight: 500;
  color: $text-white;
  line-height: 0.88;
  letter-spacing: -0.055em;
  overflow-wrap: break-word;
  word-break: break-word;
}

.villaAddress {
  margin: 0;
  padding-bottom: 0.5rem;
  font-size: 0.92rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.2;
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
  border: none;
  border-radius: 0.5rem;
  background: $text-primary;
  color: $text-white;
  cursor: pointer;
  box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.2);
  transition:
    background 0.2s,
    transform 0.2s;

  &:hover {
    background: #1f1f1f;
  }

  &:active {
    transform: scale(0.96);
  }

  @include mobile {
    width: 2.75rem;
    height: 2.75rem;
  }
}

.closeLine {
  position: absolute;
  width: 1.15rem;
  height: 1px;
  background: currentColor;
  border-radius: 1px;
  &:first-child {
    transform: rotate(45deg);
  }
  &:last-child {
    transform: rotate(-45deg);
  }
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.05rem;
  min-height: 0;
  min-width: 0;
  padding-top: 0.55rem;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
  @include mobile {
    padding: 1.5rem 0.5rem;
    padding-top: 1.5rem;
    flex: 1 1 0;
  }
}

.labeledRow,
.inputRow,
.textareaWrap {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 0.8rem;
  background: rgba(255, 255, 255, 0.015);
}

.fieldRowBlock {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.labeledRow,
.inputRow {
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: visible;
  @include mobile {
    grid-template-columns: 1fr;
  }
}

.inputErrorsRow {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  min-width: 0;
  @include mobile {
    grid-template-columns: 1fr;
  }
}

.inputErrorCell {
  min-width: 0;
  padding: 0 1.15rem;
  overflow: hidden;
}

/* Телефон / почта: ошибки в сетке без обёрток-ячеек — без вертикальных линий */
.inputErrorsRowBare {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  min-width: 0;
  padding: 0;
  box-sizing: border-box;
  gap: 0;
  column-gap: 0;
  overflow: hidden;
  @include mobile {
    grid-template-columns: 1fr;
  }
}

.inputErrorBareCell {
  min-width: 0;
  padding: 0 1.15rem;
  box-sizing: border-box;
  overflow: hidden;
}

.inputErrorsRowBare .fieldError {
  min-width: 0;
}

.labeledCell {
  position: relative;
  min-width: 0;
  overflow: visible;
  padding: 0.375rem 0.875rem;
  &:not(:first-child) {
    border-left: 1px solid rgba(255, 255, 255, 0.22);
  }
  @include mobile {
    &:not(:first-child) {
      border-left: none;
      border-top: 1px solid rgba(255, 255, 255, 0.22);
    }
  }
}

.cellLabel {
  position: absolute;
  top: 0;
  left: 1.05rem;
  transform: translateY(-50%);
  padding: 0 0.28rem;
  background: $text-primary;
  font-size: 0.74rem;
  line-height: 1.25;
  color: rgba(123, 95, 63, 0.98);
}

.staticField {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-height: 2.35rem;
  color: $text-white;
  font-size: 0.97rem;
  font-weight: 500;
}

.staticFieldDisabled {
  color: rgba(255, 255, 255, 0.92);
}

.staticFieldValue {
  display: block;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: -0.01em;
}

.fieldIcon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  opacity: 0.78;
  display: block;
}

.fieldIconCalendar {
  object-fit: contain;
}

.fieldIconClock {
  object-fit: contain;
}

.rowInput {
  min-width: 0;
  min-height: 3rem;
  padding: 0 1.15rem;
  background: transparent;
  border: none;
  color: $text-white;
  font-size: 0.875rem;
  font-family: inherit;
  outline: none;
  &::placeholder {
    color: rgba(255, 255, 255, 0.42);
  }
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-text-fill-color: $text-white;
    caret-color: $text-white;
    -webkit-box-shadow: 0 0 0 1000px rgba(255, 255, 255, 0.015) inset;
    box-shadow: 0 0 0 1000px rgba(255, 255, 255, 0.015) inset;
    -webkit-background-clip: padding-box;
    background-clip: padding-box;
    transition: background-color 9999s ease-out 0s;
  }
}

.rowInputHalf {
  &:not(:first-child) {
    border-left: 1px solid rgba(255, 255, 255, 0.22);
  }
  @include mobile {
    &:not(:first-child) {
      border-left: none;
      border-top: 1px solid rgba(255, 255, 255, 0.22);
    }
  }
}

.fieldError {
  margin: 0;
  font-size: 0.75rem;
  color: $main-red;
  line-height: 1.3;
}

.consentErrorWrap {
  overflow: hidden;
  padding: 0 1.15rem;
  box-sizing: border-box;
}

.textarea {
  width: 100%;
  min-height: 9rem;
  padding: 1rem 1.15rem;
  background: transparent;
  border: none;
  resize: none;
  color: $text-white;
  font-size: 0.98rem;
  font-family: inherit;
  outline: none;
  &::placeholder {
    color: rgba(255, 255, 255, 0.42);
  }
}

.consentRow {
  display: block;
  margin-top: -0.1rem;
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
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.18;
  cursor: pointer;
  min-width: 0;
}

.consentCheckbox {
  position: relative;
  width: 1rem;
  height: 1rem;
  margin-top: 0.08rem;
  flex-shrink: 0;
  border: 1px solid rgba(123, 95, 63, 0.95);
  border-radius: 0.18rem;
  background: rgba(255, 255, 255, 0.02);
  transition:
    border-color 0.2s,
    background 0.2s,
    box-shadow 0.2s;
}

.consentCheckmark {
  position: absolute;
  left: 0.36rem;
  top: 0.16rem;
  width: 0.26rem;
  height: 0.5rem;
  border-right: 1px solid $text-white;
  border-bottom: 1px solid $text-white;
  opacity: 0;
  transform: rotate(45deg) scale(0.85);
  transform-origin: center;
  transition:
    opacity 0.15s,
    transform 0.15s;
}

.consentText {
  flex: 1;
  min-width: 0;
  overflow-wrap: break-word;
  word-break: break-word;
}

.consentInput:checked + .consentLabel .consentCheckbox {
  background: #7b5f3f;
  border-color: #7b5f3f;
}

.consentInput:checked + .consentLabel .consentCheckmark {
  opacity: 1;
  transform: rotate(45deg) scale(1);
}

.consentInput:focus-visible + .consentLabel .consentCheckbox {
  box-shadow: 0 0 0 0.18rem rgba(123, 95, 63, 0.26);
}

.consentLink {
  color: rgba(255, 255, 255, 0.52);
  text-decoration: underline;
  &:hover {
    color: rgba(255, 255, 255, 0.78);
  }
}

.submitBtn {
  width: 100%;
  min-height: 3rem;
  padding: 0.95rem 1rem;
  background: rgba(255, 255, 255, 0.17);
  border: none;
  border-radius: 0.8rem;
  color: $text-white;
  font-size: 1.05rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.22);
  }
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.submitBtnSpinner {
  width: 1.25rem;
  height: 1.25rem;
  min-width: 1.25rem;
  min-height: 1.25rem;
  flex-shrink: 0;
  border: 2px solid rgba(255, 255, 255, 0.25);
  border-top-color: $text-white;
  border-radius: 50%;
  box-sizing: border-box;
  animation: submitBtnSpin 0.8s linear infinite;
}

@keyframes submitBtnSpin {
  to {
    transform: rotate(360deg);
  }
}

:global(.field-error-enter-active),
:global(.field-error-leave-active) {
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}

:global(.field-error-enter-from),
:global(.field-error-leave-to) {
  opacity: 0;
  transform: translateY(-0.35rem);
}

:global(.field-error-enter-to),
:global(.field-error-leave-from) {
  opacity: 1;
  transform: translateY(0);
}

@include tablet {
  .panel {
    max-width: 56rem;
  }

  .headerContent {
    flex-wrap: wrap;
  }
}

@include mobile {
  .overlay {
    padding: 0;
    align-items: stretch;
    justify-content: stretch;
  }

  .panel {
    width: 100%;
    max-width: 100%;
    height: 100vh;
    max-height: 100vh;
    margin: 0;
    padding: 1.25rem 1rem 1rem;
    padding-top: max(1.25rem, env(safe-area-inset-top));
    padding-left: max(1rem, env(safe-area-inset-left));
    padding-right: max(1rem, env(safe-area-inset-right));
    padding-bottom: max(1rem, env(safe-area-inset-bottom));
    border-radius: 0;
    box-shadow: none;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    overflow-y: hidden;
    min-width: 0;
  }

  .header {
    flex-shrink: 0;
    gap: 0.75rem;
    margin-bottom: 1rem;
    min-width: 0;
  }

  .headerContent {
    min-width: 0;
  }

  .form {
    flex: 1 1 0;
    min-height: 0;
    min-width: 0;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  .villaLabel,
  .villaAddress {
    padding-bottom: 0;
  }

  .villaName {
    font-size: 2.2rem;
    text-wrap: wrap;
  }

  .villaLabel {
    white-space: normal;
  }

  .labeledRow,
  .inputRow,
  .textareaWrap,
  .consentRow,
  .fieldRowBlock {
    min-width: 0;
  }

  .rowInput {
    min-height: 3.4rem;
  }

  .textarea {
    min-height: 7.5rem;
  }

  .submitBtn {
    min-height: 3.4rem;
  }
}
</style>
