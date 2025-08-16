import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Clock, MapPin, Stethoscope } from "lucide-react";
import { Badge } from "./ui/badge";

export default function DoctorCard({ doctor }) {
  return (
    <Link href={`/doctors/${doctor.id}`}>
      <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-4">
            <div className="relative">
              {/* <Image
              src={doctor.image}
              alt={doctor.name}
              className="w-16 h-16 rounded-full object-cover ring-4 ring-blue-100"
            /> */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-gray-900">
                {doctor.name}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 flex items-center gap-1">
                <Stethoscope className="w-3 h-3" />
                {doctor.specialization || "No Specialization"}
              </CardDescription>
            </div>
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-800 hover:bg-blue-200"
            >
              ⭐ {doctor.rating || "No Rating"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pb-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>{doctor.experience || "No Experience"}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{doctor.location || "No Location"}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Badge
              variant={
                doctor.mode === "online"
                  ? "green"
                  : doctor.mode === "inperson"
                  ? "destructive"
                  : "secondary"
              }
              className="text-xs"
            >
              {doctor.mode?.join(", ") || "N/A"}
            </Badge>
            <span className="text-xs text-green-600 font-medium">
              {doctor.availability?.[0]?.day || "N/A"}:{" "}
              {doctor.availability?.[0]?.slots?.join(", ") || "N/A"}
            </span>
          </div>
          {/* 
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">Next Available</div>
          <div className="text-sm font-semibold text-gray-900">
            {doctor.nextSlot}
          </div>
        </div> */}
        </CardContent>
      </Card>
    </Link>
  );
}
