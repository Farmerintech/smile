import * as Location from "expo-location";
import { useEffect, useState } from "react";

const [location, setLocation] = useState<Location.LocationObject | null>(null);
const [address, setAddress] = useState(""); // human-readable

useEffect(() => {
  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Location permission not granted");
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    setLocation(loc);

    // Reverse geocode
    const geo = await Location.reverseGeocodeAsync({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });

    if (geo.length > 0) {
      const place = geo[0];
      const formatted = `${place.street || ""}, ${place.city || ""}, ${place.region || ""}, ${place.country || ""}`;
      setAddress(formatted);
    }
  };

  getLocation();
}, []);
