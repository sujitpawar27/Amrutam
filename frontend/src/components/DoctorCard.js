import Image from "next/image";
import Link from "next/link";

export default function DoctorCard({ doctor }) {
  return (
    <Link href={`/doctor/${doctor._id}`}>
      <div className="border rounded-lg p-4 hover:shadow-lg cursor-pointer">
        {/* <Image
          // src={doctor.image}
          alt={doctor.name}
          className="w-full h-40 object-cover rounded"
          width={300}
          height={200}
        /> */}
        <h2 className="text-lg font-bold mt-2">{doctor.name}</h2>
        <p className="text-gray-600">{doctor.specialization}</p>
        <p className="text-sm">{doctor.mode}</p>
        <p className="text-sm text-gray-500">{doctor.experience} years exp.</p>
      </div>
    </Link>
  );
}
