import ParkingForm from "@/components/admin/parking-form";


export default function CreateParkingPage() {

    return (
        <div className="flex flex-col items-center gap-4 p-6">
            <div className="p-4 flex flex-col gap-2 w-full">
                {/* O Form agora recebe o form como prop */}
                <ParkingForm type="Create" />
            </div>
        </div>
    );
}
