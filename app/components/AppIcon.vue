<template>
  <img
    v-if="src"
    :src="src"
    :alt="alt"
    :class="$style.icon"
    :width="dimensions.width"
    :height="dimensions.height"
    loading="lazy"
    decoding="async"
  />
</template>

<script>
import logo from "@app/assets/img/logo.svg";
import vk from "@app/assets/img/header/vk.svg";
import telegram from "@app/assets/img/header/telegram.svg";
import max from "@app/assets/img/header/max.svg";
import phone from "@app/assets/img/header/phone.svg";
import mainBlockMapPin from "@app/assets/img/sections/main-block/map-pin.svg";
import mainBlockUsers from "@app/assets/img/sections/main-block/users.svg";
import mainBlockFlag from "@app/assets/img/sections/main-block/flag.svg";
import mainBlockEye from "@app/assets/img/sections/main-block/eye-on.svg";
import aboutMap from "@app/assets/img/sections/about/map.svg";
import aboutUsers from "@app/assets/img/sections/about/users.svg";
import aboutFlag from "@app/assets/img/sections/about/flag.svg";
import aboutEye from "@app/assets/img/sections/about/eye.svg";
import locationArrow from "@app/assets/img/sections/location/arrow.svg";
import reservCalendar from "@app/assets/img/sections/reserv/сalendar.svg";
import reservArrowDown from "@app/assets/img/sections/reserv/arrow-down.svg";
import reservArrowUpRight from "@app/assets/img/sections/reserv/arrow-up-right.svg";
import reservArrowDownRight from "@app/assets/img/sections/reserv/arrow-down-right.svg";

const icons = {
  logo,
  vk,
  telegram,
  max,
  phone,
  mainBlockMapPin,
  mainBlockUsers,
  mainBlockFlag,
  mainBlockEye,
  aboutMap,
  aboutUsers,
  aboutFlag,
  aboutEye,
  locationArrow,
  reservCalendar,
  reservArrowDown,
  reservArrowUpRight,
  reservArrowDownRight,
};

const iconDimensions = {
  logo: { width: 190, height: 89 },
  vk: { width: 20, height: 12 },
  telegram: { width: 20, height: 16 },
  max: { width: 20, height: 20 },
  phone: { width: 20, height: 20 },
  mainBlockMapPin: { width: 48, height: 48 },
  mainBlockUsers: { width: 48, height: 48 },
  mainBlockFlag: { width: 48, height: 48 },
  mainBlockEye: { width: 48, height: 48 },
  aboutMap: { width: 24, height: 24 },
  aboutUsers: { width: 24, height: 24 },
  aboutFlag: { width: 24, height: 24 },
  aboutEye: { width: 24, height: 24 },
  locationArrow: { width: 24, height: 24 },
  reservCalendar: { width: 24, height: 24 },
  reservArrowDown: { width: 24, height: 24 },
  reservArrowUpRight: { width: 24, height: 24 },
  reservArrowDownRight: { width: 24, height: 24 },
};

export default {
  name: "AppIcon",
  props: {
    name: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      default: "",
    },
  },
  computed: {
    src() {
      return icons[this.name] ?? null;
    },
    dimensions() {
      return iconDimensions[this.name] ?? { width: 24, height: 24 };
    },
  },
};
</script>

<style lang="scss" module>
.icon {
  display: block;
}
</style>
