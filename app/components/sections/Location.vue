<template>
  <section id="location" ref="sectionRef" :class="$style.wrapper">
    <div :class="$style.titleContainer">
      <div :class="$style.titleLine1">
        <p :class="$style.title">Резиденция<br />ВОЛГА</p>
        <h2 :class="$style.titleH2">УНИКАЛЬНОЕ</h2>
        <div :class="$style.titleLine1Right">
          <p :class="$style.phone">+7 (927) 767-56-00</p>
          <div :class="$style.titleLine1Desc">
            <p :class="$style.descLine">
              Уединенное место с панорамными видами
            </p>
            <p :class="$style.descLine">
              на волгу и горы в окружении уникальных объектов
            </p>
          </div>
        </div>
      </div>
      <div :class="$style.titleLine2">
        <h2 :class="$style.titleH2">РАСПОЛОЖЕНИЕ</h2>
        <p :class="$style.titleDescMobile">
          Уединенное место с панорамными видами на волгу и горы в окружении
          достопримечательностей и уникальных объектов.
        </p>
        <p :class="$style.address">
          Самарская обл., Тольятти,<br />СНТ Волгарь, 18/3 р-н Центральный
        </p>
      </div>
      <div :class="$style.titleLine3">
        <span :class="$style.contactItem"
          >Самарская обл., Тольятти, СНТ Волгарь, 18/3 р-н Центральный</span
        >
        <a
          :class="$style.contactItem"
          href="tel:+79171274080"
          aria-label="Позвонить"
          >8 (917) 127-40-80</a
        >
        <a
          :class="$style.contactItem"
          href="mailto:volga-dom163@mail.ru"
          aria-label="Написать на почту"
          >volga-dom163@mail.ru</a
        >
      </div>
    </div>
    <div :class="$style.mapAndFormWrap">
      <div :class="$style.mapWrap">
        <ClientOnly>
          <div ref="mapRef" :class="$style.mapContainer" />
          <template #fallback>
            <div :class="$style.mapPlaceholder">Загрузка карты...</div>
          </template>
        </ClientOnly>
        <div v-if="false" :class="$style.bookingForm">
          <div :class="$style.bookingFormHeader">
            <p :class="$style.bookingFormIntroTablet">
              Забронируйте даты вашего отдыха
            </p>
            <img
              :class="$style.bookingFormIcon"
              :src="unionWhiteIconUrl"
              alt=""
              width="64"
              height="20"
            />
          </div>
          <h3 :class="$style.bookingFormTitleTablet">
            ВЫБЕРИТЕ ВИЛЛУ<br /><span :class="$style.bookingFormTitleTabletSub"
              >ДАТУ БРОНИРОВАНИЯ</span
            >
          </h3>
          <NuxtLink
            v-if="locationSelectedApartmentName"
            :class="$style.bookingFormApartmentName"
            to="#reserv"
          >
            <span :class="$style.bookingFormApartmentNameText"
              >Вилла: {{ locationSelectedApartmentName }}</span
            >
            <AppIcon
              name="reservArrowUpRight"
              aria-hidden="true"
              :class="$style.bookingFormApartmentNameArrow"
            />
          </NuxtLink>
          <div :class="$style.locationFormRow">
            <div :class="$style.locationFormGroup">
              <label :class="$style.locationFormLabel">Заселение и выезд</label>
              <div
                ref="locationDateSelectWrapRef"
                :class="[
                  $style.locationDateSelectWrap,
                  locationCalendarOpen && $style.locationDateSelectWrapOpen,
                ]"
              >
                <button
                  ref="locationDateSelectTriggerRef"
                  type="button"
                  :class="[
                    $style.locationFormInput,
                    $style.locationDateSelectTrigger,
                    locationFormErrorField === 'dates' &&
                      $style.locationInputError,
                  ]"
                  @click="locationCalendarOpen = !locationCalendarOpen"
                >
                  <span
                    v-if="locationDateRangeFormatted"
                    :class="$style.locationDateRangeText"
                  >
                    {{ locationDateRangeFormatted }}
                  </span>
                  <span v-else :class="$style.locationPlaceholder"
                    >Выберите даты</span
                  >
                </button>
                <button
                  v-if="locationDateRangeFormatted"
                  type="button"
                  :class="$style.locationDateSelectClearBtn"
                  aria-label="Очистить даты"
                  @click.stop="clearLocationDateRange"
                >
                  ×
                </button>
                <AppIcon
                  v-else
                  name="reservCalendar"
                  alt=""
                  :class="$style.locationFormInputIcon"
                />
                <Transition name="date-dropdown">
                  <div
                    v-show="locationCalendarOpen"
                    :class="$style.locationCalendarDropdown"
                    @mousedown.prevent
                  >
                    <VueDatePicker
                      v-if="locationCalendarOpen"
                      ref="locationDatePickerRef"
                      v-model="locationDateRange"
                      range
                      :inline="true"
                      :dark="true"
                      :locale="ruLocale"
                      :enable-time-picker="false"
                      :hide-navigation="['time']"
                      :disabled-dates="locationIsCalendarDateDisabled"
                      auto-apply
                      :teleport="false"
                      @update:model-value="onLocationDateRangeSelect"
                      @update-month-year="locationOnCalendarMonthYearChange"
                    />
                  </div>
                </Transition>
              </div>
            </div>
            <div :class="$style.locationFormGroup">
              <label :class="$style.locationFormLabel">Количество гостей</label>
              <div
                ref="locationGuestsSelectWrapRef"
                :class="[
                  $style.locationGuestsSelectWrap,
                  locationGuestsOpen && $style.locationGuestsSelectWrapOpen,
                ]"
              >
                <button
                  type="button"
                  :class="[
                    $style.locationFormInput,
                    $style.locationFormInputWithIcon,
                    $style.locationGuestsSelectTrigger,
                  ]"
                  @click="locationGuestsOpen = !locationGuestsOpen"
                  @blur="onLocationGuestsBlur"
                >
                  <span
                    :class="
                      locationTotalGuests
                        ? ''
                        : $style.locationGuestsPlaceholder
                    "
                  >
                    {{
                      locationTotalGuests
                        ? `${locationTotalGuests} ${locationGuestsLabel(
                            locationTotalGuests
                          )}`
                        : `До ${locationMaxGuests} гостей`
                    }}
                  </span>
                </button>
                <AppIcon
                  name="aboutUsers"
                  alt=""
                  :class="[
                    $style.locationFormInputIcon,
                    locationGuestsOpen && $style.locationGuestsSelectIconOpen,
                  ]"
                />
                <Transition name="date-dropdown">
                  <div
                    v-show="locationGuestsOpen"
                    :class="$style.locationGuestsDropdown"
                    @mousedown="onLocationGuestsDropdownMouseDown"
                  >
                    <div :class="$style.locationGuestsDropdownInner">
                      <div :class="$style.locationGuestsRow">
                        <span :class="$style.locationGuestsRowLabel"
                          >Взрослые</span
                        >
                        <div :class="$style.locationGuestsCounter">
                          <button
                            type="button"
                            :class="$style.locationGuestsCounterBtn"
                            :disabled="locationGuestSelection.adults <= 1"
                            @click="
                              locationSetAdults(
                                locationGuestSelection.adults - 1
                              )
                            "
                          >
                            −
                          </button>
                          <span :class="$style.locationGuestsCounterValue">{{
                            locationGuestSelection.adults
                          }}</span>
                          <button
                            type="button"
                            :class="$style.locationGuestsCounterBtn"
                            :disabled="!locationCanAddAdult"
                            @click="
                              locationSetAdults(
                                locationGuestSelection.adults + 1
                              )
                            "
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div
                        v-for="(
                          child, index
                        ) in locationGuestSelection.children"
                        :key="`location-child-${index}`"
                        :class="$style.locationGuestsChildRow"
                      >
                        <span :class="$style.locationGuestsChildLabel">
                          Ребенок
                          <select
                            :class="$style.locationGuestsChildSelect"
                            :value="child.age"
                            @change="
                              locationSetChildAge(index, $event.target.value)
                            "
                          >
                            <option
                              v-for="a in locationChildAges"
                              :key="`location-child-age-${index}-${a}`"
                              :value="a"
                            >
                              {{ a }} лет
                            </option>
                          </select>
                        </span>
                        <button
                          type="button"
                          :class="$style.locationGuestsChildRemove"
                          @click="locationRemoveChild(index)"
                        >
                          ×
                        </button>
                      </div>
                      <button
                        v-if="locationCanAddChild"
                        type="button"
                        :class="$style.locationGuestsAddChild"
                        @click="locationAddChild"
                      >
                        <span :class="$style.locationGuestsAddChildChevron"
                          >+</span
                        >
                        Добавить ребенка
                      </button>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>
          </div>
          <div
            v-if="
              locationNearestDatesItems.length || locationNearestDatesLoading
            "
            :class="$style.locationUpcomingDates"
          >
            <div :class="$style.locationUpcomingDatesNavWrap">
              <template v-if="locationNearestDatesLoading">
                <div :class="$style.locationUpcomingDatesSkeleton">
                  <div
                    v-for="n in 3"
                    :key="`location-date-skeleton-${n}`"
                    :class="$style.locationUpcomingDatesSkeletonCard"
                  />
                </div>
              </template>
              <template v-else>
                <button
                  v-if="locationCanScrollNearestLeft"
                  type="button"
                  :class="[
                    $style.locationUpcomingDatesNavBtn,
                    $style.locationUpcomingDatesNavBtnPrev,
                  ]"
                  @click="scrollLocationNearestDates(-1)"
                >
                  <span>‹</span>
                </button>
                <div
                  ref="locationNearestDatesScrollRef"
                  :class="$style.locationUpcomingDatesScroll"
                  @scroll="updateLocationNearestNav"
                >
                  <div :class="$style.locationUpcomingDatesScrollInner">
                    <button
                      v-for="(item, index) in locationNearestDatesItems"
                      :key="`location-date-${item.date}-${index}`"
                      type="button"
                      :class="[
                        $style.locationDateCard,
                        !item.available && $style.locationDateCardUnavailable,
                        selectedNearestDateIndex === index &&
                          $style.locationDateCardSelected,
                      ]"
                      @click="onLocationNearestDateClick(item, index)"
                    >
                      <span :class="$style.locationDateCardPrice">
                        {{ item.priceText }}
                        <span
                          v-if="item.discountText"
                          :class="$style.locationDateCardDiscount"
                        >
                          {{ item.discountText }}
                        </span>
                      </span>
                      <span :class="$style.locationDateCardDates">
                        {{ item.dateText }}
                      </span>
                    </button>
                  </div>
                </div>
                <button
                  v-if="locationCanScrollNearestRight"
                  type="button"
                  :class="[
                    $style.locationUpcomingDatesNavBtn,
                    $style.locationUpcomingDatesNavBtnNext,
                  ]"
                  @click="scrollLocationNearestDates(1)"
                >
                  <span>›</span>
                </button>
              </template>
            </div>
          </div>
          <form
            :class="$style.bookingFormFieldsTablet"
            @submit.prevent="onLocationTabletFormSubmit"
          >
            <input
              ref="locationTabletNameRef"
              v-model="bookingName"
              type="text"
              placeholder="Ваше имя"
              :class="[
                $style.locationFormInputUnderline,
                (locationFormErrorField === 'name' || locationApiErrorName) &&
                  $style.locationInputError,
              ]"
              @input="
                locationFormError = '';
                locationFormErrorField = '';
                locationApiErrors = {};
              "
            />
            <p
              v-if="locationApiErrorName"
              :class="$style.locationFormErrorText"
            >
              {{ locationApiErrorName }}
            </p>
            <input
              ref="locationTabletPhoneRef"
              v-model="bookingPhone"
              type="tel"
              placeholder="Ваш телефон"
              :class="[
                $style.locationFormInputUnderline,
                (locationFormErrorField === 'phone' || locationApiErrorPhone) &&
                  $style.locationInputError,
              ]"
              @input="
                locationFormError = '';
                locationFormErrorField = '';
                locationApiErrors = {};
              "
            />
            <p
              v-if="locationApiErrorPhone"
              :class="$style.locationFormErrorText"
            >
              {{ locationApiErrorPhone }}
            </p>
            <p v-if="locationFormError" :class="$style.locationFormErrorText">
              {{ locationFormError }}
            </p>
            <button
              type="submit"
              :class="$style.locationBookButton"
              :disabled="locationBookingSubmitting"
            >
              <span>Забронировать</span>
              <span
                v-if="locationBookingSubmitting"
                :class="$style.locationBookButtonSpinner"
                aria-hidden="true"
              />
              <AppIcon
                v-else
                name="locationArrow"
                aria-hidden="true"
                :class="$style.locationBookButtonIcon"
              />
            </button>
          </form>
        </div>
      </div>
      <div v-if="false" :class="$style.locationContactRowMobile">
        <a
          :class="$style.contactItem"
          href="tel:+79171274080"
          aria-label="Позвонить"
          >8 (917) 127-40-80</a
        >
        <a
          :class="$style.contactItem"
          href="mailto:volga-dom163@mail.ru"
          aria-label="Написать на почту"
          >volga-dom163@mail.ru</a
        >
      </div>
      <div v-if="false" :class="$style.bookingFormTablet">
        <div :class="$style.bookingFormHeader">
          <p :class="$style.bookingFormIntroTablet">
            Забронируйте даты вашего отдыха
          </p>
          <img
            :class="$style.bookingFormIcon"
            :src="unionWhiteIconUrl"
            alt=""
            width="64"
            height="20"
          />
        </div>
        <h3 :class="$style.bookingFormTitleTablet">
          ВЫБЕРИТЕ ВИЛЛУ<br /><span :class="$style.bookingFormTitleTabletSub"
            >ДАТУ БРОНИРОВАНИЯ</span
          >
        </h3>
        <NuxtLink
          v-if="locationSelectedApartmentName"
          :class="$style.bookingFormApartmentName"
          to="#reserv"
        >
          <span :class="$style.bookingFormApartmentNameText"
            >Вилла: {{ locationSelectedApartmentName }}</span
          >
          <AppIcon
            name="reservArrowUpRight"
            aria-hidden="true"
            :class="$style.bookingFormApartmentNameArrow"
          />
        </NuxtLink>
        <div :class="$style.locationFormRow">
          <div :class="$style.locationFormGroup">
            <label :class="$style.locationFormLabel">Заселение и выезд</label>
            <div
              ref="locationDateSelectWrapRef"
              :class="[
                $style.locationDateSelectWrap,
                locationCalendarOpen && $style.locationDateSelectWrapOpen,
              ]"
            >
              <button
                ref="locationDateSelectTriggerRef"
                type="button"
                :class="[
                  $style.locationFormInput,
                  $style.locationDateSelectTrigger,
                  locationFormErrorField === 'dates' &&
                    $style.locationInputError,
                ]"
                @click="locationCalendarOpen = !locationCalendarOpen"
              >
                <span
                  v-if="locationDateRangeFormatted"
                  :class="$style.locationDateRangeText"
                >
                  {{ locationDateRangeFormatted }}
                </span>
                <span v-else :class="$style.locationPlaceholder"
                  >Выберите даты</span
                >
              </button>
              <button
                v-if="locationDateRangeFormatted"
                type="button"
                :class="$style.locationDateSelectClearBtn"
                aria-label="Очистить даты"
                @click.stop="clearLocationDateRange"
              >
                ×
              </button>
              <AppIcon
                v-else
                name="reservCalendar"
                alt=""
                :class="$style.locationFormInputIcon"
              />
              <Transition name="date-dropdown">
                <div
                  v-show="locationCalendarOpen"
                  :class="$style.locationCalendarDropdown"
                  @mousedown.prevent
                >
                  <VueDatePicker
                    v-if="locationCalendarOpen"
                    ref="locationDatePickerRef"
                    v-model="locationDateRange"
                    range
                    :inline="true"
                    :dark="true"
                    :locale="ruLocale"
                    :enable-time-picker="false"
                    :hide-navigation="['time']"
                    :disabled-dates="locationIsCalendarDateDisabled"
                    auto-apply
                    :teleport="false"
                    @update:model-value="onLocationDateRangeSelect"
                    @update-month-year="locationOnCalendarMonthYearChange"
                  />
                </div>
              </Transition>
            </div>
          </div>
          <div :class="$style.locationFormGroup">
            <label :class="$style.locationFormLabel">Количество гостей</label>
            <div
              ref="locationGuestsSelectWrapRef"
              :class="[
                $style.locationGuestsSelectWrap,
                locationGuestsOpen && $style.locationGuestsSelectWrapOpen,
              ]"
            >
              <button
                type="button"
                :class="[
                  $style.locationFormInput,
                  $style.locationFormInputWithIcon,
                  $style.locationGuestsSelectTrigger,
                ]"
                @click="locationGuestsOpen = !locationGuestsOpen"
                @blur="onLocationGuestsBlur"
              >
                <span
                  :class="
                    locationTotalGuests ? '' : $style.locationGuestsPlaceholder
                  "
                >
                  {{
                    locationTotalGuests
                      ? `${locationTotalGuests} ${locationGuestsLabel(
                          locationTotalGuests
                        )}`
                      : `До ${locationMaxGuests} гостей`
                  }}
                </span>
              </button>
              <AppIcon
                name="reservArrowDown"
                alt=""
                :class="[
                  $style.locationFormInputIcon,
                  locationGuestsOpen && $style.locationGuestsSelectIconOpen,
                ]"
              />
              <Transition name="guests-dropdown">
                <div
                  v-show="locationGuestsOpen"
                  :class="$style.locationGuestsDropdown"
                  @mousedown="onLocationGuestsDropdownMousedown"
                >
                  <div :class="$style.locationGuestsDropdownInner">
                    <div :class="$style.locationGuestsRow">
                      <span :class="$style.locationGuestsRowLabel"
                        >Взрослые</span
                      >
                      <div :class="$style.locationGuestsCounter">
                        <button
                          type="button"
                          :class="$style.locationGuestsCounterBtn"
                          :disabled="locationGuestSelection.adults <= 1"
                          aria-label="Меньше"
                          @click="
                            locationSetAdults(locationGuestSelection.adults - 1)
                          "
                        >
                          −
                        </button>
                        <span :class="$style.locationGuestsCounterValue">{{
                          locationGuestSelection.adults
                        }}</span>
                        <button
                          type="button"
                          :class="$style.locationGuestsCounterBtn"
                          :disabled="!locationCanAddAdult"
                          aria-label="Больше"
                          @click="
                            locationSetAdults(locationGuestSelection.adults + 1)
                          "
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div
                      v-for="(child, index) in locationGuestSelection.children"
                      :key="index"
                      :class="$style.locationGuestsChildRow"
                    >
                      <span :class="$style.locationGuestsChildLabel">
                        Ребенок:
                        <select
                          :value="child.age"
                          :class="$style.locationGuestsChildSelect"
                          @change="
                            locationSetChildAge(index, $event.target.value)
                          "
                        >
                          <option
                            v-for="a in locationChildAges"
                            :key="a"
                            :value="a"
                          >
                            {{ a }} лет
                          </option>
                        </select>
                      </span>
                      <button
                        type="button"
                        :class="$style.locationGuestsChildRemove"
                        aria-label="Удалить"
                        @click="locationRemoveChild(index)"
                      >
                        ×
                      </button>
                    </div>
                    <button
                      v-if="locationCanAddChild"
                      type="button"
                      :class="$style.locationGuestsAddChild"
                      @click="locationAddChild"
                    >
                      Добавить ребенка
                      <span :class="$style.locationGuestsAddChildChevron"
                        >▼</span
                      >
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </div>
        <div
          v-if="locationNearestDatesItems.length || locationNearestDatesLoading"
          :class="$style.locationUpcomingDates"
        >
          <div :class="$style.locationUpcomingDatesNavWrap">
            <template v-if="locationNearestDatesLoading">
              <div :class="$style.locationUpcomingDatesSkeleton">
                <span
                  v-for="n in 5"
                  :key="n"
                  :class="$style.locationUpcomingDatesSkeletonCard"
                />
              </div>
            </template>
            <template v-else>
              <button
                v-if="locationCanScrollNearestLeft"
                type="button"
                :class="[
                  $style.locationUpcomingDatesNavBtn,
                  $style.locationUpcomingDatesNavBtnPrev,
                ]"
                aria-label="Назад"
                @click="scrollLocationNearestDates(-1)"
              />
              <div
                ref="locationNearestDatesScrollRef"
                :class="$style.locationUpcomingDatesScroll"
                @scroll="updateLocationNearestDatesScrollState"
              >
                <div :class="$style.locationUpcomingDatesScrollInner">
                  <div
                    v-for="(item, index) in locationNearestDatesItems"
                    :key="index"
                    :class="[
                      $style.locationDateCard,
                      !item.available && $style.locationDateCardUnavailable,
                      isLocationDateCardSelected(item) &&
                        $style.locationDateCardSelected,
                    ]"
                    @click="onLocationDateCardClick(item)"
                  >
                    <span
                      v-if="item.price != null"
                      :class="$style.locationDateCardPrice"
                    >
                      {{ item.priceFormatted }}
                      <span
                        v-if="item.discountPercent"
                        :class="$style.locationDateCardDiscount"
                      >
                        {{ item.discountLabel }}
                      </span>
                    </span>
                    <span :class="$style.locationDateCardDates">
                      {{ item.dateLabel }}
                    </span>
                  </div>
                </div>
              </div>
              <button
                v-if="locationCanScrollNearestRight"
                type="button"
                :class="[
                  $style.locationUpcomingDatesNavBtn,
                  $style.locationUpcomingDatesNavBtnNext,
                ]"
                aria-label="Вперёд"
                @click="scrollLocationNearestDates(1)"
              />
            </template>
          </div>
        </div>
        <form
          :class="$style.bookingFormFieldsTablet"
          @submit.prevent="onLocationTabletFormSubmit"
        >
          <input
            ref="locationTabletNameRef"
            v-model="bookingName"
            type="text"
            placeholder="Ваше имя"
            :class="[
              $style.locationFormInputUnderline,
              (locationFormErrorField === 'name' || locationApiErrorName) &&
                $style.locationInputError,
            ]"
            @input="
              locationFormError = '';
              locationFormErrorField = '';
              locationApiErrors = {};
            "
          />
          <p v-if="locationApiErrorName" :class="$style.locationFormErrorText">
            {{ locationApiErrorName }}
          </p>
          <input
            ref="locationTabletPhoneRef"
            v-model="bookingPhone"
            type="tel"
            placeholder="Ваш телефон"
            :class="[
              $style.locationFormInputUnderline,
              (locationFormErrorField === 'phone' || locationApiErrorPhone) &&
                $style.locationInputError,
            ]"
            @input="
              locationFormError = '';
              locationFormErrorField = '';
              locationApiErrors = {};
            "
          />
          <p v-if="locationApiErrorPhone" :class="$style.locationFormErrorText">
            {{ locationApiErrorPhone }}
          </p>
          <p v-if="locationFormError" :class="$style.locationFormErrorText">
            {{ locationFormError }}
          </p>
          <button
            type="submit"
            :class="$style.locationBookButton"
            :disabled="bookingSubmitting"
          >
            Забронировать
            <span
              v-if="bookingSubmitting"
              :class="$style.locationBookButtonSpinner"
              aria-hidden="true"
            />
            <AppIcon
              v-else
              name="locationArrow"
              alt=""
              :class="$style.locationBookButtonIcon"
            />
          </button>
        </form>
      </div>
      <form
        :class="$style.bookingFormUnified"
        @submit.prevent="onLocationShortFormSubmit"
      >
        <div :class="$style.bookingFormUnifiedMeta">
          <a
            :class="$style.bookingFormUnifiedMetaLink"
            href="tel:+79277675600"
            aria-label="Позвонить"
            >+7 927 767 56 00</a
          >
          <a
            :class="$style.bookingFormUnifiedMetaLink"
            href="mailto:volga-dom163@mail.ru"
            aria-label="Написать на почту"
            >volga-dom163@mail.ru</a
          >
        </div>
        <h3 :class="$style.bookingFormUnifiedTitle">
          БРОНИРУЙТЕ ВИЛЛУ<br />
          <span :class="$style.bookingFormUnifiedTitleAccent">
            В РЕЗИДЕНЦИИ ВОЛГА
          </span>
        </h3>
        <div :class="$style.bookingFormUnifiedBody">
          <div :class="$style.bookingFormUnifiedRow">
            <div :class="$style.bookingFormUnifiedFieldWrap">
              <input
                ref="locationShortNameRef"
                v-model="bookingName"
                type="text"
                autocomplete="given-name"
                placeholder="Введите имя"
                :class="[
                  $style.bookingFormUnifiedField,
                  $style.bookingFormUnifiedFieldHalf,
                  locationUnifiedFirstNameErrorText &&
                    $style.locationInputError,
                ]"
                @input="onLocationUnifiedFirstNameInput"
              />
              <p
                v-if="locationUnifiedFirstNameErrorText"
                :class="$style.bookingFormUnifiedFieldTooltip"
              >
                {{ locationUnifiedFirstNameErrorText }}
              </p>
            </div>
            <div :class="$style.bookingFormUnifiedFieldWrap">
              <input
                ref="locationShortLastNameRef"
                v-model="bookingLastName"
                type="text"
                autocomplete="family-name"
                placeholder="Введите фамилию"
                :class="[
                  $style.bookingFormUnifiedField,
                  $style.bookingFormUnifiedFieldHalf,
                  locationUnifiedLastNameErrorText && $style.locationInputError,
                ]"
                @input="onLocationUnifiedLastNameInput"
              />
              <p
                v-if="locationUnifiedLastNameErrorText"
                :class="$style.bookingFormUnifiedFieldTooltip"
              >
                {{ locationUnifiedLastNameErrorText }}
              </p>
            </div>
          </div>
          <div :class="$style.bookingFormUnifiedRow">
            <div :class="$style.bookingFormUnifiedFieldWrap">
              <input
                ref="locationShortPhoneRef"
                v-model="bookingPhone"
                type="tel"
                autocomplete="tel"
                placeholder="Телефон"
                :class="[
                  $style.bookingFormUnifiedField,
                  $style.bookingFormUnifiedFieldHalf,
                  locationUnifiedPhoneErrorText && $style.locationInputError,
                ]"
                @input="onLocationUnifiedPhoneInput"
                @blur="validateLocationUnifiedPhoneField"
              />
              <p
                v-if="locationUnifiedPhoneErrorText"
                :class="$style.bookingFormUnifiedFieldTooltip"
              >
                {{ locationUnifiedPhoneErrorText }}
              </p>
            </div>
            <div :class="$style.bookingFormUnifiedFieldWrap">
              <input
                ref="locationShortEmailRef"
                v-model="bookingEmail"
                type="email"
                autocomplete="email"
                placeholder="E-mail (опционально)"
                :class="[
                  $style.bookingFormUnifiedField,
                  $style.bookingFormUnifiedFieldHalf,
                  locationUnifiedEmailErrorText && $style.locationInputError,
                ]"
                @input="onLocationUnifiedEmailInput"
                @blur="validateLocationUnifiedEmailField"
              />
              <p
                v-if="locationUnifiedEmailErrorText"
                :class="$style.bookingFormUnifiedFieldTooltip"
              >
                {{ locationUnifiedEmailErrorText }}
              </p>
            </div>
          </div>
          <textarea
            v-model="bookingWish"
            :class="[
              $style.bookingFormUnifiedField,
              $style.bookingFormUnifiedTextarea,
            ]"
            placeholder="Ваши пожелания (опционально)"
            rows="4"
          />
          <div :class="$style.bookingFormUnifiedConsentRow">
            <div :class="$style.bookingFormUnifiedConsentWrap">
              <input
                id="location-booking-consent"
                v-model="bookingConsent"
                type="checkbox"
                :class="$style.bookingFormUnifiedConsentInput"
                @change="clearLocationUnifiedField('consent')"
              />
              <label
                for="location-booking-consent"
                :class="$style.bookingFormUnifiedConsentLabel"
              >
                <span
                  :class="$style.bookingFormUnifiedConsentBox"
                  aria-hidden="true"
                >
                  <span :class="$style.bookingFormUnifiedConsentCheckmark" />
                </span>
                <span :class="$style.bookingFormUnifiedConsentText">
                  Я даю согласие на обработку
                  <a
                    href="#"
                    :class="$style.bookingFormUnifiedConsentLink"
                    @click.stop.prevent
                    >персональных данных</a
                  >, и подтверждаю ознакомление с
                  <a
                    href="#"
                    :class="$style.bookingFormUnifiedConsentLink"
                    @click.stop.prevent
                    >Правилами бронирования</a
                  >,
                  <a
                    href="#"
                    :class="$style.bookingFormUnifiedConsentLink"
                    @click.stop.prevent
                    >условиями оферты</a
                  >
                  и
                  <a
                    href="#"
                    :class="$style.bookingFormUnifiedConsentLink"
                    @click.stop.prevent
                    >Политикой обработки персональных данных</a
                  >.
                </span>
              </label>
              <p
                v-if="locationUnifiedConsentErrorText"
                :class="[
                  $style.bookingFormUnifiedFieldTooltip,
                  $style.bookingFormUnifiedConsentTooltip,
                ]"
              >
                {{ locationUnifiedConsentErrorText }}
              </p>
            </div>
          </div>
          <button
            type="submit"
            :class="$style.bookingFormUnifiedSubmit"
            :disabled="!canSubmitLocationForm || bookingSubmitting"
          >
            <span>Забронировать</span>
            <span
              v-if="bookingSubmitting"
              :class="$style.locationBookButtonSpinner"
              aria-hidden="true"
            />
            <AppIcon
              v-else
              name="locationArrow"
              aria-hidden="true"
              :class="$style.bookingFormUnifiedSubmitIcon"
            />
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<script>
import { defineAsyncComponent } from "vue";
import markerIconUrl from "@app/assets/img/sections/location/marker.svg?url";
import unionIconUrl from "@app/assets/img/sections/location/union.svg?url";
import unionWhiteIconUrl from "@app/assets/img/sections/location/union-white.svg?url";
import { ru } from "date-fns/locale";
import axios from "axios";

const VueDatePicker = defineAsyncComponent(async () => {
  await import("@vuepic/vue-datepicker/dist/main.css");
  const mod = await import("@vuepic/vue-datepicker");
  return mod.VueDatePicker;
});

const BOOKING_CONFIRM_URL =
  "https://realtycalendar.ru/v2/widget/NVGNpGgXO7/confirm";
const BOOKING_REDIRECT_URL = "https://homereserve.ru/HE3NXyOLk4/status";

const RESIDENCE_COORDS = [53.473523, 49.37307];
const MAP_ZOOM = 14;
const MARKER_ICON_SIZE_REM = [15.75, 6.3125];
const MARKER_ICON_OFFSET_REM = [-2.5, -4.375];
const LOCATION_CHILD_AGES = Array.from({ length: 18 }, (_, i) => String(i));

function sanitizePersonName(value) {
  return (value || "").replace(/[^\p{L}\s\-'’]/gu, "");
}

function isValidPersonName(value) {
  const t = (value || "").trim();
  if (t.length < 2) return false;
  return /^[\p{L}]+(?:[\s\-'’]+[\p{L}]+)*$/u.test(t);
}

function sanitizePhoneInput(value) {
  return (value || "").replace(/[^\d+()\s-]/g, "");
}

function digitsOnly(value) {
  return (value || "").replace(/\D/g, "");
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
    /^[a-zA-Z0-9._+%-]+$/.test(local) &&
    /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/i.test(
      domain
    )
  );
}

export default {
  name: "Location",
  components: { VueDatePicker },
  setup() {
    const config = useAppConfig();
    return { yandexMapsApiKey: config.yandexMapsApiKey || "" };
  },
  data() {
    return {
      map: null,
      unionIconUrl,
      unionWhiteIconUrl,
      bookingName: "",
      bookingLastName: "",
      bookingPhone: "",
      bookingEmail: "",
      bookingWish: "",
      bookingConsent: false,
      bookingSubmitting: false,
      isMobileView: false,
      isTabletOrBelowView: false,
      locationFormError: "",
      locationFormErrorField: "",
      locationApiErrors: {},
      ruLocale: ru,
      locationCalendarOpen: false,
      locationDateRange: null,
      locationCalendarViewMonth: null,
      locationCalendarViewYear: null,
      locationGuestsOpen: false,
      locationGuestSelection: { adults: 1, children: [] },
      locationChildAges: LOCATION_CHILD_AGES,
      locationNearestDatesLoading: false,
      locationCanScrollNearestLeft: false,
      locationCanScrollNearestRight: false,
      locationUnifiedClientErrors: {
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        consent: "",
      },
    };
  },
  computed: {
    locationUnifiedFirstNameErrorText() {
      return (
        this.locationUnifiedClientErrors.first_name ||
        this.locationApiErrorName ||
        ""
      );
    },
    locationUnifiedLastNameErrorText() {
      return this.locationUnifiedClientErrors.last_name || "";
    },
    locationUnifiedPhoneErrorText() {
      return (
        this.locationUnifiedClientErrors.phone ||
        this.locationApiErrorPhone ||
        ""
      );
    },
    locationUnifiedEmailErrorText() {
      return this.locationUnifiedClientErrors.email || "";
    },
    locationUnifiedConsentErrorText() {
      return this.locationUnifiedClientErrors.consent || "";
    },
    canSubmitLocationForm() {
      const name = (this.bookingName || "").trim();
      const lastName = (this.bookingLastName || "").trim();
      const phone = digitsOnly(this.bookingPhone);
      return !!name && !!lastName && !!phone && this.bookingConsent;
    },
    locationTotalGuests() {
      const g = this.locationGuestSelection;
      return (g?.adults ?? 0) + (g?.children?.length ?? 0);
    },
    locationMaxGuests() {
      const list = this.$store.state.apartments || [];
      const cap = list[0]?.capacity;
      return cap != null && cap > 0 ? cap : 99;
    },
    locationCanAddAdult() {
      return this.locationTotalGuests < this.locationMaxGuests;
    },
    locationCanAddChild() {
      return this.locationTotalGuests < this.locationMaxGuests;
    },
    locationApiErrorName() {
      const list = this.locationApiErrors?.first_name;
      return Array.isArray(list) && list.length ? list[0] : "";
    },
    locationApiErrorPhone() {
      const list = this.locationApiErrors?.phone;
      return Array.isArray(list) && list.length ? list[0] : "";
    },
    locationIsAnyDropdownOpen() {
      return this.locationCalendarOpen || this.locationGuestsOpen;
    },
    locationCalendarFromStore() {
      return this.$store.state.calendar || [];
    },
    locationDateRangeFormatted() {
      if (!this.locationDateRange || !Array.isArray(this.locationDateRange))
        return "";
      const [start, end] = this.locationDateRange;
      if (!start) return "";
      const format = (d) => {
        if (!d) return "";
        const day = d.getDate();
        const month = d.toLocaleDateString("ru-RU", { month: "short" });
        const year = d.getFullYear();
        return `${day} ${month} ${year}`;
      };
      if (!end || start.getTime() === end.getTime()) return format(start);
      return `${format(start)} – ${format(end)}`;
    },
    firstApartmentId() {
      const list = this.$store.state.apartments || [];
      return list[0]?.id ?? null;
    },
    locationSelectedApartmentId() {
      const list = this.$store.state.apartments || [];
      const index = this.$store.state.selectedApartmentIndex ?? 0;
      return list[index]?.id ?? list[0]?.id ?? null;
    },
    locationSelectedApartmentName() {
      const list = this.$store.state.apartments || [];
      const index = this.$store.state.selectedApartmentIndex ?? 0;
      return list[index]?.title ?? list[0]?.title ?? "";
    },
    locationCalendarNearestFromStore() {
      return this.$store.state.calendarNearest || [];
    },
    locationNearestDatesItems() {
      const list = this.locationCalendarNearestFromStore;
      return list.map((entry) => {
        const partsFrom = this.locationFormatCalendarDateParts(entry.date);
        const nextDayStr = this.locationAddDaysToDateStr(entry.date, 1);
        const partsTo = this.locationFormatCalendarDateParts(nextDayStr);
        const shortFrom = this.locationFormatCalendarDateShortMonth(entry.date);
        const shortTo = this.locationFormatCalendarDateShortMonth(nextDayStr);
        const dateLabel =
          partsFrom.month === partsTo.month
            ? `${partsFrom.day}-${partsTo.day} ${partsTo.month}`
            : `${partsFrom.day}-${partsTo.day} ${shortFrom}/${shortTo}`;
        const price = entry.price;
        const discountPercent = entry.discounts?.[0]?.percent ?? 0;
        const checkInDate = this.locationParseDateStr(entry.date);
        const checkOutDate = this.locationParseDateStr(nextDayStr);
        return {
          dateLabel,
          price,
          priceFormatted:
            price != null ? `${this.locationFormatPrice(price)} ₽` : null,
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
    locationCalendarOpen(open) {
      if (open) {
        const now = new Date();
        this.locationCalendarViewMonth = now.getMonth();
        this.locationCalendarViewYear = now.getFullYear();
        this.locationFetchCalendarForMonth(
          this.locationCalendarViewMonth,
          this.locationCalendarViewYear
        );
        this.$nextTick(() => {
          document.addEventListener(
            "mousedown",
            this.onLocationCalendarClickOutside
          );
          window.addEventListener(
            "scroll",
            this.onLocationCalendarScroll,
            true
          );
        });
      } else {
        document.removeEventListener(
          "mousedown",
          this.onLocationCalendarClickOutside
        );
        window.removeEventListener(
          "scroll",
          this.onLocationCalendarScroll,
          true
        );
      }
    },
    locationGuestsOpen(open) {
      if (open) {
        this.$nextTick(() => {
          document.addEventListener(
            "mousedown",
            this.onLocationGuestsClickOutside
          );
          window.addEventListener("scroll", this.onLocationGuestsScroll, true);
        });
      } else {
        document.removeEventListener(
          "mousedown",
          this.onLocationGuestsClickOutside
        );
        window.removeEventListener("scroll", this.onLocationGuestsScroll, true);
      }
    },
    locationIsAnyDropdownOpen(open) {
      if (open) {
        this.$nextTick(() => {
          window.addEventListener("wheel", this.onLocationWheelCapture, {
            passive: false,
          });
        });
      } else {
        window.removeEventListener("wheel", this.onLocationWheelCapture);
      }
    },
    locationNearestDatesItems() {
      this.$nextTick(() => {
        this.updateLocationNearestDatesScrollState();
        requestAnimationFrame(() =>
          this.updateLocationNearestDatesScrollState()
        );
      });
    },
  },
  mounted() {
    this.updateMobileView();
    if (typeof window !== "undefined") {
      window.addEventListener("resize", this.updateMobileView);
    }
    // Defer 3rd-party map until the section is near viewport
    const load = () => this.loadYandexMap();
    if (typeof window !== "undefined" && "IntersectionObserver" in window) {
      const el = this.$refs.sectionRef || this.$el;
      this._mapObserver = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            this._mapObserver?.disconnect?.();
            this._mapObserver = null;
            load();
          }
        },
        { rootMargin: "200px 0px", threshold: 0.01 }
      );
      if (el) this._mapObserver.observe(el);
    } else {
      setTimeout(load, 1500);
    }
  },
  beforeUnmount() {
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", this.updateMobileView);
    }
    this._mapObserver?.disconnect?.();
    this._mapObserver = null;
    document.removeEventListener(
      "mousedown",
      this.onLocationCalendarClickOutside
    );
    document.removeEventListener(
      "mousedown",
      this.onLocationGuestsClickOutside
    );
    window.removeEventListener("scroll", this.onLocationCalendarScroll, true);
    window.removeEventListener("scroll", this.onLocationGuestsScroll, true);
    window.removeEventListener("wheel", this.onLocationWheelCapture);
    if (this.map && typeof this.map.destroy === "function") {
      this.map.destroy();
    }
    this.map = null;
  },
  methods: {
    locationFormatCalendarDateParts(dateStr) {
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
    locationAddDaysToDateStr(dateStr, days) {
      if (!dateStr) return "";
      const [y, m, d] = dateStr.split("-").map(Number);
      const date = new Date(y, m - 1, d + days);
      const pad = (n) => String(n).padStart(2, "0");
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate()
      )}`;
    },
    locationFormatCalendarDateShortMonth(dateStr) {
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
    locationParseDateStr(dateStr) {
      if (!dateStr) return null;
      const [y, m, d] = dateStr.split("-").map(Number);
      return new Date(y, m - 1, d);
    },
    locationFormatPrice(value) {
      if (value == null) return "—";
      return Number(value).toLocaleString("ru-RU");
    },
    isLocationDateCardSelected(item) {
      if (!this.locationDateRange || !Array.isArray(this.locationDateRange))
        return false;
      const [start, end] = this.locationDateRange;
      if (!start || !end) return false;
      const toStr = (date) => {
        if (!date || !(date instanceof Date)) return "";
        const pad = (n) => String(n).padStart(2, "0");
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
          date.getDate()
        )}`;
      };
      return (
        toStr(start) === item.checkInStr && toStr(end) === item.checkOutStr
      );
    },
    onLocationDateCardClick(item) {
      if (!item.available) return;
      this.locationDateRange = [
        new Date(item.checkInDate.getTime()),
        new Date(item.checkOutDate.getTime()),
      ];
    },
    scrollLocationNearestDates(direction) {
      const el = this.$refs.locationNearestDatesScrollRef;
      if (!el) return;
      el.scrollBy({ left: direction * 220, behavior: "smooth" });
      setTimeout(() => this.updateLocationNearestDatesScrollState(), 350);
    },
    updateLocationNearestDatesScrollState() {
      const el = this.$refs.locationNearestDatesScrollRef;
      if (!el) return;
      const threshold = 1;
      const hasOverflow = el.scrollWidth > el.clientWidth;
      if (!hasOverflow) {
        this.locationCanScrollNearestLeft = false;
        this.locationCanScrollNearestRight = false;
        return;
      }
      this.locationCanScrollNearestLeft = el.scrollLeft > threshold;
      this.locationCanScrollNearestRight =
        el.scrollLeft + el.clientWidth < el.scrollWidth - threshold;
    },
    async fetchLocationNearestDates() {
      const id = this.firstApartmentId;
      if (!id) return;
      this.locationNearestDatesLoading = true;
      try {
        const now = new Date();
        const begin = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );
        const end = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
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
          apartmentId: id,
          beginDate,
          endDate,
          forNearest: true,
        });
      } finally {
        this.locationNearestDatesLoading = false;
      }
    },
    onLocationDateRangeSelect() {
      if (!this.locationDateRange || !Array.isArray(this.locationDateRange))
        return;
      const [start, end] = this.locationDateRange;
      if (!start || !end) return;
      if (this.locationToDateStr(start) === this.locationToDateStr(end)) {
        this.locationDateRange = null;
        return;
      }
      this.locationFormError = "";
      this.locationFormErrorField = "";
      this.locationCalendarOpen = false;
    },
    locationToDateStr(date) {
      if (!date || !(date instanceof Date)) return "";
      const pad = (n) => String(n).padStart(2, "0");
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate()
      )}`;
    },
    clearLocationDateRange() {
      this.locationDateRange = null;
      this.locationCalendarOpen = false;
    },
    onLocationCalendarClickOutside(event) {
      const wrap = this.$refs.locationDateSelectWrapRef;
      if (wrap && !wrap.contains(event.target)) {
        this.locationCalendarOpen = false;
      }
    },
    onLocationCalendarScroll() {
      this.locationCalendarOpen = false;
    },
    onLocationWheelCapture(event) {
      const dateWrap = this.$refs.locationDateSelectWrapRef;
      const guestsWrap = this.$refs.locationGuestsSelectWrapRef;
      const insideCalendar = dateWrap && dateWrap.contains(event.target);
      const insideGuests = guestsWrap && guestsWrap.contains(event.target);
      if (insideCalendar || insideGuests) {
        event.preventDefault();
      }
    },
    locationSetAdults(n) {
      const min = 1;
      const max =
        this.locationMaxGuests - this.locationGuestSelection.children.length;
      this.locationGuestSelection.adults = Math.max(min, Math.min(max, n));
    },
    locationAddChild() {
      if (!this.locationCanAddChild) return;
      this.locationGuestSelection.children.push({ age: "0" });
    },
    locationRemoveChild(index) {
      this.locationGuestSelection.children.splice(index, 1);
    },
    locationSetChildAge(index, age) {
      if (this.locationGuestSelection.children[index]) {
        this.locationGuestSelection.children[index].age = age;
      }
    },
    locationGuestsLabel(n) {
      const last = n % 10;
      const last2 = n % 100;
      if (last2 >= 11 && last2 <= 19) return "гостей";
      if (last === 1) return "гость";
      if (last >= 2 && last <= 4) return "гостя";
      return "гостей";
    },
    onLocationGuestsBlur(event) {
      const wrap = this.$refs.locationGuestsSelectWrapRef;
      const related = event.relatedTarget;
      if (wrap && related && wrap.contains(related)) return;
      setTimeout(() => {
        this.locationGuestsOpen = false;
      }, 150);
    },
    onLocationGuestsDropdownMousedown(event) {
      const tag = event.target?.tagName;
      if (tag === "SELECT" || tag === "OPTION") return;
      event.preventDefault();
    },
    onLocationGuestsClickOutside(event) {
      const wrap = this.$refs.locationGuestsSelectWrapRef;
      if (wrap && !wrap.contains(event.target)) {
        this.locationGuestsOpen = false;
      }
    },
    onLocationGuestsScroll(event) {
      const guestsWrap = this.$refs.locationGuestsSelectWrapRef;
      const scrollInsideDropdown =
        guestsWrap && guestsWrap.contains(event.target);
      if (!scrollInsideDropdown) {
        this.locationGuestsOpen = false;
      }
    },
    locationFetchCalendarForMonth(month, year) {
      const id = this.firstApartmentId;
      if (!id) return;
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
        apartmentId: id,
        beginDate,
        endDate,
        guests: { adults: 1, children: [] },
        merge: true,
      });
    },
    locationOnCalendarMonthYearChange({ month, year }) {
      this.locationCalendarViewMonth = month;
      this.locationCalendarViewYear = year;
      this.locationFetchCalendarForMonth(month, year);
    },
    locationIsCalendarDateDisabled(date) {
      const dateStr = this.locationToDateStr(date);
      const entry = this.locationCalendarFromStore.find(
        (e) => e.date === dateStr
      );
      return entry
        ? entry.closed_on_arrival === true || entry.available === false
        : false;
    },
    loadYandexMap() {
      if (typeof window === "undefined") return;
      if (window.ymaps) {
        this.initYandexMap();
        return;
      }
      const key = this.yandexMapsApiKey || "";
      const url = `https://api-maps.yandex.ru/2.1/?lang=ru_RU${
        key ? `&apikey=${key}` : ""
      }`;
      const script = document.createElement("script");
      script.src = url;
      script.async = true;
      script.onload = () => {
        window.ymaps.ready(() => this.initYandexMap());
      };
      document.head.appendChild(script);
    },
    initYandexMap() {
      const el = this.$refs.mapRef;
      if (!el || !window.ymaps) return;
      const { ymaps } = window;

      const remPx =
        (typeof document !== "undefined" &&
          parseFloat(getComputedStyle(document.documentElement).fontSize)) ||
        16;
      const isMobile =
        typeof window !== "undefined" && window.innerWidth <= 768;
      const scale = isMobile ? 0.5 : 1;
      const iconSizePx = [
        MARKER_ICON_SIZE_REM[0] * remPx * scale,
        MARKER_ICON_SIZE_REM[1] * remPx * scale,
      ];
      const iconOffsetPx = [
        MARKER_ICON_OFFSET_REM[0] * remPx * scale,
        MARKER_ICON_OFFSET_REM[1] * remPx * scale,
      ];

      this.map = new ymaps.Map(
        el,
        {
          center: RESIDENCE_COORDS,
          zoom: MAP_ZOOM,
          controls: [],
        },
        {
          suppressMapOpenBlock: true,
        }
      );
      const placemark = new ymaps.Placemark(
        RESIDENCE_COORDS,
        { balloonContent: "Резиденция Волга" },
        {
          iconLayout: "default#image",
          iconImageHref: markerIconUrl,
          iconImageSize: iconSizePx,
          iconImageOffset: iconOffsetPx,
          iconShape: {
            type: "Rectangle",
            coordinates: [
              [iconOffsetPx[0], iconOffsetPx[1]],
              [
                iconOffsetPx[0] + iconSizePx[0],
                iconOffsetPx[1] + iconSizePx[1],
              ],
            ],
          },
        }
      );
      this.map.geoObjects.add(placemark);
    },
    updateMobileView() {
      this.isMobileView =
        typeof window !== "undefined" && window.innerWidth <= 768;
      this.isTabletOrBelowView =
        typeof window !== "undefined" && window.innerWidth <= 1290;
    },
    resetLocationUnifiedClientErrors() {
      this.locationUnifiedClientErrors = {
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        consent: "",
      };
    },
    clearLocationUnifiedField(key) {
      this.locationUnifiedClientErrors[key] = "";
      if (!this.locationApiErrors[key]) return;
      this.locationApiErrors = Object.fromEntries(
        Object.entries(this.locationApiErrors).filter(([k]) => k !== key)
      );
    },
    onLocationUnifiedFirstNameInput(e) {
      this.bookingName = sanitizePersonName(e.target.value);
      this.clearLocationUnifiedField("first_name");
    },
    onLocationUnifiedLastNameInput(e) {
      this.bookingLastName = sanitizePersonName(e.target.value);
      this.clearLocationUnifiedField("last_name");
    },
    onLocationUnifiedPhoneInput(e) {
      this.bookingPhone = sanitizePhoneInput(e.target.value);
      this.clearLocationUnifiedField("phone");
    },
    onLocationUnifiedEmailInput(e) {
      this.bookingEmail = e.target.value;
      this.clearLocationUnifiedField("email");
    },
    validateLocationUnifiedPhoneField() {
      const d = digitsOnly(this.bookingPhone);
      if (!d) {
        this.clearLocationUnifiedField("phone");
        return;
      }
      if (!isValidRuPhoneDigits(d)) {
        this.locationUnifiedClientErrors.phone =
          "Введите номер в формате 9XXXXXXXXX или +7/8 9XXXXXXXXX";
      } else {
        this.clearLocationUnifiedField("phone");
      }
    },
    validateLocationUnifiedEmailField() {
      const t = (this.bookingEmail || "").trim();
      if (!t) {
        this.clearLocationUnifiedField("email");
        return;
      }
      if (!isValidEmailFormat(t)) {
        this.locationUnifiedClientErrors.email = "Введите корректный e-mail";
      } else {
        this.clearLocationUnifiedField("email");
      }
    },
    onLocationShortFormSubmit() {
      this.resetLocationUnifiedClientErrors();
      this.locationFormError = "";
      this.locationFormErrorField = "";

      const firstName = (this.bookingName || "").trim();
      const lastName = (this.bookingLastName || "").trim();
      const phoneDigits = digitsOnly(this.bookingPhone);
      const emailTrim = (this.bookingEmail || "").trim();
      let invalid = false;

      if (!firstName) {
        this.locationUnifiedClientErrors.first_name = "Введите имя";
        invalid = true;
      } else if (!isValidPersonName(firstName)) {
        this.locationUnifiedClientErrors.first_name =
          "Только буквы, без цифр и символов (минимум 2 символа)";
        invalid = true;
      }
      if (!lastName) {
        this.locationUnifiedClientErrors.last_name = "Введите фамилию";
        invalid = true;
      } else if (!isValidPersonName(lastName)) {
        this.locationUnifiedClientErrors.last_name =
          "Только буквы, без цифр и символов (минимум 2 символа)";
        invalid = true;
      }
      if (!phoneDigits) {
        this.locationUnifiedClientErrors.phone = "Введите телефон";
        invalid = true;
      } else if (!isValidRuPhoneDigits(phoneDigits)) {
        this.locationUnifiedClientErrors.phone =
          "Введите номер в формате 9XXXXXXXXX или +7/8 9XXXXXXXXX";
        invalid = true;
      }
      if (!isValidEmailFormat(emailTrim)) {
        this.locationUnifiedClientErrors.email =
          "Некорректный адрес: проверьте формат name@домен.зона";
        invalid = true;
      }
      if (!this.bookingConsent) {
        this.locationUnifiedClientErrors.consent =
          "Необходимо согласие на обработку персональных данных";
        invalid = true;
      }

      if (invalid) {
        this.$nextTick(() => {
          if (this.locationUnifiedFirstNameErrorText) {
            this.$refs.locationShortNameRef?.focus();
          } else if (this.locationUnifiedLastNameErrorText) {
            this.$refs.locationShortLastNameRef?.focus();
          } else if (this.locationUnifiedPhoneErrorText) {
            this.$refs.locationShortPhoneRef?.focus();
          } else if (this.locationUnifiedEmailErrorText) {
            this.$refs.locationShortEmailRef?.focus();
          }
        });
        return;
      }

      const normalizedPhone = normalizePhoneForApi(phoneDigits);
      const phonePrefill =
        sanitizePhoneInput(this.bookingPhone).trim() || normalizedPhone;

      this.$store.commit("setLocationFormData", {
        firstName,
        lastName,
        phone: normalizedPhone,
        email: emailTrim,
        wish: (this.bookingWish || "").trim(),
      });
      this.$store.commit("setBookingModalOpenedFromLocation", true);
      this.$store.commit("setBookingModalPrefill", {
        name: firstName,
        phone: phonePrefill,
      });
      this.$store.commit("setBookingModalOpen", true);
    },
    onLocationTabletFormSubmit() {
      if (this.isMobileView) {
        this.onLocationShortFormSubmit();
        return;
      }
      this.onBookingSubmit();
    },
    async onBookingSubmit() {
      this.locationFormError = "";
      this.locationFormErrorField = "";
      const aptId = this.locationSelectedApartmentId;
      if (!aptId) return;

      if (!this.locationDateRange || !Array.isArray(this.locationDateRange)) {
        this.locationFormError = "Выберите даты заезда и выезда";
        this.locationFormErrorField = "dates";
        this.$nextTick(() => this.$refs.locationDateSelectTriggerRef?.focus());
        return;
      }
      const [start, end] = this.locationDateRange;
      if (!start || !end) {
        this.locationFormError = "Выберите даты заезда и выезда";
        this.locationFormErrorField = "dates";
        this.$nextTick(() => this.$refs.locationDateSelectTriggerRef?.focus());
        return;
      }

      const firstName = (this.bookingName || "").trim();
      if (!firstName) {
        this.locationFormError = "Введите имя";
        this.locationFormErrorField = "name";
        this.$nextTick(() => this.$refs.locationTabletNameRef?.focus());
        return;
      }

      const phoneRaw = (this.bookingPhone || "").replace(/\D/g, "");
      if (!phoneRaw) {
        this.locationFormError = "Введите номер телефона";
        this.locationFormErrorField = "phone";
        this.$nextTick(() => this.$refs.locationTabletPhoneRef?.focus());
        return;
      }

      const body = {
        apartment_id: String(aptId),
        begin_date: this.locationToDateStr(start),
        end_date: this.locationToDateStr(end),
        first_name: firstName,
        last_name: "Бронь-сайт",
        guests: {
          adults: this.locationGuestSelection?.adults ?? 1,
          children: (this.locationGuestSelection?.children ?? []).map((c) => ({
            age: c?.age ?? "0",
          })),
        },
        phone: phoneRaw,
        redirect_url: BOOKING_REDIRECT_URL,
        widget_type: "widget_page",
      };

      this.bookingSubmitting = true;
      this.locationApiErrors = {};
      try {
        const response = await axios.post(BOOKING_CONFIRM_URL, body);
        const paymentUrl = response?.data?.url;
        if (paymentUrl && typeof window !== "undefined") {
          window.location.href = paymentUrl;
          return;
        }
        this.bookingSubmitting = false;
      } catch (err) {
        console.error("Booking confirm error:", err);
        this.bookingSubmitting = false;
        if (err.response?.status === 422 && err.response?.data?.errors) {
          this.locationApiErrors = { ...err.response.data.errors };
          const firstKey = Object.keys(this.locationApiErrors)[0];
          if (firstKey === "first_name") {
            this.$nextTick(() => this.$refs.locationTabletNameRef?.focus());
          } else if (firstKey === "phone") {
            this.$nextTick(() => this.$refs.locationTabletPhoneRef?.focus());
          }
        }
      }
    },
  },
};
</script>

<style lang="scss" module>
@use "@app/assets/scss/mixins.scss" as *;

.wrapper {
  display: flex;
  flex-direction: column;
  padding: 5rem;
  gap: 5rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  @include tablet {
    padding: 5rem 2.5rem 2.5rem 2.5rem;
    gap: 1rem;
  }
  @include mobile {
    padding: 2.5rem 1rem 1rem 1rem;
    gap: 1.5rem;
  }

  h2 {
    font-size: 6.25rem;
    font-weight: 400;
    line-height: 0.8;
  }
}

.titleContainer {
  width: 100%;
  flex-shrink: 0;
}

.titleLine1 {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
  margin: 0 0 1rem 0;

  @include tablet {
    .title {
      display: none;
    }
    .titleLine1Right .phone {
      display: none;
    }
  }
  @include mobile {
    flex-direction: column;
    align-items: center;
    gap: 0;
    margin: 0;

    .title,
    .titleLine1Right .phone {
      display: none;
    }
    .titleLine1Desc {
      display: block;
      margin-top: 0.5rem;
      max-width: 100%;
      width: 100%;
      text-align: center;
      .descLine {
        display: none;
        margin: 0;
      }
    }
    .titleH2 {
      font-size: 1.875rem;
      font-weight: 300;
      width: 100%;
      text-align: left;
      line-height: 0.95;
    }
  }
}

.titleLine1Right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  max-width: 26rem;
  min-width: 0;

  .phone {
    display: none;
  }

  .titleLine1Desc {
    display: block;

    @include tablet {
      display: block;
    }
  }

  @include mobile {
    align-items: center;
    max-width: none;
    width: 100%;
  }
}

.titleLine1Desc {
  text-align: right;
  max-width: 100%;
  min-width: 0;

  .descLine {
    white-space: normal;
    overflow-wrap: anywhere;
    margin: 0 0 0.25rem;
    font-size: 1rem;
    font-weight: 300;
    line-height: 1.2;
    color: $text-primary;
    letter-spacing: -4%;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.titleLine2 {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;

  .titleH2 {
    text-align: right;
    order: 2;
  }

  .address {
    margin: 0;
    text-align: left;
    order: 1;

    :global(br) {
      display: none;
    }
  }

  @include tablet {
    h2 {
      line-height: 1;
    }
    justify-content: flex-end;
    .address {
      display: none;
    }
  }
  @include mobile {
    flex-direction: column;
    align-items: center;
    margin-top: 0;

    .titleH2 {
      font-size: 1.875rem;
      font-weight: 300;
      text-align: right;
      width: 100%;
      line-height: 0.95;
      order: 1;
    }
    .titleDescMobile {
      display: block;
      order: 2;
      margin: 0.35rem 0 0 0;
      font-size: 0.625rem;
      font-weight: 300;
      line-height: 1.2;
      text-align: center;
      color: $text-primary;
      max-width: 22rem;
    }
    .address {
      display: block;
      margin: 0.75rem 0 0 0;
      font-size: 1rem;
      font-weight: 600;
      line-height: 1.35;
      text-align: center;
      width: 100%;
      order: 3;

      :global(br) {
        display: inline;
      }
    }
  }
}

.titleLine3 {
  display: none;

  @include tablet {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 5rem 0 0 0;
  }
  @include mobile {
    display: none;
  }
}

.contactItem {
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.2;
  color: $text-primary;
  text-decoration: none;
}

a.contactItem:hover {
  text-decoration: underline;
}

.titleH2 {
  margin: 0;
}

.title {
  font-size: 1rem;
  line-height: 1.2;
  font-weight: 300;
}

.phone {
  font-size: 2rem;
  line-height: 1.2;
  font-weight: 500;
}

.address {
  font-size: 1.5rem;
  line-height: 1.2;
  text-align: right;
  @include mobile {
    text-align: center;
  }
}

.titleDescMobile {
  display: none;

  @include mobile {
    display: block;
    font-size: 0.625rem;
    font-weight: 300;
    line-height: 1.4;
    color: $text-secondary;
    text-align: center;
  }
}

.mapAndFormWrap {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 26.75rem;
  width: 100%;
  min-width: 0;
  gap: 0.75rem;

  @include tablet {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 26.75rem;
    gap: 1rem;
    align-items: stretch;
  }
  @include mobile {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
}

.locationContactRowMobile {
  display: none;

  @include mobile {
    display: none;
  }
}

.mapWrap {
  position: relative;
  width: 100%;
  flex-shrink: 0;
  border-radius: 1.25rem;
  overflow: hidden;
  @include mobile {
    border-radius: 1rem;
  }
}

.mapContainer {
  width: 100%;
  min-width: 0;
  height: 32.625rem;
  border-radius: 1.25rem;
  overflow: hidden;
  @include tablet {
    height: 32.5rem;
  }
  @include mobile {
    height: 16rem;
    border-radius: 1rem;
  }

  :global([class*="copyrights-promo"]),
  :global([class*="copyright_content"]),
  :global([class*="copyright__logo"]),
  :global([class*="-copyright"]) {
    display: none !important;
  }
  background: #f5f5f5;
  box-sizing: border-box;
}

.mapPlaceholder {
  width: 100%;
  min-width: 0;
  height: 20.5rem;
  border-radius: 1.25rem;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  box-sizing: border-box;
  @include tablet {
    height: 20.5rem;
  }
  @include mobile {
    height: 16rem;
    border-radius: 1rem;
  }
}

.bookingForm {
  position: relative;
  width: 100%;
  min-height: 20.5rem;
  padding: 1.5rem;
  background: $text-primary;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  color: $text-white;
  @include tablet {
    min-height: 20.5rem;
  }
  @include mobile {
    min-height: 0;
    padding: 0.95rem;
    border-radius: 1rem;
  }
}

.bookingFormUnified {
  @extend .bookingForm;
}

.bookingFormUnifiedMeta {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  font-weight: 300;
  font-size: 1rem;
  line-height: 1.2;
  color: $text-white;
  @include mobile {
    flex-wrap: wrap;
    gap: 0.25rem 0.75rem;
  }
}

.bookingFormUnifiedMetaLink {
  color: inherit;
  text-decoration: none;
}

.bookingFormUnifiedTitle {
  margin: 0;
  font-size: 2rem;
  font-weight: 300;
  line-height: 0.95;
  letter-spacing: -0.03em;
  color: $text-white;
  text-transform: uppercase;
  @include tablet {
    font-size: 1.75rem;
  }
  @include mobile {
    font-size: 1.4rem;
  }
}

.bookingFormUnifiedTitleAccent {
  color: #685137;
}

.bookingFormUnifiedBody {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}

.bookingFormUnifiedRow {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 0.45rem;
  overflow: visible;
  @include mobile {
    grid-template-columns: 1fr;
  }
}

.bookingFormUnifiedFieldWrap {
  position: relative;
  min-width: 0;
  &:not(:first-child) {
    border-left: 1px solid rgba(255, 255, 255, 0.24);
  }
  @include mobile {
    &:not(:first-child) {
      border-left: none;
      border-top: 1px solid rgba(255, 255, 255, 0.24);
    }
  }
}

.bookingFormUnifiedField {
  width: 100%;
  min-width: 0;
  padding: 0.75rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 0.45rem;
  color: $text-white;
  font-size: 0.875rem;
  font-family: inherit;
  line-height: 1.2;
  font-weight: 300;
  outline: none;
  box-sizing: border-box;
  &::placeholder {
    color: rgba(255, 255, 255, 0.42);
  }
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-text-fill-color: $text-white;
    caret-color: $text-white;
    -webkit-box-shadow: 0 0 0 1000px $text-primary inset;
    box-shadow: 0 0 0 1000px $text-primary inset;
    transition: background-color 9999s ease-out 0s;
  }
}

.bookingFormUnifiedFieldHalf {
  border: none;
  border-radius: 0;
}

.bookingFormUnifiedFieldTooltip {
  position: absolute;
  top: calc(100% + 0.3rem);
  right: 0.4rem;
  z-index: 20;
  margin: 0;
  max-width: min(20rem, calc(100vw - 2rem));
  padding: 0.35rem 0.5rem;
  background: rgb(173, 31, 31);
  border-radius: 0.35rem;
  color: $text-white;
  font-size: 0.7rem;
  line-height: 1.25;
  pointer-events: none;
  box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.25);
}

.bookingFormUnifiedTextarea {
  min-height: 5.75rem;
  resize: none;
}

.bookingFormUnifiedConsentRow {
  display: block;
  position: relative;
}

.bookingFormUnifiedConsentWrap {
  position: relative;
}

.bookingFormUnifiedConsentTooltip {
  top: calc(100% + 0.3rem);
  bottom: auto;
  right: 0.4rem;
}

.bookingFormUnifiedConsentInput {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.bookingFormUnifiedConsentLabel {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.75rem;
  line-height: 1.2;
  color: rgba(255, 255, 255, 0.46);
  cursor: pointer;
}

.bookingFormUnifiedConsentBox {
  position: relative;
  width: 0.875rem;
  height: 0.875rem;
  margin-top: 0.04rem;
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.32);
  border-radius: 0.14rem;
  background: transparent;
}

.bookingFormUnifiedConsentCheckmark {
  position: absolute;
  left: 0.29rem;
  top: 0.1rem;
  width: 0.2rem;
  height: 0.42rem;
  border-right: 1px solid $text-white;
  border-bottom: 1px solid $text-white;
  opacity: 0;
  transform: rotate(45deg) scale(0.9);
  transition:
    opacity 0.15s,
    transform 0.15s;
}

.bookingFormUnifiedConsentText {
  flex: 1;
  min-width: 0;
}

.bookingFormUnifiedConsentLink {
  color: rgba(255, 255, 255, 0.5);
  text-decoration: underline;
}

.bookingFormUnifiedConsentInput:checked
  + .bookingFormUnifiedConsentLabel
  .bookingFormUnifiedConsentBox {
  background: #685137;
  border-color: #685137;
}

.bookingFormUnifiedConsentInput:checked
  + .bookingFormUnifiedConsentLabel
  .bookingFormUnifiedConsentCheckmark {
  opacity: 1;
  transform: rotate(45deg) scale(1);
}

.bookingFormUnifiedSubmit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  min-height: 3rem;
  padding: 0.9rem 1rem;
  border: none;
  border-radius: 0.45rem;
  background: #004f68;
  color: $text-white;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.2s;
  &:hover:not(:disabled) {
    background: #006080;
  }
  &:disabled {
    opacity: 0.8;
    cursor: not-allowed;
  }
}

.bookingFormUnifiedSubmitIcon {
  width: 1rem;
  height: 1rem;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

.bookingFormHeader {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.bookingFormIntro {
  margin: 0;
  font-size: 1rem;
  font-weight: 300;
  line-height: 1.2;
  color: #004f68;
  flex: 1;
}

.bookingFormIcon {
  flex-shrink: 0;
  width: 3rem;
  height: auto;
  margin-top: -0.15rem;
}

.bookingFormTitle {
  margin: 1rem 0 0 0;
  font-size: 2rem;
  font-weight: 300;
  line-height: 1.25;
  text-transform: uppercase;
  line-height: 1;
}

.bookingFormSub {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.45;
  color: #3d6b4a;
}

.bookingFormFields {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2.5rem;
}

.bookingInput {
  width: 100%;
  padding: 1rem 0;
  font-size: 1rem;
  background: transparent;
  border: none;
  border-bottom: 0.1rem solid $text-secondary;
  border-radius: 0;
  outline: none;
  box-sizing: border-box;

  &::placeholder {
    text-transform: uppercase;
    letter-spacing: 0.04em;
    font-size: 1rem;
  }

  &:focus {
    border-bottom-color: $text-primary;
  }
}

.locationInputError {
  border-color: $main-red !important;
  border-bottom-color: $main-red !important;
}

.locationFormErrorText {
  margin: 0.5rem 0 0 0;
  font-size: 0.875rem;
  color: $main-red;
  line-height: 1.3;
}

.bookingSubmit {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  align-self: flex-end;
  gap: 0.5rem;
  padding: 1.125rem 1.25rem;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  background: #004f68;
  border: none;
  border-radius: 6.5rem;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 1.5rem;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.85;
  }
}

.bookingFormTablet {
  display: none;

  @include tablet {
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    background: $text-primary;
    border-radius: 1.5rem;
    min-height: 0;
  }
  @include mobile {
    display: flex;
    flex-direction: column;
    padding: 1.25rem 1rem;
    background: $text-primary;
    border-radius: 0.75rem;
    min-height: 0;

    .locationFormRow,
    .locationUpcomingDates,
    .bookingFormApartmentName {
      display: none !important;
    }
    .bookingFormIntroTablet {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.8);
    }
    .bookingFormTitleTablet {
      margin-top: 0.75rem;
      font-size: 1.125rem;
      line-height: 1.3;
    }
    .bookingFormTitleTabletSub {
      color: rgba(255, 255, 255, 0.7);
    }
    .bookingFormIcon {
      width: 2.25rem;
    }
    .bookingFormFieldsTablet {
      margin-top: 1.25rem;
      gap: 0.75rem;
    }
    .locationBookButton {
      margin-top: 1.5rem;
      padding: 1rem 1.25rem;
      font-size: 0.9375rem;
      border-radius: 0.5rem;
      width: 100%;
    }
  }
}

.bookingFormIntroTablet {
  margin: 0;
  font-size: 1rem;
  font-weight: 300;
  line-height: 1.2;
  color: rgba(255, 255, 255, 0.9);
  flex: 1;
}

.bookingFormTitleTablet {
  margin: 1rem 0 0 0;
  font-size: 2rem;
  font-weight: 300;
  line-height: 1.25;
  text-transform: uppercase;
  color: $text-white;
}

.bookingFormTitleTabletSub {
  color: #685137;
}

.bookingFormApartmentName {
  margin: 1.75rem 0 0 0;
  font-size: 1rem;
  font-weight: 400;
  color: $text-tertiary;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
}

.bookingFormApartmentNameText {
  text-decoration: underline;
}

.bookingFormApartmentNameArrow {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  transform: rotate(-45deg);
  opacity: 0.9;
}

.locationFormRow {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.locationFormGroup {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.locationFormLabel {
  display: none;
  font-size: 1rem;
  font-weight: 600;
  color: $text-white;
}

.locationDateSelectWrap {
  position: relative;
  z-index: 0;
  width: 100%;

  &.locationDateSelectWrapOpen {
    z-index: 3;
  }
}

.locationFormInput {
  padding: 1rem;
  border: 1px solid $bg-transparent-16 !important;
  border-radius: 0.5rem;
  background: transparent;
  color: $text-white;
  font-size: 1rem;
  font-family: inherit;

  &::placeholder {
    color: rgba(255, 255, 255, 0.45);
  }
}

.locationFormInputWithIcon {
  padding-right: 2.75rem;
}

.locationDateSelectTrigger {
  width: 100%;
  text-align: left;
  cursor: pointer;
  border: none;
  font-family: inherit;
  appearance: none;
  padding-right: 2.75rem;
}

.locationPlaceholder {
  color: rgba(255, 255, 255, 0.45);
}

.locationDateRangeText {
  color: inherit;
}

.locationFormInputIcon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  pointer-events: none;
  opacity: 0.7;
}

.locationDateSelectClearBtn {
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
}

.locationDateSelectClearBtn:hover {
  color: $text-white;
  background: rgba(255, 255, 255, 0.1);
}

.locationCalendarDropdown {
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

.locationGuestsSelectWrap {
  position: relative;
  z-index: 0;

  &.locationGuestsSelectWrapOpen {
    z-index: 2;
  }
}

.locationGuestsSelectTrigger {
  width: 100%;
  text-align: left;
  cursor: pointer;
  border: none;
  font-family: inherit;
  appearance: none;
}

.locationGuestsPlaceholder {
  color: rgba(255, 255, 255, 0.45);
}

.locationGuestsSelectIconOpen {
  transform: translateY(-50%) rotate(180deg);
  transition: transform 0.25s ease;
}

.locationGuestsDropdown {
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
}

.locationGuestsDropdownInner {
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.locationGuestsRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.locationGuestsRowLabel {
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.9);
}

.locationGuestsCounter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: $text-white;
}

.locationGuestsCounterBtn {
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

.locationGuestsCounterValue {
  min-width: 1.5rem;
  text-align: center;
  font-size: 1rem;
  font-weight: 500;
}

.locationGuestsChildRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 0.375rem;
}

.locationGuestsChildLabel {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
}

.locationGuestsChildSelect {
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

.locationGuestsChildRemove {
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

.locationGuestsAddChild {
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

.locationGuestsAddChildChevron {
  font-size: 0.75rem;
  opacity: 0.8;
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

.locationUpcomingDates {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
}

.locationUpcomingDatesNavWrap {
  display: flex;
  align-items: center;
  min-height: 5.125rem;
}

.locationUpcomingDatesSkeleton {
  flex: 1;
  min-width: 0;
  display: flex;
  gap: 0.75rem;
  align-items: center;
  overflow: hidden;
}

.locationUpcomingDatesSkeletonCard {
  flex: 0 0 auto;
  width: 10rem;
  height: 4.5rem;
  border-radius: 0.375rem;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.06) 0%,
    rgba(255, 255, 255, 0.14) 50%,
    rgba(255, 255, 255, 0.06) 100%
  );
  background-size: 200% 100%;
  animation: locationShimmer 1.5s ease-in-out infinite;
}

@keyframes locationShimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.locationUpcomingDatesNavBtn {
  flex-shrink: 0;
  width: 1.5rem;
  height: 5.125rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 0.5rem 0.5rem 0 0;
  background: $bg-overlay
    url("../../assets/img/sections/about/swiper-arrow.svg") no-repeat center;
  background-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background-color: rgba(50, 50, 50, 0.98);
  }
}

.locationUpcomingDatesNavBtnPrev {
  border-radius: 0 0.5rem 0.5rem 0;
  transform: scaleX(-1);
}

.locationUpcomingDatesNavBtnNext {
  border-radius: 0 0.5rem 0.5rem 0;
}

.locationUpcomingDatesScroll {
  flex: 1;
  min-width: 0;
  overflow-x: auto;
  scroll-snap-type: x proximity;
  scrollbar-width: none;
  -ms-overflow-style: none;
  min-height: 5.5rem;

  &::-webkit-scrollbar {
    display: none;
  }
}

.locationUpcomingDatesScrollInner {
  display: flex;
  gap: 0.75rem;
  min-height: 5.5rem;
  align-items: center;
}

.locationDateCard {
  flex: 0 0 auto;
  min-height: 5.125rem;
  padding: 0 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.375rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.75rem;
  scroll-snap-align: start;
  cursor: pointer;
  transition:
    background-color 0.2s,
    border-color 0.2s,
    color 0.2s;
}

.locationDateCardUnavailable {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.12);
  cursor: not-allowed;
  pointer-events: none;

  .locationDateCardDates,
  .locationDateCardPrice {
    color: rgba(255, 255, 255, 0.45);
  }

  .locationDateCardDiscount {
    color: rgba(229, 115, 115, 0.7);
  }
}

.locationDateCardSelected {
  background: #2d5a5a;
  border-color: rgba(255, 255, 255, 0.35);

  .locationDateCardDates,
  .locationDateCardPrice {
    color: $text-white;
  }
}

.locationDateCardDates {
  font-size: 1rem;
  color: $text-white;
}

.locationDateCardPrice {
  font-size: 1rem;
  font-weight: 600;
  color: $text-white;
}

.locationDateCardDiscount {
  margin-left: 0.35em;
  font-size: 1rem;
  color: $main-red;
}

.bookingFormFieldsTablet {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}

.locationFormInputUnderline {
  padding: 1rem 0;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 0;
  background: transparent;
  color: $text-white;
  font-size: 1rem;
  width: 100%;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-bottom-color: $text-white;
  }
  @include mobile {
    padding: 0.75rem 0;
    font-size: 0.9375rem;
  }
}

.locationFormInputUnderline.locationInputError,
.locationDateSelectTrigger.locationInputError {
  border-color: $main-red !important;
  border-bottom-color: $main-red !important;
}

.locationBookButton {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.25rem;
  font-size: 1rem;
  font-weight: 600;
  color: $text-white;
  background: #004f68;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 2.5rem;
}

.locationBookButton:hover:not(:disabled) {
  background: #006080;
}

.locationBookButton:disabled {
  cursor: not-allowed;
  opacity: 0.85;
}

.locationBookButtonSpinner {
  width: 1.25rem;
  height: 1.25rem;
  min-width: 1.25rem;
  min-height: 1.25rem;
  flex-shrink: 0;
  border: 2px solid rgba(255, 255, 255, 0.25);
  border-top-color: $text-white;
  border-radius: 50%;
  box-sizing: border-box;
  animation: locationSpinnerRotate 0.8s linear infinite;
}

@keyframes locationSpinnerRotate {
  to {
    transform: rotate(360deg);
  }
}

.locationBookButtonIcon {
  width: 1.25rem;
  height: 1.25rem;
  object-fit: contain;
  filter: brightness(0) invert(1);
}
</style>
