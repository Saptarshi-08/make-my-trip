import axios from "axios";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export const login = async (email, password) => {
  try {
    const url = `${BACKEND_URL}/user/login?email=${email}&password=${password}`;
    const res = await axios.post(url);
    const data = res.data;
    return data;
  } catch (error) {
    throw error;
  }
};

export const signup = async (
  firstName,
  lastName,
  email,
  phoneNumber,
  password,
) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/user/signup`, {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
    });
    const data = res.data;
    // console.log(data);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getuserbyemail = async (email) => {
  try {
    const res = await axios.get(`${BACKEND_URL}/user/email?email=${email}`);
    const data = res.data;
    return data;
  } catch (error) {
    throw error;
  }
};

export const editprofile = async (
  id,
  firstName,
  lastName,
  email,
  phoneNumber,
) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/user/edit?id=${id}`, {
      firstName,
      lastName,
      email,
      phoneNumber,
    });
    const data = res.data;
    return data;
  } catch (error) {}
};

export const getflight = async () => {
  try {
    const res = await axios.get(`${BACKEND_URL}/flight`);
    const data = res.data;
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getFlightStatus = async (flightId) => {
  try {
    const res = await axios.get(`${BACKEND_URL}/tracking/${flightId}`);

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const addflight = async (
  flightName,
  from,
  to,
  destinationCategory,
  departureTime,
  arrivalTime,
  price,
) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/admin/flight`, {
      flightName,
      from,
      to,
      destinationCategory,
      departureTime,
      arrivalTime,
      price,
    });
    const data = res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const editflight = async (
  id,
  flightName,
  from,
  to,
  destinationCategory,
  departureTime,
  arrivalTime,
  price,
) => {
  try {
    const res = await axios.put(`${BACKEND_URL}/admin/flight/${id}`, {
      flightName,
      from,
      to,
      destinationCategory,
      departureTime,
      arrivalTime,
      price,
    });
    const data = res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const gethotel = async () => {
  try {
    const res = await axios.get(`${BACKEND_URL}/hotel`);
    const data = res.data;
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const addhotel = async (hotel) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/admin/hotel`, hotel);

    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const edithotel = async (hotel) => {
  try {
    const res = await axios.put(
      `${BACKEND_URL}/admin/hotel/${hotel.id}`,
      hotel,
    );

    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const handleflightbooking = async (
  userId,
  flightId,
  selectedSeats,
  savePreference,
  useFrozenPrice = false,
) => {
  try {
    const url =
      `${BACKEND_URL}/booking/flight` +
      `?userId=${userId}` +
      `&flightId=${flightId}`;

    const res = await axios.post(url, {
      selectedSeats,
      savePreference,
      useFrozenPrice,
    });

    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const handlehotelbooking = async (
  userId,
  hotelId,
  roomType,
  savePreference,
  useFrozenPrice = false,
) => {
  try {
    const url =
      `${BACKEND_URL}/booking/hotel` +
      `?userId=${userId}` +
      `&hotelId=${hotelId}`;

    const res = await axios.post(url, {
      roomType,
      savePreference,
      useFrozenPrice,
    });

    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const cancelBooking = async (userId, bookingId, reason) => {
  try {
    const url =
      `${BACKEND_URL}/booking/cancel` +
      `?userId=${userId}` +
      `&bookingId=${bookingId}` +
      `&reason=${encodeURIComponent(reason)}`;

    const res = await axios.post(url);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateRefundStatus = async (userId, bookingId, status) => {
  try {
    const url =
      `${BACKEND_URL}/booking/refund-status` +
      `?userId=${userId}` +
      `&bookingId=${bookingId}` +
      `&status=${status}`;

    const res = await axios.post(url);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const res = await axios.get(`${BACKEND_URL}/admin/users`);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const createReview = async (reviewData) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/review`, reviewData);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getReviews = async (targetType, targetId, sort = "newest") => {
  try {
    const res = await axios.get(
      `${BACKEND_URL}/review/${targetType}/${targetId}?sort=${sort}`,
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const addReply = async (reviewId, replyData) => {
  try {
    const res = await axios.post(
      `${BACKEND_URL}/review/${reviewId}/reply`,
      replyData,
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const markHelpful = async (reviewId) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/review/${reviewId}/helpful`);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const flagReview = async (reviewId, reason) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/review/${reviewId}/flag`, {
      reason,
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getFlaggedReviews = async () => {
  try {
    const res = await axios.get(`${BACKEND_URL}/moderation/flagged`);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const removeReview = async (reviewId) => {
  try {
    const res = await axios.put(`${BACKEND_URL}/moderation/remove/${reviewId}`);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getCurrentFlightPrice = async (flightId) => {
  try {
    const res = await axios.get(
      `${BACKEND_URL}/booking/flight/current-price?flightId=${flightId}`,
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getCurrentHotelPrice = async (hotelId) => {
  try {
    const res = await axios.get(
      `${BACKEND_URL}/booking/hotel/current-price?hotelId=${hotelId}`,
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getFlightPriceHistory = async (flightId) => {
  try {
    const res = await axios.get(
      `${BACKEND_URL}/booking/flight/price-history?flightId=${flightId}`,
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getHotelPriceHistory = async (hotelId) => {
  try {
    const res = await axios.get(
      `${BACKEND_URL}/booking/hotel/price-history?hotelId=${hotelId}`,
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const freezeFlightPrice = async (userId, flightId) => {
  try {
    const res = await axios.post(
      `${BACKEND_URL}/booking/flight/freeze-price?userId=${userId}&flightId=${flightId}`,
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getFrozenFlightPrice = async (userId, flightId) => {
  try {
    const res = await axios.get(
      `${BACKEND_URL}/booking/flight/frozen-price?userId=${userId}&flightId=${flightId}`,
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getFrozenHotelPrice = async (userId, hotelId) => {
  try {
    const res = await axios.get(
      `${BACKEND_URL}/booking/hotel/frozen-price?userId=${userId}&hotelId=${hotelId}`,
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const freezeHotelPrice = async (userId, hotelId) => {
  try {
    const res = await axios.post(
      `${BACKEND_URL}/booking/hotel/freeze-price?userId=${userId}&hotelId=${hotelId}`,
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getRecommendations = async (userId) => {
  try {
    const res = await axios.get(
      `${BACKEND_URL}/user/recommendations/${userId}`,
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const submitRecommendationFeedback = async (data) => {
  try {
    const res = await axios.post(
      `${BACKEND_URL}/user/recommendation-feedback`,
      data,
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};
