import { createStore } from "vuex";
import axios from "axios";

export const store = createStore({
  state() {
    return {
      apiBaseUrl: "",
      apiKey: "",
      apartmentIds: [],
      apartments: [],
      apartmentDetails: {},
      selectedApartmentIndex: 0,
      calendar: [],
      calendarNearest: [],
      bookingModalOpen: false,
      bookingModalPrefill: null,
      bookingModalOpenedFromLocation: false,
      locationFormData: null,
      bookingFormModalOpen: false,
      bookingFormData: null,
      faqOpenIndex: null,
    };
  },
  mutations: {
    setFaqOpenIndex(state, index) {
      state.faqOpenIndex = index != null && Number.isFinite(Number(index)) ? Number(index) : null;
    },
    setBookingModalOpen(state, open) {
      state.bookingModalOpen = !!open;
      if (!open) {
        state.bookingModalPrefill = null;
        state.bookingModalOpenedFromLocation = false;
        state.locationFormData = null;
      }
    },
    setBookingModalOpenedFromLocation(state, value) {
      state.bookingModalOpenedFromLocation = !!value;
    },
    setLocationFormData(state, data) {
      state.locationFormData =
        data && typeof data === "object"
          ? {
              firstName: data.firstName ?? "",
              lastName: data.lastName ?? "",
              phone: data.phone ?? "",
              email: data.email ?? "",
              wish: data.wish ?? "",
            }
          : null;
    },
    setBookingModalPrefill(state, prefill) {
      state.bookingModalPrefill = prefill && typeof prefill === "object"
        ? { name: prefill.name ?? "", phone: prefill.phone ?? "" }
        : null;
    },
    setBookingFormModalOpen(state, open) {
      state.bookingFormModalOpen = !!open;
      if (!open) state.bookingFormData = null;
    },
    setBookingFormData(state, data) {
      state.bookingFormData = data && typeof data === "object" ? data : null;
    },
    setSelectedApartmentIndex(state, index) {
      state.selectedApartmentIndex = Math.max(0, Number(index) || 0);
    },
    setApiConfig(state, config) {
      state.apiBaseUrl = config.homeReserveApiUrl || "https://realtycalendar.ru/v2/widget";
      state.apiKey = config.homeReserveApiKey || "HE3NXyOLk4";
      state.apartmentIds = config.apartmentIds || [323833, 333838];
    },
    setApartments(state, apartments) {
      state.apartments = apartments;
    },
    setApartmentDetails(state, { id, data }) {
      if (id != null && data) {
        state.apartmentDetails = { ...state.apartmentDetails, [id]: data };
      }
    },
    setCalendar(state, calendar) {
      state.calendar = calendar;
    },
    setCalendarNearest(state, calendar) {
      state.calendarNearest = calendar || [];
    },
    mergeCalendar(state, { calendar, beginDate, endDate }) {
      const withoutRange = (state.calendar || []).filter(
        (e) => e.date < beginDate || e.date > endDate
      );
      state.calendar = [...withoutRange, ...(calendar || [])].sort((a, b) =>
        a.date.localeCompare(b.date)
      );
    },
  },
  actions: {
    async getApartmentsByIds({ commit, state }) {
      const baseUrl = `${state.apiBaseUrl}/${state.apiKey}`;
      const rawIds = state.apartmentIds || [];
      const ids = [
        ...new Set(rawIds.map((id) => String(id).trim()).filter(Boolean)),
      ];
      if (!state.apiKey || !state.apiBaseUrl || !ids.length) return [];
      const list = [];
      for (const id of ids) {
        const response = await axios.post(`${baseUrl}/apartment/${id}`);
        const data = response.data;
        if (data) {
          list.push(data);
          commit("setApartmentDetails", { id, data });
        }
      }
      commit("setApartments", list);
      return list;
    },
    async getApartment({ commit, state }, apartmentId) {
      const baseUrl = `${state.apiBaseUrl}/${state.apiKey}`;
      if (!state.apiKey || !state.apiBaseUrl || !apartmentId) return;
      const response = await axios.post(`${baseUrl}/apartment/${apartmentId}`);
      commit("setApartmentDetails", { id: apartmentId, data: response.data });
      return response.data;
    },
    async getCalendar(
      { commit, state },
      { apartmentId, beginDate, endDate, guests, merge, forNearest }
    ) {
      const baseUrl = `${state.apiBaseUrl}/${state.apiKey}`;
      if (!state.apiKey || !state.apiBaseUrl) return;
      const body = {
        apartment_id: apartmentId,
        begin_date: beginDate,
        end_date: endDate,
        guests: forNearest
          ? { adults: 1, children: [] }
          : guests != null
            ? guests
            : { adults: 1, children: [] },
      };
      const response = await axios.post(`${baseUrl}/calendar`, body);
      if (forNearest) {
        commit("setCalendarNearest", response.data.calendar);
        commit("setCalendar", []);
      } else if (merge) {
        commit("mergeCalendar", {
          calendar: response.data.calendar,
          beginDate,
          endDate,
        });
      } else {
        commit("setCalendar", response.data.calendar);
      }
      return response.data;
    },
    async fetchCalendarForApartment(
      { state },
      { apartmentId, beginDate, endDate, guests }
    ) {
      const baseUrl = `${state.apiBaseUrl}/${state.apiKey}`;
      if (!state.apiKey || !state.apiBaseUrl || !apartmentId) return [];
      const body = {
        apartment_id: apartmentId,
        begin_date: beginDate,
        end_date: endDate,
        guests: guests ?? { adults: 1, children: [] },
      };
      const response = await axios.post(`${baseUrl}/calendar`, body);
      return response.data?.calendar ?? [];
    },
  },
});
