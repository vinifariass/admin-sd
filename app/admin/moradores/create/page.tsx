import MoradorForm from "@/components/admin/morador-form";


export default function CreateParkingPage() {

    return (
        <div className="flex flex-col items-center gap-4 p-6">
            <div className="p-4 flex flex-col gap-2 w-full md:w-1/2">
                {/* O Form agora recebe o form como prop */}
                <MoradorForm type="Create" />
            </div>
        </div>
    );
}
