"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Textarea } from "@/components/ui/textarea";
import FlightList from "@/components/Flights/Flightlist";
import {
    addflight,
    addhotel,
    editflight,
    edithotel,
    getuserbyemail,
    getAllUsers,
    updateRefundStatus,
    getFlaggedReviews,
    removeReview,
} from "@/api";
import HotelList from "@/components/Hotel/Hotel";
const mockFlights = [
    {
        _id: "1",
        flightName: "AirOne 101",
        from: "New York",
        to: "London",
        departureTime: "2023-07-01T08:00",
        arrivalTime: "2023-07-01T20:00",
        price: 500,
        availableSeats: 150,
    },
    {
        _id: "2",
        flightName: "SkyHigh 202",
        from: "Paris",
        to: "Tokyo",
        departureTime: "2023-07-02T10:00",
        arrivalTime: "2023-07-03T06:00",
        price: 800,
        availableSeats: 200,
    },
    {
        _id: "3",
        flightName: "EagleWings 303",
        from: "Los Angeles",
        to: "Sydney",
        departureTime: "2023-07-03T22:00",
        arrivalTime: "2023-07-05T06:00",
        price: 1200,
        availableSeats: 180,
    },
];

const mockHotels = [
    {
        _id: "1",
        hotelName: "Luxury Palace",
        location: "Paris, France",
        pricePerNight: 300,
        availableRooms: 50,
        amenities: "Wi-Fi, Pool, Spa, Restaurant",
    },
    {
        _id: "2",
        hotelName: "Seaside Resort",
        location: "Bali, Indonesia",
        pricePerNight: 200,
        availableRooms: 100,
        amenities: "Beach Access, Wi-Fi, Restaurant, Water Sports",
    },
    {
        _id: "3",
        hotelName: "Mountain Lodge",
        location: "Aspen, Colorado",
        pricePerNight: 250,
        availableRooms: 30,
        amenities: "Ski-in/Ski-out, Fireplace, Hot Tub, Restaurant",
    },
];
interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    phoneNumber: string;
}

function UserSearch() {
    const [email, setEmail] = useState("");
    const [user, setUser] = useState<User | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = await getuserbyemail(email);
        const mockUser: User = data;
        setUser(mockUser);
    };

    return (
        <div className="space-y-4">
            <form onSubmit={handleSearch} className="flex gap-2">
                <div className="flex-1">
                    <Label htmlFor="email" className="sr-only">
                        Email
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="Search user by email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <Button type="submit">Search</Button>
            </form>
            {user && (
                <div className="border p-4 rounded-md">
                    <h3 className="font-bold mb-2">User Details</h3>
                    <p>
                        <strong>Name:</strong> {user.firstName} {user.lastName}
                    </p>
                    <p>
                        <strong>Email:</strong> {user.email}
                    </p>
                    <p>
                        <strong>Role:</strong> {user.role}
                    </p>
                    <p>
                        <strong>Phone:</strong> {user.phoneNumber}
                    </p>
                </div>
            )}
        </div>
    );
}

interface RoomType {

    type: string;

    available: number;

    upgradeCharge: number;

    description: string;

    images: string[];
}

interface Hotel {
    id?: string;
    hotelName: string;
    location: string;
    pricePerNight: number;
    amenities: string;
    roomTypes: RoomType[];
}

function AddEditHotel({ hotel }: { hotel: Hotel | null }) {
    const emptyRoom = (): RoomType => ({
        type: "",
        available: 0,
        upgradeCharge: 0,
        description: "",
        images: [""],
    });

    const [formData, setFormData] = useState<Hotel>({
        hotelName: "",
        location: "",
        pricePerNight: 0,
        amenities: "",
        roomTypes: [emptyRoom()],
    });

    useEffect(() => {
        if (hotel) {
            setFormData({
                ...hotel,
                roomTypes:
                    hotel.roomTypes && hotel.roomTypes.length > 0
                        ? hotel.roomTypes
                        : [emptyRoom()],
            });
        } else {
            setFormData({
                hotelName: "",
                location: "",
                pricePerNight: 0,
                amenities: "",
                roomTypes: [emptyRoom()],
            });
        }
    }, [hotel]);

    const handleHotelChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRoomChange = (
        index: number,
        field: keyof RoomType,
        value: any,
    ) => {
        const rooms = [...formData.roomTypes];

        rooms[index] = {
            ...rooms[index],
            [field]: value,
        };

        setFormData({
            ...formData,
            roomTypes: rooms,
        });
    };

    const addRoomType = () => {
        setFormData({
            ...formData,
            roomTypes: [...formData.roomTypes, emptyRoom()],
        });
    };

    const removeRoomType = (index: number) => {
        if (formData.roomTypes.length === 1) return;

        const rooms = formData.roomTypes.filter((_, i) => i !== index);

        setFormData({
            ...formData,
            roomTypes: rooms,
        });
    };

    const updateImage = (
        roomIndex: number,
        imageIndex: number,
        value: string
    ) => {

        const rooms = [...formData.roomTypes];

        rooms[roomIndex].images[imageIndex] = value;

        setFormData({
            ...formData,
            roomTypes: rooms,
        });

    };

    const addImage = (roomIndex: number) => {

        const rooms = [...formData.roomTypes];

        rooms[roomIndex].images.push("");

        setFormData({
            ...formData,
            roomTypes: rooms,
        });

    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (hotel) {
            await edithotel(formData);
        } else {
            await addhotel(formData);
        }

        setFormData({
            hotelName: "",
            location: "",
            pricePerNight: 0,
            amenities: "",
            roomTypes: [emptyRoom()],
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 overflow-y-auto max-h-[80vh] pr-2"
        >
            <h3 className="text-lg font-semibold">
                {hotel ? "Edit Hotel" : "Add Hotel"}
            </h3>

            <div>
                <Label>Hotel Name</Label>

                <Input
                    name="hotelName"
                    value={formData.hotelName}
                    onChange={handleHotelChange}
                    required
                />
            </div>

            <div>
                <Label>Location</Label>

                <Input
                    name="location"
                    value={formData.location}
                    onChange={handleHotelChange}
                    required
                />
            </div>
            <div>
                <Label>Base Price Per Night (₹)</Label>

                <Input
                    type="number"
                    name="pricePerNight"
                    value={formData.pricePerNight}
                    onChange={handleHotelChange}
                    required
                />
            </div>

            <div>
                <Label>Amenities</Label>

                <Textarea
                    name="amenities"
                    value={formData.amenities}
                    onChange={handleHotelChange}
                />
            </div>

            <hr />

            <h3 className="font-semibold text-lg">
                Room Types
            </h3>

            {formData.roomTypes.map((room, index) => (
                <div
                    key={index}
                    className="border rounded-lg p-4 space-y-3"
                >
                    <div className="flex justify-between items-center">
                        <h4 className="font-semibold">
                            Room {index + 1}
                        </h4>

                        {formData.roomTypes.length > 1 && (
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={() => removeRoomType(index)}
                            >
                                Remove
                            </Button>
                        )}
                    </div>

                    <Input
                        placeholder="Room Type"
                        value={room.type}
                        onChange={(e) =>
                            handleRoomChange(
                                index,
                                "type",
                                e.target.value,
                            )
                        }
                    />

                    <div>
                        <Label>Available Rooms</Label>
                        <Input
                            type="number"
                            value={room.available}
                            onChange={(e) =>
                                handleRoomChange(
                                    index,
                                    "available",
                                    Number(e.target.value),
                                )
                            }
                        />
                    </div>

                    <div>
                        <Label>Upgrade Charge (₹)</Label>
                        <Input
                            type="number"
                            value={room.upgradeCharge}
                            onChange={(e) =>
                                handleRoomChange(
                                    index,
                                    "upgradeCharge",
                                    Number(e.target.value),
                                )
                            }
                        />
                    </div>

                    <Textarea
                        placeholder="Description"
                        value={room.description}
                        onChange={(e) =>
                            handleRoomChange(
                                index,
                                "description",
                                e.target.value,
                            )
                        }
                    />
                    <div>

                        <Label>Images</Label>

                        {room.images.map((img, imageIndex) => (

                            <div
                                key={imageIndex}
                                className="flex gap-2 mb-2"
                            >

                                <Input
                                    placeholder="Image URL"
                                    value={img}
                                    onChange={(e) =>
                                        updateImage(
                                            index,
                                            imageIndex,
                                            e.target.value
                                        )
                                    }
                                />

                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => {

                                        const rooms = [...formData.roomTypes];

                                        rooms[index].images.splice(
                                            imageIndex,
                                            1
                                        );

                                        setFormData({
                                            ...formData,
                                            roomTypes: rooms,
                                        });

                                    }}
                                >

                                    Remove

                                </Button>

                            </div>

                        ))}

                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => addImage(index)}
                        >

                            + Add Image

                        </Button>

                    </div>
                </div>
            ))}

            <Button
                type="button"
                variant="secondary"
                onClick={addRoomType}
            >
                + Add Room Type
            </Button>

            <Button
                className="w-full"
                type="submit"
            >
                {hotel ? "Update Hotel" : "Add Hotel"}
            </Button>
        </form>
    );
}

interface Flight {
    id?: string;
    flightName: string;
    from: string;
    to: string;
    departureTime: string;
    arrivalTime: string;
    price: number;
}

function AddEditFlight({ flight }: { flight: Flight | null }) {
    const [formData, setFormData] = useState<Flight>({
        flightName: "",
        from: "",
        to: "",
        departureTime: "",
        arrivalTime: "",
        price: 0,
    });

    useEffect(() => {
        if (flight) {
            setFormData(flight);
        } else {
            setFormData({
                flightName: "",
                from: "",
                to: "",
                departureTime: "",
                arrivalTime: "",
                price: 0,
            });
        }
    }, [flight]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically send this data to your backend
        console.log("Submitting flight data:", formData);
        if (flight) {
            await editflight(
                flight?.id,
                formData.flightName,
                formData.from,
                formData.to,
                formData.departureTime,
                formData.arrivalTime,
                formData.price,
            );
            return;
        }
        await addflight(
            formData.flightName,
            formData.from,
            formData.to,
            formData.departureTime,
            formData.arrivalTime,
            formData.price,
        );
        if (!flight) {
            setFormData({
                flightName: "",
                from: "",
                to: "",
                departureTime: "",
                arrivalTime: "",
                price: 0,
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-semibold mb-2">
                {flight ? "Edit Flight" : "Add New Flight"}
            </h3>
            <div>
                <Label htmlFor="flightName">Flight Name</Label>
                <Input
                    id="flightName"
                    name="flightName"
                    value={formData.flightName}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <Label htmlFor="from">From</Label>
                <Input
                    id="from"
                    name="from"
                    value={formData.from}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <Label htmlFor="to">To</Label>
                <Input
                    id="to"
                    name="to"
                    value={formData.to}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <Label htmlFor="departureTime">Departure Time</Label>
                <Input
                    id="departureTime"
                    name="departureTime"
                    type="datetime-local"
                    value={formData.departureTime}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <Label htmlFor="arrivalTime">Arrival Time</Label>
                <Input
                    id="arrivalTime"
                    name="arrivalTime"
                    type="datetime-local"
                    value={formData.arrivalTime}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <Label htmlFor="price">Price</Label>
                <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    required
                />
            </div>
            <Button type="submit">{flight ? "Update Flight" : "Add Flight"}</Button>
        </form>
    );
}

interface RefundBooking {
    bookingId: string;
    bookingStatus: string;
    refundStatus: string;
    refundAmount: number;
}

interface RefundUser {
    id: string;
    firstName: string;
    bookings: RefundBooking[];
}

function RefundManagement() {
    const [users, setUsers] = useState<RefundUser[]>([]);

    useEffect(() => {
        loadRefunds();
    }, []);

    const loadRefunds = async () => {
        const data = await getAllUsers();

        setUsers(data);
    };

    const processRefund = async (userId: String, bookingId: String) => {
        console.log({
            userId,
            bookingId,
        });
        await updateRefundStatus(userId, bookingId, "PROCESSED");

        loadRefunds();
    };

    const completeRefund = async (userId: String, bookingId: String) => {
        await updateRefundStatus(userId, bookingId, "COMPLETED");

        loadRefunds();
    };

    return (
        <div className="space-y-4">
            {users.map((user) =>
                user.bookings?.map((booking) => {
                    if (booking.bookingStatus !== "CANCELLED") return null;

                    return (
                        <div
                            key={booking.bookingId}
                            className="
                                        border
                                        p-4
                                        rounded
                                    "
                        >
                            <p>
                                <b>User:</b> {user.firstName}
                            </p>

                            <p>
                                <b>Booking:</b> {booking.bookingId}
                            </p>

                            <p>
                                <b>Refund:</b>₹{booking.refundAmount}
                            </p>

                            <p>
                                <b>Status:</b> {booking.refundStatus}
                            </p>

                            {booking.refundStatus === "PENDING" && (
                                <button
                                    onClick={() => processRefund(user.id, booking.bookingId)}
                                    className="
                                                    bg-blue-500
                                                    text-white
                                                    px-3
                                                    py-1
                                                    rounded
                                                    mt-2
                                                "
                                >
                                    Process
                                </button>
                            )}

                            {booking.refundStatus === "PROCESSED" && (
                                <button
                                    onClick={() => completeRefund(user.id, booking.bookingId)}
                                    className="
                                                    bg-green-500
                                                    text-white
                                                    px-3
                                                    py-1
                                                    rounded
                                                    mt-2
                                                "
                                >
                                    Complete
                                </button>
                            )}
                        </div>
                    );
                }),
            )}
        </div>
    );
}

function ReviewModeration() {
    const [reviews, setReviews] = useState<any[]>([]);

    const loadReviews = async () => {
        try {
            const data = await getFlaggedReviews();

            setReviews(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        loadReviews();
    }, []);

    const remove = async (reviewId: string) => {
        await removeReview(reviewId);

        setReviews((prev) =>
            prev.map((review) =>
                review.id === reviewId || review._id === reviewId
                    ? {
                        ...review,
                        removed: true,
                    }
                    : review,
            ),
        );
    };

    return (
        <div className="space-y-4">
            {reviews.length === 0 && <p>No flagged reviews.</p>}

            {reviews.map((review) => (
                <div
                    key={review.id}
                    className="
                                border
                                p-4
                                rounded
                            "
                >
                    <p>
                        <b>User:</b> {review.userName}
                    </p>

                    <p>
                        <b>Rating:</b> {review.rating}
                    </p>

                    <p>
                        <b>Review:</b> {review.reviewText}
                    </p>

                    <p>
                        <b>Reason:</b> {review.flagReason}
                    </p>

                    {review.removed ? (
                        <p
                            className="
                mt-3
                font-semibold
                text-green-600
            "
                        >
                            Review Removed
                        </p>
                    ) : (
                        <button
                            onClick={() => remove(review.id || review._id)}
                            className="
                bg-red-500
                text-white
                px-3
                py-1
                rounded
                mt-3
            "
                        >
                            Remove Review
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("flights");
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [selectedHotel, setSelectedHotel] = useState(null);

    return (
        <div className="container mx-auto p-4 bg-white max-w-full">
            <h1 className="text-3xl font-bold mb-6 ">Admin Dashboard</h1>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-5  text-black">
                    <TabsTrigger value="flights">Flights</TabsTrigger>
                    <TabsTrigger value="hotels">Hotels</TabsTrigger>
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="refunds">Refunds</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                <TabsContent value="flights">
                    <Card>
                        <CardHeader>
                            <CardTitle>Manage Flights</CardTitle>
                            <CardDescription>
                                Add, edit, or remove flights from the system.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <FlightList onSelect={setSelectedFlight} />
                                <AddEditFlight flight={selectedFlight} />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="hotels">
                    <Card>
                        <CardHeader>
                            <CardTitle>Manage Hotels</CardTitle>
                            <CardDescription>
                                Add, edit, or remove hotels from the system.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <HotelList onSelect={setSelectedHotel} />
                                <AddEditHotel hotel={selectedHotel} />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="users">
                    <Card>
                        <CardHeader>
                            <CardTitle>User Management</CardTitle>
                            <CardDescription>Search for users by email.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <UserSearch />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="refunds">
                    <Card>
                        <CardHeader>
                            <CardTitle>Refund Management</CardTitle>

                            <CardDescription>Manage refund requests</CardDescription>
                        </CardHeader>

                        <CardContent>
                            <RefundManagement />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="reviews">
                    <Card>
                        <CardHeader>
                            <CardTitle>Review Moderation</CardTitle>

                            <CardDescription>
                                Flagged reviews requiring admin action
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <ReviewModeration />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
