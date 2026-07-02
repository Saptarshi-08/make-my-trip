import React, { useState, useEffect, useRef } from "react";
import {
    User,
    Phone,
    Mail,
    Edit2,
    MapPin,
    Calendar,
    CreditCard,
    X,
    Check,
    LogOut,
    Plane,
    Building2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { clearUser, setUser } from "@/store";
import {
    editprofile,
    cancelBooking,
    getuserbyemail,
    getFlightStatus,
} from "@/api";

const index = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.user.user);
    const router = useRouter();

    useEffect(() => {
        const refreshUser = async () => {
            try {
                if (!user?.email) return;

                const updatedUser = await getuserbyemail(user.email);

                dispatch(setUser(updatedUser));
            } catch (error) {
                console.error(error);
            }
        };
    }, [user?.email]);

    useEffect(() => {
        const fetchStatuses = async () => {
            if (!user?.bookings) return;

            const statuses: Record<string, any> = {};

            for (const booking of user.bookings) {
                if (
                    booking?.type === "Flight" &&
                    booking?.flightId &&
                    booking?.bookingStatus === "ACTIVE"
                ) {
                    try {
                        const status = await getFlightStatus(booking.flightId);

                        statuses[booking.flightId] = status;
                        const oldStatus =
                            previousStatusesRef.current[
                            booking.flightId
                            ];

                        console.log("Old:", oldStatus);
                        console.log("New:", status.flightStatus);
                        if (
                            oldStatus !== undefined &&
                            oldStatus !== status.flightStatus
                        ) {
                            const message =
                                `✈ ${booking.flightName}\n` +
                                `Status: ${status.flightStatus.replaceAll("_", " ")}\n` +
                                (status.delayReason
                                    ? `Reason: ${status.delayReason}\n`
                                    : "") +
                                (status.revisedDepartureTime
                                    ? `Departure: ${new Date(
                                        status.revisedDepartureTime
                                    ).toLocaleTimeString()}\n`
                                    : "") +
                                `ETA: ${new Date(
                                    status.estimatedArrivalTime
                                ).toLocaleTimeString()}`;

                            switch (status.flightStatus) {
                                case "ON_TIME":
                                    toast.success(message);
                                    break;

                                case "BOARDING":
                                    toast(message, {
                                        icon: "🛫",
                                    });
                                    break;

                                case "DELAYED_BY_1_HOUR":
                                    toast.error(message);
                                    break;

                                default:
                                    toast(message);
                            }
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            }

            setFlightStatuses(statuses);
            const updatedPrevious:
                Record<string, string> = {};

            Object.keys(statuses)
                .forEach((flightId) => {

                    updatedPrevious[
                        flightId
                    ] =
                        statuses[
                            flightId
                        ].flightStatus;

                });

            previousStatusesRef.current = updatedPrevious;

            setPreviousStatuses(
                updatedPrevious
            );
            Object.values(statuses)
                .forEach((flight: any) => {

                    if (
                        flight.flightStatus ===
                        "DELAYED_BY_1_HOUR"
                    ) {

                        console.log(
                            `${flight.flightName}
            delayed by 1 hour`
                        );
                    }
                });
        };

        fetchStatuses();

        const interval = setInterval(fetchStatuses, 15000);

        return () => clearInterval(interval);
    }, [user]);

    const logout = () => {
        dispatch(clearUser());
        router.push("/");
    };
    const [isEditing, setIsEditing] = useState(false);
    const [selectedReason, setSelectedReason] = useState<Record<string, string>>(
        {},
    );
    const [flightStatuses, setFlightStatuses] = useState<Record<string, any>>({});
    const [previousStatuses, setPreviousStatuses] = useState<Record<string, string>>({});
    const previousStatusesRef = useRef<Record<string, string>>({});
    const [userData, setUserData] = useState({
        firstName: user?.firstName ? user?.firstName : "",
        lastName: user?.lastName ? user?.lastName : "",
        email: user?.email ? user?.email : "",
        phoneNumber: user?.phoneNumber ? user?.phoneNumber : "",
    });

    const [editForm, setEditForm] = useState({ ...userData });
    const handleSave = async () => {
        try {
            const data = await editprofile(
                user?.id,
                userData.firstName,
                userData.lastName,
                userData.email,
                userData.phoneNumber,
            );
            dispatch(setUser(data));
            setIsEditing(false);
        } catch (error) {
            setUserData(editForm);
            setIsEditing(false);
        }
    };

    const handleCancelBooking = async (bookingId: string) => {
        const reason = selectedReason[bookingId];

        if (!reason) {
            alert("Please select a cancellation reason");
            return;
        }

        try {
            await cancelBooking(user?.id, bookingId, reason);

            const updatedUser = await getuserbyemail(user.email);

            dispatch(setUser(updatedUser));

            alert("Booking cancelled successfully");
        } catch (error) {
            console.error(error);

            alert("Unable to cancel booking");
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };
    const handleEditFormChange = (field: any, value: any) => {
        setUserData((prevState) => ({
            ...prevState,
            [field]: value, // Update the specific field dynamically
        }));
    };
    return (
        <div className="min-h-screen bg-gray-50 pt-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Profile Section */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold">Profile</h2>
                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="text-red-600 flex items-center space-x-1 hover:text-red-700"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        <span>Edit</span>
                                    </button>
                                )}
                            </div>

                            {isEditing ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            value={userData.firstName}
                                            onChange={(e) =>
                                                handleEditFormChange("firstName", e.target.value)
                                            }
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            value={userData.lastName}
                                            onChange={(e) =>
                                                handleEditFormChange("lastName", e.target.value)
                                            }
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={userData.email}
                                            onChange={(e) =>
                                                handleEditFormChange("email", e.target.value)
                                            }
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={userData.phoneNumber}
                                            onChange={(e) =>
                                                handleEditFormChange("phoneNumber", e.target.value)
                                            }
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        />
                                    </div>
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={handleSave}
                                            className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                                        >
                                            <Check className="w-4 h-4" />
                                            <span>Save</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsEditing(false);
                                                setEditForm({ ...user });
                                            }}
                                            className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                                        >
                                            <X className="w-4 h-4" />
                                            <span>Cancel</span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex items-center space-x-3">
                                        <User className="w-5 h-5 text-gray-500" />
                                        <div>
                                            <p className="font-medium">
                                                {user?.firstName} {user?.lastName}
                                            </p>
                                            {/* <p className="text-sm text-gray-500">{userData.role}</p> */}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Mail className="w-5 h-5 text-gray-500" />
                                        <p>{user?.email}</p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Phone className="w-5 h-5 text-gray-500" />
                                        <p>{user?.phoneNumber}</p>
                                    </div>
                                    <button
                                        className="w-full mt-4 flex items-center justify-center space-x-2 text-red-600 hover:text-red-700"
                                        onClick={logout}
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bookings Section */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-2xl font-bold mb-6">My Bookings</h2>
                            <div className="space-y-6">
                                {user?.bookings
                                    ?.filter((booking: any) => booking !== null)
                                    .map((booking: any, index: any) => (
                                        <div
                                            key={index}
                                            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center space-x-3">
                                                    {booking?.type === "Flight" ? (
                                                        <div className="bg-blue-100 p-2 rounded-lg">
                                                            <Plane className="w-6 h-6 text-blue-600" />
                                                        </div>
                                                    ) : (
                                                        <div className="bg-green-100 p-2 rounded-lg">
                                                            <Building2 className="w-6 h-6 text-green-600" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <h3 className="font-semibold">{booking?.type}</h3>
                                                        <p className="text-sm text-gray-500">
                                                            Booking ID: {booking?.bookingId}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold">
                                                        ₹ {booking?.totalPrice.toLocaleString("en-IN")}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {booking?.type}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>
                                                        {booking?.bookingTime
                                                            ? formatDate(booking.bookingTime)
                                                            : "N/A"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{booking?.type}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <CreditCard className="w-4 h-4" />
                                                    <span>Paid</span>
                                                </div>
                                            </div>
                                            <div className="mt-4 border-t pt-4">
                                                <div className="grid gap-2 text-sm">
                                                    <p>
                                                        <strong>Status:</strong>{" "}
                                                        {booking?.bookingStatus || "ACTIVE"}
                                                    </p>
                                                    {
                                                        booking?.type === "Flight" &&
                                                        booking?.flightId &&
                                                        booking?.bookingStatus === "ACTIVE" &&
                                                        flightStatuses[booking.flightId] && (

                                                            <div className="mt-4 rounded-xl border bg-white p-4 shadow-sm">

                                                                <div className="flex items-center justify-between mb-3">

                                                                    <h4 className="font-semibold text-lg">
                                                                        ✈ Live Flight Tracking
                                                                    </h4>

                                                                    <span
                                                                        className={`px-3 py-1 rounded-full text-sm font-semibold ${flightStatuses[booking.flightId].flightStatus === "ON_TIME"
                                                                            ? "bg-green-100 text-green-700"
                                                                            : flightStatuses[booking.flightId].flightStatus === "BOARDING"
                                                                                ? "bg-yellow-100 text-yellow-700"
                                                                                : "bg-red-100 text-red-700"
                                                                            }`}
                                                                    >
                                                                        {
                                                                            flightStatuses[booking.flightId].flightStatus
                                                                                .replaceAll("_", " ")
                                                                        }
                                                                    </span>

                                                                </div>

                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                                                                    <div>
                                                                        <p className="text-gray-500 text-sm">
                                                                            Flight
                                                                        </p>

                                                                        <p className="font-medium">
                                                                            {booking.flightName}
                                                                        </p>
                                                                    </div>

                                                                    <div>
                                                                        <p className="text-gray-500 text-sm">
                                                                            Route
                                                                        </p>

                                                                        <p className="font-medium">
                                                                            {booking.fromLocation}
                                                                            {" → "}
                                                                            {booking.toLocation}
                                                                        </p>
                                                                    </div>

                                                                    {
                                                                        flightStatuses[booking.flightId]
                                                                            .delayReason && (

                                                                            <div className="md:col-span-2">

                                                                                <p className="text-gray-500 text-sm">
                                                                                    Delay Reason
                                                                                </p>

                                                                                <p className="font-medium text-red-600">
                                                                                    {
                                                                                        flightStatuses[
                                                                                            booking.flightId
                                                                                        ].delayReason
                                                                                    }
                                                                                </p>

                                                                            </div>
                                                                        )
                                                                    }
                                                                    {
                                                                        flightStatuses[
                                                                            booking.flightId
                                                                        ].revisedDepartureTime && (

                                                                            <>
                                                                                <div>

                                                                                    <p className="text-gray-500 text-sm">
                                                                                        Revised Departure
                                                                                    </p>

                                                                                    <p className="font-medium text-orange-600">
                                                                                        {
                                                                                            new Date(
                                                                                                flightStatuses[
                                                                                                    booking.flightId
                                                                                                ].revisedDepartureTime
                                                                                            ).toLocaleString()
                                                                                        }
                                                                                    </p>

                                                                                </div>

                                                                                <div>

                                                                                    <p className="text-gray-500 text-sm">
                                                                                        Revised Arrival
                                                                                    </p>

                                                                                    <p className="font-medium text-orange-600">
                                                                                        {
                                                                                            new Date(
                                                                                                flightStatuses[
                                                                                                    booking.flightId
                                                                                                ].revisedArrivalTime
                                                                                            ).toLocaleString()
                                                                                        }
                                                                                    </p>

                                                                                </div>

                                                                            </>
                                                                        )
                                                                    }
                                                                    <div>
                                                                        <p className="text-gray-500 text-sm">
                                                                            Estimated Arrival
                                                                        </p>

                                                                        <p className="font-medium">
                                                                            {
                                                                                new Date(
                                                                                    flightStatuses[
                                                                                        booking.flightId
                                                                                    ].estimatedArrivalTime
                                                                                ).toLocaleString()
                                                                            }
                                                                        </p>

                                                                    </div>

                                                                    <div>

                                                                        <p className="text-gray-500 text-sm">
                                                                            Last Updated
                                                                        </p>

                                                                        <p className="font-medium">
                                                                            {
                                                                                new Date(
                                                                                    flightStatuses[
                                                                                        booking.flightId
                                                                                    ].lastUpdated
                                                                                ).toLocaleString()
                                                                            }
                                                                        </p>

                                                                    </div>

                                                                </div>

                                                            </div>
                                                        )
                                                    }

                                                    {booking?.bookingStatus === "CANCELLED" && (
                                                        <>
                                                            <p>
                                                                <strong>Cancellation Reason:</strong>{" "}
                                                                {booking?.cancellationReason}
                                                            </p>

                                                            <p>
                                                                <strong>Refund Amount:</strong> ₹
                                                                {booking?.refundAmount}
                                                            </p>

                                                            <p>
                                                                <strong>Refund Status:</strong>{" "}
                                                                {booking?.refundStatus}
                                                            </p>

                                                            <p className="text-green-600">
                                                                Expected refund processing: 3-7 business days
                                                            </p>
                                                        </>
                                                    )}

                                                    {booking?.bookingStatus !== "CANCELLED" && (
                                                        <>
                                                            <select
                                                                className="border rounded p-2"
                                                                value={selectedReason[booking.bookingId] || ""}
                                                                onChange={(e) =>
                                                                    setSelectedReason({
                                                                        ...selectedReason,

                                                                        [booking.bookingId]: e.target.value,
                                                                    })
                                                                }
                                                            >
                                                                <option value="">Select Reason</option>

                                                                <option value="Plan Changed">
                                                                    Plan Changed
                                                                </option>

                                                                <option value="Found Better Price">
                                                                    Found Better Price
                                                                </option>

                                                                <option value="Booking Mistake">
                                                                    Booking Mistake
                                                                </option>

                                                                <option value="Medical Emergency">
                                                                    Medical Emergency
                                                                </option>

                                                                <option value="Travel Cancelled">
                                                                    Travel Cancelled
                                                                </option>

                                                                <option value="Other">Other</option>
                                                            </select>

                                                            <button
                                                                onClick={() =>
                                                                    handleCancelBooking(booking.bookingId)
                                                                }
                                                                className="
                            mt-2
                            bg-red-600
                            text-white
                            px-4
                            py-2
                            rounded
                            hover:bg-red-700
                        "
                                                            >
                                                                Cancel Booking
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default index;
