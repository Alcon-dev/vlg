<template>
  <component
    :is="embedded ? 'div' : 'section'"
    :id="embedded ? undefined : 'reserv'"
    :class="embedded ? $style.embeddedWrap : $style.wrapper"
  >
    <div v-if="!embedded" :class="$style.titleContainer">
      <div :class="$style.titleLine1">
        <h3>Резиденция<br />ВОЛГА</h3>
        <h2>ВЫБЕРИТЕ ВИЛЛУ</h2>
      </div>
      <div :class="$style.titleLine2">
        <h2>ДАТЫ БРОНИРОВАНИЯ</h2>
      </div>
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
            {{ tab.label }}
          </button>
          <div :class="$style.tabCardLine" />
          <div
            v-if="tab.desc"
            :class="[
              $style.tabCardDesc,
              activeTabIndex !== index && $style.tabCardDescInactive,
            ]"
            v-html="tab.desc"
          />
        </div>
      </div>

      <template v-if="currentApartment">
        <Transition name="tab-content" mode="out-in">
          <div :key="currentApartment.id" :class="$style.tabContentInner">
            <div :class="$style.mainContent">
              <div :class="$style.carouselWrap">
                <svg
                  aria-hidden="true"
                  class="visually-hidden"
                  width="0"
                  height="0"
                >
                  <defs>
                    <clipPath
                      id="carouselCounterClip"
                      clipPathUnits="objectBoundingBox"
                    >
                      <path
                        d="M 0.07 1 Q 0 1 0.008 0.93 L 0.112 0.07 Q 0.12 0 0.19 0 L 0.81 0 Q 0.88 0 0.888 0.07 L 0.992 0.935 Q 1 1 0.93 1 L 0.07 1 Z"
                      />
                    </clipPath>
                  </defs>
                </svg>
                <p :class="$style.carouselPriceOverlay">
                  от
                  {{
                    formatPrice(
                      currentApartment.price?.common?.without_discount
                    )
                  }}
                  Р
                </p>
                <p :class="$style.carouselCounter">
                  {{ carouselActiveIndex
                  }}<span :class="$style.carouselCounterTotal">
                    / {{ carouselPhotos.length }}</span
                  >
                </p>
                <button
                  v-if="carouselPhotos.length"
                  type="button"
                  :class="$style.carouselAllPhotos"
                  aria-label="Открыть все фотографии"
                  @click.prevent="openPhotoGallery"
                >
                  <span :class="$style.carouselAllPhotosText">Все фото</span>
                  <svg
                    :class="$style.carouselAllPhotosChevron"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M6 12l4-4-4-4"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
                <Swiper
                  :modules="swiperModules"
                  :slides-per-view="1"
                  :space-between="0"
                  navigation
                  :class="$style.carousel"
                  @swiper="onCarouselSwiper"
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
                    Р
                  </p>
                </div>
                <div
                  v-if="currentApartment.desc"
                  :class="[$style.villaDesc, $style.villaDescDesktopOnly]"
                  v-html="currentApartment.desc"
                ></div>

                <form
                  :class="[$style.formRow, $style.formRowOneRow]"
                  @submit.prevent="onBookingSubmit"
                >
                  <div
                    ref="dateSelectWrapRef"
                    :class="[
                      $style.dateSelectWrap,
                      $style.dateSelectWrapRow,
                      calendarOpen && $style.dateSelectWrapOpen,
                    ]"
                  >
                    <div :class="$style.formGroup">
                      <label :class="$style.formLabel">Заселение и выезд</label>
                      <div :class="$style.dateSelectTriggerWrap">
                        <button
                          ref="dateSelectTriggerRef"
                          type="button"
                          :class="[
                            $style.formInput,
                            $style.formInputWithIcon,
                            $style.dateSelectTrigger,
                            bookingValidationError === 'dates' &&
                              $style.formInputError,
                          ]"
                          @click="calendarOpen = !calendarOpen"
                        >
                          <span
                            v-if="dateRangeFormatted"
                            :class="$style.dateRangeText"
                          >
                            {{ dateRangeFormatted }}
                          </span>
                          <span v-else :class="$style.guestsPlaceholder">
                            Выберите даты
                          </span>
                        </button>
                        <button
                          v-if="dateRangeFormatted"
                          type="button"
                          :class="$style.dateSelectClearBtn"
                          aria-label="Очистить даты"
                          @click.stop="clearDateRange"
                        >
                          ×
                        </button>
                        <AppIcon
                          v-else
                          name="reservCalendar"
                          alt=""
                          :class="$style.formInputIcon"
                        />
                      </div>
                    </div>
                    <Transition name="date-dropdown">
                      <div
                        v-show="calendarOpen"
                        :class="$style.calendarDropdown"
                        @mousedown.prevent
                      >
                        <VueDatePicker
                          v-if="calendarOpen"
                          ref="datePickerRef"
                          v-model="dateRange"
                          range
                          :inline="true"
                          :dark="true"
                          :locale="ruLocale"
                          :enable-time-picker="false"
                          :hide-navigation="['time']"
                          :disabled-dates="isCalendarDateDisabled"
                          auto-apply
                          :teleport="false"
                          @update:model-value="onDateRangeSelect"
                          @update-month-year="onCalendarMonthYearChange"
                        />
                      </div>
                    </Transition>
                  </div>
                  <div :class="[$style.formGroup, $style.formGroupGuests]">
                    <label :class="$style.formLabel">Количество гостей</label>
                    <div
                      ref="guestsSelectWrapRef"
                      :class="[
                        $style.guestsSelectWrap,
                        guestsOpen && $style.guestsSelectWrapOpen,
                      ]"
                    >
                      <button
                        type="button"
                        :class="[
                          $style.formInput,
                          $style.formInputWithIcon,
                          $style.guestsSelectTrigger,
                        ]"
                        @click="guestsOpen = !guestsOpen"
                        @blur="onGuestsBlur"
                      >
                        <span
                          :class="totalGuests ? '' : $style.guestsPlaceholder"
                        >
                          {{
                            totalGuests
                              ? `${totalGuests} ${guestsLabel(totalGuests)}`
                              : `До ${currentApartment.capacity} гостей`
                          }}
                        </span>
                      </button>
                      <AppIcon
                        name="reservArrowDown"
                        alt=""
                        :class="[
                          $style.formInputIcon,
                          guestsOpen && $style.guestsSelectIconOpen,
                        ]"
                      />
                      <Transition name="guests-dropdown">
                        <div
                          v-show="guestsOpen"
                          :class="$style.guestsDropdown"
                          @mousedown="onGuestsDropdownMousedown"
                        >
                          <div :class="$style.guestsDropdownInner">
                            <div :class="$style.guestsRow">
                              <span :class="$style.guestsRowLabel"
                                >Взрослые</span
                              >
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
                                  @change="
                                    setChildAge(index, $event.target.value)
                                  "
                                >
                                  <option
                                    v-for="a in childAges"
                                    :key="a"
                                    :value="a"
                                  >
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
                              <span :class="$style.guestsAddChildChevron"
                                >▼</span
                              >
                            </button>
                          </div>
                        </div>
                      </Transition>
                    </div>
                  </div>

                  <button
                    type="submit"
                    :class="$style.bookButton"
                    :disabled="bookingSubmitting"
                  >
                    Забронировать
                    <span
                      v-if="bookingSubmitting"
                      :class="$style.bookButtonSpinner"
                      aria-hidden="true"
                    />
                    <AppIcon
                      v-else
                      name="reservArrowUpRight"
                      alt=""
                      :class="$style.bookButtonIcon"
                    />
                  </button>

                  <div
                    v-if="nearestDatesItems.length || nearestDatesLoading"
                    :class="[$style.upcomingDates, $style.formRowFullWidth]"
                  >
                    <span :class="$style.upcomingDatesTitle"
                      >Ближайшие даты</span
                    >
                    <div :class="$style.upcomingDatesNavWrap">
                      <template v-if="nearestDatesLoading">
                        <div :class="$style.upcomingDatesSkeleton">
                          <span
                            v-for="n in 5"
                            :key="n"
                            :class="$style.upcomingDatesSkeletonCard"
                          />
                        </div>
                      </template>
                      <template v-else>
                        <Transition name="nav-btn">
                          <button
                            v-if="canScrollNearestLeft"
                            key="prev"
                            type="button"
                            :class="[
                              $style.upcomingDatesNavBtn,
                              $style.upcomingDatesNavBtnPrev,
                            ]"
                            aria-label="Назад"
                            @click="scrollNearestDates(-1)"
                          />
                        </Transition>
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
                                v-if="item.price != null"
                                :class="$style.dateCardPrice"
                              >
                                {{ item.priceFormatted }}
                                <span
                                  v-if="item.discountPercent"
                                  :class="$style.dateCardDiscount"
                                >
                                  {{ item.discountLabel }}
                                </span>
                              </span>
                              <span :class="$style.dateCardDates">
                                {{ item.dateLabel }}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Transition name="nav-btn">
                          <button
                            v-if="canScrollNearestRight"
                            key="next"
                            type="button"
                            :class="[
                              $style.upcomingDatesNavBtn,
                              $style.upcomingDatesNavBtnNext,
                            ]"
                            aria-label="Вперёд"
                            @click="scrollNearestDates(1)"
                          />
                        </Transition>
                      </template>
                    </div>
                  </div>

                  <p
                    v-if="bookingValidationError"
                    :class="[
                      $style.bookingValidationMessage,
                      $style.formRowFullWidth,
                    ]"
                  >
                    {{ bookingValidationMessage }}
                  </p>
                </form>
              </div>
            </div>

            <div v-if="!embedded" :class="$style.bottomBlocks">
              <div
                :class="[
                  $style.block,
                  expandedBlocks.about && $style.blockExpanded,
                ]"
              >
                <h5
                  :class="$style.blockTitle"
                  role="button"
                  tabindex="0"
                  :aria-expanded="expandedBlocks.about"
                  @click="toggleBlock('about')"
                  @keydown.enter.prevent="toggleBlock('about')"
                  @keydown.space.prevent="toggleBlock('about')"
                >
                  О вилле
                  <AppIcon
                    name="reservArrowDownRight"
                    alt=""
                    :class="$style.blockTitleIcon"
                  />
                </h5>
                <div :class="$style.blockContent">
                  <div :class="$style.blockListTwoCol">
                    <div :class="$style.blockListRow">
                      <span :class="$style.blockListLabel">Кол-во гостей:</span>
                      <span :class="$style.blockListValue">{{
                        currentApartment.capacity ?? "—"
                      }}</span>
                    </div>
                    <div :class="$style.blockListRow">
                      <span :class="$style.blockListLabel">Спальных мест:</span>
                      <span :class="$style.blockListValue">{{
                        sleepsTotal ?? "—"
                      }}</span>
                    </div>
                    <div :class="$style.blockListRow">
                      <span :class="$style.blockListLabel">Кол-во этажей:</span>
                      <span :class="$style.blockListValue">{{
                        currentApartment.floor ?? "—"
                      }}</span>
                    </div>
                    <div :class="$style.blockListRow">
                      <span :class="$style.blockListLabel">Кол-во комнат:</span>
                      <span :class="$style.blockListValue">{{
                        currentApartment.rooms ?? "—"
                      }}</span>
                    </div>
                    <div :class="$style.blockListRow">
                      <span :class="$style.blockListLabel">Площадь:</span>
                      <span :class="$style.blockListValue"
                        >{{ currentApartment.area ?? "—" }} м²</span
                      >
                    </div>
                    <div
                      v-if="currentApartment?.services?.includes('balcony')"
                      :class="$style.blockListRow"
                    >
                      <span :class="$style.blockListLabel">Зона отдыха:</span>
                      <span :class="$style.blockListValue">{{
                        serviceLabel("balcony")
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-if="equipmentKeys.length"
                :class="[
                  $style.block,
                  expandedBlocks.equipment && $style.blockExpanded,
                ]"
              >
                <h5
                  :class="$style.blockTitle"
                  role="button"
                  tabindex="0"
                  :aria-expanded="expandedBlocks.equipment"
                  @click="toggleBlock('equipment')"
                  @keydown.enter.prevent="toggleBlock('equipment')"
                  @keydown.space.prevent="toggleBlock('equipment')"
                >
                  <span :class="$style.blockTitleDesktopOnly"
                    >Техника и оснащение</span
                  >
                  <span :class="$style.blockTitleTabletOnly">Оснащение</span>
                  <AppIcon
                    name="reservArrowDownRight"
                    alt=""
                    :class="$style.blockTitleIcon"
                  />
                </h5>
                <div :class="$style.blockContent">
                  <p :class="$style.blockListInline">
                    <template v-for="(key, i) in equipmentKeys" :key="key">
                      <span v-if="i"> · </span>{{ serviceLabel(key) }}
                    </template>
                  </p>
                </div>
              </div>
              <div
                v-if="comfortKeys.length"
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
                  Комфорт
                  <AppIcon
                    name="reservArrowDownRight"
                    alt=""
                    :class="$style.blockTitleIcon"
                  />
                </h5>
                <div :class="$style.blockContent">
                  <p :class="$style.blockListInline">
                    <template v-for="(key, i) in comfortKeys" :key="key">
                      <span v-if="i"> · </span>{{ serviceLabel(key) }}
                    </template>
                  </p>
                </div>
              </div>
              <div
                :class="[
                  $style.block,
                  expandedBlocks.rules && $style.blockExpanded,
                ]"
              >
                <h5
                  :class="$style.blockTitle"
                  role="button"
                  tabindex="0"
                  :aria-expanded="expandedBlocks.rules"
                  @click="toggleBlock('rules')"
                  @keydown.enter.prevent="toggleBlock('rules')"
                  @keydown.space.prevent="toggleBlock('rules')"
                >
                  Правила
                  <AppIcon
                    name="reservArrowDownRight"
                    alt=""
                    :class="$style.blockTitleIcon"
                  />
                </h5>
                <div :class="$style.blockContent">
                  <div :class="$style.blockListTwoCol">
                    <div v-if="rulesCheckInLabel" :class="$style.blockListRow">
                      <span :class="$style.blockListLabel">Заезд:</span>
                      <span :class="$style.blockListValue">{{
                        rulesCheckInLabel
                      }}</span>
                    </div>
                    <div v-if="rulesCheckOutLabel" :class="$style.blockListRow">
                      <span :class="$style.blockListLabel">Выезд:</span>
                      <span :class="$style.blockListValue">{{
                        rulesCheckOutLabel
                      }}</span>
                    </div>
                    <div :class="$style.blockListRow">
                      <span :class="$style.blockListLabel"
                        >Можно с детьми:</span
                      >
                      <span :class="$style.blockListValue">{{
                        rulesKidsAllowed ? "да" : "нет"
                      }}</span>
                    </div>
                    <div :class="$style.blockListRow">
                      <span :class="$style.blockListLabel"
                        >Можно с питомцем:</span
                      >
                      <span :class="$style.blockListValue">{{
                        rulesPetsAllowed ? "да" : "нет"
                      }}</span>
                    </div>
                    <div :class="$style.blockListRow">
                      <span :class="$style.blockListLabel"
                        >Разрешены вечеринки:</span
                      >
                      <span :class="$style.blockListValue">{{
                        rulesPartyAllowed ? "да" : "нет"
                      }}</span>
                    </div>
                    <div :class="$style.blockListRow">
                      <span :class="$style.blockListLabel">Можно курить:</span>
                      <span :class="$style.blockListValue">{{
                        rulesSmokeAllowed ? "да" : "нет"
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
  air_conditioning: "Кондиционер",
  pool: "Бассейн",
  washing_machine: "Стиральная машина",
  wi_fi: "Wi-Fi",
  animals: "Можно с животными",
  party: "Можно проводить вечеринки",
  tv: "Телевизор",
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
      localSelectedIndex: 0,
      swiperModules: [Navigation],
      carouselSwiper: null,
      carouselActiveIndex: 1,
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
      bookingApiErrors: {},
      guestsOpen: false,
      guestSelection: { adults: 1, children: [] },
      childAges: CHILD_AGES,
      calendarOpen: false,
      dateRange: null,
      ruLocale: ru,
      calendarViewMonth: null,
      calendarViewYear: null,
      canScrollNearestLeft: false,
      canScrollNearestRight: false,
      nearestDatesLoading: false,
      isMobile: false,
      expandedBlocks: {
        about: true,
        equipment: false,
        comfort: false,
        rules: false,
      },
    };
  },
  computed: {
    dateRangeFormatted() {
      if (!this.dateRange || !Array.isArray(this.dateRange)) return "";
      const [start, end] = this.dateRange;
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
        desc: a.desc || "",
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
    equipmentKeys() {
      return EQUIPMENT_KEYS.filter((key) =>
        this.currentApartment?.services?.includes(key)
      );
    },
    comfortKeys() {
      return COMFORT_KEYS.filter((key) =>
        this.currentApartment?.services?.includes(key)
      );
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
        dates: "Выберите даты заезда и выезда",
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
      return this.calendarOpen || this.guestsOpen;
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
        const dateLabel =
          partsFrom.month === partsTo.month
            ? `${partsFrom.day}-${partsTo.day} ${partsTo.month}`
            : `${partsFrom.day}-${partsTo.day} ${shortFrom}/${shortTo}`;
        const price = entry.price;
        const discountPercent = entry.discounts?.[0]?.percent ?? 0;
        const checkInDate = this.parseDateStr(entry.date);
        const checkOutDate = this.parseDateStr(nextDayStr);
        return {
          dateLabel,
          price,
          priceFormatted: price != null ? `${this.formatPrice(price)} ₽` : null,
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
      this.dateRange = null;
      this.guestSelection = { adults: 1, children: [] };
      this.guestsOpen = false;
      this.calendarOpen = false;
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
    calendarOpen(open) {
      if (open) {
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
      if (swiper) {
        this.carouselActiveIndex =
          (swiper.realIndex ?? swiper.activeIndex ?? 0) + 1;
        swiper.on("realIndexChange", (s) => {
          this.carouselActiveIndex = (s.realIndex ?? s.activeIndex ?? 0) + 1;
        });
      }
    },
    goToCarouselDot(dotIndex) {
      if (!this.carouselSwiper || !this.carouselPhotos.length) return;
      const len = this.carouselPhotos.length;
      if (dotIndex === 0) this.carouselSwiper.slideTo(0);
      else if (dotIndex === 1) this.carouselSwiper.slideTo(Math.floor(len / 2));
      else this.carouselSwiper.slideTo(len - 1);
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
      return Number(value).toLocaleString("ru-RU");
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
      if (!this.dateRange || !Array.isArray(this.dateRange)) return false;
      const [start, end] = this.dateRange;
      if (!start || !end) return false;
      return (
        this.toDateStr(start) === item.checkInStr &&
        this.toDateStr(end) === item.checkOutStr
      );
    },
    onDateCardClick(item) {
      if (!item.available) return;
      this.dateRange = [
        new Date(item.checkInDate.getTime()),
        new Date(item.checkOutDate.getTime()),
      ];
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
      const wrap = this.$refs.dateSelectWrapRef;
      if (wrap && !wrap.contains(event.target)) {
        this.calendarOpen = false;
      }
    },
    onCalendarScroll() {
      this.calendarOpen = false;
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
      const dateWrap = this.$refs.dateSelectWrapRef;
      const insideCalendar = dateWrap && dateWrap.contains(event.target);
      if (insideCalendar) {
        event.preventDefault();
      }
    },
    onDateRangeSelect() {
      if (this.dateRange && Array.isArray(this.dateRange)) {
        const [start, end] = this.dateRange;
        if (!start || !end) return;
        if (this.toDateStr(start) === this.toDateStr(end)) {
          this.dateRange = null;
          return;
        }
        this.bookingValidationError = "";
        this.calendarOpen = false;
      }
    },
    clearDateRange() {
      this.dateRange = null;
      this.calendarOpen = false;
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
      const apt = this.currentApartment;
      if (!apt?.id) return;

      if (!this.dateRange || !Array.isArray(this.dateRange)) {
        this.bookingValidationError = "dates";
        this.$nextTick(() => this.$refs.dateSelectTriggerRef?.focus());
        return;
      }
      const [start, end] = this.dateRange;
      if (!start || !end) {
        this.bookingValidationError = "dates";
        this.$nextTick(() => this.$refs.dateSelectTriggerRef?.focus());
        return;
      }

      const guests = {
        adults: this.guestSelection?.adults ?? 1,
        children: (this.guestSelection?.children ?? []).map((c) => ({
          age: c?.age ?? "0",
        })),
      };

      this.$store.commit("setBookingFormData", {
        checkInDate: this.toDateStr(start),
        checkOutDate: this.toDateStr(end),
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
  padding: 7.5rem 2.5rem;
  background-color: $text-primary;
  color: $text-white;
  gap: 5rem;
  @include mobile {
    padding: 5rem 1rem;
    gap: 2.5rem;
  }
  h2 {
    color: $text-tertiary;
    font-weight: 300;
    line-height: 0.8;
    @include mobile {
      font-size: 1.875rem;
      color: $text-white;
    }
  }
  h3 {
    font-size: 1rem;
    font-weight: 300;
    margin: 0.25rem 0 0 0;
    line-height: 120%;
    @include mobile {
      font-size: 0.625rem;
      color: $text-tertiary;
      margin: 0;
    }
  }
}

.titleContainer {
  max-width: 110rem;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  @include mobile {
    gap: 0.25rem;
  }
}

.titleLine1 {
  display: flex;
  text-wrap: nowrap;
  gap: 0;
  justify-content: space-between;
  letter-spacing: -4%;
  @include mobile {
    gap: 0;
  }
}

.titleLine2 {
  display: flex;
  letter-spacing: -4%;
  text-wrap: nowrap;
  h2 {
    color: #685137;
  }
  @include mobile {
  }
}

.embeddedWrap {
  background-color: $text-primary;
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
  max-width: 110rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  width: stretch;
  @include mobile {
    gap: 1.5rem;
    width: stretch;
  }
}

.tabContentInner {
  display: block;
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

.switcher {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0;
  border-bottom: none;
  @include mobile {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto auto;
    gap: 0;
    padding-bottom: 0;
    -webkit-overflow-scrolling: touch;
    border-bottom: none;
  }
}

.tabCard {
  &:nth-child(even) {
    .switcherTab {
      padding: 1.5rem;
      @include mobile {
        padding: 0.5rem 0.25rem 0.5rem 0;
      }
    }
    .tabCardDesc {
      padding: 0 1.5rem;
      @include mobile {
        padding: 0.5rem 0 0;
      }
    }
  }
}

.switcherTab {
  display: flex;
  align-items: flex-end;
  text-align: left;
  padding: 1.5rem 0.5rem;
  font-size: 3rem;
  font-weight: 300;
  color: #685137;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  cursor: pointer;
  font-family: inherit;
  transition:
    color 0.2s,
    border-color 0.2s;

  &:hover {
    color: rgba(255, 255, 255, 0.85);
  }
  @include mobile {
    font-size: 1rem;
    padding: 0.5rem 0.25rem 0.5rem 0;
    margin-bottom: 0;
    white-space: nowrap;
    flex-shrink: 0;
    border-bottom: 2px solid #685137;
  }
}

.switcherTabActive {
  color: $text-white;
  font-weight: 600;
  border-bottom-color: $text-white;
}

.tabCard {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  cursor: pointer;
  @include mobile {
    display: contents;
  }

  &:hover .switcherTab {
    color: $text-white;
  }

  &:hover .switcherTabVilla {
    color: $text-white;
    @include mobile {
      color: #685137;
    }

    &:hover .tabCardDesc {
      color: $text-white;
      @include mobile {
        color: #685137;
      }
    }

    &:hover .tabCardLine {
      background: $text-white;
      @include mobile {
        background: #685137;
      }
    }
  }
}

.switcherTabVilla {
  display: block;
  font-size: 1rem;
  font-weight: 400;
  color: #685137;
  margin-bottom: 0.5rem;
  margin-right: 0.5rem;

  @include mobile {
    display: none !important;
  }
}

.switcherTabActive .switcherTabVilla {
  color: rgba(255, 255, 255, 0.85);
}

.tabCardLine {
  display: block;
  height: 2px;
  margin-top: -1px;
  margin-bottom: 0;
  background: #685137;
  min-height: 2px;

  @include mobile {
    display: none !important;
  }
}

.tabCard:has(.switcherTabActive) .tabCardLine {
  background: $text-white;
}

.tabCardDesc {
  display: block;
  font-size: 1rem;
  font-weight: 300;
  line-height: 1.2;
  color: $text-white;
  margin-top: 0.75rem;
  text-align: justify;

  :global(p) {
    margin: 0 0 0.5em 0;
  }
  :global(p:last-child) {
    margin-bottom: 0;
  }
}

.tabCardDescInactive {
  color: #685137;
}

.tabCardDesc {
  @include mobile {
    display: none;
    font-size: 0.625rem;
    margin-top: 0;
    padding: 0.5rem 0 0;
    color: rgba(255, 255, 255, 0.85);
    grid-row: 2;
    grid-column: 1 / -1;
  }
}

.tabCard:has(.switcherTabActive) .tabCardDesc {
  @include mobile {
    display: block;
  }
}

@include mobile {
  .switcher .tabCard:nth-child(1) .switcherTab,
  .switcher .tabCard:nth-child(1) .tabCardLine {
    grid-row: 1;
    grid-column: 1;
  }
  .switcher .tabCard:nth-child(2) .switcherTab,
  .switcher .tabCard:nth-child(2) .tabCardLine {
    grid-row: 1;
    grid-column: 2;
  }
  .switcher .tabCard:nth-child(3) .switcherTab,
  .switcher .tabCard:nth-child(3) .tabCardLine {
    grid-row: 1;
    grid-column: 3;
  }
}

.villaDescDesktopOnly {
  display: none !important;
  @include mobile {
    display: none;
  }
}

.mainContent {
  display: flex;
  flex-direction: column;
  gap: 0;
  align-items: center;
}

.carouselWrap {
  position: relative;
  border-radius: 0;
  display: flex;
  overflow: hidden;
  background: $text-primary;
  height: 100%;
  min-height: 20rem;
  user-select: none;
  width: 100%;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);

  @include mobile {
    display: flex;
    width: 100%;
    margin-left: 0;
    margin-right: 0;
    border-radius: 1rem;
    min-height: auto;
  }
}

.carouselPriceOverlay {
  display: none;

  @include mobile {
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

.carouselCounterTotal {
  color: #685137;
}

.carouselCounter {
  display: block;
  position: absolute;
  bottom: -0.625rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  margin: 0;
  padding: 0.75rem 4.5rem;
  background: $text-primary;
  color: $text-white;
  font-size: 2rem;
  font-weight: 300;
  pointer-events: none;
  clip-path: url(#carouselCounterClip);

  @include mobile {
    display: block;
    position: absolute;
    bottom: 0.5rem;
    left: 0.5rem;
    transform: none;
    padding: 0.625rem 1.5rem;
    background: $bg-overlay;
    backdrop-filter: blur(0.5rem);
    border-radius: 6rem;
    font-size: 1.5rem;
    clip-path: none;
  }
}

.carouselAllPhotos {
  position: absolute;
  top: 1.25rem;
  right: 1.5rem;
  z-index: 10;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(0.5rem);
  border-radius: 999px;
  border: 0;
  color: $text-white;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition:
    opacity 0.2s,
    background 0.2s;
  &:hover {
    opacity: 0.95;
    background: rgba(0, 0, 0, 0.6);
  }
  @include mobile {
    top: 0.75rem;
    right: 0.75rem;
    padding: 0.4rem 0.75rem;
    font-size: 0.75rem;
  }
}

.carouselAllPhotosText {
  display: block;
}

.carouselAllPhotosChevron {
  flex-shrink: 0;
  opacity: 0.95;
}

/* Photo gallery modal */
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

.carousel {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;

  :global(.swiper-wrapper) {
    flex: 1 1 0;
    min-height: 0;
    height: 100% !important;
  }

  :global(.swiper-slide) {
    height: 100% !important;
    min-height: 0;
    overflow: hidden;
    display: flex;
    align-items: stretch;
  }

  height: 46rem;
  border-radius: 1.5rem;

  @include tablet {
    height: 32.25rem;
  }
  @include mobile {
    height: 11.25rem;
    margin: 0;
    border-radius: 1.5rem;
  }
  :global(.swiper-button-prev),
  :global(.swiper-button-next) {
    top: auto;
    bottom: 2.5rem;
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 50%;
    background-color: $bg-transparent-16;
    backdrop-filter: blur(2.5rem);
    transition: all 0.2s ease;
    background-image: url("../../assets/img/sections/reserv/swiper-arrow.svg");
    background-repeat: no-repeat;
    background-position: center;
    background-size: 1.5rem;
    z-index: 1000;
    svg {
      display: none;
    }

    &::before,
    &::after {
      display: none;
    }

    top: 55%;
    bottom: auto;

    @include mobile {
      display: none;
    }
  }

  :global(.swiper-button-prev) {
    left: 2.5rem;
    transform: translateY(-50%) scaleX(-1);
  }

  :global(.swiper-button-next) {
    right: 2.5rem;
    transform: translateY(-50%);
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
}

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

.carouselImg {
  width: 100%;
  height: 100%;
  min-height: 0;
  max-height: 100%;
  object-position: center;
  display: block;
}

.detailsColumn {
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
}

.upcomingDates {
  display: flex;
  flex-direction: column;
  order: -1;
  width: 100%;
  margin-right: calc(-50vw + 50%);
  padding: 1.5rem 0;
  box-sizing: border-box;
  background: $text-primary;

  @include mobile {
    width: 100%;
    margin-left: 0;
    margin-right: 0;
    padding: 1.5rem 0 1rem 0;
  }
}

.detailsHeader {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
}

.detailsHeaderDesktopOnly {
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
}

.formRow {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0 0 1.5rem 0;

  @include mobile {
    flex-direction: column;
    padding: 0 0 1rem 0;
    gap: 0;
    padding: 0;
  }
}

.formRowOneRow {
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 1rem;
  padding: 0 0 1rem 0;

  & > .formGroup {
    padding-bottom: 0;
  }

  & > .bookButton {
    min-width: 11rem;
    flex-shrink: 0;
    padding: 0 1.5rem;
    height: 3.5rem;
    box-sizing: border-box;
    @include tablet {
      width: 100%;
    }
  }

  .dateSelectTriggerWrap .formInput,
  .guestsSelectWrap .formInput {
    min-height: 2.75rem;
    box-sizing: border-box;
  }

  @include mobile {
    flex-direction: column;
    align-items: stretch;

    & > .bookButton {
      width: 100%;
      min-width: 0;
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

  @include mobile {
    padding: 0 0 1rem 0;
  }

  &:last-child {
    padding: 0;

    @include mobile {
      padding: 0 0 1rem 0;
    }
  }
}

.formLabel {
  font-size: 1rem;
  font-weight: 600;
  color: $text-white;
  @include mobile {
    display: none;
  }
}

.formGroupContact {
  padding: 0 0 2.5rem 0;

  @include mobile {
    padding: 0 0 1.5rem 0;
  }
}

.formContactRow {
  display: flex;
  flex-direction: row;
  gap: 1.5rem;

  @include mobile {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
}

.formContactRow .formInputUnderline {
  flex: 1;
  min-width: 0;
}

.formLabelContact {
  font-size: 2.375rem;
  font-weight: 300;
  color: $text-tertiary;
  margin-bottom: 0.5rem;
  @include mobile {
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
  @include mobile {
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
    @include mobile {
      border-color: $text-white;
    }
  }
}

.formInputError {
  border-color: $main-red !important;
  @include mobile {
    border-color: $main-red !important;
  }
}

.bookingValidationMessage {
  margin: 0 0 0.75rem 0;
  font-size: 0.875rem;
  color: $main-red;
  line-height: 1.3;
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
  min-height: 5.125rem;
}

.upcomingDatesSkeleton {
  flex: 1;
  min-width: 0;
  display: flex;
  gap: 0.75rem;
  align-items: center;
  overflow: hidden;
}

.upcomingDatesSkeletonCard {
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
  animation: upcomingDatesShimmer 1.5s ease-in-out infinite;
}

@keyframes upcomingDatesShimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.upcomingDatesNavBtn {
  flex-shrink: 0;
  width: 1.5rem;
  height: 5.125rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 0.5rem 0.5rem 0 0;
  background: $bg-overlay
    url("../../assets/img/sections/reserv/swiper-arrow.svg") no-repeat center;
  background-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  @include mobile {
    height: 4.5rem;
  }
  &:hover {
    background-color: rgba(50, 50, 50, 0.98);
  }
}

.upcomingDatesNavBtnPrev {
  border-radius: 0 0.5rem 0.5rem 0;
  transform: scaleX(-1);
}

.upcomingDatesNavBtnNext {
  border-radius: 0 0.5rem 0.5rem 0;
}

.upcomingDatesScroll {
  flex: 1;
  min-width: 0;
  overflow-x: auto;
  scroll-snap-type: x proximity;
  scrollbar-width: none;
  -ms-overflow-style: none;
  min-height: 5.5rem;
  @include mobile {
    min-height: auto;
  }

  &::-webkit-scrollbar {
    display: none;
  }
}

.upcomingDatesScrollInner {
  display: flex;
  gap: 0.75rem;
  min-height: 5.5rem;
  align-items: center;
  @include mobile {
    min-height: 4.5rem;
    gap: 0.5rem;
  }
}

.dateCard {
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
  @include mobile {
    min-height: 4rem;
    gap: 0.25rem;
  }
}

.dateCardUnavailable {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.12);
  cursor: not-allowed;
  pointer-events: none;

  .dateCardDates,
  .dateCardPrice {
    color: rgba(255, 255, 255, 0.45);
  }

  .dateCardDiscount {
    color: rgba(229, 115, 115, 0.7);
  }
}

.dateCardSelected {
  background: #2d5a5a;
  border-color: rgba(255, 255, 255, 0.35);

  .dateCardDates,
  .dateCardPrice {
    color: $text-white;
  }
}

.dateCardDates {
  font-size: 1rem;
  color: $text-white;
  @include mobile {
    font-size: 0.75rem;
  }
}

.dateCardPrice {
  font-size: 1rem;
  font-weight: 600;
  color: $text-white;
  @include mobile {
    font-size: 0.875rem;
  }
}

.dateCardDiscount {
  margin-left: 0.35em;
  font-size: 1rem;
  color: $main-red;
  @include mobile {
    font-size: 0.75rem;
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
  @include mobile {
    padding: 0.75rem;
    font-size: 1rem;
  }
  &::placeholder {
    color: rgba(255, 255, 255, 0.45);
  }
}

.formInputWithIcon {
  padding-right: 2.75rem;
}

.formInput.formInputError {
  border-color: $main-red !important;
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
}

.dateSelectClearBtn:hover {
  color: $text-white;
  background: rgba(255, 255, 255, 0.1);
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

  @include mobile {
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
}

.guestsDropdownInner {
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.guestsRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.guestsRowLabel {
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.9);
}

.guestsCounter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
  @include mobile {
    margin-top: 0.5rem;
    padding: 0.875rem 1rem;
  }
}

.bookButton:hover:not(:disabled) {
  background: #006080;
}

.bookButton:disabled {
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

.bottomBlocks {
  display: grid;
  grid-template-columns: 25% 25% 25% 25%;
  padding: 2.5rem 0 0 0;

  @include mobile {
    grid-template-columns: 1fr;
    padding-top: 2.5rem;
    gap: 0;
  }
}

.block {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0 1rem 0 1rem;
  border-right: 1px solid #685137;
  &:first-child {
    padding: 0 1rem 0 0;
    @include mobile {
      padding: 0;
    }
  }
  &:last-child {
    padding: 0 0 0 1rem;
    border-right: none;
    @include mobile {
      padding: 0;
    }
  }
  @include mobile {
    padding: 0;
    gap: 0;
    border-right: none;
    border-top: 1px solid #685137;
    transition: border-top-color 0.2s ease;
  }
}

.blockExpanded {
  @include mobile {
    border-top-color: $text-white;

    .blockTitle {
      color: $text-white;
    }

    .blockTitleIcon {
      transform: rotate(90deg);
      filter: brightness(0) invert(1);
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
  margin: 0;
  color: $text-tertiary;
  text-wrap: nowrap;
  letter-spacing: -5%;
  @include mobile {
    font-size: 1.5rem;
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
}

.blockContent {
  @include mobile {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.3s ease-out;
    padding-bottom: 0;

    & > * {
      min-height: 0;
      overflow: hidden;
    }
  }
}

.blockExpanded .blockContent {
  @include mobile {
    grid-template-rows: 1fr;
    padding-bottom: 0.75rem;
  }
}

.blockTitleDesktopOnly {
  display: none;
  @include mobile {
    display: none;
  }
}

.blockTitleTabletOnly {
  display: inline;
  @include mobile {
    display: inline;
  }
}

.blockTitleIcon {
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
}

.blockListInline {
  margin: 0;
  font-size: 1rem;
  color: $text-white;
  line-height: 1.6;
  @include mobile {
    font-size: 0.875rem;
  }
}

.blockListTwoCol {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;

  @include mobile {
    font-size: 0.875rem;
    gap: 0.25rem;
  }
}

.blockListRow {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
}

.blockListLabel {
  flex-shrink: 0;
  text-align: left;
}

.blockListValue {
  flex-shrink: 0;
  text-align: right;
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

.nav-btn-enter-active,
.nav-btn-leave-active {
  transition: opacity 0.25s ease;
}

.nav-btn-enter-from,
.nav-btn-leave-to {
  opacity: 0;
}

.loadingWrap {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 20rem;
  padding: 3rem;
}

.spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-top-color: $text-white;
  border-radius: 50%;
  animation: spinnerRotate 0.8s linear infinite;
}

@keyframes spinnerRotate {
  to {
    transform: rotate(360deg);
  }
}
</style>
