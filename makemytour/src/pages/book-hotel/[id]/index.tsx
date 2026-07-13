import { useRouter } from "next/router";
import {
    Star,
    MapPin,
    School as Pool,
    UtensilsCrossed,
    Wine,
    Power,
    ChevronRight,
    Camera,
    Image,
    CreditCard,
    Ticket,
    Plane,
    Home,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
    gethotel,
    handlehotelbooking,
    getReviews,
    getCurrentHotelPrice,
    getHotelPriceHistory,
    freezeHotelPrice,
    getFrozenHotelPrice,
} from "@/api";
import PriceFreezeCard from "@/components/PriceFreezeCard";
import PriceHistoryChart from "@/components/PriceHistoryChart";
import ReviewForm from "@/components/reviews/ReviewForm";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import SignupDialog from "@/components/SignupDialog";
import Loader from "@/components/Loader";
import { setUser } from "@/store";
import ReviewList from "@/components/reviews/ReviewList";

interface Hotel {
    id: string;

    hotelName: string;

    location: string;

    pricePerNight: number;

    availableRooms: number;

    amenities: string;

    averageRating: number;

    reviewCount: number;

    roomTypes: RoomType[];
}

interface RoomType {
    type: string;

    available: number;

    upgradeCharge: number;

    description: string;

    images: string[];
}

interface HotelContentProps {
    hotel: Hotel;
    room: RoomType | undefined;

    quantity: number;
    selectedRoom: string;
    currentImage: number;

    savePreference: boolean;

    roomPrice: number;
    totalPrice: number;
    totalTaxes: number;
    totalDiscounts: number;
    grandTotal: number;

    setQuantity: React.Dispatch<React.SetStateAction<number>>;
    setSelectedRoom: React.Dispatch<React.SetStateAction<string>>;
    setCurrentImage: React.Dispatch<React.SetStateAction<number>>;
    setSavePreference: React.Dispatch<React.SetStateAction<boolean>>;

    handleQuantityChange: (
        e: React.ChangeEvent<HTMLInputElement>
    ) => void;

    handlebooking: (
        e: React.FormEvent
    ) => void;
}

const HotelContent = ({
    hotel,
    room,

    quantity,
    selectedRoom,
    currentImage,

    savePreference,

    roomPrice,
    totalPrice,
    totalTaxes,
    totalDiscounts,
    grandTotal,

    setQuantity,
    setSelectedRoom,
    setCurrentImage,
    setSavePreference,

    handleQuantityChange,
    handlebooking,
}: HotelContentProps) => (
    <DialogContent
        className="
        sm:max-w-[700px]
        bg-white
        max-h-[90vh]
        overflow-y-auto
    "
    >
        <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center">
                <Home className="w-6 h-6 mr-2" />
                Hotel Booking Details
            </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Hotel Name */}
                <div className="space-y-2">
                    <Label htmlFor="hotelName" className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        Hotel Name
                    </Label>
                    <Input id="hotelName" value={hotel.hotelName} readOnly />
                </div>

                {/* Location */}
                <div className="space-y-2">
                    <Label htmlFor="location" className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        Location
                    </Label>
                    <Input id="location" value={hotel.location} readOnly />
                </div>
                {/* Price Per Night */}
                <div className="space-y-2">
                    <Label htmlFor="pricePerNight" className="flex items-center">
                        <Ticket className="w-4 h-4 mr-2" />
                        Price Per Night
                    </Label>
                    <Input id="pricePerNight" value={`₹ ${roomPrice}`} readOnly />
                </div>

                {/* Available Rooms */}
                <div className="space-y-2">
                    <Label htmlFor="availableRooms" className="flex items-center">
                        <Ticket className="w-4 h-4 mr-2" />
                        Available Rooms
                    </Label>
                    <Input
                        id="availableRooms"
                        value={room ? room.available : hotel.availableRooms}
                        readOnly
                    />
                </div>

                {/* Number of Rooms to Book */}
                <div className="space-y-2">
                    <Label htmlFor="quantity" className="flex items-center">
                        <Ticket className="w-4 h-4 mr-2" />
                        Number of Rooms to Book
                    </Label>
                    <Input
                        id="quantity"
                        type="number"
                        min="1"
                        max={room ? room.available : hotel.availableRooms}
                        value={quantity}
                        onChange={handleQuantityChange}
                    />
                </div>
            </div>
            <div className="border rounded-lg p-5">
                <h3 className="text-lg font-bold mb-4">Select Room Type</h3>

                <div className="grid grid-cols-1 gap-4">
                    {hotel.roomTypes.map((room) => (
                        <div
                            key={room.type}
                            onClick={() => {
                                if (room.available > 0) {
                                    setSelectedRoom(room.type);
                                }
                            }}
                            className={`

border
rounded-lg
p-4
transition-all

${room.available === 0
                                    ? "opacity-50 cursor-not-allowed bg-gray-100"
                                    : "cursor-pointer"
                                }

${selectedRoom === room.type
                                    ? "border-blue-600 bg-blue-50"
                                    : "border-gray-200 hover:border-blue-300"
                                }
`}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold">{room.type}</h4>

                                    <div className="space-y-1 mt-2">
                                        <p className="text-gray-700 font-medium">
                                            Base Price : ₹{hotel.pricePerNight.toLocaleString()}
                                        </p>

                                        <p className="text-blue-600">
                                            Upgrade : +₹{room.upgradeCharge.toLocaleString()}
                                        </p>

                                        <p className="font-bold text-lg">
                                            Total : ₹
                                            {(
                                                hotel.pricePerNight + room.upgradeCharge
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                    <p
                                        className={`text-sm mt-1 ${room.available > 0
                                            ? "text-green-600"
                                            : "text-red-500 font-semibold"
                                            }`}
                                    >

                                        {room.available > 0
                                            ? `Available : ${room.available}`
                                            : "Sold Out"}

                                    </p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        {room.description}
                                    </p>
                                </div>

                                {room.upgradeCharge > 0 && (
                                    <span
                                        className="
                                bg-yellow-400
                                px-3
                                py-1
                                rounded-full
                                text-xs
                                font-semibold
                            "
                                    >
                                        Premium
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {room && room.images.length > 0 && (
                <div className="border rounded-lg p-5">

                    <h3 className="text-lg font-bold mb-4">
                        Room Preview
                    </h3>

                    <img
                        src={room.images[currentImage]}
                        className="w-full h-72 object-cover rounded-lg"
                    />

                    {room.images.length > 1 && (

                        <div className="flex justify-between mt-4">

                            <Button
                                type="button"
                                onClick={() =>
                                    setCurrentImage((prev) =>
                                        prev === 0
                                            ? room.images.length - 1
                                            : prev - 1
                                    )
                                }
                            >
                                Previous
                            </Button>

                            <span>
                                {currentImage + 1} / {room.images.length}
                            </span>

                            <Button
                                type="button"
                                onClick={() =>
                                    setCurrentImage((prev) =>
                                        (prev + 1) %
                                        room.images.length
                                    )
                                }
                            >
                                Next
                            </Button>

                        </div>

                    )}

                </div>
            )}
            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    id="saveRoomPreference"
                    checked={savePreference}
                    onChange={(e) => setSavePreference(e.target.checked)}
                />

                <Label htmlFor="saveRoomPreference">
                    Save this room preference for future bookings
                </Label>
            </div>
            <div className="bg-gray-100 rounded-lg p-4">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Fare Summary
                </h3>
                <div className="flex justify-between items-center">
                    <span className="font-medium">Room Type</span>

                    <span>{selectedRoom}</span>
                </div>
                <div className="space-y-3">

                    <div className="flex justify-between">
                        <span>Hotel Base Price</span>
                        <span>₹ {hotel.pricePerNight.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Room Upgrade</span>
                        <span>
                            + ₹ {(room?.upgradeCharge ?? 0).toLocaleString()}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span>Rooms Selected</span>
                        <span>{quantity}</span>
                    </div>

                    <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>Room Cost</span>
                        <span>₹ {totalPrice.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Taxes & Charges</span>
                        <span>₹ {totalTaxes.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>- ₹ {Math.abs(totalDiscounts).toLocaleString()}</span>
                    </div>

                    <div className="border-t pt-3 flex justify-between text-lg font-bold">
                        <span>Total Amount</span>
                        <span>₹ {grandTotal.toLocaleString()}</span>
                    </div>

                </div>
            </div>
        </div>
        <Button className="w-full mt-4" onClick={handlebooking}>
            Proceed to Payment
        </Button>
    </DialogContent>
);

const BookHotelPage = () => {
    const [quantity, setQuantity] = useState(1);
    const [selectedRoom, setSelectedRoom] = useState("");

    const [savePreference, setSavePreference] = useState(false);
    const router = useRouter();
    const { id } = router.query; // Access the hotel ID from the URL
    const [hotels, sethotels] = useState<Hotel[]>([]);
    const [loading, setLoading] = useState(true);
    const user = useSelector((state: any) => state.user.user);
    const [open, setopem] = useState(false);
    const [reviews, setReviews] = useState<any[]>([]);
    const [sort, setSort] = useState("newest");
    const [currentImage, setCurrentImage] = useState(0);
    const [currentPrice, setCurrentPrice] = useState(0);
    const [pricingReason, setPricingReason] = useState("");
    const [priceHistory, setPriceHistory] = useState([]);
    const [useFrozenPrice, setUseFrozenPrice] = useState(false);
    const [freezeExpiry, setFreezeExpiry] = useState("");
    const refreshReviews = async (hotelId: string) => {
        try {
            const data = await getReviews("HOTEL", hotelId, sort);

            setReviews(data);
        } catch (error) {
            console.log(error);
        }
    };
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchhotels = async () => {
            try {
                const data = await gethotel();

                const filteredData = data.filter((hotel: any) => hotel.id === id);

                sethotels(filteredData);

                if (filteredData.length > 0) {
                    await refreshReviews(filteredData[0].id);
                    const livePrice = await getCurrentHotelPrice(filteredData[0].id);

                    setCurrentPrice(livePrice);

                    const history = await getHotelPriceHistory(filteredData[0].id);

                    setPriceHistory(history);

                    const latestHotel = (
                        await gethotel()
                    ).find((h: Hotel) => h.id === filteredData[0].id);

                    if (latestHotel) {
                        setPricingReason(latestHotel.pricingReason);
                    }

                    if (user?.id) {

                        const frozen = await getFrozenHotelPrice(
                            user.id,
                            filteredData[0].id
                        );

                        if (frozen.active) {

                            setUseFrozenPrice(true);

                            setFreezeExpiry(frozen.expiry);

                            setCurrentPrice(frozen.price);

                        } else {

                            setUseFrozenPrice(false);

                            setFreezeExpiry("");

                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching hotel:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchhotels();
        }
    }, [id, sort]);
    useEffect(() => {
        if (hotels.length > 0 && hotels[0].roomTypes.length > 0 && !selectedRoom) {
            setSelectedRoom(hotels[0].roomTypes[0].type);
        }
    }, [hotels, selectedRoom]);
    useEffect(() => {

        if (hotels.length === 0) return;

        const interval = setInterval(async () => {

            if (useFrozenPrice && user?.id) {

                const frozen = await getFrozenHotelPrice(
                    user.id,
                    hotels[0].id
                );

                if (frozen.active) {

                    setCurrentPrice(frozen.price);

                    setFreezeExpiry(frozen.expiry);

                } else {

                    setUseFrozenPrice(false);

                    const latest =
                        await getCurrentHotelPrice(hotels[0].id);

                    setCurrentPrice(latest);
                }

            } else {

                const latest =
                    await getCurrentHotelPrice(hotels[0].id);

                setCurrentPrice(latest);

            }

            const history =
                await getHotelPriceHistory(hotels[0].id);

            setPriceHistory(history);

        }, 30000);

        return () => clearInterval(interval);

    }, [hotels, useFrozenPrice]);

    if (loading) {
        return <Loader />;
    }
    const hotel = hotels[0];

    if (!hotel) {
        return <Loader />;
    }
    const hotelData = {
        name: "Magnum Resorts- Near Candolim Beach",
        rating: 3,
        maxRating: 5,
        propertyPhotos: 91,
        guestPhotos: 386,
        description:
            "One of the best hotels in North Goa, operating since 2001 catering to international and domestic individual and group travelers.",
        amenities: [
            { icon: <Pool className="w-5 h-5" />, name: "Swimming Pool" },
            { icon: <UtensilsCrossed className="w-5 h-5" />, name: "Restaurant" },
            { icon: <Wine className="w-5 h-5" />, name: "Bar" },
            { icon: <Power className="w-5 h-5" />, name: "Power Backup" },
        ],
        room: {
            type: "Standard Room",
            capacity: "Fits 2 Adults",
            features: [
                "No meals included",
                "10% off on food & beverage services",
                "Complimentary welcome drinks on arrival",
                "Non-Refundable",
            ],
            originalPrice: 8999,
            discountedPrice: 664,
            taxes: 527,
        },
        location: {
            area: "Candolim",
            distance: "7 minutes walk to Candolim Beach",
        },
        reviews: {
            rating: 3.8,
            count: 784,
            text: "Very Good",
        },
    };
    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const value = Number.parseInt(e.target.value);
        setQuantity(
            isNaN(value)
                ? 1
                : Math.max(
                    1,
                    Math.min(value, room ? room.available : hotel.availableRooms),
                ),
        );
    };

    const room = hotel.roomTypes.find((r) => r.type === selectedRoom);

    const roomPrice = room
        ? currentPrice + room.upgradeCharge
        : currentPrice;

    const totalPrice = roomPrice * quantity;
    const totalTaxes = hotelData?.room.taxes * quantity;
    const totalDiscounts = hotelData?.room.discountedPrice * quantity;
    const grandTotal = totalPrice + totalTaxes - totalDiscounts;
    const handlebooking = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await handlehotelbooking(
                user?.id,
                hotel?.id,
                selectedRoom,
                grandTotal,
                savePreference,
            );
            const updateuser = {
                ...user,
                bookings: [...user.bookings, data],
            };
            dispatch(setUser(updateuser));
            setopem(false);
            setQuantity(1);
            router.push("/profile");
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center space-x-2 text-sm">
                        <a href="/" className="text-blue-500">
                            Home
                        </a>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <a href="/" className="text-blue-500">
                            {hotel?.location}
                        </a>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{hotel?.hotelName}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Hotel Title & Rating */}
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold mb-2">{hotel.hotelName}</h1>
                            <div className="flex items-center space-x-1">
                                {[...Array(hotelData.rating)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className="w-5 h-5 text-yellow-400 fill-current"
                                    />
                                ))}
                                {[...Array(hotelData.maxRating - hotelData.rating)].map(
                                    (_, i) => (
                                        <Star key={i} className="w-5 h-5 text-gray-300" />
                                    ),
                                )}
                            </div>
                        </div>

                        {/* Image Gallery */}
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div className="col-span-2 relative group cursor-pointer">
                                <img
                                    src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800"
                                    alt="Hotel Main"
                                    className="w-full h-80 object-cover rounded-lg"
                                />
                                <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-1 rounded-full flex items-center space-x-1">
                                    <Camera className="w-4 h-4" />
                                    <span className="text-sm">
                                        +{hotelData.propertyPhotos} Property Photos
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="relative group cursor-pointer">
                                    <img
                                        src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800"
                                        alt="Hotel Room"
                                        className="w-full h-[152px] object-cover rounded-lg"
                                    />
                                </div>
                                <div className="relative group cursor-pointer">
                                    <img
                                        src="https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800"
                                        alt="Hotel Amenity"
                                        className="w-full h-[152px] object-cover rounded-lg"
                                    />
                                    <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-1 rounded-full flex items-center space-x-1">
                                        <Image className="w-4 h-4" />
                                        <span className="text-sm">
                                            +{hotelData.guestPhotos} Guest Photos
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 mb-6">
                            {hotelData.description}
                            <button className="text-blue-500 ml-2">Read more</button>
                        </p>

                        {/* Amenities */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">Amenities</h2>
                            <div className="flex flex-wrap gap-6">
                                {hotelData.amenities.map((amenity, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center space-x-2 text-gray-600"
                                    >
                                        {amenity.icon}
                                        <span>{amenity.name}</span>
                                    </div>
                                ))}
                                <button className="text-blue-500">+ 31 Amenities</button>
                            </div>
                        </div>
                        <div className="mb-5 rounded-xl border border-blue-200 bg-blue-50 p-4">

                            <div className="flex justify-between">

                                <span className="font-semibold text-blue-700">
                                    🔥 Live Dynamic Pricing
                                </span>

                                <span className="text-xs text-blue-600">
                                    Auto Updates
                                </span>

                            </div>

                            <div className="mt-3">

                                <p className="text-xs text-gray-500">

                                    Current Price

                                </p>

                                <p className="text-3xl font-bold text-blue-700">

                                    ₹ {currentPrice.toLocaleString()}

                                </p>

                            </div>

                            <p className="mt-3 text-sm text-gray-600">

                                {pricingReason}

                            </p>

                        </div>
                    </div>

                    {/* Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-xl font-semibold mb-4">
                                {selectedRoom || hotelData.room.type}
                            </h3>
                            <p className="text-gray-600 mb-4">{hotelData.room.capacity}</p>

                            <ul className="space-y-3 mb-6">
                                {hotelData.room.features.map((feature, index) => (
                                    <li key={index} className="flex items-start space-x-2">
                                        <span className="text-gray-400">•</span>
                                        <span className="text-gray-600">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mb-6">
                                {/* Price Per Night */}
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-800 font-semibold">
                                        Current Dynamic Price:
                                    </span>
                                    <span className="text-lg font-medium text-gray-800">
                                        ₹ {roomPrice.toLocaleString()} / Night
                                    </span>
                                </div>

                                {/* Available Rooms */}
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-gray-800 font-semibold">
                                        Available Rooms:
                                    </span>
                                    <span className="text-lg font-medium text-gray-800">
                                        {room ? room.available : hotel.availableRooms}
                                    </span>
                                </div>

                                {/* Amenities */}
                                <div>
                                    <h4 className="text-gray-800 font-semibold mb-2">
                                        Amenities:
                                    </h4>
                                    <p className="text-gray-600">{hotel.amenities}</p>
                                </div>
                            </div>
                            <div className="mt-6 rounded-xl border bg-gray-50 p-4 space-y-3">

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">
                                        Dynamic Price / Night
                                    </span>

                                    <span className="font-semibold">
                                        ₹ {roomPrice.toLocaleString()}
                                    </span>
                                </div>

                                {room && room.upgradeCharge > 0 && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">
                                            Room Upgrade
                                        </span>

                                        <span className="text-blue-600">
                                            + ₹ {room.upgradeCharge.toLocaleString()}
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">
                                        Taxes & Fees
                                    </span>

                                    <span>
                                        + ₹ {totalTaxes.toLocaleString()}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center text-green-600">
                                    <span>
                                        Discount
                                    </span>

                                    <span>
                                        - ₹ {Math.abs(totalDiscounts).toLocaleString()}
                                    </span>
                                </div>

                                <div className="border-t pt-3 flex justify-between items-center">

                                    <div>
                                        <p className="font-bold text-xl">
                                            You Pay
                                        </p>

                                        <p className="text-xs text-gray-500">
                                            Final payable amount
                                        </p>
                                    </div>

                                    <span className="text-3xl font-bold text-blue-700">
                                        ₹ {grandTotal.toLocaleString()}
                                    </span>

                                </div>

                            </div>
                            <Dialog open={open} onOpenChange={setopem}>
                                <DialogTrigger asChild>
                                    <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors mb-3">
                                        BOOK THIS NOW
                                    </button>
                                </DialogTrigger>
                                <Button
                                    variant="secondary"
                                    disabled={useFrozenPrice}
                                    className="w-full mb-3"
                                    onClick={async () => {

                                        const expiry = await freezeHotelPrice(
                                            user.id,
                                            hotel.id
                                        );

                                        setFreezeExpiry(expiry);

                                        setUseFrozenPrice(true);

                                        alert("Price frozen successfully.");

                                    }}
                                >

                                    {useFrozenPrice
                                        ? "Price Frozen"
                                        : "Freeze Current Price"}

                                </Button>

                                <PriceFreezeCard
                                    frozen={useFrozenPrice}
                                    expiry={freezeExpiry}
                                    onExpired={() => {

                                        setUseFrozenPrice(false);

                                        setFreezeExpiry("");

                                    }}
                                />

                                <PriceHistoryChart
                                    history={priceHistory}
                                />
                                {user ? (
                                    <HotelContent
                                        hotel={hotel}
                                        room={room}

                                        quantity={quantity}
                                        selectedRoom={selectedRoom}
                                        currentImage={currentImage}

                                        savePreference={savePreference}

                                        roomPrice={roomPrice}
                                        totalPrice={totalPrice}
                                        totalTaxes={totalTaxes}
                                        totalDiscounts={totalDiscounts}
                                        grandTotal={grandTotal}

                                        setQuantity={setQuantity}
                                        setSelectedRoom={setSelectedRoom}
                                        setCurrentImage={setCurrentImage}
                                        setSavePreference={setSavePreference}

                                        handleQuantityChange={handleQuantityChange}
                                        handlebooking={handlebooking}
                                    />
                                ) : (
                                    <DialogContent className="bg-white">
                                        <DialogHeader>
                                            <DialogTitle>Login Required</DialogTitle>
                                        </DialogHeader>
                                        <p>Please log in to continue with your booking.</p>
                                        <SignupDialog
                                            trigger={
                                                <Button className="w-full">Log In / Sign Up</Button>
                                            }
                                        />
                                    </DialogContent>
                                )}
                            </Dialog>

                            <button className="w-full text-blue-500 text-center">
                                14 More Options
                            </button>
                        </div>

                        {/* Rating Card */}
                        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-blue-500 text-white text-2xl font-bold w-16 h-16 rounded-lg flex items-center justify-center">
                                        {hotel.averageRating
                                            ? hotel.averageRating.toFixed(1)
                                            : "0.0"}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-lg">
                                            {hotelData.reviews.text}
                                        </div>
                                        <div className="text-gray-500">
                                            ({hotel.reviewCount} ratings )
                                        </div>
                                    </div>
                                </div>
                                <a href="#" className="text-blue-500">
                                    All Reviews
                                </a>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
                            <ReviewForm
                                targetType="HOTEL"
                                targetId={hotel.id}
                                user={user}
                                refreshReviews={() => refreshReviews(hotel.id)}
                            />

                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-xl">Reviews</h3>

                                <select
                                    className="border rounded p-2"
                                    value={sort}
                                    onChange={(e) => setSort(e.target.value)}
                                >
                                    <option value="newest">Newest</option>

                                    <option value="highest">Highest Rated</option>

                                    <option value="helpful">Most Helpful</option>
                                </select>
                            </div>

                            <ReviewList
                                reviews={reviews}
                                user={user}
                                refreshReviews={() => refreshReviews(hotel.id)}
                            />
                        </div>
                        {/* Location Card */}
                        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-semibold text-lg mb-1">
                                        {hotel.location}
                                    </h3>
                                </div>
                                <button className="text-blue-500">See on Map</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookHotelPage;
